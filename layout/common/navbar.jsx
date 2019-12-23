'use strict';

const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('../util/cache');

function isSameLink(a, b) {
    function santize(url) {
        let paths = url.replace(/(^\w+:|^)\/\//, '').split('#')[0].split('/').filter(p => p.trim() !== '');
        if (paths.length > 0 && paths[paths.length - 1].trim() === 'index.html') {
            paths = paths.slice(0, paths.length - 1);
        }
        return paths.join('/');
    }
    return santize(a) === santize(b);
}

class Navbar extends Component {
    render() {
        const {
            logo,
            logoUrl,
            siteUrl,
            siteTitle,
            menus,
            links,
            showToc,
            tocTitle,
            showSearch,
            searchTitle
        } = this.props;

        return <nav className="navbar navbar-main">
            <div className="container">
                <div className="navbar-brand is-flex-center">
                    <a className="navbar-item navbar-logo" href={siteUrl}>
                        {logo && logo.text ? logo.text : <img src={logoUrl} alt={siteTitle} height="28" />}
                    </a>
                </div>
                <div className="navbar-menu">
                    {Object.keys(menus).length ? <div className="navbar-start">
                        {Object.keys(menus).map(name => {
                            const menu = menus[name];
                            return <a className={{ 'navbar-item': true, 'is-active': menu.active }} href={menu.url}>{name}</a>;
                        })}
                    </div> : null}
                    <div className="navbar-end">
                        {Object.keys(links).length ? <Fragment>
                            {Object.keys(links).forEach(name => {
                                const link = links[name];
                                return <a className="navbar-item" target="_blank" rel="noopener" title={name} href={link.url}>
                                    {link.icon ? <i className={link.icon}></i> : name}
                                </a>;
                            })}
                        </Fragment> : null}
                        {showToc ? <a className="navbar-item is-hidden-tablet catalogue" title={tocTitle} href="javascript:;">
                            <i className="fas fa-list-ul"></i>
                        </a> : null}
                        {showSearch ? <a className="navbar-item search" title={searchTitle} href="javascript:;">
                            <i className="fas fa-search"></i>
                        </a> : null}
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

    const hasTocWidget = Array.isArray(widgets) && widgets.find(widget => widget.type === 'toc');
    const showToc = (config.toc === true || page.toc) && hasTocWidget && ['page', 'post'].includes(page.layout);

    const menus = {};
    if (navbar && navbar.menus) {
        const pageUrl = typeof page.path !== 'undefined' ? url_for(page.path) : '';
        Object.keys(navbar.menus).forEach(name => {
            const url = url_for(navbar.menus[name]);
            const active = isSameLink(url, pageUrl);
            menus[name] = { url, active };
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
        menus,
        links,
        showToc,
        tocTitle: _p('widget.catalogue', Infinity),
        showSearch: search && search.type,
        searchTitle: __('search.search')
    };
});
