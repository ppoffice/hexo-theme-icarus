/* eslint-disable node/no-unsupported-features/node-builtins */
(function($, ClipboardJS, config) {
    $('.article img:not(".not-gallery-item")').each(function() {
        // wrap images with link and add caption if possible
        if ($(this).parent('a').length === 0) {
            $(this).wrap($('<a class="gallery-item"></a>').attr('href', $(this).attr('src')));
            if (this.alt) {
                $(this).after($('<p class="has-text-centered is-size-6 caption"></p>').text(this.alt));
            }
        }
    });

    if (typeof $.fn.lightGallery === 'function') {
        $('.article').lightGallery({ selector: '.gallery-item' });
    }
    if (typeof $.fn.justifiedGallery === 'function') {
        if ($('.justified-gallery > p > .gallery-item').length) {
            $('.justified-gallery > p > .gallery-item').unwrap();
        }
        $('.justified-gallery').justifiedGallery();
    }

    // Locale for relative dates: the page language when the browser supports it, else English.
    function getRelativeTimeLocale() {
        const lang = document.documentElement.lang === 'vn' ? 'vi' : document.documentElement.lang;
        try {
            return lang && Intl.RelativeTimeFormat.supportedLocalesOf(lang).length ? lang : 'en';
        } catch (e) {
            return 'en';
        }
    }

    // "3 days ago", using the same rounding thresholds as moment's fromNow().
    function formatRelativeTime(date, format) {
        const seconds = (date.getTime() - Date.now()) / 1000;
        const abs = Math.abs(seconds);
        if (abs < 45) {
            return format.format(Math.round(seconds), 'second');
        } else if (abs < 45 * 60) {
            return format.format(Math.round(seconds / 60), 'minute');
        } else if (abs < 22 * 3600) {
            return format.format(Math.round(seconds / 3600), 'hour');
        } else if (abs < 26 * 86400) {
            return format.format(Math.round(seconds / 86400), 'day');
        } else if (abs < 320 * 86400) {
            return format.format(Math.round(seconds / (30.436875 * 86400)), 'month');
        }
        return format.format(Math.round(seconds / (365.2425 * 86400)), 'year');
    }

    if (typeof Intl !== 'undefined' && typeof Intl.RelativeTimeFormat === 'function') {
        const format = new Intl.RelativeTimeFormat(getRelativeTimeLocale(), { numeric: 'auto' });
        $('.article-meta time').each(function() {
            const date = new Date($(this).attr('datetime'));
            if (!isNaN(date.getTime())) {
                $(this).text(formatRelativeTime(date, format));
            }
        });
    }

    $('.article > .content > table').each(function() {
        if ($(this).width() > $(this).parent().width()) {
            $(this).wrap('<div class="table-overflow"></div>');
        }
    });

    function adjustNavbar() {
        const navbarWidth = $('.navbar-main .navbar-start').outerWidth() + $('.navbar-main .navbar-end').outerWidth();
        if ($(document).outerWidth() < navbarWidth) {
            $('.navbar-main .navbar-menu').addClass('justify-content-start');
        } else {
            $('.navbar-main .navbar-menu').removeClass('justify-content-start');
        }
    }
    adjustNavbar();
    // main.js runs again after every PJAX navigation: replace, do not add, window handlers.
    $(window).off('resize.icarus-navbar').on('resize.icarus-navbar', adjustNavbar);

    function toggleFold(codeBlock, isFolded) {
        const $toggle = $(codeBlock).find('.fold i');
        !isFolded ? $(codeBlock).removeClass('folded') : $(codeBlock).addClass('folded');
        !isFolded ? $toggle.removeClass('fa-angle-right') : $toggle.removeClass('fa-angle-down');
        !isFolded ? $toggle.addClass('fa-angle-down') : $toggle.addClass('fa-angle-right');
    }

    function createFoldButton(fold) {
        return '<span class="fold">' + (fold === 'unfolded' ? '<i class="fas fa-angle-down"></i>' : '<i class="fas fa-angle-right"></i>') + '</span>';
    }

    $('figure.highlight table').wrap('<div class="highlight-body">');
    if (typeof config !== 'undefined'
        && typeof config.article !== 'undefined'
        && typeof config.article.highlight !== 'undefined') {

        $('figure.highlight').addClass('hljs');
        $('figure.highlight .code .line span').each(function() {
            const classes = ($(this).attr('class') || '').split(/\s+/).filter(Boolean);
            for (const cls of classes) {
                $(this).addClass('hljs-' + cls);
                $(this).removeClass(cls);
            }
        });


        const clipboard = config.article.highlight.clipboard;
        const fold = config.article.highlight.fold.trim();

        $('figure.highlight').each(function() {
            if ($(this).find('figcaption').length) {
                $(this).find('figcaption').addClass('level is-mobile');
                $(this).find('figcaption').append('<div class="level-left">');
                $(this).find('figcaption').append('<div class="level-right">');
                $(this).find('figcaption div.level-left').append($(this).find('figcaption').find('span'));
                $(this).find('figcaption div.level-right').append($(this).find('figcaption').find('a'));
            } else {
                if (clipboard || fold) {
                    $(this).prepend('<figcaption class="level is-mobile"><div class="level-left"></div><div class="level-right"></div></figcaption>');
                }
            }
        });

        if (typeof ClipboardJS !== 'undefined' && clipboard) {
            const i18n = config.i18n || {};
            const copyTitle = i18n.copy || 'Copy';
            const copiedTitle = i18n.copied || 'Copied!';

            $('figure.highlight').each(function() {
                const $button = $('<button type="button" class="copy"></button>')
                    .attr({ title: copyTitle, 'aria-label': copyTitle })
                    .append('<i class="fas fa-copy" aria-hidden="true"></i>');
                $(this).find('figcaption div.level-right').append($button);
            });
            // ClipboardJS listens on the document, so one instance serves every (PJAX) page.
            if (!window.IcarusClipboard) {
                window.IcarusClipboard = new ClipboardJS('.highlight .copy', {
                    target: trigger => $(trigger).closest('figure.highlight').find('.code')[0]
                });
                window.IcarusClipboard.on('success', event => {
                    event.clearSelection();
                    const $button = $(event.trigger);
                    clearTimeout($button.data('icarus-copied'));
                    $button.addClass('is-copied').attr({ title: copiedTitle, 'aria-label': copiedTitle })
                        .find('i').removeClass('fa-copy').addClass('fa-check');
                    $button.data('icarus-copied', setTimeout(() => {
                        $button.removeClass('is-copied').attr({ title: copyTitle, 'aria-label': copyTitle })
                            .find('i').removeClass('fa-check').addClass('fa-copy');
                    }, 2000));
                });
            }
        }

        if (fold) {
            $('figure.highlight').each(function() {
                $(this).addClass('foldable'); // add 'foldable' class as long as fold is enabled

                if ($(this).find('figcaption').find('span').length > 0) {
                    const span = $(this).find('figcaption').find('span');
                    if (span[0].innerText.indexOf('>folded') > -1) {
                        span[0].innerText = span[0].innerText.replace('>folded', '');
                        $(this).find('figcaption div.level-left').prepend(createFoldButton('folded'));
                        toggleFold(this, true);
                        return;
                    }
                }
                $(this).find('figcaption div.level-left').prepend(createFoldButton(fold));
                toggleFold(this, fold === 'folded');
            });

            $('figure.highlight figcaption .level-left').click(function() {
                const $code = $(this).closest('figure.highlight');
                toggleFold($code.eq(0), !$code.hasClass('folded'));
            });
        }
    }

    const $toc = $('#toc');
    if ($toc.length > 0) {
        // Reuse the mask left by a previous PJAX page instead of adding another one.
        let $mask = $('#toc-mask');
        if (!$mask.length) {
            $mask = $('<div>').attr('id', 'toc-mask');
            $('body').append($mask);
        }
        $mask.removeClass('is-active');

        function toggleToc() { // eslint-disable-line no-inner-declarations
            $toc.toggleClass('is-active');
            $mask.toggleClass('is-active');
        }

        $toc.on('click', toggleToc);
        $mask.off('click.icarus-toc').on('click.icarus-toc', toggleToc);
        $('.navbar-main .catalogue').on('click', toggleToc);
    } else {
        $('#toc-mask').remove();
    }
}(jQuery, window.ClipboardJS, window.IcarusThemeSettings));
