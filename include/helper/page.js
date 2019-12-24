/**
* Helper functions for page/post.
*
* @example
*     <%- is_categories(page) %>
*     <%- is_tags(page) %>
*     <%- has_thumbnail(post) %>
*     <%- get_thumbnail(post) %>
*/
module.exports = function(hexo) {
    hexo.extend.helper.register('is_categories', function(page = null) {
        return (page === null ? this.page : page).__categories;
    });

    hexo.extend.helper.register('is_tags', function(page = null) {
        return (page === null ? this.page : page).__tags;
    });

    hexo.extend.helper.register('has_thumbnail', function(post) {
        const { article } = this.config;
        if (article && article.thumbnail === false) {
            return false;
        }
        return 'thumbnail' in post && post.thumbnail;
    });

    hexo.extend.helper.register('get_thumbnail', function(post) {
        const { url_for, has_thumbnail } = this.helper;
        return url_for(has_thumbnail.call(this, post) ? post.thumbnail : 'images/thumbnail.svg');
    });
};
