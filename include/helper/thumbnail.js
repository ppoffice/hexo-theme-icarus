/**
* Helper functions for post thumbnail.
*
* @example
*     <%- has_thumbnail(post) %>
*     <%- get_thumbnail(post) %>
*/
module.exports = function(hexo) {
    hexo.extend.helper.register('has_thumbnail', function(post) {
        const { article } = this.config;
        if (typeof post !== 'object') {
            return false;
        }
        if (article && article.thumbnail === false) {
            return false;
        }
        return 'thumbnail' in post && post.thumbnail;
    });

    hexo.extend.helper.register('get_thumbnail', function(post) {
        const { url_for, has_thumbnail } = this.helper;
        return url_for(has_thumbnail.call(this, post) ? post.thumbnail : '/img/thumbnail.svg');
    });
};
