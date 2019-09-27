module.exports = (ctx, locals) => {
    const { get_config, has_config, has_widget, is_same_link, page } = ctx;
    const menus = get_config('navbar.menu', {});
    const actives = {};
    Object.keys(menus).forEach(i => {
        actives[i] = typeof page.path !== 'undefined' && is_same_link(menus[i], page.path)
    });
    const hasToc = get_config('toc') === true && has_widget('toc') && (page.layout === 'page' || page.layout === 'post');
    return Object.assign(locals, {
        hasToc,
        menus,
        actives,
        title: get_config('title'),
        logo: get_config('logo'),
        links: get_config('navbar.links', []),
        search: has_config('search.type')
    });
}