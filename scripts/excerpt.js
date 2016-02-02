/**
* Excerpt Helper
* @description Get the excerpt from a post
* @example
*     <%- excerpt(post) %>
*/
hexo.extend.helper.register('excerpt', function (post) {
    var excerpt;
    if (post.excerpt) {
        excerpt = post.excerpt.replace(/\<[^\>]+\>/g, '');
    } else {
        excerpt = post.content.replace(/\<[^\>]+\>/g, '').substring(0, 200);
    }
    return excerpt;
});