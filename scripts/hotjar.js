const cheerio = require('cheerio');

function fixStyle(content) {
    const $ = cheerio.load(content, { decodeEntities: false });
    $('body').append(`<style>#_hj_feedback_container *:after {box-shadow: none !important;}</style>`);
    return $.html();
}

hexo.extend.filter.register('after_render:html', function (content, data) {
    return fixStyle(content);
});