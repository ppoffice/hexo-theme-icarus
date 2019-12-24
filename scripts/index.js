/* global hexo */
require('../include/task/welcome');
require('../include/task/dependencies');
// require('../include/task/check_config');
require('../include/generator/categories')(hexo);
require('../include/generator/category')(hexo);
require('../include/generator/tags')(hexo);
require('../include/generator/insight')(hexo);
require('../include/filter/locals')(hexo);
require('../include/helper/cdn')(hexo);
require('../include/helper/page')(hexo);

// Fix large blog rendering OOM
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

// Debug helper
hexo.extend.helper.register('console', function() {
    console.log(arguments);
});
