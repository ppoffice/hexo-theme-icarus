'use strict';
const fs = require('hexo-fs');
function lazyProcess(htmlContent) {
    const loadingImage = this.config.lazyload.loadingImg || 'https://img-blog.csdnimg.cn/2022010612032074818.gif';
    return htmlContent.replace(/<img(\s+)(?!.*alt=)"([^"]*)"([^>]*)>/gi, (match, p1, p2, p3) => {
        const classAttr = (/class="(.*?)"/gi).exec(match);
        if (classAttr) {
            const classStr = classAttr[1];
            const lazyClass = classStr.includes('lazy) ? classStr : `${classStr} lazy`;
            return match.replace(classAttr[0], `class="${lazyClass}"`)
                        .replace(p3, `${p3} srcset="${loadingImage}" data-srcset="${p2}"`);
        } else {
            return match.replace(p3, `${p3} class="lazy" srcset="${loadingImage}" data-srcset="${p2}"`);
        }
    });
}

module.exports.processPost = function(data) {
    data.content = lazyProcess.call(this, data.content);
    return data;
};

module.exports.processSite = function (htmlContent) {
    return lazyProcess.call(this, htmlContent);
};
