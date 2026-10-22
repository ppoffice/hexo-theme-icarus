const assert = require('assert').strict;
const { render, makePage } = require('../support/render');

/** The paginator of hexo-component-inferno, which the index and archive layouts use. */
const Paginator = require('hexo-component-inferno/lib/view/misc/paginator');

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
    return render(Paginator, props(current, total, baseUrl));
}

const pageLabels = $ => $('.pagination-list li').map((i, el) => $(el).text()).get();

describe('paginator (hexo-component-inferno misc/paginator)', () => {
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

    describe('in the layouts', () => {
        const pagination = $ => ({
            prev: [$('.pagination-previous').hasClass('is-invisible'), $('.pagination-previous a').attr('href')],
            next: [$('.pagination-next').hasClass('is-invisible'), $('.pagination-next a').attr('href')],
            pages: $('.pagination-link').map((i, el) => el.attribs.href).get()
        });

        it('index: links pages under the pagination directory, without a link on the hidden "Previous"', async () => {
            const page = makePage({ layout: 'index', posts: [], current: 1, total: 3, base: '/' });
            const { $ } = await render('index', { page });
            assert.deepEqual(pagination($), { prev: [true, undefined], next: [false, '/page/2/'], pages: ['/', '/page/2/', '/page/3/'] });
            assert.equal($('.pagination-previous a').text(), 'Previous');
            assert.equal($('.pagination-next a').text(), 'Next');
        });

        it('archive: links pages under the archive, without a link on the hidden "Next"', async () => {
            const page = makePage({ layout: 'archive', posts: [], year: 2024, month: 3, current: 2, total: 2, base: '/archives/2024/03/' });
            const { $ } = await render('archive', { page });
            assert.deepEqual(pagination($), {
                prev: [false, '/archives/2024/03/'],
                next: [true, undefined],
                pages: ['/archives/2024/03/', '/archives/2024/03/page/2/']
            });
        });

        it('index: renders no paginator for a single page', async () => {
            const page = makePage({ layout: 'index', posts: [], current: 1, total: 1, base: '/' });
            assert.equal((await render('index', { page })).$('.pagination').length, 0);
        });
    });
});
