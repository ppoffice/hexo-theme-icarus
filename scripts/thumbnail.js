/**
* Thumbnail Helper
* @description Get the thumbnail url from a post
* @example
*     <%- thumbnail(post) %>
*/
hexo.extend.helper.register('thumbnail', function (post) {
    var url = post.thumbnail || post.banner || '';
    if (!url) {
        var imgPattern = /\<img\s.*?\s?src\s*=\s*['|"]?([^\s'"]+).*?\>/ig;
        var result = imgPattern.exec(post.content);
        if (result && result.length > 1) {
            url = result[1];
        }
        if(url.length > 0) {
            var pattern = /^[\\{0,1}\/{0,1}]([^\/^\\]+)/,
                pattern_ = /([^\/^\\]+)/;
            if ((ret = pattern.exec(url)) != null) {
                if(ret[0].length == url.length) {
                    url = post.path + ret[1];
                }
            } else if ((ret = pattern_.exec(url)) != null) {
                if(ret[0].length == url.length) {
                    url = post.path + ret[1];
                }
            }
        }
    }
    return url;
});