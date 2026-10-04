const assert = require('assert').strict;
const { render } = require('../support/render');

const Upstream = require('hexo-component-inferno/lib/view/misc/paginator');

const props = (current, total, baseUrl = '/') => ({
    current,
    total,
    baseUrl,
    path: 'page',
    urlFor: url => url,
    prevTitle: 'Previous',
    nextTitle: 'Next'
});

async function renderPaginator(current, total, baseUrl) {
    return render('misc/paginator', props(current, total, baseUrl));
}

const pageLabels = $ => $('.pagination-list li').map((i, el) => $(el).text()).get();

describe('layout/misc/paginator', () => {
    it('links to the previous and next pages', async () => {
        const { $ } = await renderPaginator(2, 3);
        assert.equal($('.pagination-previous a').attr('href'), '/');
        assert.equal($('.pagination-next a').attr('href'), '/page/3/');
        assert.equal($('.pagination-link.is-current').text(), '2');
    });

    it('keeps an invisible, link-less "Previous" placeholder on the first page', async () => {
        const { $ } = await renderPaginator(1, 3);
        const prev = $('.pagination-previous');
        assert.ok(prev.hasClass('is-invisible'));
        assert.equal(prev.find('a').attr('href'), undefined);
        assert.equal($('.pagination-next a').attr('href'), '/page/2/');
    });

    it('keeps an invisible, link-less "Next" placeholder on the last page', async () => {
        const { $ } = await renderPaginator(3, 3);
        const next = $('.pagination-next');
        assert.ok(next.hasClass('is-invisible'));
        assert.equal(next.find('a').attr('href'), undefined);
        assert.equal($('.pagination-previous a').attr('href'), '/page/2/');
    });

    it('builds page URLs under the base URL', async () => {
        const { $ } = await renderPaginator(1, 2, '/archives/2024/');
        assert.deepEqual($('.pagination-link').map((i, el) => el.attribs.href).get(), ['/archives/2024/', '/archives/2024/page/2/']);
    });

    for (const [current, total, expected] of [
        [1, 1, ['1']],
        [3, 5, ['1', '2', '3', '4', '5']],
        [5, 10, ['1', '…', '4', '5', '6', '…', '10']],
        [1, 10, ['1', '2', '…', '10']],
        [10, 10, ['1', '…', '9', '10']]
    ]) {
        it(`lists pages ${expected.join(' ')} for page ${current} of ${total}`, async () => {
            assert.deepEqual(pageLabels((await renderPaginator(current, total)).$), expected);
        });
    }

    it('renders the same markup as the hexo-component-inferno paginator on middle pages', async () => {
        for (const [current, total] of [[2, 3], [5, 10], [3, 4]]) {
            const ours = (await render('misc/paginator', props(current, total))).html;
            const upstream = (await render(Upstream, props(current, total))).html;
            assert.equal(ours, upstream, `page ${current} of ${total}`);
        }
    });
});
