const assert = require('assert').strict;
const moment = require('moment');
const { render, fixtureConfig, makePage } = require('../support/render');

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

async function wordCountText(content, page = {}) {
    const { $ } = await renderArticle(Object.assign({ content }, page));
    return $('.article-meta').text();
}

const words = (n, word = 'word') => Array.from({ length: n }, () => word).join(' ');

describe('layout/common/article', () => {
    describe('reading time and word count', () => {
        const count = async (html, page) => {
            const match = (await wordCountText(html, page)).match(/\(About (\d+) words?\)/);
            assert.ok(match, 'word count not rendered');
            return Number(match[1]);
        };

        it('counts English words', async () => {
            assert.match(await wordCountText(`<p>${words(300)}</p>`), /2 minutes read \(About 300 words\)/);
        });

        it('uses the singular form for one word', async () => {
            assert.match(await wordCountText('<p>hello</p>'), /\(About 1 word\)/);
        });

        for (const [description, html, expected] of [
            ['each Chinese character as a word', '<p>天地玄黄宇宙洪荒</p>', 8],
            ['each Japanese kana and kanji as a word', '<p>日本語のテキスト</p>', 8],
            ['Korean words separated by spaces', '<p>안녕하세요 세계</p>', 2],
            ['Cyrillic words, not letters', '<p>один два три четыре пять</p>', 5],
            ['Greek words', '<p>καλημέρα κόσμε</p>', 2],
            ['accented Latin words as single words', '<p>naïve façade jalapeño</p>', 3],
            ['Vietnamese words', '<p>Tiếng Việt rất đẹp</p>', 4],
            ['contractions as one word', '<p>don\'t stop, it\u2019s fine</p>', 4],
            ['mixed CJK and Latin text', '<p>使用Hexo写博客</p>', 6]
        ]) {
            it(`counts ${description}`, async () => {
                assert.equal(await count(html), expected);
            });
        }

        for (const [description, html, expected] of [
            ['punctuation, including CJK punctuation', '<p>你好，世界。 Hello, world! — “quoted” …</p>', 7],
            ['markup and link targets', '<p><span class="x">one</span> <a href="https://example.com/some/path">two</a></p>', 2],
            ['HTML entities', '<p>Tom &amp; Jerry&nbsp;&mdash;&nbsp;cartoon</p>', 3],
            ['numbers without letters', '<p>in 2024 we shipped v8</p>', 4],
            ['code line numbers', '<figure class="highlight js"><table><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span></pre></td><td class="code"><pre><span class="line"><span class="keyword">const</span> x;</span><br><span class="line">y();</span></pre></td></tr></table></figure>', 3],
            ['scripts, styles and comments', '<p>visible</p><script>var hidden = 1;</script><style>.hidden{}</style><!-- hidden comment -->', 1]
        ]) {
            it(`ignores ${description}`, async () => {
                assert.equal(await count(html), expected);
            });
        }

        it('counts the original content of encrypted posts', async () => {
            assert.equal(await count('<div id="encrypted">abcdef0123456789</div><p>Enter password</p>', {
                encrypt: true, origin: '<p>one two three</p>'
            }), 3);
        });

        it('is hidden when article.readtime is off', async () => {
            const { $ } = await renderArticle({}, { config: { article: { readtime: false } } });
            assert.doesNotMatch($('.article-meta').text(), /read/);
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
