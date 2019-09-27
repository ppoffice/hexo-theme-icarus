module.exports = (ctx, locals) => {
    const { head, plugin } = locals;
    if (!head || !plugin.site_id) {
        return null;
    }
    return locals;
}