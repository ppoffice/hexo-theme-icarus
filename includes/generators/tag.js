const pagination = require('hexo-pagination');

module.exports = function (hexo) {
    // ATTENTION: This will override the default tag generator!
    hexo.extend.generator.register('tag', function(locals) {
        const config = this.config;
        const perPage = config.category_generator.per_page;
        const paginationDir = config.pagination_dir || 'page';

        function findParent(tag) {
            let parents = [];
            if (tag && tag.hasOwnProperty('parent')) {
                const parent = locals.tag.filter(cat => cat._id === tag.parent).first();
                parents = [parent].concat(findParent(parent));
            }
            return parents;
        }
        
        return locals.tags.reduce(function(result, tag){
            const posts = tag.posts.sort('-date');
            const data = pagination(tag.path, posts, {
                perPage: perPage,
                layout: ['custom_tag','tag', 'index'],
                format: paginationDir + '/%d/',
                data: {
                    tag: tag.name,
                    parents: findParent(tag)
                }
            });
        
            return result.concat(data);
        }, []);
    });
}