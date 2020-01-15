(function ($) {
    $('.article img:not(".not-gallery-item")').each(function () {
        // wrap images with link and add caption if possible
        if ($(this).parent('a').length === 0) {
            $(this).wrap('<a class="gallery-item" href="' + $(this).attr('src') + '"></a>');
            if (this.alt) {
                $(this).after('<div class="has-text-centered is-size-6 has-text-grey caption">' + this.alt + '</div>');
            }
        }
    });

    if (typeof (moment) === 'function') {
        $('.article-meta time').each(function () {
            $(this).text(moment($(this).attr('datetime')).fromNow());
        });
    }

    $('.article > .content > table').each(function () {
        if ($(this).width() > $(this).parent().width()) {
            $(this).wrap('<div class="table-overflow"></div>');
        }
    });

    function adjustNavbar() {
        const navbarWidth = $('.navbar-main .navbar-start').outerWidth() + $('.navbar-main .navbar-end').outerWidth();
        if ($(document).outerWidth() < navbarWidth) {
            $('.navbar-main .navbar-menu').addClass('is-flex-start');
        } else {
            $('.navbar-main .navbar-menu').removeClass('is-flex-start');
        }
    }
    adjustNavbar();
    $(window).resize(adjustNavbar);

    $('figure.highlight table').wrap('<div class="highlight-body">');
    if (typeof (IcarusThemeSettings) !== 'undefined' &&
        typeof (IcarusThemeSettings.article) !== 'undefined' &&
        typeof (IcarusThemeSettings.article.highlight) !== 'undefined') {

        $('figure.highlight').addClass('hljs');
        $('figure.highlight .code .line span').each(function () {
            const classes = $(this).attr('class').split(/\s+/);
            if (classes.length === 1) {
                $(this).addClass('hljs-' + classes[0]);
                $(this).removeClass(classes[0]);
            }
        });


        var clipboard = IcarusThemeSettings.article.highlight.clipboard;
        var fold = IcarusThemeSettings.article.highlight.fold;
        fold = fold.trim();

        $('figure.highlight').each(function () {
            if ($(this).find('figcaption').length) {
                $(this).find('figcaption').addClass('level');
                $(this).find('figcaption').append('<div class="level-left">');
                $(this).find('figcaption').append('<div class="level-right">');
                $(this).find('figcaption div.level-left').append($(this).find('figcaption').find('span'));
                $(this).find('figcaption div.level-right').append($(this).find('figcaption').find('a'));
            } else {
                if (clipboard || fold) {
                    $(this).prepend('<figcaption class="level"><div class="level-left"></div><div class="level-right"></div></figcaption>');
                }
            }
        });

        if (typeof (ClipboardJS) !== 'undefined' && clipboard) {
            $('figure.highlight').each(function () {
                var id = 'code-' + Date.now() + (Math.random() * 1000 | 0);
                var button = '<a href="javascript:;" class="copy" title="Copy" data-clipboard-target="#' + id + ' .code"><i class="fas fa-copy"></i></a>';
                $(this).attr('id', id);
                $(this).find('figcaption div.level-right').append(button);
            });
            new ClipboardJS('.highlight .copy');
        }

        if (fold) {
            var button = '<span class="fold">' + (fold === 'unfolded' ? '<i class="fas fa-angle-down"></i>' : '<i class="fas fa-angle-right"></i>') + '</span>';
            $('figure.highlight').each(function () {
                // 此处find ">folded" span,如果有自定义code头,并且">folded"进行处理
                // 使用示例，.md 文件中头行标记">folded"
                // ```java main.java >folded
                // import main.java
                // private static void main(){
                //     // test
                //     int i = 0;
                //     return i;
                // }
                // ```
                if ($(this).find('figcaption').find('span').length > 0) {
                    let spanArr = $(this).find('figcaption').find('span');
                    if (spanArr[0].innerText.indexOf(">folded") > -1) {
                        // 去掉folded
                        spanArr[0].innerText = spanArr[0].innerText.replace(">folded", "")
                        button = '<span class="fold"><i class="fas fa-angle-right"></i></span>';
                        $(this).find('figcaption div.level-left').prepend(button);

                        // 收叠代码块
                        toggleFold(this, true);
                        return;
                    }
                }
                $(this).find('figcaption div.level-left').prepend(button);
                toggleFold(this, fold === 'folded');
            });

            function toggleFold(codeBlock, isFolded) {
                var $toggle = $(codeBlock).find('.fold i');
                !isFolded ? $(codeBlock).removeClass('folded') : $(codeBlock).addClass('folded');
                !isFolded ? $toggle.removeClass('fa-angle-right') : $toggle.removeClass('fa-angle-down');
                !isFolded ? $toggle.addClass('fa-angle-down') : $toggle.addClass('fa-angle-right');
            }

            // $('figure.highlight').each(function () {
            //     toggleFold(this, fold === 'folded');
            // });
            $('figure.highlight figcaption .fold').click(function () {
                var $code = $(this).closest('figure.highlight');
                toggleFold($code.eq(0), !$code.hasClass('folded'));
            });
        }
    }

    var $toc = $('#toc');
    if ($toc.length > 0) {
        var $mask = $('<div>');
        $mask.attr('id', 'toc-mask');

        $('body').append($mask);

        function toggleToc() {
            $toc.toggleClass('is-active');
            $mask.toggleClass('is-active');
        }

        $toc.on('click', toggleToc);
        $mask.on('click', toggleToc);
        $('.navbar-main .catalogue').on('click', toggleToc);
    }

    // hexo-util/lib/is_external_link.js
    function isExternalLink(input, sitehost, exclude) {
        try {
            sitehost = new URL(sitehost).hostname;
        } catch (e) { }

        if (!sitehost) return false;

        // handle relative url
        const data = new URL(input, 'http://' + sitehost);

        // handle mailto: javascript: vbscript: and so on
        if (data.origin === 'null') return false;

        const host = data.hostname;

        if (exclude) {
            exclude = Array.isArray(exclude) ? exclude : [exclude];

            if (exclude && exclude.length) {
                for (const i of exclude) {
                    if (host === i) return false;
                }
            }
        }

        if (host !== sitehost) return true;

        return false;
    }

    if (typeof (IcarusThemeSettings) !== 'undefined' &&
        typeof (IcarusThemeSettings.site.url) !== 'undefined' &&
        typeof (IcarusThemeSettings.site.external_link) !== 'undefined' &&
        IcarusThemeSettings.site.external_link.enable) {
        $('.article .content a').filter(function (i, link) {
            return link.href &&
                !$(link).attr('href').startsWith('#') &&
                link.classList.length === 0 &&
                isExternalLink(link.href,
                    IcarusThemeSettings.site.url,
                    IcarusThemeSettings.site.external_link.exclude);
        }).each(function (i, link) {
            link.relList.add('noopener');
            link.target = '_blank';
        });
    }
})(jQuery);
