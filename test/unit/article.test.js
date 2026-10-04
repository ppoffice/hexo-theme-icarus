const assert = require('assert').strict;
const moment = require('moment');
const { render, fixtureConfig, makePage } = require('../support/render');
const { knownBug } = require('../support/known-bug');

function post(overrides = {}) {
    return makePage(Object.assign({
        title: 'Article Title',
        path: '2024/01/01/article/',
        date: moment.utc('2024-01-01T10:00:00Z'),
        updated: moment.utc('2024-01-01T10:00:00Z'),
        content: '<p>Rendered content</p>',
        _content: 'Rendered content'
    }, overrides));
}

const renderArticle = (page, { index = false, config } = {}) =>
    render('common/article', { config: fixtureConfig(config), page: post(page), index });

async function wordCountText(_content) {
    const { $ } = await renderArticle({ _content });
    return $('.article-meta').text();
}

const words = (n, word = 'word') => Array.from({ length: n }, () => word).join(' ');

describe('layout/common/article', () => {
    describe('reading time and word count', () => {
        it('counts English words', async () => {
            assert.match(await wordCountText(words(300)), /2 minutes read \(About 300 words\)/);
        });

        it('uses the singular form for one word', async () => {
            assert.match(await wordCountText('hello'), /\(About 1 word\)/);
        });

        it('counts each CJK character as a word', async () => {
            assert.match(await wordCountText('天地玄黄宇宙洪荒'), /\(About 8 words\)/);
        });

        it('ignores HTML tags', async () => {
            assert.match(await wordCountText('<span class="x">one</span> <b>two</b>'), /\(About 2 words\)/);
        });

        it('is hidden when article.readtime is off', async () => {
            const { $ } = await renderArticle({}, { config: { article: { readtime: false } } });
            assert.doesNotMatch($('.article-meta').text(), /read/);
        });

        knownBug('counts Cyrillic words, not letters', async () => {
            assert.match(await wordCountText('один два три четыре пять'), /\(About 5 words\)/);
        });

        knownBug('counts accented Latin words as single words', async () => {
            assert.match(await wordCountText('naïve façade jalapeño'), /\(About 3 words\)/);
        });

        knownBug('does not count CJK punctuation as words', async () => {
            assert.match(await wordCountText('你好，世界。'), /\(About 4 words\)/);
        });

        knownBug('does not count Markdown link URLs as words', async () => {
            assert.match(await wordCountText('[link](https://example.com/some/path)'), /\(About 1 word\)/);
        });
    });

    describe('dates', () => {
        const updated = moment.utc('2024-02-01T10:00:00Z');

        it('shows the creation date with a machine-readable datetime', async () => {
            const { $ } = await renderArticle();
            const time = $('.article-meta time').first();
            assert.equal(time.text(), '2024-01-01');
            assert.equal(time.attr('datetime'), '2024-01-01T10:00:00.000Z');
        });

        it('update_time: auto shows the update date only when it differs', async () => {
            const auto = { article: { update_time: 'auto' } };
            assert.equal((await renderArticle({}, { config: auto })).$('.article-meta time').length, 1);
            assert.equal((await renderArticle({ updated }, { config: auto })).$('.article-meta time').length, 2);
        });

        it('update_time: true always shows it and false never does', async () => {
            assert.equal((await renderArticle({}, { config: { article: { update_time: true } } })).$('.article-meta time').length, 2);
            assert.equal((await renderArticle({ updated }, { config: { article: { update_time: false } } })).$('.article-meta time').length, 1);
        });
    });

    it('shows a pin icon for pinned posts', async () => {
        assert.equal((await renderArticle({ top: true })).$('.fa-thumbtack').length, 1);
        assert.equal((await renderArticle()).$('.fa-thumbtack').length, 0);
    });

    it('links categories in order separated by slashes', async () => {
        const { $ } = await renderArticle({ categories: [{ name: 'Guides', path: 'categories/Guides/' }, { name: 'Hexo', path: 'categories/Guides/Hexo/' }] });
        const links = $('.article-meta a.link-muted').map((i, el) => [[$(el).text(), el.attribs.href]]).get();
        assert.deepEqual(links, [['Guides', '/categories/Guides/'], ['Hexo', '/categories/Guides/Hexo/']]);
        assert.match($('.article-meta').text(), /Guides\u00a0\/\u00a0Hexo/);
    });

    it('does not show post metadata on pages', async () => {
        assert.equal((await renderArticle({ layout: 'page' })).$('.article-meta').length, 0);
    });

    describe('post view', () => {
        it('renders the title as h1, the full content, tags, licensing and share/donate', async () => {
            const { $ } = await renderArticle({
                content: '<p>Full</p>', excerpt: '<p>Short</p>',
                tags: [{ name: 'hexo', path: 'tags/hexo/' }]
            });
            assert.equal($('h1.title').text(), 'Article Title');
            assert.equal($('.content').html(), '<p>Full</p>');
            assert.equal($('.article-tags a[rel="tag"]').attr('href'), '/tags/hexo/');
            assert.equal($('.article-licensing').length, 1);
            assert.equal($('.article-more').length, 0);
            assert.ok($('form[action*="paypal"]').length + $('[class*="donate"]').length > 0, 'donate block rendered');
        });

        it('renders previous/next navigation', async () => {
            const { $ } = await renderArticle({ prev: { path: 'p/', title: 'Newer' }, next: { path: 'n/', title: 'Older' } });
            assert.equal($('.article-nav-prev').attr('href'), '/p/');
            assert.equal($('.article-nav-prev').text(), 'Newer');
            assert.equal($('.article-nav-next').attr('href'), '/n/');
        });

        it('renders the cover image without a link', async () => {
            const { $ } = await renderArticle({ cover: '/img/cover.png' });
            assert.equal($('.card-image span.image img').attr('src'), '/img/cover.png');
            assert.equal($('.card-image a').length, 0);
        });

        it('shows the busuanzi page counter only when enabled', async () => {
            assert.equal((await renderArticle({}, { config: { plugins: { busuanzi: true } } })).$('#busuanzi_value_page_pv').length, 1);
            assert.equal((await renderArticle()).$('#busuanzi_value_page_pv').length, 0);
        });
    });

    describe('index view', () => {
        it('renders a linked title, the excerpt and a "Read more" link', async () => {
            const { $ } = await renderArticle({ content: '<p>Full</p>', excerpt: '<p>Short</p>' }, { index: true });
            assert.equal($('h1').length, 0);
            assert.equal($('p.title a').attr('href'), '/2024/01/01/article/');
            assert.equal($('.content').html(), '<p>Short</p>');
            assert.equal($('.article-more').attr('href'), '/2024/01/01/article/#more');
            assert.equal($('.article-more').text(), 'Read more');
        });

        it('renders the full content when there is no excerpt', async () => {
            const { $ } = await renderArticle({ content: '<p>Full</p>' }, { index: true });
            assert.equal($('.content').html(), '<p>Full</p>');
            assert.equal($('.article-more').length, 0);
        });

        it('omits tags, licensing, navigation and comments', async () => {
            const { $ } = await renderArticle({ tags: [{ name: 't', path: 'tags/t/' }], prev: { path: 'p/', title: 'P' } }, {
                index: true, config: { comment: { type: 'disqus', shortname: 'x' } }
            });
            for (const selector of ['.article-tags', '.article-licensing', '.post-navigation', '#comments']) {
                assert.equal($(selector).length, 0, selector);
            }
        });

        it('links the cover image to the post', async () => {
            const { $ } = await renderArticle({ cover: '/img/cover.png' }, { index: true });
            assert.equal($('.card-image a').attr('href'), '/2024/01/01/article/');
        });

        it('links to page.link instead of the path when set', async () => {
            const { $ } = await renderArticle({ link: 'https://example.com/elsewhere' }, { index: true });
            assert.equal($('p.title a').attr('href'), 'https://example.com/elsewhere');
        });
    });

    it('renders the comment section on posts when configured', async () => {
        const { $ } = await renderArticle({}, { config: { comment: { type: 'disqus', shortname: 'fixture' } } });
        assert.equal($('#comments h3').text(), 'Comments');
    });
});
