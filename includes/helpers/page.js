/**
* Helper functions for page/post.
*
* @example
*     <%- is_categories(page) %>
*     <%- is_tags(page) %>
*     <%- page_title(page) %>
*     <%- meta(post) %>
*     <%- has_random_recent_thumbnail(post) %>
*     <%- get_random_recent_thumbnail(post) %>
*     <%- has_thumbnail(post) %>
*     <%- get_thumbnail(post) %>
*     <%- get_og_image(post) %>
*/
module.exports = function (hexo) {
    function trim(str) {
        return str.trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
    }

    function split(str, sep) {
        var result = [];
        var matched = null;
        while (matched = sep.exec(str)) {
            result.push(matched[0]);
        }
        return result;
    }

    hexo.extend.helper.register('is_categories', function (page = null) {
        return (page === null ? this.page : page).__categories;
    });

    hexo.extend.helper.register('is_tags', function (page = null) {
        return (page === null ? this.page : page).__tags;
    });

    /**
     * Generate html head title based on page type
     */
    hexo.extend.helper.register('page_title', function (page = null) {
        page = page === null ? this.page : page;
        let title = page.title;

        if (this.is_archive()) {
            title = this._p('common.archive', Infinity);
            if (this.is_month()) {
                title += ': ' + page.year + '/' + page.month;
            } else if (this.is_year()) {
                title += ': ' + page.year;
            }
        } else if (this.is_category()) {
            title = this._p('common.category', 1) + ': ' + page.category;
        } else if (this.is_tag()) {
            title = this._p('common.tag', 1) + ': ' + page.tag;
        } else if (this.is_categories()) {
            title = this._p('common.category', Infinity);
        } else if (this.is_tags()) {
            title = this._p('common.tag', Infinity);
        }

        const siteTitle = hexo.extend.helper.get('get_config').bind(this)('title', '', true);
        return [title, siteTitle].filter(str => typeof (str) !== 'undefined' && str.trim() !== '').join(' - ');
    });

    hexo.extend.helper.register('meta', function (post) {
        var metas = post.meta || [];
        var output = '';
        var metaDOMArray = metas.map(function (meta) {
            var entities = split(meta, /(?:[^\\;]+|\\.)+/g);
            var entityArray = entities.map(function (entity) {
                var keyValue = split(entity, /(?:[^\\=]+|\\.)+/g);
                if (keyValue.length < 2) {
                    return null;
                }
                var key = trim(keyValue[0]);
                var value = trim(keyValue[1]);
                return key + '="' + value + '"';
            }).filter(function (entity) {
                return entity;
            });
            return '<meta ' + entityArray.join(' ') + ' />';
        });
        return metaDOMArray.join('\n');
    });

    hexo.extend.helper.register('has_random_recent_thumbnail', function (post) {
        const getConfig = hexo.extend.helper.get('get_config').bind(this);
        return getConfig('article.random_recent_thubnail', true);
    });

    hexo.extend.helper.register('get_random_recent_thumbnail', function (post) {
        const autothubnail = hexo.extend.helper.get('has_random_recent_thumbnail').bind(this)(post);
        var url = "images/thumbnail.svg";
        if(autothubnail){
           var imgurls = [
                "http://qiniucdn.dp2px.com/blog-photos190608_0596.jpg!photo_thumb",
                "http://qiniucdn.dp2px.com/blog-photos190608_0622.jpg!photo_thumb",
                "http://qiniucdn.dp2px.com/blog-photos190608_0642.jpg!photo_thumb",
                "http://qiniucdn.dp2px.com/blog-photos190721_1254.jpg!photo_thumb",
                "http://qiniucdn.dp2px.com/blog-photos190721_1266.jpg!photo_thumb",
                "http://qiniucdn.dp2px.com/blog-photos2debfe6cdf3f49e2af807a492d97ce2e.jpg!photo_thumb",
                "http://qiniucdn.dp2px.com/blog-photos20181120113926.jpg!photo_thumb",
                "http://qiniucdn.dp2px.com/blog-photos20181120113937.jpg!photo_thumb",
                "http://qiniucdn.dp2px.com/blog-photosDSC01548.jpg!photo_thumb",
                "http://qiniucdn.dp2px.com/blog-photos108659916.jpg!photo_thumb",
                "http://qiniucdn.dp2px.com/blog-photosDSC01639.jpg!photo_thumb",
                "http://qiniucdn.dp2px.com/blog-photos_DSC1969222.jpg!photo_thumb",
                "http://qiniucdn.dp2px.com/blog-photosDSC01753.jpg!photo_thumb",
                "http://qiniucdn.dp2px.com/blog-photos_DSC18900.jpg!photo_thumb",
                "http://qiniucdn.dp2px.com/blog-photos_DSC19322.jpg!photo_thumb",
                "http://qiniucdn.dp2px.com/blog-photos_DSC2110.jpg!photo_thumb",
                "http://qiniucdn.dp2px.com/blog-photos_DSC2123.jpg!photo_thumb",
                "http://qiniucdn.dp2px.com/blog-photos_DSC2124.jpg!photo_thumb",
                "http://qiniucdn.dp2px.com/blog-photosDSC01664.jpg!photo_thumb",
                "http://qiniucdn.dp2px.com/blog-photos_DSC2177.jpg!photo_thumb",
                "http://qiniucdn.dp2px.com/blog-photos_DSC2203.jpg!photo_thumb",
                "http://qiniucdn.dp2px.com/blog-photos_DSC2218.jpg!photo_thumb",
                "http://qiniucdn.dp2px.com/blog-photos_DSC2258.jpg!photo_thumb",
                "http://qiniucdn.dp2px.com/blog-photos_DSC2362.jpg!photo_thumb",
                "http://qiniucdn.dp2px.com/blog-photos_DSC2391.jpg!photo_thumb"
            ]
            url = imgurls[Math.floor(Math.random()*imgurls.length)];
        }
        return this.url_for(url);
    });

    hexo.extend.helper.register('has_thumbnail', function (post) {
        const getConfig = hexo.extend.helper.get('get_config').bind(this);
        const allowThumbnail = getConfig('article.thumbnail', true);
        if (!allowThumbnail) {
            return false;
        }
        return post.hasOwnProperty('thumbnail') && post.thumbnail;
    });

    hexo.extend.helper.register('get_thumbnail', function (post) {
        const hasThumbnail = hexo.extend.helper.get('has_thumbnail').bind(this)(post);
        return this.url_for(hasThumbnail ? post.thumbnail : 'images/thumbnail.svg');
    });

    hexo.extend.helper.register('has_og_image', function (post) {
        return post.hasOwnProperty('og_image');
    });

    hexo.extend.helper.register('get_og_image', function (post) {
        const getConfig = hexo.extend.helper.get('get_config').bind(this);
        const hasConfig = hexo.extend.helper.get('has_config').bind(this);

        const hasOGImage = hexo.extend.helper.get('has_og_image').bind(this)(post);
        const hasThumbnail = hexo.extend.helper.get('has_thumbnail').bind(this)(post);

        const getThumbnail = hexo.extend.helper.get('get_thumbnail').bind(this);

        let og_image

        if(hasOGImage)
            og_image = post.og_image
        else if (hasThumbnail)
            og_image = getThumbnail(post);
        else
            og_image = getConfig('article.og_image', '/images/og_image.png');

        return this.url_for(og_image);
    });
}
