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
        it('loads jQuery and moment before main.js and sets the moment locale', async () => {
            const { $ } = await renderLayout({ lang: 'zh-CN' });
            const sources = $('script[src]').map((i, el) => el.attribs.src).get();
            const indexOf = re => sources.findIndex(src => re.test(src));
            assert.ok(indexOf(/jquery/) > -1 && indexOf(/jquery/) < indexOf(/\/js\/main\.js$/), sources.join('\n'));
            assert.ok(indexOf(/moment/) > -1 && indexOf(/moment/) < indexOf(/\/js\/main\.js$/), sources.join('\n'));
            assert.match($('script:not([src])').text(), /moment\.locale\("zh-cn"\)/);
        });

        it('embeds the code block settings for main.js', async () => {
            const { $ } = await renderLayout({}, { article: { highlight: { clipboard: false, fold: 'folded' } } });
            const settings = $('script:not([src])').text();
            assert.match(settings, /clipboard: false/);
            assert.match(settings, /fold: 'folded'/);
            assert.equal($('script[src*="clipboard"]').length, 0, 'clipboard.js is not loaded when disabled');
        });

        it('loads PJAX and back-to-top scripts when those plugins are enabled', async () => {
            const { $ } = await renderLayout({}, { plugins: { pjax: true, back_to_top: true } });
            assert.equal($('script[src*="pjax.min.js"]').length, 1);
            assert.equal($('script[src="/js/pjax.js"]').length, 1);
            assert.equal($('#back-to-top').length, 1);
            assert.equal($('script[src="/js/back_to_top.js"]').length, 1);
        });

        it('renders the search box markup when search is configured', async () => {
            assert.equal((await renderLayout()).$('.searchbox').length, 1);
            assert.equal((await renderLayout({}, { search: { type: null } })).$('.searchbox').length, 0);
        });
    });
});
