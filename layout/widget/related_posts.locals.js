module.exports = (ctx, locals) => {
    const { layout, content } = ctx.page;
    const { get_config } = ctx;
    if (layout !== 'page' && layout !== 'post') {
        return null;
    }
    return Object.assign(locals, { content });
}