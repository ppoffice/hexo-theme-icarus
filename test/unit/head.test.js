const assert = require('assert').strict;
const { render, fixtureConfig, makePage } = require('../support/render');

const renderHead = (page, config) => render('common/head', { config: fixtureConfig(config), page: makePage(page), site: {} });

describe('layout/common/head', () => {
    describe('<title>', () => {
        for (const [description, page, expected] of [
            ['a post', {}, 'Test Page - Icarus Fixture'],
            ['a post without title', { title: '' }, 'Icarus Fixture'],
            ['the archive', { archive: true, title: undefined }, 'Archives - Icarus Fixture'],
            ['a yearly archive', { archive: true, year: 2024 }, 'Archives: 2024 - Icarus Fixture'],
            ['a monthly archive', { archive: true, year: 2024, month: 3 }, 'Archives: 2024/3 - Icarus Fixture'],
            ['a category', { category: 'Guides' }, 'Category: Guides - Icarus Fixture'],
            ['a tag', { tag: 'hexo' }, 'Tag: hexo - Icarus Fixture'],
            ['the category list', { __categories: true, title: undefined }, 'Categories - Icarus Fixture'],
            ['the tag list', { __tags: true, title: undefined }, 'Tags - Icarus Fixture']
        ]) {
            it(`is correct for ${description}`, async () => {
                const { $ } = await renderHead(page);
                assert.equal($('title').text(), expected);
            });
        }
    });

    it('marks archive, category and tag listings as noindex but not posts', async () => {
        assert.equal((await renderHead({})).$('meta[name="robots"]').length, 0);
        for (const page of [{ archive: true }, { category: 'Guides' }, { tag: 'hexo' }]) {
            assert.equal((await renderHead(page)).$('meta[name="robots"]').attr('content'), 'noindex');
        }
    });

    it('uses the page permalink as the canonical URL', async () => {
        const { $ } = await renderHead({ permalink: 'http://localhost:4000/2024/01/01/a/' });
        assert.equal($('link[rel="canonical"]').attr('href'), 'http://localhost:4000/2024/01/01/a/');
    });

    describe('Open Graph image', () => {
        const ogImages = async (page, config) => (await renderHead(page, config)).$('meta[property="og:image"]').map((i, el) => el.attribs.content).get();

        it('prefers the og_image front-matter', async () => {
            assert.deepEqual(await ogImages({ og_image: 'https://cdn.example.com/og.png', cover: '/c.png', thumbnail: '/t.png' }), ['https://cdn.example.com/og.png']);
        });

        it('falls back to cover, then thumbnail', async () => {
            assert.deepEqual(await ogImages({ cover: '/c.png', thumbnail: '/t.png' }), ['http://localhost:4000/c.png']);
            assert.deepEqual(await ogImages({ thumbnail: '/t.png' }), ['http://localhost:4000/t.png']);
        });

        it('falls back to article.og_image from the theme config', async () => {
            assert.deepEqual(await ogImages({}, { article: { og_image: '/site-og.png' } }), ['http://localhost:4000/site-og.png']);
        });

        it('uses the images found in the content', async () => {
            const content = '<p><img src="/a.png" alt="a"><img alt="b" src="https://example.com/b.png"></p>';
            assert.deepEqual(await ogImages({ content }), ['http://localhost:4000/a.png', 'https://example.com/b.png']);
        });

        it('defaults to /img/og_image.png', async () => {
            assert.deepEqual(await ogImages({}), ['http://localhost:4000/img/og_image.png']);
        });

        it('is overridden by head.open_graph.image', async () => {
            assert.deepEqual(await ogImages({ cover: '/c.png' }, { head: { open_graph: { image: 'https://example.com/forced.png' } } }), ['https://example.com/forced.png']);
        });
    });

    it('sets og:type to article for posts and website for pages', async () => {
        assert.equal((await renderHead({ __post: true, layout: 'post' })).$('meta[property="og:type"]').attr('content'), 'article');
        assert.equal((await renderHead({ layout: 'page' })).$('meta[property="og:type"]').attr('content'), 'website');
    });

    it('emits JSON-LD structured data', async () => {
        const { $ } = await renderHead({ title: 'Structured' });
        const data = JSON.parse($('script[type="application/ld+json"]').html());
        assert.equal(data.headline, 'Structured');
    });

    describe('stylesheets', () => {
        const stylesheets = async (page, config) => (await renderHead(page, config)).$('link[rel="stylesheet"]').map((i, el) => el.attribs.href).get();

        it('loads the icon font, highlight theme, web font and theme CSS for the default variant', async () => {
            const hrefs = await stylesheets({});
            assert.ok(hrefs.includes('https://use.fontawesome.com/releases/v6.0.0/css/all.css'), hrefs.join('\n'));
            assert.ok(hrefs.some(h => /highlight\.js@[\d.]+\/styles\/atom-one-light\.css$/.test(h)), hrefs.join('\n'));
            assert.ok(hrefs.some(h => h.startsWith('https://fonts.googleapis.com/css2?family=Ubuntu')), hrefs.join('\n'));
            assert.ok(hrefs.includes('/css/default.css'));
        });

        it('loads cyberpunk CSS and fonts for the cyberpunk variant', async () => {
            const hrefs = await stylesheets({}, { variant: 'cyberpunk' });
            assert.ok(hrefs.includes('/css/cyberpunk.css'));
            assert.ok(hrefs.some(h => h.includes('family=Oxanium')));
        });

        it('honours article.highlight.theme and highlight.enable: false', async () => {
            assert.ok((await stylesheets({}, { article: { highlight: { theme: 'monokai' } } })).some(h => h.endsWith('/styles/monokai.css')));
            assert.ok(!(await stylesheets({}, { highlight: { enable: false } })).some(h => h.includes('highlight.js')));
        });

        it('does not let PJAX swap the main theme stylesheet (FOUC regression)', async () => {
            const { $ } = await renderHead({});
            assert.equal($('link[href="/css/default.css"]').attr('data-pjax'), undefined);
        });
    });

    it('adds the AdSense script and follow.it verification only when those widgets exist', async () => {
        let { $ } = await renderHead({});
        assert.equal($('script[data-ad-client]').length, 0);
        assert.equal($('meta[name="follow.it-verification-code"]').length, 0);
        ({ $ } = await renderHead({}, { widgets: [
            { position: 'left', type: 'adsense', client_id: 'ca-pub-1', slot_id: '1' },
            { position: 'left', type: 'followit', action_url: 'https://follow.it', verification_code: 'abc' }
        ] }));
        assert.equal($('script[data-ad-client]').attr('data-ad-client'), 'ca-pub-1');
        assert.equal($('meta[name="follow.it-verification-code"]').attr('content'), 'abc');
    });

    it('renders head parts of enabled plugins (animejs hides content until animated)', async () => {
        const { $ } = await renderHead({}, { plugins: { animejs: true } });
        const css = $('style').text();
        assert.match(css, /opacity:\s*0/);
        // Only hidden once a script has opted in, so the page never stays blank without JS.
        for (const rule of css.split(',')) {
            assert.match(rule, /^html\.is-animating /, rule);
        }
        assert.match($('script:not([src])').text(), /prefers-reduced-motion/);
    });

    it('allows users to zoom (no maximum-scale or user-scalable=no in the viewport meta)', async () => {
        const { $ } = await renderHead({});
        const viewport = $('meta[name="viewport"]').attr('content');
        assert.match(viewport, /width=device-width/);
        assert.doesNotMatch(viewport, /maximum-scale|user-scalable/);
    });
});
