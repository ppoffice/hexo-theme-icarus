const cheerio = require('cheerio');
const UglifyJS = require('uglify-es');

hexo.extend.filter.register('after_render:html', function (content, data) {
    const $ = cheerio.load(content, { decodeEntities: false });

    $('script').each(function () {
        const url = $(this).attr('src');
        if (!url) {
            $(this).html(UglifyJS.minify($(this).html()).code);
        }
    });

    return $.html();
});