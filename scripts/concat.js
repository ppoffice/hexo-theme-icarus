const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const UglifyJS = require('uglify-es');
const CleanCSS = require('clean-css');

const root = path.join(__dirname, '../themes/icarus/source/');

function replaceWithBundled(html) {
    const urlFor = hexo.extend.helper.get('url_for').bind(hexo);
    const $ = cheerio.load(html, { decodeEntities: false });
    $('script').each(function () {
        const url = $(this).attr('src');
        if (url && url.startsWith(urlFor('/js')) && url.endsWith('.js')) {
            $(this).remove();
        }
    });
    $('body').append(`<script src="${urlFor('/js/bundle.js')}" defer></script>`);
    $('link[rel="stylesheet"]').each(function () {
        const url = $(this).attr('href');
        if (url && url.startsWith(urlFor('/css')) && url.endsWith('.css') && !url.endsWith('style.css')) {
            $(this).remove();
        }
    });
    $('head').append(`<link rel="stylesheet" href="${urlFor('/css/bundle.css')}">`);
    return $.html();
}

hexo.extend.generator.register('bundle.js', function (locals) {
    const folder = path.join(root, 'js');
    const concated = fs.readdirSync(path.join(root, 'js'))
        .filter(filename => filename.endsWith('.js'))
        .map(filename => fs.readFileSync(path.join(folder, filename)))
        .join('\n');
    const result = UglifyJS.minify(concated);
    return {
        path: '/js/bundle.js',
        data: result.code
    };
});

hexo.extend.generator.register('bundle.css', function (locals) {
    const folder = path.join(root, 'css');
    const concated = fs.readdirSync(path.join(root, 'css'))
        .filter(filename => filename.endsWith('.css'))
        .map(filename => fs.readFileSync(path.join(folder, filename)))
        .join('\n');
    const result = new CleanCSS().minify(concated);
    return {
        path: '/css/bundle.css',
        data: result.styles
    };
});

hexo.extend.filter.register('after_render:html', function (content, data) {
    return replaceWithBundled(content);
});