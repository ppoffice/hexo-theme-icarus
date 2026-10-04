const assert = require('assert').strict;
const { render, fixtureConfig, makePage } = require('../support/render');
const { knownBug } = require('../support/known-bug');

// Loaded through the render harness so that @babel/register handles the JSX.
let Widgets;
before(async () => {
    await render(() => null);
    Widgets = require('../../layout/common/widgets');
});

const profile = position => ({ position, type: 'profile', author: 'A' });
const toc = position => ({ position, type: 'toc' });
const recent = position => ({ position, type: 'recent_posts' });

describe('layout/common/widgets', () => {
    describe('getColumnCount', () => {
        const count = (widgets, { toc: tocEnabled = false, layout = 'post' } = {}) =>
            Widgets.getColumnCount(widgets, { toc: tocEnabled }, { layout });

        it('is 1 without widgets', () => {
            assert.equal(count([]), 1);
            assert.equal(count(undefined), 1);
        });

        it('counts each side that has at least one widget', () => {
            assert.equal(count([profile('left')]), 2);
            assert.equal(count([profile('right')]), 2);
            assert.equal(count([profile('left'), recent('right')]), 3);
        });

        it('ignores the toc widget when the toc is disabled or the page is not a post/page', () => {
            assert.equal(count([profile('left'), toc('right')]), 2);
            assert.equal(count([profile('left'), toc('right')], { toc: true, layout: 'index' }), 2);
            assert.equal(count([profile('left'), toc('right')], { toc: true, layout: 'post' }), 3);
            assert.equal(count([profile('left'), toc('right')], { toc: true, layout: 'page' }), 3);
        });
    });

    describe('rendering', () => {
        const renderSide = async (widgets, position, pageOverrides = {}, configOverrides = {}) => {
            const config = fixtureConfig(Object.assign({ widgets }, configOverrides));
            return render(Widgets, { config, page: makePage(pageOverrides), site: { posts: [], categories: [], tags: [] }, position });
        };

        it('renders nothing for a side without widgets', async () => {
            const { $ } = await renderSide([profile('left')], 'right');
            assert.equal($('.column').length, 0);
        });

        it('applies size, order and sticky classes to a column', async () => {
            const { $ } = await renderSide([profile('left'), recent('right')], 'right', {}, { sidebar: { right: { sticky: true } } });
            const column = $('.column-right');
            assert.equal(column.length, 1);
            for (const cls of ['column', 'is-4-tablet', 'is-4-desktop', 'is-3-widescreen', 'order-3', 'is-sticky', 'is-hidden-touch', 'is-hidden-desktop-only']) {
                assert.ok(column.hasClass(cls), `missing class ${cls}: ${column.attr('class')}`);
            }
        });

        it('adds the right-column shadow to the left column in three-column layouts', async () => {
            const { $ } = await renderSide([profile('left'), recent('right')], 'left');
            assert.equal($('.column-left .column-right-shadow').length, 1);
        });

        it('skips widgets with an unknown or missing type without failing', async () => {
            const { $ } = await renderSide([{ position: 'left' }, { position: 'left', type: 'no_such_widget' }, profile('left')], 'left');
            assert.equal($('.widget').length, 1);
        });

        knownBug('does not render an empty column when its only widget is a hidden toc', async () => {
            const { $ } = await renderSide([profile('left'), toc('right')], 'right', { layout: 'index' });
            assert.equal($('.column-right').length, 0, 'the column count says 2 columns, so the right column must not be rendered');
        });
    });
});
