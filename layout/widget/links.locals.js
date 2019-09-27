module.exports = (ctx, locals) => {
    const { get_config_from_obj } = ctx;
    const links = get_config_from_obj(locals.widget, 'links');
    if (Object.keys(links).length == 0) {
        return null;
    }
    return Object.assign(locals, { links });
}