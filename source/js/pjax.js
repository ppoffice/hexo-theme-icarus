(function() {
    // eslint-disable-next-line no-unused-vars
    let pjax;

    /**
     * Switch to the appearance of the new page (light, auto or dark, which pages can set in their
     * front-matter): the data-appearance attribute of <html> that selects the dark colors, which
     * PJAX does not copy, the color-scheme meta and the code highlight stylesheets, of which
     * there are one or two (light and dark).
     */
    function switchAppearance(oldHead, newHead, options) {
        const html = options.request && typeof options.request.responseText === 'string' ? options.request.responseText : '';
        const htmlTag = (html.match(/<html\b[^>]*>/i) || [''])[0];
        const appearance = (htmlTag.match(/\sdata-appearance="([^"]*)"/) || [])[1];
        if (appearance) {
            document.documentElement.setAttribute('data-appearance', appearance);
        } else {
            document.documentElement.removeAttribute('data-appearance');
        }

        const oldMeta = oldHead.querySelector('meta[name="color-scheme"]');
        const newMeta = newHead.querySelector('meta[name="color-scheme"]');
        if (oldMeta && newMeta) {
            oldMeta.setAttribute('content', newMeta.getAttribute('content'));
        } else if (oldMeta) {
            oldMeta.remove();
        } else if (newMeta) {
            const viewport = oldHead.querySelector('meta[name="viewport"]');
            oldHead.insertBefore(newMeta.cloneNode(), viewport ? viewport.nextSibling : oldHead.firstChild);
        }

        const key = links => Array.from(links).map(link => link.getAttribute('href') + ' ' + link.getAttribute('media')).join();
        const oldLinks = oldHead.querySelectorAll('link[data-pjax]');
        const newLinks = newHead.querySelectorAll('link[data-pjax]');
        if (key(oldLinks) !== key(newLinks)) {
            const anchor = oldLinks.length ? oldLinks[0] : null;
            newLinks.forEach(link => oldHead.insertBefore(link.cloneNode(), anchor));
            oldLinks.forEach(link => link.remove());
        }
    }

    /**
     * Switch the title and the appearance of the page. <head> itself is not one of the selectors
     * because PJAX runs the scripts of the switched elements again: the analytics and other scripts
     * of <head> would run again, counting page views twice and adding their listeners again.
     */
    function switchHead(oldTitle, newTitle, options) {
        oldTitle.textContent = newTitle.textContent;
        switchAppearance(oldTitle.ownerDocument.head, newTitle.ownerDocument.head, options);
        this.onSwitch();
    }

    /** Switch the content of the logo links, which stay and keep being followed with PJAX. */
    function switchContent(oldEl, newEl) {
        oldEl.innerHTML = newEl.innerHTML;
        this.onSwitch();
    }

    function initPjax() {
        try {
            const Pjax = window.Pjax || function() {};
            pjax = new Pjax({
                selectors: [
                    // The stylesheets of <head> are switched with the appearance: their number varies.
                    '[data-pjax]:not(link)',
                    '.navbar-logo',
                    '.footer-logo',
                    '.pjax-reload',
                    'head title',
                    '.columns',
                    '.navbar-start',
                    '.navbar-end',
                    '.searchbox link',
                    '.searchbox script',
                    // The comments are switched, and their scripts run again, with .columns. Selecting
                    // their elements too would make PJAX fail and reload the page when the numbers
                    // differ: pages without comments, or comment scripts removed by PJAX once run.
                    '#back-to-top'
                ],
                switches: {
                    'head title': switchHead,
                    '.navbar-logo': switchContent,
                    '.footer-logo': switchContent
                },
                cacheBust: false
            });
        } catch (e) {
            console.warn('PJAX error: ' + e);
        }
    }

    // // Listen for start of Pjax
    // document.addEventListener('pjax:send', function() {
    //     return;
    //     // TODO pace start loading animation
    // })

    // Listen for completion of Pjax
    document.addEventListener('pjax:complete', () => {
        // Plugin [MathJax] reload logic
        if (window.MathJax) {
            try {
                window.MathJax.typesetPromise && window.MathJax.typesetPromise();
            } catch (e) {
                console.error('MathJax reload error:', e);
            }
        }
        // Plugin [Busuanzi] reload logic
        if (window.bszCaller && window.bszTag) {
            window.bszCaller.fetch('//busuanzi.ibruce.info/busuanzi?jsonpCallback=BusuanziCallback', a => {
                window.bszTag.texts(a);
                window.bszTag.shows();
            });
        }

        // TODO pace stop loading animation
    });

    document.addEventListener('DOMContentLoaded', () => initPjax());
}());
