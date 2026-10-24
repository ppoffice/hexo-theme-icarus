(function($, ClipboardJS, config) {
    if (window.HexoGithubCalendar) {
        window.HexoGithubCalendar.init();
    }
    const galleryEnabled = !!(config && config.gallery);
    window.HexoGallery.init(document, { lightGallery: galleryEnabled, justifiedGallery: galleryEnabled });

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

    // The notice of an outdated post: shown from the number of days since its last update in the
    // browser of the reader, as the static page may be much older than its build says. The date
    // becomes "N days ago" in the template of the notice ("%s").
    $('.article-outdated').each(function() {
        const $time = $(this).find('time');
        const date = new Date($time.attr('datetime'));
        const days = Number($(this).attr('data-outdated-days'));
        if (isNaN(date.getTime()) || !(days > 0)) {
            return;
        }
        const age = Math.floor((Date.now() - date.getTime()) / 86400000);
        this.hidden = age < days;
        const $text = $(this).find('.article-outdated-text');
        const template = $text.attr('data-template');
        if (!this.hidden && template && template.indexOf('%s') > -1
            && typeof Intl !== 'undefined' && typeof Intl.RelativeTimeFormat === 'function') {
            const parts = template.split('%s');
            const format = new Intl.RelativeTimeFormat(getRelativeTimeLocale(), { numeric: 'always' });
            $text.empty().append(document.createTextNode(parts[0]), $time.text(format.format(-age, 'day')),
                document.createTextNode(parts.slice(1).join('%s')));
        }
    });

    $('.article > .content > table').each(function() {
        if ($(this).width() > $(this).parent().width()) {
            $(this).wrap('<div class="table-overflow"></div>');
        }
    });

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
            // With a preview, a folded block keeps its first lines, fading out, instead of hiding all of them.
            const preview = Math.max(0, parseInt(config.article.highlight.fold_preview, 10) || 0);

            $('figure.highlight').each(function() {
                let folded = fold === 'folded';
                if ($(this).find('figcaption').find('span').length > 0) {
                    const span = $(this).find('figcaption').find('span');
                    if (span[0].innerText.indexOf('>folded') > -1) {
                        span[0].innerText = span[0].innerText.replace('>folded', '');
                        folded = true;
                    }
                }

                if (preview) {
                    // A block that fits in its preview has nothing to fold.
                    if ($(this).find('.code .line').length <= preview) {
                        return;
                    }
                    $(this).addClass('fold-preview').css('--fold-preview-lines', preview);
                }

                $(this).addClass('foldable');
                $(this).find('figcaption div.level-left').prepend(createFoldButton(folded ? 'folded' : 'unfolded'));
                toggleFold(this, folded);
            });

            $('figure.highlight.foldable figcaption .level-left').click(function() {
                const $code = $(this).closest('figure.highlight');
                toggleFold($code.eq(0), !$code.hasClass('folded'));
            });

            // Clicking the faded preview unfolds the block.
            $('figure.highlight.fold-preview .highlight-body').click(function() {
                const $code = $(this).closest('figure.highlight');
                if ($code.hasClass('folded')) {
                    toggleFold($code.eq(0), false);
                }
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

        function toggleToc() {
            $toc.toggleClass('is-active');
            $mask.toggleClass('is-active');
        }

        $toc.on('click', toggleToc);
        $mask.off('click.icarus-toc').on('click.icarus-toc', toggleToc);
        $('.navbar-main .catalogue').on('click', toggleToc);
    } else {
        $('#toc-mask').remove();
    }

    // The scrollable box, between a toc entry and the toc itself, that clips the entry: the mobile
    // overlay, or a widget given a max-height. Without one there is nothing to scroll.
    function getTocScroller(entry, toc) {
        for (let el = entry.parentElement; el; el = el.parentElement) {
            if (/^(auto|scroll|overlay)$/.test(getComputedStyle(el).overflowY) && el.scrollHeight > el.clientHeight) {
                return el;
            }
            if (el === toc) {
                return null;
            }
        }
        return null;
    }

    // Bring the active (deepest highlighted) toc entry to the middle of its scroll box. Only that box
    // scrolls: scrollIntoView() would also scroll the page under the reader.
    function scrollTocToActive(toc, instant) {
        const entry = $(toc).find('.menu-list a.is-active').last()[0];
        const scroller = entry && getTocScroller(entry, toc);
        if (!scroller) {
            return;
        }
        const offset = entry.getBoundingClientRect().top - scroller.getBoundingClientRect().top - scroller.clientTop;
        const max = scroller.scrollHeight - scroller.clientHeight;
        const top = Math.round(Math.min(max, Math.max(0, scroller.scrollTop + offset - ((scroller.clientHeight - entry.offsetHeight) / 2))));
        // Do not restart a smooth scroll that is already heading there.
        if (!instant && $(scroller).data('icarus-toc-top') === top) {
            return;
        }
        $(scroller).data('icarus-toc-top', top);
        const smooth = !instant && !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
        if (typeof scroller.scrollTo === 'function') {
            scroller.scrollTo({ top, behavior: smooth ? 'smooth' : 'auto' });
        } else {
            scroller.scrollTop = top;
        }
    }

    // toc.js highlights the entry being read with "is-active": follow it. Every #toc counts, including
    // the copy column.js makes of the right column. main.js runs again after every PJAX navigation:
    // replace the observer of the previous page instead of adding another one.
    if (window.IcarusTocObserver) {
        window.IcarusTocObserver.disconnect();
        window.IcarusTocObserver = null;
    }
    const tocs = document.querySelectorAll('#toc');
    if (tocs.length && typeof MutationObserver === 'function') {
        const pending = new Map();
        let frame = null;
        const schedule = (toc, instant) => {
            pending.set(toc, pending.get(toc) || instant);
            if (frame === null) {
                frame = requestAnimationFrame(() => {
                    frame = null;
                    pending.forEach((instant, toc) => scrollTocToActive(toc, instant));
                    pending.clear();
                });
            }
        };
        window.IcarusTocObserver = new MutationObserver(records => {
            for (const record of records) {
                const toc = record.target.closest('#toc');
                // A class change on the toc itself opens the mobile overlay: jump, do not animate.
                schedule(toc, record.target === toc);
            }
        });
        tocs.forEach(toc => {
            window.IcarusTocObserver.observe(toc, { subtree: true, attributes: true, attributeFilter: ['class'] });
            schedule(toc, true);
        });
    }

    // Captions and folded code blocks can add/remove a scrollbar, even without ResizeObserver.
    // Refit only: keep this page's handlers, menu state and pending focus correction.
    window.IcarusNavbar.refresh();
}(jQuery, window.ClipboardJS, window.IcarusThemeSettings));
