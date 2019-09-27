module.exports = (ctx, locals) => {
    const { head, plugin } = locals;
    if (head || !plugin) {
        return null;
    }
    return locals;
}