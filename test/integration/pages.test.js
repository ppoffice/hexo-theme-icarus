/**
 * Page-level structure checks on the generated fixture site.
 */
const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const yaml = require('hexo-component-inferno/lib/util/yaml');
const { getSite } = require('../support/site');
const { knownBug } = require('../support/known-bug');
const { FIXTURE_SITE } = require('../support/paths');

const POST_COUNT = fs.readdirSync(path.join(FIXTURE_SITE, 'source/_posts')).length;
const PER_PAGE = yaml.parse(fs.readFileSync(path.join(FIXTURE_SITE, '_config.yml'), 'utf8')).per_page;

describe('generated pages (default variant)', function() {
    this.timeout(120000);
    let site;

    before(() => {
        site = getSite('default');
    });

    const metaText = urlPath => site.$(urlPath)('.article-meta').text();

    describe('home page', () => {
        it(`lists ${PER_PAGE} posts per page with pagination`, () => {
            const $ = site.$('/');
            assert.equal($('.column-main > .card article').length, PER_PAGE);
            assert.equal($('.pagination-next a').attr('href'), '/page/2/');
            const last = Math.ceil(POST_COUNT / PER_PAGE);
            assert.ok(site.exists(`page/${last}/index.html`));
            assert.equal(site.exists(`page/${last + 1}/index.html`), false);
        });

        it('shows excerpts with a "Read more" link', () => {
            const article = site.$('/')('article').filter((i, el) => site.$('/')(el).find('a[href="/2024/03/01/hello-world/"]').length > 0);
            assert.equal(article.find('.article-more').attr('href'), '/2024/03/01/hello-world/#more');
            assert.match(article.find('.content').text(), /excerpt of the hello world post/);
            assert.doesNotMatch(article.find('.content').text(), /Final words/);
        });

        it('uses a three-column layout with both sidebars', () => {
            const $ = site.$('/');
            assert.ok($('body').hasClass('is-3-column'));
            assert.equal($('.column-left').length, 1);
            assert.equal($('.column-right').length, 1);
            assert.equal($('.column-right').hasClass('is-sticky'), true);
        });
    });

    describe('post page', () => {
        const url = '/2024/03/01/hello-world/';

        it('renders title, dates, categories and tags', () => {
            const $ = site.$(url);
            assert.equal($('h1.title').text(), 'Hello World');
            assert.equal($('title').text(), 'Hello World - Icarus Fixture');
            assert.equal($('.article-meta time').length, 2, 'created and updated dates');
            assert.deepEqual($('.article-meta a').map((i, el) => el.attribs.href).get(), ['/categories/Guides/', '/categories/Guides/Hexo/']);
            assert.deepEqual($('.article-tags a').map((i, el) => $(el).text()).get(), ['hexo', 'testing']);
        });

        it('renders a table of contents pointing at the headings', () => {
            const $ = site.$(url);
            const targets = $('#toc a').map((i, el) => el.attribs.href).get();
            assert.ok(targets.length >= 3, targets.join(', '));
            for (const target of targets) {
                assert.equal($(target.replace(/^#/, '#')).length, 1, `no heading for ${target}`);
            }
            assert.equal($('.navbar-main .catalogue').length, 1);
        });

        it('links to neighbouring posts', () => {
            const $ = site.$(url);
            assert.equal($('.article-nav-prev').length, 0, 'the newest post has no previous post');
            assert.equal($('.article-nav-next').attr('href'), '/2024/02/20/code-blocks/');
        });

        it('renders licensing and donation blocks', () => {
            const $ = site.$(url);
            assert.equal($('.article-licensing').length, 1);
            assert.match($('.column-main').text(), /Support the author/);
        });

        it('sets Open Graph and canonical metadata', () => {
            const $ = site.$(url);
            assert.equal($('link[rel="canonical"]').attr('href'), 'http://localhost:4000/2024/03/01/hello-world/');
            assert.equal($('meta[property="og:type"]').attr('content'), 'article');
            assert.equal($('meta[property="og:title"]').attr('content'), 'Hello World');
            assert.equal($('meta[property="og:url"]').attr('content'), 'http://localhost:4000/2024/03/01/hello-world/');
        });

        it('uses the og_image front-matter for Open Graph', () => {
            assert.equal(site.$('/2023/11/01/og-image/')('meta[property="og:image"]').attr('content'), 'https://cdn.example.com/og.png');
        });

        it('renders the pin icon and cover of a pinned post', () => {
            const $ = site.$('/2023/12/01/pinned/');
            assert.equal($('.fa-thumbtack').length, 1);
            assert.equal($('.card-image img').attr('src'), '/img/og_image.png');
        });
    });

    describe('code blocks', () => {
        it('renders highlighted code with captions', () => {
            const $ = site.$('/2024/02/20/code-blocks/');
            assert.equal($('figure.highlight').length, 3);
            assert.match($('figure.highlight figcaption').first().text(), /Captioned example/);
            assert.match($('figure.highlight figcaption').eq(1).text(), />folded/, 'the fold marker is passed to main.js');
        });
    });

    describe('reading time', () => {
        it('counts English words', () => {
            assert.match(metaText('/2024/02/01/word-count-en/'), /2 minutes read \(About 300 words\)/);
        });

        it('counts Chinese characters', () => {
            assert.match(metaText('/2024/01/20/word-count-zh/'), /\(About 150 words\)/);
        });

        knownBug('counts Russian words', () => {
            assert.match(metaText('/2024/01/10/word-count-ru/'), /\(About 10 words\)/);
        });

        knownBug('ignores Chinese punctuation', () => {
            assert.match(metaText('/2024/01/05/word-count-zh-punctuation/'), /\(About 4 words\)/);
        });
    });

    describe('archives', () => {
        it('groups all posts by year on the main archive', () => {
            const $ = site.$('/archives/');
            assert.deepEqual($('.column-main h3.tag').map((i, el) => $(el).text()).get().slice(0, 2), ['2024', '2023'].slice(0, $('.column-main h3.tag').length));
        });

        it('titles monthly archives with the month name', () => {
            const $ = site.$('/archives/2024/03/');
            assert.equal($('.column-main h3.tag').first().text(), 'March 2024');
            assert.equal($('title').text(), 'Archives: 2024/3 - Icarus Fixture');
            assert.equal($('meta[name="robots"]').attr('content'), 'noindex');
        });

        it('titles yearly archives with the year only', () => {
            assert.equal(site.$('/archives/2023/')('.column-main h3.tag').first().text(), '2023');
        });
    });

    describe('categories and tags', () => {
        it('renders a breadcrumb with parent categories', () => {
            const $ = site.$('/categories/Guides/Hexo/');
            const crumbs = $('.breadcrumb li').map((i, el) => $(el).text()).get();
            assert.deepEqual(crumbs, ['Categories', 'Guides', 'Hexo']);
            assert.equal($('.breadcrumb li.is-active a').attr('aria-current'), 'page');
        });

        it('lists the posts of a tag', () => {
            const $ = site.$('/tags/hexo/');
            assert.deepEqual($('.breadcrumb li').map((i, el) => $(el).text()).get(), ['Tags', 'hexo']);
            assert.equal($('.column-main article').length, 1);
        });

        it('lists all categories and tags', () => {
            assert.match(site.$('/categories/')('.column-main').text(), /Guides[\s\S]*Media/);
            assert.match(site.$('/tags/')('.column-main').text(), /hexo[\s\S]*testing/);
        });
    });

    describe('about page', () => {
        it('is rendered without post metadata and with the menu item active', () => {
            const $ = site.$('/about/');
            assert.equal($('h1.title').text(), 'About');
            assert.equal($('.article-meta').length, 0);
            assert.equal($('.navbar-start .is-active').text(), 'About');
        });
    });
});
