/**
 * Tag list page generator
 */
module.exports = function(hexo) {
    hexo.extend.generator.register('tags', locals => {
        return {
            path: 'tags/',
            layout: ['tags'],
            data: Object.assign({}, locals, {
                __tags: true
            })
        };
    });
};
