const assert = require('assert').strict;
const { render, fixtureConfig, makePage } = require('../support/render');

const site = { posts: { length: 0 }, categories: [], tags: [] };
const onlyProfile = position => [{ position, type: 'profile', author: 'A' }];

const renderLayout = (page = {}, config = {}) => render('layout', {
    config: fixtureConfig(Object.assign({ widgets: onlyProfile('left') }, config)),
    page: makePage(page),
    site,
    body: '<div id="page-body">BODY</div>'
});

describe('layout/layout (page skeleton)', () => {
    it('renders navbar, main column with the body, footer and scripts', async () => {
        const { $ } = await renderLayout();
        assert.equal($('body > nav.navbar-main').length, 1);
        assert.equal($('.column-main #page-body').text(), 'BODY');
        assert.equal($('body > footer.footer').length, 1);
        assert.equal($('body > script[src="/js/main.js"]').length, 1);
    });

    for (const [widgets, columns, mainClasses] of [
        [[], 1, ['is-12']],
        [onlyProfile('left'), 2, ['is-8-tablet', 'is-8-desktop', 'is-8-widescreen']],
        [[...onlyProfile('left'), ...onlyProfile('right')], 3, ['is-8-tablet', 'is-8-desktop', 'is-6-widescreen']]
    ]) {
        it(`uses a ${columns}-column layout`, async () => {
            const { $ } = await renderLayout({}, { widgets });
            assert.ok($('body').hasClass(`is-${columns}-column`), $('body').attr('class'));
            for (const cls of mainClasses) {
                assert.ok($('.column-main').hasClass(cls), `${cls} missing: ${$('.column-main').attr('class')}`);
            }
        });
    }

    describe('appearance', () => {
        const attribute = async config => (await renderLayout({}, config)).$('html').attr('data-appearance');

        it('marks the dark appearances on <html>, for the dark colors of the stylesheet', async () => {
            assert.equal(await attribute({ appearance: 'auto' }), 'auto');
            assert.equal(await attribute({ appearance: 'dark' }), 'dark');
        });

        it('adds no attribute for the light appearance', async () => {
            for (const config of [{}, { appearance: 'light' }, { appearance: 'night' }]) {
                assert.equal(await attribute(config), undefined, JSON.stringify(config));
            }
        });

        it('reports cyberpunk as fixed dark to plugins and browser controls', async () => {
            for (const appearance of [undefined, null, 'light', 'auto', 'dark', 'invalid']) {
                const { $ } = await renderLayout({}, { variant: 'cyberpunk', appearance });
                assert.equal($('html').attr('data-appearance'), 'dark');
                assert.equal($('html').attr('data-appearance-mode'), 'dark');
                assert.equal($('meta[name="color-scheme"]').attr('content'), 'dark');
                assert.equal($('.appearance-toggle').length, 0);
                assert.deepEqual($('link[href*="highlight.js"]').map((i, el) => el.attribs.href.split('/').pop()).get(), ['atom-one-dark.css']);
            }
        });

        it('applies the appearance of the page to the head and the logos too', async () => {
            const { $ } = await renderLayout({}, { appearance: 'dark' });
            assert.equal($('meta[name="color-scheme"]').attr('content'), 'dark');
            assert.deepEqual($('link[href*="highlight.js"]').map((i, el) => el.attribs.href.split('/').pop()).get(), ['atom-one-dark.css']);
            assert.deepEqual($('.navbar-logo img, .footer-logo img').map((i, el) => el.attribs.src).get(), ['/img/logo-dark.svg', '/img/logo-dark.svg']);
        });
    });

    describe('CDN providers', () => {
        const urls = async providers => {
            const { $ } = await renderLayout({}, { providers, plugins: { pjax: true } });
            const src = name => $(`script[src*="${name}"]`).attr('src');
            return { jquery: src('jquery'), clipboard: src('clipboard'), pjax: src('pjax-core.js'), highlight: $('link[href*="highlight.js"]').attr('href') };
        };

        it('loads the packages from the cdn provider', async () => {
            assert.deepEqual(await urls({ cdn: 'jsdelivr' }), {
                jquery: 'https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js',
                clipboard: 'https://cdn.jsdelivr.net/npm/clipboard@2.0.11/dist/clipboard.min.js',
                pjax: '/js/pjax-core.js',
                highlight: 'https://cdn.jsdelivr.net/npm/highlight.js@11.11.1/styles/atom-one-light.css'
            });
        });

        it('loads the packages of cdn_overrides from their own provider, URL template or URL', async () => {
            assert.deepEqual(await urls({
                cdn: 'jsdelivr',
                cdn_overrides: {
                    'jquery': 'cdnjs',
                    'highlight.js': 'https://cdn.example.com/${package}/${version}/${filename}',
                    'clipboard': 'https://example.com/js/clipboard.min.js'
                }
            }), {
                jquery: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js',
                clipboard: 'https://example.com/js/clipboard.min.js',
                pjax: '/js/pjax-core.js',
                highlight: 'https://cdn.example.com/highlight.js/11.11.1/styles/atom-one-light.css'
            });
        });

        it('loads the other packages from the cdn provider, or jsdelivr without one', async () => {
            const unpkg = await urls({ cdn: 'unpkg', cdn_overrides: { jquery: 'jsdelivr' } });
            assert.equal(unpkg.jquery, 'https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js');
            assert.equal(unpkg.pjax, '/js/pjax-core.js');
            const noCdn = await urls({ cdn: null, cdn_overrides: { jquery: 'unpkg' } });
            assert.equal(noCdn.jquery, 'https://unpkg.com/jquery@3.7.1/dist/jquery.min.js');
            assert.equal(noCdn.pjax, '/js/pjax-core.js');
            assert.deepEqual(await urls({ cdn: 'jsdelivr', cdn_overrides: null }), await urls({ cdn: 'jsdelivr' }));
        });
    });

    it('renders with empty widget entries (a bare "-" in YAML)', async () => {
        const { $ } = await renderLayout({ toc: true }, { widgets: [null, ...onlyProfile('left'), null] });
        assert.ok($('body').hasClass('is-2-column'));
        assert.equal($('.column-left .widget').length, 1);
    });

    it('sets <html lang> from the site language', async () => {
        assert.equal((await renderLayout()).$('html').attr('lang'), 'en');
    });

    it('prefers the page language over the site language', async () => {
        assert.equal((await renderLayout({ lang: 'fr' })).$('html').attr('lang'), 'fr');
    });

    for (const [lang, expected] of [['zh-CN', 'zh-CN'], ['pt-BR', 'pt-BR'], ['zh_TW', 'zh-TW'], ['ja', 'ja']]) {
        it(`keeps the region subtag in <html lang> (${lang} -> ${expected})`, async () => {
            assert.equal((await renderLayout({ lang })).$('html').attr('lang'), expected);
        });
    }

    describe('scripts', () => {
        it('loads the navbar once before the per-page main script', async () => {
            const { $ } = await renderLayout({}, { plugins: { pjax: true } });
            const sources = $('body > script[src]').map((i, el) => el.attribs.src).get();
            const navbar = $('script[src="/js/navbar.js"]');
            assert.equal(navbar.length, 1);
            assert.equal(navbar.attr('data-pjax'), undefined);
            assert.notEqual(navbar.attr('defer'), undefined);
            assert.ok(sources.indexOf('/js/navbar.js') < sources.indexOf('/js/main.js'));
            for (const source of ['pjax-page', 'pjax-prefetch']) {
                const script = $(`script[src="/js/${source}.js"]`);
                assert.equal(script.length, 1);
                assert.equal(script.attr('data-pjax'), undefined);
                assert.ok(sources.indexOf(`/js/${source}.js`) < sources.indexOf('/js/pjax.js'));
                assert.equal((await renderLayout()).$(`script[src="/js/${source}.js"]`).length, 0);
            }
        });

        it('loads jQuery before main.js', async () => {
            const { $ } = await renderLayout({ lang: 'zh-CN' });
            const sources = $('script[src]').map((i, el) => el.attribs.src).get();
            const indexOf = re => sources.findIndex(src => re.test(src));
            assert.ok(indexOf(/jquery/) > -1 && indexOf(/jquery/) < indexOf(/\/js\/main\.js$/), sources.join('\n'));
        });

        it('does not load moment in the browser (relative dates use Intl)', async () => {
            const { $ } = await renderLayout({ lang: 'zh-CN' });
            assert.equal($('script[src*="moment"]').length, 0);
            assert.doesNotMatch($('script:not([src])').text(), /moment/);
        });

        const embeddedSettings = $ => {
            const script = $('script:not([src])').filter((i, el) => /IcarusThemeSettings/.test($(el).html())).html();
            return JSON.parse(script.split('\n')[0].replace(/^var IcarusThemeSettings = /, '').replace(/;$/, ''));
        };

        it('embeds the code block settings and translations for main.js', async () => {
            const { $ } = await renderLayout({ lang: 'zh-CN' }, { article: { highlight: { clipboard: false, fold: 'folded' } } });
            assert.deepEqual(embeddedSettings($), {
                gallery: false,
                article: { highlight: { clipboard: false, fold: 'folded', fold_preview: 0 } },
                i18n: { copy: '复制', copied: '已复制！' }
            });
            assert.equal($('script[src*="clipboard"]').length, 0, 'clipboard.js is not loaded when disabled');
        });

        it('embeds the number of lines of the folded code block previews, or 0 for none', async () => {
            const preview = async fold_preview => embeddedSettings((await renderLayout({}, { article: { highlight: { fold_preview } } })).$).article.highlight.fold_preview;
            assert.equal(await preview(5), 5);
            for (const value of [undefined, null, 0, -3, 2.5, '5']) {
                assert.equal(await preview(value), 0, JSON.stringify(value));
            }
        });

        it('cannot break out of the settings <script> through configured values', async () => {
            const { $, html } = await renderLayout({}, { article: { highlight: { fold: '</script><script>alert(1)</script>' } } });
            assert.doesNotMatch(html, /<script>alert\(1\)/);
            assert.equal(embeddedSettings($).article.highlight.fold, '</script><script>alert(1)</script>');
        });

        it('loads PJAX and back-to-top scripts when those plugins are enabled', async () => {
            const { $ } = await renderLayout({}, { plugins: { pjax: true, back_to_top: true } });
            assert.equal($('script[src="/js/pjax-core.js"]').length, 1);
            assert.equal($('script[src="/js/pjax.js"]').length, 1);
            assert.equal($('#back-to-top').prop('tagName'), 'BUTTON');
            assert.equal($('#back-to-top').attr('aria-label'), 'Back to top');
            assert.equal($('script[src="/js/back_to_top.js"]').length, 1);
        });

        it('loads the prefetch script, which PJAX does not run again, only when the plugin is enabled', async () => {
            assert.equal((await renderLayout()).$('script[src="/js/prefetch.js"]').length, 0);
            assert.equal((await renderLayout({}, { plugins: { prefetch: false } })).$('script[src="/js/prefetch.js"]').length, 0);
            for (const [prefetch, delay] of [[true, '65'], [{}, '65'], [{ delay: null }, '65'], [{ delay: 0 }, '0'], [{ delay: 200 }, '200']]) {
                const { $ } = await renderLayout({}, { plugins: { pjax: true, prefetch } });
                const script = $('script[src="/js/prefetch.js"]');
                assert.equal(script.length, 1, JSON.stringify(prefetch));
                assert.equal(script.attr('data-delay'), delay, JSON.stringify(prefetch));
                assert.equal(script.attr('data-pjax'), undefined);
                assert.equal($('head script[src="/js/prefetch.js"]').length, 0);
            }
        });

        it('renders the search box markup when search is configured', async () => {
            assert.equal((await renderLayout()).$('.searchbox').length, 1);
            assert.equal((await renderLayout({}, { search: { type: null } })).$('.searchbox').length, 0);
        });
    });
});
