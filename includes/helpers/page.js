/**
* Helper functions for page/post.
*
* @example
*     <%- is_categories(page) %>
*     <%- is_tags(page) %>
*     <%- page_title(page) %>
*     <%- has_thumbnail(post) %>
*     <%- get_thumbnail(post) %>
*     <%- get_og_image(post) %>
*/
module.exports = function (hexo) {
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

        if (hasOGImage)
            og_image = post.og_image
        else if (hasThumbnail)
            og_image = getThumbnail(post);
        else
            og_image = getConfig('article.og_image', '/images/og_image.png');

        return this.url_for(og_image);
    });
}
