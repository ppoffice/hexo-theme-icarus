const assert = require('assert').strict;
const { render, fixtureConfig, makePage } = require('../support/render');

// Loaded through the render harness so that @babel/register handles the JSX.
let Widgets;

const profile = position => ({ position, type: 'profile', author: 'A' });
const toc = position => ({ position, type: 'toc' });
const recent = position => ({ position, type: 'recent_posts' });

describe('layout/common/widgets', () => {
    before(async () => {
        await render(() => null);
        Widgets = require('../../layout/common/widgets');
    });

    describe('getColumnCount', () => {
        const count = (widgets, { toc: tocEnabled = false, layout = 'post' } = {}) =>
            Widgets.getColumnCount(widgets, { toc: tocEnabled }, { layout });

        it('is 1 without widgets', () => {
            assert.equal(count([]), 1);
            assert.equal(count(undefined), 1);
            assert.equal(count(null), 1);
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

        it('renders the toc column on posts with the toc enabled', async () => {
            const { $ } = await renderSide([profile('left'), toc('right')], 'right', { layout: 'post', content: '<h2 id="a">A</h2>' }, { toc: true });
            assert.equal($('.column-right #toc').length, 1);
        });

        it('does not add the right-column shadow when the right column is hidden', async () => {
            const { $ } = await renderSide([profile('left'), toc('right')], 'left', { layout: 'index' });
            assert.equal($('.column-right-shadow').length, 0);
        });

        it('ignores empty widget entries (a bare "-" in YAML)', async () => {
            const { $ } = await renderSide([null, profile('left')], 'left');
            assert.equal($('.widget').length, 1);
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

        it('does not render an empty column when its only widget is a hidden toc', async () => {
            const { $ } = await renderSide([profile('left'), toc('right')], 'right', { layout: 'index' });
            assert.equal($('.column-right').length, 0, 'the column count says 2 columns, so the right column must not be rendered');
        });
    });
});

describe('layout/common/article_media', () => {
    const media = { url: '/p/', title: 'Post', date: 'Jan 1', dateXml: '2024-01-01', categories: [{ name: 'A', url: '/a/' }, { name: 'B', url: '/b/' }] };

    it('loads the thumbnail when it is about to be scrolled to', async () => {
        const { $ } = await render('common/article_media', Object.assign({ thumbnail: '/t.png' }, media));
        const img = $('.media-left a.image img');
        assert.equal(img.attr('src'), '/t.png');
        assert.equal(img.attr('alt'), 'Post');
        assert.equal(img.attr('loading'), 'lazy');
        assert.equal(img.attr('decoding'), 'async');
    });

    it('renders the date, title and categories, without a thumbnail', async () => {
        const { $ } = await render('common/article_media', Object.assign({ thumbnail: null }, media));
        assert.equal($('.media-left').length, 0);
        assert.equal($('.date time').attr('datetime'), '2024-01-01');
        assert.equal($('.title a').attr('href'), '/p/');
        assert.equal($('.categories').text(), 'A / B');
    });
});

describe('layout/widget/recent_posts', () => {
    // The posts of site.posts: a Hexo Query, of which the widget uses sort, limit and map
    const query = posts => ({
        length: posts.length,
        sort: () => ({ limit: limit => posts.slice(0, limit) })
    });
    const posts = Array.from({ length: 7 }, (v, i) => ({
        title: 'Post ' + i,
        path: `p${i}/`,
        date: new Date(Date.UTC(2024, 0, 7 - i)),
        thumbnail: i === 0 ? '/t.png' : undefined,
        categories: []
    }));
    const renderWidget = (widget = {}) => render(require('../../layout/widget/recent_posts').Cacheable, {
        site: { posts: query(posts) },
        widget: Object.assign({ type: 'recent_posts', position: 'right' }, widget)
    });

    before(() => render(() => null));

    it('is the widget of the theme', () => {
        const view = require('hexo-component-inferno/lib/core/view');
        assert.equal(view.require('widget/recent_posts'), require('../../layout/widget/recent_posts'));
    });

    it('lists the latest posts, with lazily loaded thumbnails', async () => {
        const { $ } = await renderWidget();
        assert.equal($('.card.widget[data-type="recent-posts"] h3.menu-label').text(), 'Recents');
        assert.deepEqual($('.media .title a').map((i, el) => el.attribs.href).get(), ['/p0/', '/p1/', '/p2/', '/p3/', '/p4/']);
        assert.equal($('.media-left img').length, 1);
        assert.equal($('.media-left img').attr('loading'), 'lazy');
    });

    it('honours the limit', async () => {
        assert.equal((await renderWidget({ limit: 2 })).$('.media').length, 2);
    });
});
