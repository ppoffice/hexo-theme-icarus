(function() {
    const script = document.currentScript;
    const delay = Math.max(0, parseInt(script && script.getAttribute('data-delay'), 10) || 0);
    const prefetched = new Set();
    let timer = null;

    function savesData() {
        const connection = navigator.connection;
        return !!connection && (connection.saveData || /2g/.test(connection.effectiveType || ''));
    }

    /**
     * The URL, without its fragment, of the page of the site a link leads to, or null for external
     * links, downloads, files other than pages (images of the gallery, feeds, ...), anchors of the
     * current page and links opted out with data-no-prefetch.
     */
    function pageUrl(link) {
        if (!link || link.hasAttribute('download') || link.hasAttribute('data-no-prefetch')) {
            return null;
        }
        let url;
        try {
            url = new URL(link.href, location.href);
        } catch (e) {
            return null;
        }
        if (url.origin !== location.origin || !/^https?:$/.test(url.protocol)
            || /\.(?!html?$)[^./]+$/i.test(url.pathname)
            || (url.pathname === location.pathname && url.search === location.search)) {
            return null;
        }
        url.hash = '';
        return url.href;
    }

    /**
     * Prefetch a page. With PJAX, pjax.js handles the icarus:prefetch event: it requests the page
     * as PJAX does and keeps the response for the PJAX navigation, which would not reuse a page
     * prefetched by the browser unless it is cacheable. Otherwise, the browser prefetches it, with
     * speculation rules where supported, whose prefetches navigations reuse whatever the cache
     * headers, or else with <link rel="prefetch">.
     */
    function prefetch(url) {
        if (prefetched.has(url) || savesData()) {
            return;
        }
        const event = new CustomEvent('icarus:prefetch', { detail: { url }, cancelable: true });
        if (!document.dispatchEvent(event)) {
            return;
        }
        prefetched.add(url);
        if (HTMLScriptElement.supports && HTMLScriptElement.supports('speculationrules')) {
            const rules = document.createElement('script');
            rules.type = 'speculationrules';
            rules.textContent = JSON.stringify({ prefetch: [{ source: 'list', urls: [url] }] });
            document.head.appendChild(rules);
        } else {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = url;
            document.head.appendChild(link);
        }
    }

    // Delegated to the document, so that the links of the pages switched in by PJAX are handled too
    document.addEventListener('mouseover', event => {
        const link = event.target.closest && event.target.closest('a[href]');
        if (!link || (event.relatedTarget && link.contains(event.relatedTarget))) {
            return;
        }
        const url = pageUrl(link);
        if (url) {
            clearTimeout(timer);
            timer = setTimeout(() => prefetch(url), delay);
        }
    });

    document.addEventListener('mouseout', event => {
        const link = event.target.closest && event.target.closest('a[href]');
        if (link && !(event.relatedTarget && link.contains(event.relatedTarget))) {
            clearTimeout(timer);
        }
    });

    document.addEventListener('touchstart', event => {
        const url = pageUrl(event.target.closest && event.target.closest('a[href]'));
        if (url) {
            prefetch(url);
        }
    }, { capture: true, passive: true });
}());
