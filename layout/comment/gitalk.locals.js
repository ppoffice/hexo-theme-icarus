module.exports = (ctx, locals) => {
    const { path } = ctx.page;
    return Object.assign(locals, { path });
}