(function() {

    /**
     * The URL of the page loaded without PJAX. The relative URLs of the elements of the current
     * page are relative to it: those of the elements switched in by PJAX are made absolute.
     */
    const loadedUrl = document.baseURI;
    let mathjaxEnabled = true;

    /** Whether a URL is relative to the path of the page, unlike root-relative and absolute ones. */
    function isPathRelative(url) {
        return !/^([a-z][a-z\d+.-]*:|\/|#)/i.test(url.trim());
    }

    function resolveUrl(url, base) {
        try {
            return new URL(url, base).href;
        } catch (e) {
            return url;
        }
    }

    /**
     * Make the URLs relative to the path of the new page absolute in its document, before PJAX
     * switches its elements in: PJAX only updates the URL of the page afterwards, and the scripts,
     * stylesheets and other resources would be loaded from the URLs relative to the previous page
     * (`relative_link: true` of Hexo). Root-relative and absolute URLs, and links, which are
     * resolved when they are followed, are left as they are.
     */
    function resolveUrls(doc, pageUrl) {
        const resolve = url => {
            return url && isPathRelative(url) ? resolveUrl(url, pageUrl) : url;
        };
        doc.querySelectorAll('[src], [poster], link[href]').forEach(el => {
            ['src', 'poster', 'href'].filter(name => el.hasAttribute(name)).forEach(name => {
                el.setAttribute(name, resolve(el.getAttribute(name)));
            });
        });
        doc.querySelectorAll('[srcset]').forEach(el => {
            // The URL of each candidate, which can contain commas (data: URLs), is followed by
            // its descriptors and a comma.
            const srcset = el.getAttribute('srcset').replace(/(^|,)(\s*)(\S+?)(?=,*(\s|$))/g,
                (match, comma, space, url) => comma + space + resolve(url));
            el.setAttribute('srcset', srcset);
        });
    }

    /**
     * Replace the stylesheets of <head> matching the selector with those of the new page, only when
     * they differ, so that the stylesheets that stay are not loaded and applied again. Their URLs
     * are compared once resolved: with relative URLs, they differ between pages at different depths.
     */
    function switchStylesheets(oldHead, newHead, selector, pageUrl) {
        const key = (links, base) => Array.from(links).map(link => resolveUrl(link.getAttribute('href'), base) + ' ' + (link.getAttribute('data-appearance-media') || link.getAttribute('media'))).join();
        const oldLinks = oldHead.querySelectorAll(selector);
        const newLinks = newHead.querySelectorAll(selector);
        if (key(oldLinks, loadedUrl) !== key(newLinks, pageUrl)) {
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
    function switchAppearance(oldHead, newHead, options, pageUrl) {
        const html = options.request && typeof options.request.responseText === 'string' ? options.request.responseText : '';
        const htmlTag = (html.match(/<html\b[^>]*>/i) || [''])[0];
        const appearance = (htmlTag.match(/\sdata-appearance="([^"]*)"/) || [])[1];
        const mode = (htmlTag.match(/\sdata-appearance-mode="([^"]*)"/) || [])[1] || appearance || 'light';
        document.documentElement.setAttribute('data-appearance-mode', mode);
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

        switchStylesheets(oldHead, newHead, 'link[data-pjax]', pageUrl);
        if (window.IcarusAppearance) {
            window.IcarusAppearance.apply();
        }
    }

    /**
     * Render the formulas of the page with KaTeX, if it is loaded. KaTeX renders on the load event
     * of the window, which pages switched to by PJAX do not have. MathJax typesets the page by
     * itself once it is loaded.
     */
    function renderKatex() {
        // A renderer loaded on an earlier page must not compete with this page's MathJax.
        if (!mathjaxEnabled && typeof window.renderMathInElement === 'function') {
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
    function loadPlugins(oldBody, newBody, pageUrl) {
        const isPluginElement = el => (el.tagName === 'SCRIPT' && !el.hasAttribute('data-pjax'))
            || (el.tagName === 'LINK' && el.getAttribute('rel') === 'stylesheet');
        const key = (el, base) => {
            const url = el.getAttribute('src') || el.getAttribute('href');
            return url ? resolveUrl(url, base) : el.textContent;
        };
        const present = new Set(Array.from(oldBody.children).filter(isPluginElement).map(el => key(el, loadedUrl)));

        const runs = [[]];
        Array.from(newBody.children).forEach(el => {
            if (isPluginElement(el) && !present.has(key(el, pageUrl))) {
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
     * Make the navbar, which stays, sticky or not as on the new page (navbar.sticky, which pages
     * can also set in their front-matter).
     */
    function switchNavbar(oldDoc, newDoc) {
        const oldNavbar = oldDoc.querySelector('.navbar-main');
        const newNavbar = newDoc.querySelector('.navbar-main');
        const sticky = newNavbar && newNavbar.getAttribute('data-sticky');
        if (oldNavbar && sticky) {
            oldNavbar.setAttribute('data-sticky', sticky);
        } else if (oldNavbar) {
            oldNavbar.removeAttribute('data-sticky');
        }
    }

    /**
     * Switch the title, the appearance and the variant (default or cyberpunk, which pages can also
     * set in their front-matter, with its theme and font stylesheets) of the page, and load the
     * plugins it adds. <head> itself is not one of the selectors because PJAX runs the scripts of
     * the switched elements again: the analytics and other scripts of <head> would run again,
     * counting page views twice and adding their listeners again.
     */
    function switchMetadata(oldDoc, newDoc) {
        // Synchronize page data without rerunning head scripts (analytics, SDKs).
        const selector = 'meta[name]:not([name="viewport"]):not([name="color-scheme"]), meta[property], '
            + 'link[rel="canonical"], link[rel="alternate"][hreflang], script[type="application/ld+json"]';
        oldDoc.head.querySelectorAll(selector).forEach(el => el.remove());
        newDoc.head.querySelectorAll(selector).forEach(el => oldDoc.head.appendChild(el.cloneNode(true)));
        ['lang', 'dir'].forEach(name => {
            if (newDoc.documentElement.hasAttribute(name)) {
                oldDoc.documentElement.setAttribute(name, newDoc.documentElement.getAttribute(name));
            } else {
                oldDoc.documentElement.removeAttribute(name);
            }
        });
    }

    function switchHead(oldTitle, newTitle, options) {
        const pageUrl = this.state.href;
        // The loader stays in the old body, so inspect the incoming page, not the live DOM.
        mathjaxEnabled = !!newTitle.ownerDocument.querySelector('script#MathJax-script');
        oldTitle.textContent = newTitle.textContent;
        switchMetadata(oldTitle.ownerDocument, newTitle.ownerDocument);
        switchAppearance(oldTitle.ownerDocument.head, newTitle.ownerDocument.head, options, pageUrl);
        switchStylesheets(oldTitle.ownerDocument.head, newTitle.ownerDocument.head, 'link[data-variant]', pageUrl);
        switchNavbar(oldTitle.ownerDocument, newTitle.ownerDocument);
        loadPlugins(oldTitle.ownerDocument.body, newTitle.ownerDocument.body, pageUrl);
        this.onSwitch();
    }

    /** Switch the content of the logo links, which stay and keep being followed with PJAX. */
    function switchContent(oldEl, newEl) {
        oldEl.innerHTML = newEl.innerHTML;
        this.onSwitch();
    }

    function complete(event) {
        // Plugin [MathJax] reload logic
        if (window.MathJax && mathjaxEnabled) {
            try {
                // v4 serializes asynchronous typesetting, including lazy font data loads.
                if (window.MathJax.typesetPromise) {
                    const elements = Array.from(document.querySelectorAll('[role="article"] > .content'));
                    window.MathJax.typesetPromise(elements).catch(e => console.error('MathJax reload error:', e));
                }
            } catch (e) {
                console.error('MathJax reload error:', e);
            }
        }
        // Plugin [KaTeX]
        renderKatex();
        // PJAX scrolls the anchor of the new page to the top of the window, under a sticky navbar:
        // scroll it again after PJAX, before the next paint, below the navbar (its scroll margin).
        if ((!event || event.history !== false) && location.hash && document.querySelector('.navbar-main[data-sticky]')) {
            requestAnimationFrame(() => {
                let target = null;
                try {
                    const name = decodeURIComponent(location.hash.slice(1));
                    target = document.getElementById(name) || document.getElementsByName(name)[0];
                } catch (e) {
                    // A malformed hash: leave the page where PJAX scrolled it
                }
                if (target) {
                    target.scrollIntoView();
                }
            });
        }
        // Plugin [Busuanzi] reload logic
        if (window.bszCaller && window.bszTag) {
            window.bszCaller.fetch('//busuanzi.ibruce.info/busuanzi?jsonpCallback=BusuanziCallback', a => {
                window.bszTag.texts(a);
                window.bszTag.shows();
            });
        }
    }

    function beforeReplace() {
        // Forget MathItems before their DOM is removed, including navigation to non-math pages.
        if (window.MathJax && window.MathJax.typesetClear) {
            const math = window.MathJax;
            math.typesetClear();
            // A font/extension request may still be finishing. Purge old MathItems once
            // pending work settles, before v4's queued typesetting of the incoming page starts.
            math.whenReady(() => {
                math.typesetClear();
                math.texReset();
            }).catch(e => console.error('MathJax cleanup error:', e));
        }
        // Teardown while the old DOM is still attached, also when the next page
        // has no corresponding component. Initializers already destroy before
        // re-init; clearing the handles prevents a second destroy of that instance.
        ['__artalkInstance', '__walineInstance', '__gitalkInstance'].forEach(name => {
            const instance = window[name];
            if (instance && typeof instance.destroy === 'function') {
                instance.destroy();
                window[name] = null;
            }
        });
        if (window.HexoGallery) window.HexoGallery.destroy(document);
        document.dispatchEvent(new CustomEvent('hexo:page:before-replace'));
    }

    window.IcarusPjaxPage = { resolveUrls, switchHead, switchContent, complete, beforeReplace };
}());
