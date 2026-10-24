(function() {
    let pjax;
    const page = window.IcarusPjaxPage;

    /** How long a prefetched page is kept for the navigation to it, as browsers keep prefetches. */
    const PREFETCH_TTL = 5 * 60 * 1000;
    const prefetches = new Map();

    function withoutHash(url) {
        return url.split('#')[0];
    }

    function isPlainGet(options) {
        const request = options.requestOptions || {};
        return (request.requestMethod || 'GET').toUpperCase() === 'GET' && !(request.requestParams && request.requestParams.length) && !request.formData;
    }

    /**
     * Prefetch a page for the prefetch plugin, with the request PJAX makes, and keep the response
     * for the navigation to it. A page prefetched by the browser is only reused by the request of
     * PJAX when it is cacheable, which most hosts do not allow for pages (max-age=0 or no-cache).
     */
    function prefetch(sendRequest, url) {
        const entry = prefetches.get(url);
        if (entry && Date.now() - entry.time < PREFETCH_TTL) {
            return;
        }
        const prefetched = { time: Date.now(), response: null, onResponse: null };
        prefetched.request = sendRequest.call(pjax, url, pjax.options, (responseText, request) => {
            prefetched.response = [responseText, request];
            // A failed prefetch is tried again on the next hover
            if (responseText === null && prefetches.get(url) === prefetched) {
                prefetches.delete(url);
            }
            if (prefetched.onResponse) {
                prefetched.onResponse(responseText, request);
            }
        });
        prefetches.set(url, prefetched);
    }

    /**
     * Send the request of a PJAX navigation, or use the prefetched response of the page, even when
     * it is still loading. When the prefetch has failed, the page is requested again.
     */
    function sendRequestOrUsePrefetched(sendRequest) {
        return function(href, options, callback) {
            const url = withoutHash(href);
            const prefetched = prefetches.get(url);
            prefetches.delete(url);
            if (!prefetched || Date.now() - prefetched.time >= PREFETCH_TTL || !isPlainGet(options) || options.cacheBust) {
                return sendRequest.call(this, href, options, callback);
            }
            // Stands for the request until the response is passed on: PJAX aborts the request of a
            // navigation when another one starts.
            const request = { readyState: 1, aborted: false, abort() { this.aborted = true; } };
            prefetched.onResponse = (responseText, xhr) => {
                if (request.aborted) {
                    return;
                }
                request.readyState = 4;
                if (responseText === null) {
                    this.request = sendRequest.call(this, href, options, callback);
                } else {
                    callback(responseText, xhr, href, options);
                }
            };
            if (prefetched.response) {
                // Asynchronously, as a request: PJAX keeps the returned request first
                Promise.resolve().then(() => prefetched.onResponse(...prefetched.response));
            }
            return request;
        };
    }


    function initPjax() {
        try {
            const Pjax = window.Pjax || function() {};
            pjax = new Pjax({
                selectors: [
                    // Stylesheets are switched with appearance: their number varies.
                    '[data-pjax]:not(link)',
                    '.navbar-logo',
                    '.footer-logo',
                    '.pjax-reload',
                    'head title',
                    // Do not select Bulma columns inside page content.
                    'body > .section > .container > .columns',
                    '.navbar-start',
                    '.navbar-end',
                    '.searchbox link',
                    '.searchbox script',
                    // Comments are already switched (and their scripts rerun) with .columns.
                    '#back-to-top'
                ],
                switches: {
                    'head title': page.switchHead,
                    '.navbar-logo': page.switchContent,
                    '.footer-logo': page.switchContent
                },
                cacheBust: false
            });
            const switchSelectors = pjax.switchSelectors;
            if (switchSelectors) {
                pjax.switchSelectors = function(selectors, fromEl, toEl, options) {
                    page.resolveUrls(fromEl, this.state.href);
                    return switchSelectors.call(this, selectors, fromEl, toEl, options);
                };
            }
            const sendRequest = pjax.doRequest;
            if (sendRequest) {
                pjax.doRequest = sendRequestOrUsePrefetched(sendRequest);
                document.addEventListener('icarus:prefetch', event => {
                    event.preventDefault();
                    prefetch(sendRequest, withoutHash(event.detail.url));
                });
            }
        } catch (e) {
            console.warn('PJAX error: ' + e);
        }
    }

    document.addEventListener('pjax:complete', page.complete);
    document.addEventListener('DOMContentLoaded', initPjax);
}());
