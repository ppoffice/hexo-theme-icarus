const logger = require('hexo-log')();

module.exports = hexo => {
    logger.info('=== Registering Hexo extensions ===');
    require('hexo-component-inferno/lib/hexo/filter/locals')(hexo);
    require('hexo-component-inferno/lib/hexo/generator/assets')(hexo);
    require('hexo-component-inferno/lib/hexo/generator/insight')(hexo);
    require('hexo-component-inferno/lib/hexo/generator/categories')(hexo);
    require('hexo-component-inferno/lib/hexo/generator/category')(hexo);
    require('hexo-component-inferno/lib/hexo/generator/manifest')(hexo);
    require('hexo-component-inferno/lib/hexo/generator/tags')(hexo);
    require('hexo-component-inferno/lib/hexo/helper/cdn')(hexo);
    require('hexo-component-inferno/lib/hexo/helper/page')(hexo);
    require('hexo-component-inferno/lib/core/view').init(hexo);
};
