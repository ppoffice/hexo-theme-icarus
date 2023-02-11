'use strict';
const fs = require('hexo-fs');

function lazyProcess(htmlContent) {
    let loadingImage = this.config.lazyload.loadingImg || 'https://img-blog.csdnimg.cn/2022010612032038329.gif';

    return htmlContent.replace(/<img(\s*?)src="(.*?)"(.*?)>/gi, (str, p1, p2, p3) => {
        if (/data-src/gi.test(str)) {
            return str;
        }

        return `<img${p1} srcset="${loadingImage}" data-srcset="${p2}" class="lazyload"${p3}>`;
    });
}

module.exports.processPost = function(data) {
    data.content = lazyProcess.call(this, data.content);
    return data;
};

module.exports.processSite = function(htmlContent) {
    return lazyProcess.call(this, htmlContent);
};
