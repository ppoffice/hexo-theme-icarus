module.exports = (ctx, locals) => {
    if (!locals.plugin) {
        return null;
    }
    return locals;
}