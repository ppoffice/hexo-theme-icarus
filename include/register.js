const logger = require('hexo-log')();

module.exports = hexo => {
    logger.info('=== Patching Hexo ===');
    require('../include/generator/categories')(hexo);
    require('../include/generator/category')(hexo);
    require('../include/generator/tags')(hexo);
    require('../include/generator/insight')(hexo);
    require('../include/filter/locals')(hexo);
    require('../include/helper/cdn')(hexo);
    require('../include/helper/page')(hexo);
    require('../include/helper/thumbnail')(hexo);

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
