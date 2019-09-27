module.exports = (ctx, locals) => {
    const { page } = ctx;
    return Object.assign(locals, { path: page.path });
}