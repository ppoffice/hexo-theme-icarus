'use strict';
const fs = require('hexo-fs');
function lazyProcess(htmlContent)  {
    let loadingImage = this.config.lazyload.loadingImg || 'https://blog.amane.icu/lazy.gif';
    return htmlContent.replace(/<img(.*?)src="(.*?)"(.*?)>/gi, (str, p1, p2)  =>  {
        if (/data-src/gi.test(str)) {
            return str;
        }
        if (/class="(.*?)"/gi.test(str)){
            str = str.replace(/class="(.*?)"/gi, (classStr, p1) => {
                return classStr.replace(p1, `${p1} lazy`);
            })
            return str.replace(`src="${p2}"`, `src="${p2}" class="lazy" data-srcset="${p2}" srcset="${loadingImage}"`);
        }
        return str.replace(`src="${p2}"`, `src="${p2}" class="lazy" data-srcset="${p2}" srcset="${loadingImage}"`);
    });
}

module.exports.processPost = function(data) {
    data.content = lazyProcess.call(this, data.content);
    return data;
};

module.exports.processSite = function (htmlContent) {
    return lazyProcess.call(this, htmlContent);
};
