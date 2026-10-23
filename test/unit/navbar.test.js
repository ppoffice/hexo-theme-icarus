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

    describe('dark logo', () => {
        // [description, theme config, navbar logo markup]
        const picture = (dark, light) => `<picture><source srcset="${dark}" media="(prefers-color-scheme: dark)"><img src="${light}" alt="Icarus Fixture" height="28"></picture>`;
        const img = src => `<img src="${src}" alt="Icarus Fixture" height="28">`;
        for (const [description, config, expected] of [
            ['keeps the logo for the light appearance', {}, img('/img/logo.svg')],
            ['keeps the logo for the light appearance even with logo_dark', { logo_dark: '/img/night.svg' }, img('/img/logo.svg')],
            ['switches the theme logo to its dark version with the system for "auto"', { appearance: 'auto' }, picture('/img/logo-dark.svg', '/img/logo.svg')],
            ['uses the dark version of the theme logo for "dark"', { appearance: 'dark' }, img('/img/logo-dark.svg')],
            ['keeps a logo of the site without logo_dark', { appearance: 'auto', logo: '/img/mine.svg' }, img('/img/mine.svg')],
            ['keeps a logo of the site without logo_dark for "dark"', { appearance: 'dark', logo: '/img/mine.svg' }, img('/img/mine.svg')],
            ['switches to logo_dark for "auto"', { appearance: 'auto', logo: '/img/mine.svg', logo_dark: '/img/mine-dark.svg' }, picture('/img/mine-dark.svg', '/img/mine.svg')],
            ['uses logo_dark for "dark"', { appearance: 'dark', logo: '/img/mine.svg', logo_dark: 'https://example.com/dark.png' }, img('https://example.com/dark.png')],
            ['uses logo_dark with the theme logo too', { appearance: 'auto', logo_dark: '/img/night.svg' }, picture('/img/night.svg', '/img/logo.svg')],
            ['uses the dark logo for the cyberpunk variant, which is always dark', { variant: 'cyberpunk', appearance: 'light' }, img('/img/logo-dark.svg')],
            ['uses logo_dark for the cyberpunk variant', { variant: 'cyberpunk', logo: '/img/mine.svg', logo_dark: '/img/night.svg' }, img('/img/night.svg')]
        ]) {
            it(description, async () => {
                const { $ } = await renderNavbar({}, config);
                assert.equal($('.navbar-logo').html(), expected);
            });
        }

        it('keeps a text logo', async () => {
            for (const appearance of ['auto', 'dark']) {
                const { $ } = await renderNavbar({}, { appearance, logo: { text: 'Text Logo' }, logo_dark: '/img/night.svg' });
                assert.equal($('.navbar-logo').html(), 'Text Logo', appearance);
            }
        });
    });

    describe('sticky', () => {
        for (const [sticky, expected] of [[undefined, undefined], [false, undefined], [true, 'all'], ['mobile', 'mobile']]) {
            it(`marks the navbar ${expected ? `data-sticky="${expected}"` : 'not sticky'} for ${JSON.stringify(sticky)}`, async () => {
                const config = fixtureConfig();
                if (typeof sticky !== 'undefined') {
                    config.navbar.sticky = sticky;
                }
                const { $ } = await render('common/navbar', { config, page: makePage() });
                assert.equal($('nav.navbar-main').attr('data-sticky'), expected);
            });
        }
    });

    it('renders menu items in configuration order', async () => {
        const { $ } = await renderNavbar();
        const items = $('.navbar-start > a.navbar-item').map((i, el) => [[$(el).text(), $(el).attr('href')]]).get();
        assert.deepEqual(items, [['Home', '/'], ['Archives', '/archives'], ['Categories', '/categories'], ['Tags', '/tags'], ['About', '/about']]);
        // The fixture sub-menu sits between Tags and About.
        assert.deepEqual($('.navbar-start > .navbar-item').map((i, el) => { return $(el).is('.has-dropdown') ? 'group' : $(el).text(); }).get(),
            ['Home', 'Archives', 'Categories', 'Tags', 'group', 'About']);
    });

    describe('sub-menus', () => {
        const menu = {
            Home: '/',
            About: { Trademark: '/about/trademark/', Enterprise: 'https://example.com/enterprise' },
            Tags: '/tags',
            More: { Archives: '/archives' }
        };
        // Replace the fixture menu instead of merging into it.
        const renderWithMenu = (page, navbarMenu) => {
            const config = fixtureConfig();
            config.navbar.menu = navbarMenu;
            return render('common/navbar', { config, page: makePage(page) });
        };
        const renderMenu = page => renderWithMenu(page, menu);

        it('renders an object value as a button controlling a drop-down of links', async () => {
            const { $ } = await renderMenu();
            const groups = $('.navbar-start > .navbar-item.has-dropdown');
            assert.equal(groups.length, 2);
            const group = groups.first();
            assert.equal(group.prop('tagName'), 'DIV');
            const button = group.children().first();
            assert.ok(button.is('button.navbar-link'));
            assert.equal(button.attr('type'), 'button');
            assert.equal(button.text(), 'About');
            assert.equal(button.attr('aria-expanded'), 'false');
            const dropdown = button.next();
            assert.ok(dropdown.is('div.navbar-dropdown'));
            assert.equal(button.attr('aria-controls'), dropdown.attr('id'));
            const links = dropdown.children().map((i, el) => [[el.tagName, $(el).attr('class'), $(el).text(), $(el).attr('href')]]).get();
            assert.deepEqual(links, [
                ['a', 'navbar-item', 'Trademark', '/about/trademark/'],
                ['a', 'navbar-item', 'Enterprise', 'https://example.com/enterprise']
            ]);
        });

        it('gives each drop-down a unique id', async () => {
            const { $ } = await renderMenu();
            const ids = $('.navbar-link').map((i, el) => $(el).attr('aria-controls')).get();
            assert.deepEqual(ids, ['navbar-main-menu-1', 'navbar-main-menu-3']);
            for (const id of ids) {
                assert.equal($(`[id="${id}"]`).length, 1, id);
                assert.ok($(`#${id}`).is('.navbar-dropdown'));
            }
        });

        it('keeps string values as plain links, in configuration order', async () => {
            const { $ } = await renderMenu();
            assert.deepEqual($('.navbar-start > *').map((i, el) => { return $(el).is('a') ? `${$(el).text()} ${$(el).attr('href')}` : $(el).children('button').text(); }).get(),
                ['Home /', 'About', 'Tags /tags', 'More']);
            assert.deepEqual($('.navbar-start > a').map((i, el) => $(el).attr('class')).get(), ['navbar-item', 'navbar-item']);
        });

        it('marks the group button and the link of the current page as active', async () => {
            const { $ } = await renderMenu({ path: 'about/trademark/index.html' });
            assert.deepEqual($('.navbar-start .is-active').map((i, el) => `${el.tagName} ${$(el).text()}`).get(), ['button About', 'a Trademark']);
            assert.equal($('.navbar-link.is-active').attr('aria-expanded'), 'false');
            // Bulma opens a .has-dropdown.is-active: the group itself is not marked.
            assert.equal($('.has-dropdown.is-active').length, 0);
        });

        it('marks nothing in the groups for another page', async () => {
            const { $ } = await renderMenu({ path: 'tags/index.html' });
            assert.deepEqual($('.navbar-start .is-active').map((i, el) => $(el).text()).get(), ['Tags']);
        });

        it('skips an empty sub-menu', async () => {
            const { $ } = await renderWithMenu({}, { Home: '/', Empty: {} });
            assert.equal($('.has-dropdown').length, 0);
            assert.deepEqual($('.navbar-start > *').map((i, el) => $(el).text()).get(), ['Home']);
        });
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
