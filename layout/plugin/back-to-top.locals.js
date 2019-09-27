module.exports = (ctx, locals) => {
    const { plugin } = locals;
    if (!plugin) {
        return null;
    }
    return locals;
}