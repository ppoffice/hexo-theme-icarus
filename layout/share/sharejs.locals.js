module.exports = (ctx, locals) => {
    const { get_config } = ctx;
    return Object.assign(locals, {
        // just for diff detection
        _providers: {
            _cdn: get_config('providers.cdn')
        }
    });
}