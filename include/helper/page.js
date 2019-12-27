/**
* Helper functions for page/post.
*
* @example
*     <%- is_categories(page) %>
*     <%- is_tags(page) %>
*/
module.exports = function(hexo) {
    hexo.extend.helper.register('is_categories', function(page = null) {
        return (page === null ? this.page : page).__categories === true;
    });

    hexo.extend.helper.register('is_tags', function(page = null) {
        return (page === null ? this.page : page).__tags === true;
    });
};
