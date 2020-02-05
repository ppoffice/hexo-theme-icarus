module.exports = (ctx, locals) => {
    const { get_config, has_config, has_widget, is_same_link, page } = ctx;
    const menus = get_config('navbar.menu', {});
    const hasToc = get_config('toc') === true && has_widget('toc') && (page.layout === 'page' || page.layout === 'post');
    return Object.assign(locals, {
        hasToc,
        menus,
        title: get_config('title'),
        logo: get_config('logo'),
        links: get_config('navbar.links', []),
        search: has_config('search.type')
    });
}