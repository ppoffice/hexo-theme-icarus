module.exports = (ctx, locals) => {
    const { get_config } = ctx;
    return Object.assign(locals, {
        title: get_config('title'),
        author: get_config('author'),
        logo: get_config('logo'),
        busuanzi: get_config('plugins.busuanzi', false),
        links: get_config('footer.links', [])
    });
}