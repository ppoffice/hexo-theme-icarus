function lazyProcess(htmlContent) {
    let loadingImage = this.config.lazyload.loadingImg || 'https://img-blog.csdnimg.cn/2022010612032074818.gif';
    return htmlContent.replace(/<img(\s+[^>]*?)?\s*alt="(.*?)"(.*?)\s*src="(.*?)"(.*?)>/gi, (str, p1, p2, p3, p4, p5) => {
        if (/data-src/gi.test(str)) {
            return str;
        }
        if (/class="(.*?)"/gi.test(str)) {
            str = str.replace(/class="(.*?)"/gi, (classStr, p1) => {
                return classStr.replace(p1, `${p1} lazyload`);
            })
            return str.replace(p5, `${p5} srcset="${loadingImage}" data-srcset="${p4}"`);
        }
        return str.replace(p5, `${p5} class="lazy" srcset="${loadingImage}" data-srcset="${p4}"`);
    }).replace(/<img(\s+[^>]*?)?\s*src="(.*?)"(.*?)>/gi, (str, p1, p2, p3) => {
        if (/\s*alt="(.*?)"/gi.test(str)) {
            return str;
        }
        if (/data-src/gi.test(str)) {
            return str.replace(/<img/gi, '<img alt=""');
        }
        return str.replace(p3, `${p3} alt=""`);
    });
}
