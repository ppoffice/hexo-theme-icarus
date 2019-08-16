module.exports = (ctx, locals) => {
    const { head, plugin } = locals;
    if (!head || !plugin.tracking_id) {
        return null;
    }
    return locals;
}