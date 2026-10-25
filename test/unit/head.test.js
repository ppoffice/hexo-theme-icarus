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

    describe('og:type of head.open_graph.type', () => {
        const ogType = async (page, type) => (await renderHead(page, { head: { open_graph: { type } } })).$('meta[property="og:type"]').attr('content');

        // Configurations generated before hexo-component-inferno 4.2.0 have type: blog.
        it('ignores "blog", which is not an Open Graph type', async () => {
            assert.equal(await ogType({ __post: true, layout: 'post' }, 'blog'), 'article');
            assert.equal(await ogType({ layout: 'page' }, 'blog'), 'website');
        });

        it('keeps any other type', async () => {
            assert.equal(await ogType({ __post: true, layout: 'post' }, 'website'), 'website');
            assert.equal(await ogType({ layout: 'page' }, 'profile'), 'profile');
        });
    });

    it('emits JSON-LD structured data', async () => {
        const { $ } = await renderHead({ title: 'Structured' });
        const data = JSON.parse($('script[type="application/ld+json"]').html());
        assert.equal(data.headline, 'Structured');
    });

    it('ignores legacy Google+ configuration without changing Open Graph, Twitter or JSON-LD', async () => {
        const open_graph = {
            title: 'Social preview',
            twitter_card: 'summary_large_image',
            twitter_id: 'author',
            twitter_site: '@site',
            fb_admins: 'admin',
            fb_app_id: 'app'
        };
        const structured_data = { publisher: 'Publisher', publisher_logo: '/logo.png' };
        const baseline = await renderHead({}, { head: { open_graph, structured_data } });
        const legacy = await renderHead({}, { head: {
            open_graph: { ...open_graph, google_plus: 'https://plus.google.com/legacy' },
            structured_data
        } });
        assert.equal(legacy.$('link[rel="publisher"]').length, 0);
        assert.equal(legacy.$('meta[property="og:title"]').attr('content'), 'Social preview');
        assert.equal(legacy.$('meta[property="twitter:card"]').attr('content'), 'summary_large_image');
        assert.equal(JSON.parse(legacy.$('script[type="application/ld+json"]').html()).publisher.name, 'Publisher');
        assert.equal(legacy.html, baseline.html);
    });

    describe('metadata image overrides', () => {
        const images = async (page, config) => {
            const { $ } = await renderHead(page, config);
            const structured = $('script[type="application/ld+json"]');
            return {
                openGraph: $('meta[property="og:image"]').map((i, el) => el.attribs.content).get(),
                structured: structured.length ? JSON.parse(structured.html()).image : null
            };
        };

        it('keeps the two explicit overrides independent and ahead of page.photos', async () => {
            assert.deepEqual(await images({ cover: '/cover.png', photos: ['/photo.png'] }, { head: {
                open_graph: { image: ['/og.png', 'https://example.com/og.png'] },
                structured_data: { image: '/structured.png' }
            } }), {
                openGraph: ['http://localhost:4000/og.png', 'https://example.com/og.png'],
                structured: ['http://localhost:4000/structured.png']
            });
        });

        it('uses photos for empty or null overrides and the base image for empty photos', async () => {
            assert.deepEqual(await images({ cover: '/cover.png', photos: '/photo.png' }, { head: {
                open_graph: { image: [] }, structured_data: { image: null }
            } }), {
                openGraph: ['http://localhost:4000/photo.png'],
                structured: ['http://localhost:4000/photo.png']
            });
            assert.deepEqual(await images({ cover: '/cover.png', photos: [] }), {
                openGraph: ['http://localhost:4000/cover.png'],
                structured: ['http://localhost:4000/cover.png']
            });
        });

        it('leaves disabled metadata sections disabled', async () => {
            for (const disabled of [false, null]) {
                assert.deepEqual(await images({ photos: ['/photo.png'] }, { head: {
                    open_graph: disabled, structured_data: disabled
                } }), { openGraph: [], structured: null });
            }
        });
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

        it('shows the text in a fallback font until the web fonts are loaded', async () => {
            for (const variant of ['default', 'cyberpunk', 'm3e']) {
                const { $ } = await renderHead({}, { variant });
                assert.match($('link[data-variant]').first().attr('href'), /^https:\/\/fonts\.googleapis\.com\/css2\?family=.+&display=swap$/, variant);
            }
        });

        it('adds display=swap to the query of a custom web font provider', async () => {
            const { $ } = await renderHead({}, { providers: { fontcdn: 'https://fonts.example.com/${type}?family=${fontname}' } });
            assert.equal($('link[data-variant]').first().attr('href'), 'https://fonts.example.com/css2?family=Ubuntu:wght@400;600&family=Source+Code+Pro&display=swap');
        });

        describe('preconnect', () => {
            const preconnects = async config => (await renderHead({}, config)).$('link[rel="preconnect"]')
                .map((i, el) => [[el.attribs.href, el.attribs.crossorigin]]).get();

            it('connects in advance to the origins of the icon and web font files', async () => {
                assert.deepEqual(await preconnects({}), [
                    ['https://use.fontawesome.com', 'anonymous'],
                    ['https://fonts.gstatic.com', 'anonymous']
                ]);
                assert.deepEqual(await preconnects({ variant: 'cyberpunk' }), await preconnects({}));
            });

            it('precedes the stylesheets', async () => {
                const { $ } = await renderHead({});
                assert.ok($('link[rel="preconnect"]').last().nextAll('link[rel="stylesheet"]').length > 0);
                assert.equal($('link[rel="preconnect"]').last().prevAll('link[rel="stylesheet"]').length, 0);
            });

            it('follows the icon and web font providers', async () => {
                assert.deepEqual(await preconnects({ providers: { iconcdn: 'loli', fontcdn: 'loli' } }), [['https://cdnjs.loli.net', 'anonymous']]);
                assert.deepEqual(await preconnects({ providers: { iconcdn: 'https://icons.example.com/css/all.css', fontcdn: 'https://fonts.example.com/${type}?family=${fontname}' } }),
                    [['https://icons.example.com', 'anonymous']]);
            });

            it('skips the fonts hosted with the site', async () => {
                assert.deepEqual(await preconnects({ providers: { iconcdn: '/css/all.css', fontcdn: '/css/fonts.css' } }), []);
                assert.deepEqual(await preconnects({ url: 'https://icons.example.com', providers: { iconcdn: 'https://icons.example.com/css/all.css' } }),
                    [['https://fonts.gstatic.com', 'anonymous']]);
            });
        });

        it('honours article.highlight.theme and highlight.enable: false', async () => {
            assert.ok((await stylesheets({}, { article: { highlight: { theme: 'monokai' } } })).some(h => h.endsWith('/styles/monokai.css')));
            assert.ok(!(await stylesheets({}, { highlight: { enable: false } })).some(h => h.includes('highlight.js')));
        });

        it('does not let PJAX swap the main theme stylesheet (FOUC regression)', async () => {
            const { $ } = await renderHead({});
            assert.equal($('link[href="/css/default.css"]').attr('data-pjax'), undefined);
        });

        // PJAX replaces them only when the next page has another variant, set in its front-matter
        it('marks the theme and web font stylesheets of the variant', async () => {
            for (const [variant, font] of [['default', 'Ubuntu'], ['cyberpunk', 'Oxanium'], ['m3e', 'Roboto+Flex']]) {
                const { $ } = await renderHead({}, { variant });
                const hrefs = $('link[data-variant]').map((i, el) => el.attribs.href).get();
                assert.equal(hrefs.length, 2, hrefs.join('\n'));
                assert.ok(hrefs[0].includes('family=' + font), hrefs[0]);
                assert.equal(hrefs[1], `/css/${variant}.css`);
            }
        });
    });

    describe('appearance', () => {
        const highlightThemes = async config => (await renderHead({}, config)).$('link[href*="highlight.js"]')
            .map((i, el) => [[el.attribs.href.match(/styles\/(.+)\.css$/)[1], el.attribs.media || null, 'data-pjax' in el.attribs]]).get();
        const colorScheme = async config => {
            const meta = (await renderHead({}, config)).$('meta[name="color-scheme"]');
            return meta.length ? meta.attr('content') : null;
        };

        it('changes nothing for "light", the default', async () => {
            for (const config of [{}, { appearance: 'light' }, { appearance: 'unknown' }]) {
                assert.equal(await colorScheme(config), null);
                assert.deepEqual(await highlightThemes(config), [['atom-one-light', null, true]]);
            }
        });

        it('follows the system color scheme for "auto"', async () => {
            assert.equal(await colorScheme({ appearance: 'auto' }), 'light dark');
            assert.deepEqual(await highlightThemes({ appearance: 'auto' }), [
                ['atom-one-light', '(prefers-color-scheme: light)', true],
                ['atom-one-dark', '(prefers-color-scheme: dark)', true]
            ]);
        });

        it('only loads the dark code highlight theme for "dark"', async () => {
            assert.equal(await colorScheme({ appearance: 'dark' }), 'dark');
            assert.deepEqual(await highlightThemes({ appearance: 'dark' }), [['atom-one-dark', null, true]]);
        });

        it('honours article.highlight.dark_theme, and falls back to atom-one-dark without it', async () => {
            const highlight = { theme: 'github', dark_theme: 'github-dark' };
            assert.deepEqual(await highlightThemes({ appearance: 'auto', article: { highlight } }), [
                ['github', '(prefers-color-scheme: light)', true],
                ['github-dark', '(prefers-color-scheme: dark)', true]
            ]);
            assert.deepEqual(await highlightThemes({ appearance: 'dark', article: { highlight } }), [['github-dark', null, true]]);
            assert.deepEqual(await highlightThemes({ appearance: 'dark', article: { highlight: { dark_theme: null } } }), [['atom-one-dark', null, true]]);
        });

        it('loads no code highlight theme when highlighting is disabled', async () => {
            for (const appearance of ['auto', 'dark']) {
                assert.deepEqual(await highlightThemes({ appearance, highlight: { enable: false } }), [], appearance);
            }
        });

        it('is always dark for the cyberpunk variant', async () => {
            for (const appearance of ['light', 'auto', 'dark']) {
                const config = { variant: 'cyberpunk', appearance };
                assert.equal(await colorScheme(config), 'dark', appearance);
                assert.deepEqual(await highlightThemes(config), [['atom-one-dark', null, true]], appearance);
            }
        });

        it('keeps appearance restoration, highlight, sync and variant resources in order', async () => {
            for (const variant of ['default', 'cyberpunk', 'm3e']) {
                for (const appearance of ['light', 'dark', 'auto']) {
                    const { $ } = await renderHead({}, { variant, appearance });
                    const resources = $('head > script, head > link[rel="stylesheet"]').map((i, el) =>
                        el.attribs.src || el.attribs.href || $(el).text()).get();
                    const restore = resources.indexOf('/js/appearance.js');
                    const icon = resources.findIndex(resource => resource.includes('fontawesome'));
                    const highlight = resources.map((resource, i) => {
                        return resource.includes('highlight.js') ? i : -1;
                    }).filter(i => i >= 0);
                    const sync = resources.indexOf('window.IcarusAppearance.sync();');
                    const font = resources.findIndex(resource => resource.includes('fonts.googleapis.com'));
                    const css = resources.indexOf(`/css/${variant}.css`);
                    assert.ok(restore >= 0 && restore < icon);
                    assert.ok(highlight.length > 0 && highlight.every(i => icon < i && i < sync));
                    assert.ok(sync < font && font < css);
                }
            }
        });

        it('supports light, dark and auto in the m3e variant', async () => {
            for (const appearance of ['light', 'dark', 'auto']) {
                const config = { variant: 'm3e', appearance };
                assert.equal(await colorScheme(config), await colorScheme({ appearance }));
                assert.deepEqual(await highlightThemes(config), await highlightThemes({ appearance }));
            }
            const { $ } = await renderHead({}, { variant: 'm3e', providers: { fontcdn: 'https://fonts.example.com/${type}?family=${fontname}' } });
            const font = $('link[data-variant]').first().attr('href');
            assert.ok(font.startsWith('https://fonts.example.com/css2?family=Roboto+Flex:'));
            assert.ok(font.includes('opsz,wdth,wght@8..144,25..151,100..1000'));
            assert.ok(font.includes('family=Roboto+Mono:'));
            assert.ok(font.includes('family=Noto+Sans+SC:wght@100..900'));
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
