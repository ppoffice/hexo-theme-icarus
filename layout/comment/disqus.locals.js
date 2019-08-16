module.exports = (ctx, locals) => {
    const { permalink, disqusId, path } = ctx.page;
    return Object.assign(locals, { permalink, disqusId, path });
}