const assert = require('assert').strict;
const { render, fixtureConfig, makePage } = require('../support/render');

const renderNavbar = (page, config) => render('common/navbar', { config: fixtureConfig(config), page: makePage(page) });

describe('layout/common/navbar', () => {
    it('renders the logo image linking to the site root', async () => {
        const { $ } = await renderNavbar();
        const logo = $('.navbar-logo');
        assert.equal(logo.attr('href'), '/');
        assert.equal(logo.find('img').attr('src'), '/img/logo.svg');
        assert.equal(logo.find('img').attr('alt'), 'Icarus Fixture');
    });

    it('renders a text logo when logo.text is set', async () => {
        const { $ } = await renderNavbar({}, { logo: { text: 'Text Logo' } });
        assert.equal($('.navbar-logo').text(), 'Text Logo');
        assert.equal($('.navbar-logo img').length, 0);
    });

    it('renders menu items in configuration order', async () => {
        const { $ } = await renderNavbar();
        const items = $('.navbar-start .navbar-item').map((i, el) => [[$(el).text(), $(el).attr('href')]]).get();
        assert.deepEqual(items, [['Home', '/'], ['Archives', '/archives'], ['Categories', '/categories'], ['Tags', '/tags'], ['About', '/about']]);
    });

    for (const [path, expected] of [
        ['about/index.html', 'About'],
        ['about/', 'About'],
        ['archives/index.html', 'Archives'],
        ['index.html', 'Home'],
        ['2024/01/01/post/', null]
    ]) {
        it(`marks ${expected ? `"${expected}"` : 'no item'} as active for page path ${path}`, async () => {
            const { $ } = await renderNavbar({ path });
            const active = $('.navbar-start .navbar-item.is-active').map((i, el) => $(el).text()).get();
            assert.deepEqual(active, expected ? [expected] : []);
        });
    }

    it('renders icon links and text links on the right side', async () => {
        const { $ } = await renderNavbar();
        const github = $('.navbar-end a[title="GitHub"]');
        assert.equal(github.attr('href'), 'https://github.com/ppoffice/hexo-theme-icarus');
        assert.equal(github.attr('target'), '_blank');
        assert.match(github.attr('rel'), /noopener/);
        assert.ok(github.find('i').hasClass('fa-github'));
        assert.equal(github.attr('aria-label'), 'GitHub');
        assert.equal(github.find('i').attr('aria-hidden'), 'true');
        assert.equal($('.navbar-end a[title="Example"]').attr('aria-label'), undefined, 'text links need no aria-label');
        assert.equal($('.navbar-end a[title="Example"]').text(), 'Example');
    });

    it('renders the toc and search controls as labelled buttons', async () => {
        const { $ } = await renderNavbar({ toc: true });
        for (const [selector, label] of [['.catalogue', 'Catalogue'], ['.search', 'Search']]) {
            const button = $(`.navbar-end ${selector}`);
            assert.equal(button.prop('tagName'), 'BUTTON', selector);
            assert.equal(button.attr('type'), 'button');
            assert.equal(button.attr('aria-label'), label);
            assert.equal(button.find('i').attr('aria-hidden'), 'true');
        }
        assert.equal($('a[href^="javascript:"]').length, 0);
    });

    it('renders a labelled toggle for the menu links, collapsed by default', async () => {
        const { $ } = await renderNavbar();
        const toggle = $('.navbar-menu > .navbar-toggle');
        assert.equal(toggle.length, 1);
        assert.equal(toggle.prop('tagName'), 'BUTTON');
        assert.equal(toggle.attr('type'), 'button');
        assert.equal(toggle.attr('title'), 'Menu');
        assert.equal(toggle.attr('aria-label'), 'Menu');
        assert.equal(toggle.attr('aria-expanded'), 'false');
        assert.ok(toggle.find('i').hasClass('fa-bars'));
        assert.equal(toggle.find('i').attr('aria-hidden'), 'true');
        // It controls the menu links, which follow it so that they come next in the tab order.
        assert.equal(toggle.attr('aria-controls'), 'navbar-main-menu');
        assert.ok(toggle.next().is('.navbar-start#navbar-main-menu'));
    });

    it('translates the menu toggle label', async () => {
        const { $ } = await renderNavbar({ lang: 'zh-CN' }, { language: 'zh-CN' });
        assert.equal($('.navbar-toggle').attr('aria-label'), '菜单');
    });

    it('renders no menu toggle without menu items', async () => {
        const { $ } = await renderNavbar({}, { navbar: { menu: null } });
        assert.equal($('.navbar-start').length, 0);
        assert.equal($('.navbar-toggle').length, 0);
    });

    it('shows the search button only when search is configured', async () => {
        assert.equal((await renderNavbar()).$('.navbar-item.search').length, 1);
        assert.equal((await renderNavbar({}, { search: { type: null } })).$('.navbar-item.search').length, 0);
    });

    it('ignores empty widget entries', async () => {
        const { $ } = await renderNavbar({ toc: true }, { widgets: [null, { position: 'left', type: 'toc' }] });
        assert.equal($('.catalogue').length, 1);
    });

    it('shows the mobile catalogue button only on posts/pages with a toc', async () => {
        assert.equal((await renderNavbar({ toc: true })).$('.catalogue').length, 1);
        assert.equal((await renderNavbar({ toc: false })).$('.catalogue').length, 0);
        assert.equal((await renderNavbar({ toc: true, layout: 'index' })).$('.catalogue').length, 0);
        assert.equal((await renderNavbar({ toc: true }, { widgets: [] })).$('.catalogue').length, 0);
    });
});
