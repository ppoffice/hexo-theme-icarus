const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');
const classname = require('hexo-component-inferno/lib/util/classname');

function isSameLink(a, b) {
    function sanitize(url) {
        let paths = url.replace(/(^\w+:|^)\/\//, '').split('#')[0].split('/').filter(p => p.trim() !== '');
        if (paths.length > 0 && paths[paths.length - 1].trim() === 'index.html') {
            paths = paths.slice(0, paths.length - 1);
        }
        return paths.join('/');
    }
    return sanitize(a) === sanitize(b);
}

class Navbar extends Component {
    render() {
        const {
            logo,
            logoUrl,
            siteUrl,
            siteTitle,
            menu,
            links,
            showToc,
            tocTitle,
            showSearch,
            searchTitle,
            menuTitle
        } = this.props;
        // The toggle folds the menu links into a drop-down when they do not fit (source/js/main.js)
        const hasMenu = Object.keys(menu).length > 0;

        let navbarLogo = '';
        if (logo) {
            if (logo.text) {
                navbarLogo = logo.text;
            } else {
                navbarLogo = <img src={logoUrl} alt={siteTitle} height="28" />;
            }
        } else {
            navbarLogo = siteTitle;
        }

        return <nav class="navbar navbar-main">
            <div class="container navbar-container">
                <div class="navbar-brand justify-content-center">
                    <a class="navbar-item navbar-logo" href={siteUrl}>
                        {navbarLogo}
                    </a>
                </div>
                <div class="navbar-menu">
                    {hasMenu ? <button type="button" class="navbar-item navbar-toggle" title={menuTitle} aria-label={menuTitle} aria-expanded="false" aria-controls="navbar-main-menu">
                        <i class="fas fa-bars" aria-hidden="true"></i>
                    </button> : null}
                    {hasMenu ? <div class="navbar-start" id="navbar-main-menu">
                        {Object.keys(menu).map((name, i) => {
                            const item = menu[name];
                            if (item.items) {
                                // A sub-menu: a button showing its links, as a drop-down or below it
                                // in the folded menu (source/js/main.js). Bulma's is-active on
                                // .has-dropdown means "open", so the button marks the current page.
                                const id = `navbar-main-menu-${i}`;
                                return <div class="navbar-item has-dropdown">
                                    <button type="button" class={classname({ 'navbar-link': true, 'is-active': item.active })} aria-expanded="false" aria-controls={id}>{name}</button>
                                    <div class="navbar-dropdown" id={id}>
                                        {Object.keys(item.items).map(subName => {
                                            const subItem = item.items[subName];
                                            return <a class={classname({ 'navbar-item': true, 'is-active': subItem.active })} href={subItem.url}>{subName}</a>;
                                        })}
                                    </div>
                                </div>;
                            }
                            return <a class={classname({ 'navbar-item': true, 'is-active': item.active })} href={item.url}>{name}</a>;
                        })}
                    </div> : null}
                    <div class="navbar-end">
                        {Object.keys(links).length ? <Fragment>
                            {Object.keys(links).map(name => {
                                const link = links[name];
                                return <a class="navbar-item" target="_blank" rel="noopener" title={name} href={link.url} aria-label={link.icon ? name : null}>
                                    {link.icon ? <i class={link.icon} aria-hidden="true"></i> : name}
                                </a>;
                            })}
                        </Fragment> : null}
                        {showToc ? <button type="button" class="navbar-item is-hidden-tablet catalogue" title={tocTitle} aria-label={tocTitle}>
                            <i class="fas fa-list-ul" aria-hidden="true"></i>
                        </button> : null}
                        {showSearch ? <button type="button" class="navbar-item search" title={searchTitle} aria-label={searchTitle}>
                            <i class="fas fa-search" aria-hidden="true"></i>
                        </button> : null}
                    </div>
                </div>
            </div>
        </nav>;
    }
}

module.exports = cacheComponent(Navbar, 'common.navbar', props => {
    const { config, helper, page } = props;
    const { url_for, _p, __ } = helper;
    const { logo, title, navbar, widgets, search } = config;

    const hasTocWidget = Array.isArray(widgets) && widgets.find(widget => widget && widget.type === 'toc');
    const showToc = (config.toc === true || page.toc) && hasTocWidget && ['page', 'post'].includes(page.layout);

    const menu = {};
    if (navbar && navbar.menu) {
        const pageUrl = typeof page.path !== 'undefined' ? url_for(page.path) : '';
        const getLink = path => {
            const url = url_for(path);
            return { url, active: isSameLink(url, pageUrl) };
        };
        Object.keys(navbar.menu).forEach(name => {
            const item = navbar.menu[name];
            if (item && typeof item === 'object') {
                // A sub-menu: the names of its links mapped to their URLs or paths
                const items = {};
                Object.keys(item).forEach(subName => {
                    items[subName] = getLink(item[subName]);
                });
                if (Object.keys(items).length) {
                    menu[name] = { items, active: Object.keys(items).some(subName => items[subName].active) };
                }
            } else {
                menu[name] = getLink(item);
            }
        });
    }

    const links = {};
    if (navbar && navbar.links) {
        Object.keys(navbar.links).forEach(name => {
            const link = navbar.links[name];
            links[name] = {
                url: url_for(typeof link === 'string' ? link : link.url),
                icon: link.icon
            };
        });
    }

    return {
        logo,
        logoUrl: url_for(logo),
        siteUrl: url_for('/'),
        siteTitle: title,
        menu,
        links,
        showToc,
        tocTitle: _p('widget.catalogue', Infinity),
        showSearch: search && search.type,
        searchTitle: __('search.search'),
        menuTitle: __('navbar.menu')
    };
});
