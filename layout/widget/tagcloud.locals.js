module.exports = (ctx, locals) => {
    if (!ctx.site.tags.length) {
        return null;
    }
    return locals;
}