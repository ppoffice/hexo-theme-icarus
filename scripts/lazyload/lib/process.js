'use strict';
const fs = require('hexo-fs');
function lazyProcess(htmlContent) {
    let loadingImage = this.config.lazyload.loadingImg || 'https://img-blog.csdnimg.cn/2022010612032074818.gif';
    return htmlContent.replace(/<img(\s*?)src="(.*?)"(.*?)alt="(.*?)"(.*?)>/gi, (str, p1, p2, p3, p4, p5) => {
        if (/data-src/gi.test(str)) {
            return str;
        }
        if (/class="(.*?)"/gi.test(str)) {
            str = str.replace(/class="(.*?)"/gi, (classStr, p1) => {
                return classStr.replace(p1, `${p1} lazyload`);
            })
            return str.replace(p5, `${p5} srcset="${loadingImage}" data-srcset="${p2}"`);
        }
        return str.replace(p5, `${p5} class="lazy" srcset="${loadingImage}" data-srcset="${p2}"`);
    }).replace(/<img(\s*?)src="(.*?)"(.*?)>/gi, (str, p1, p2, p3) => {
        if (/alt="(.*?)"/gi.test(str)) {
            return str;
        }
        if (/data-src/gi.test(str)) {
            return str.replace(/(<img)(.*?)(>)/gi, '$1 alt="" $2 $3');
        }
        return str.replace(p3, `${p3} alt=""`);
    });
}

module.exports.processPost = function(data) {
    data.content = lazyProcess.call(this, data.content);
    return data;
};

module.exports.processSite = function (htmlContent) {
    return lazyProcess.call(this, htmlContent);
};
