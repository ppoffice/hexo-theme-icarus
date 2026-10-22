(function() {
    // eslint-disable-next-line no-unused-vars
    let pjax;

    /**
     * Replace the stylesheets of <head> matching the selector with those of the new page, only when
     * they differ, so that the stylesheets that stay are not loaded and applied again.
     */
    function switchStylesheets(oldHead, newHead, selector) {
        const key = links => Array.from(links).map(link => link.getAttribute('href') + ' ' + link.getAttribute('media')).join();
        const oldLinks = oldHead.querySelectorAll(selector);
        const newLinks = newHead.querySelectorAll(selector);
        if (key(oldLinks) !== key(newLinks)) {
            const anchor = oldLinks.length ? oldLinks[0] : null;
            newLinks.forEach(link => oldHead.insertBefore(link.cloneNode(), anchor));
            oldLinks.forEach(link => link.remove());
        }
    }

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

        switchStylesheets(oldHead, newHead, 'link[data-pjax]');
    }

    /**
     * Render the formulas of the page with KaTeX, if it is loaded. KaTeX renders on the load event
     * of the window, which pages switched to by PJAX do not have. MathJax typesets the page by
     * itself once it is loaded.
     */
    function renderKatex() {
        if (typeof window.renderMathInElement === 'function') {
            document.querySelectorAll('[role="article"] > .content').forEach(element => window.renderMathInElement(element));
        }
    }

    /**
     * Load the plugins of the new page that the current page does not have, such as a math plugin
     * enabled in the front-matter of a post. Their scripts and stylesheets are children of <body>,
     * which PJAX does not switch. Only the runs of missing elements that load a script or a
     * stylesheet are added, so that the inline scripts of plugins that both pages have, but
     * configure differently, do not run again.
     */
    function loadPlugins(oldBody, newBody) {
        const isPluginElement = el => (el.tagName === 'SCRIPT' && !el.hasAttribute('data-pjax'))
            || (el.tagName === 'LINK' && el.getAttribute('rel') === 'stylesheet');
        const key = el => el.getAttribute('src') || el.getAttribute('href') || el.textContent;
        const present = new Set(Array.from(oldBody.children).filter(isPluginElement).map(key));

        const runs = [[]];
        Array.from(newBody.children).forEach(el => {
            if (isPluginElement(el) && !present.has(key(el))) {
                runs[runs.length - 1].push(el);
            } else if (runs[runs.length - 1].length) {
                runs.push([]);
            }
        });

        const loads = [];
        runs.filter(run => run.some(el => el.hasAttribute('src') || el.tagName === 'LINK')).flat().forEach(el => {
            // Scripts only run when they are created in this document
            const copy = document.createElement(el.tagName.toLowerCase());
            Array.from(el.attributes).forEach(attribute => copy.setAttribute(attribute.name, attribute.value));
            copy.textContent = el.textContent;
            if (copy.tagName === 'SCRIPT' && copy.src) {
                // Run the scripts in order, as the page would
                copy.async = false;
                loads.push(new Promise(resolve => {
                    copy.addEventListener('load', resolve);
                    copy.addEventListener('error', resolve);
                }));
            }
            oldBody.appendChild(copy);
        });
        if (loads.length) {
            Promise.all(loads).then(renderKatex);
        }
    }

    /**
     * Switch the title, the appearance and the variant (default or cyberpunk, which pages can also
     * set in their front-matter, with its theme and font stylesheets) of the page, and load the
     * plugins it adds. <head> itself is not one of the selectors because PJAX runs the scripts of
     * the switched elements again: the analytics and other scripts of <head> would run again,
     * counting page views twice and adding their listeners again.
     */
    function switchHead(oldTitle, newTitle, options) {
        oldTitle.textContent = newTitle.textContent;
        switchAppearance(oldTitle.ownerDocument.head, newTitle.ownerDocument.head, options);
        switchStylesheets(oldTitle.ownerDocument.head, newTitle.ownerDocument.head, 'link[data-variant]');
        loadPlugins(oldTitle.ownerDocument.body, newTitle.ownerDocument.body);
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
        // Plugin [KaTeX]
        renderKatex();
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
