require('../includes/tasks/welcome');
require('../includes/tasks/check_deps');
require('../includes/tasks/check_config');
require('../includes/generators/categories')(hexo);
require('../includes/generators/category')(hexo);
require('../includes/generators/tags')(hexo);
require('../includes/generators/insight')(hexo);
require('../includes/helpers/cdn')(hexo);
require('../includes/helpers/config')(hexo);
require('../includes/helpers/layout')(hexo);
require('../includes/helpers/override')(hexo);
require('../includes/helpers/page')(hexo);
require('../includes/helpers/site')(hexo);

// Fix large blog rendering OOM
const hooks = [
    'after_render:html',
    'after_post_render'
]
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
hexo.extend.helper.register('console', function () {
    console.log(arguments)
});