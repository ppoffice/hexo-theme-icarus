const logger = require('hexo-log')();

module.exports = hexo => {
    logger.info('=== Registering Hexo extensions ===');
    require('hexo-component-inferno/lib/hexo/filter/locals')(hexo);
    require('hexo-component-inferno/lib/hexo/generator/assets')(hexo);
    require('hexo-component-inferno/lib/hexo/generator/insight')(hexo);
    require('hexo-component-inferno/lib/hexo/generator/categories')(hexo);
    require('hexo-component-inferno/lib/hexo/generator/category')(hexo);
    require('hexo-component-inferno/lib/hexo/generator/tags')(hexo);
    require('hexo-component-inferno/lib/hexo/helper/cdn')(hexo);
    require('hexo-component-inferno/lib/hexo/helper/page')(hexo);
    require('hexo-component-inferno/lib/hexo/helper/thumbnail')(hexo);
    require('hexo-component-inferno/lib/core/view').init(hexo);

    const hooks = [
        'after_render:html',
        'after_post_render'
    ];
    const filters = [
        'hexoMetaGeneratorInject',
        'externalLinkFilter'
    ];
    hooks.forEach(hook => {
        hexo.extend.filter.list()[hook]
            .filter(filter => filters.includes(filter.name))
            .forEach(filter => hexo.extend.filter.unregister(hook, filter));
    });
};
