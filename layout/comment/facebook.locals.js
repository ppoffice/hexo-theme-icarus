module.exports = (ctx, locals) => {
    const { permalink } = ctx.page;
    return Object.assign(locals, { permalink });
}