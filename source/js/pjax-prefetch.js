(function() {
    const PREFETCH_TTL = 5 * 60 * 1000;
    const withoutHash = url => url.split('#')[0];

    function isPlainGet(options) {
        const request = options.requestOptions || {};
        return (request.requestMethod || 'GET').toUpperCase() === 'GET' && !(request.requestParams && request.requestParams.length) && !request.formData;
    }

    // One cache per PJAX instance. This module owns requests only, not DOM events or page state.
    function create(pjax, sendRequest) {
        const prefetches = new Map();

        function prefetch(href) {
            const url = withoutHash(href);
            const entry = prefetches.get(url);
            if (entry && Date.now() - entry.time < PREFETCH_TTL) {
                return;
            }
            const prefetched = { time: Date.now(), response: null, onResponse: null };
            prefetched.request = sendRequest.call(pjax, url, pjax.options, (responseText, request) => {
                prefetched.response = [responseText, request];
                // A failed prefetch is tried again on the next hover.
                if (responseText === null && prefetches.get(url) === prefetched) {
                    prefetches.delete(url);
                }
                if (prefetched.onResponse) {
                    prefetched.onResponse(responseText, request);
                }
            });
            prefetches.set(url, prefetched);
        }

        function doRequest(href, options, callback) {
            const url = withoutHash(href);
            const prefetched = prefetches.get(url);
            prefetches.delete(url);
            if (!prefetched || Date.now() - prefetched.time >= PREFETCH_TTL || !isPlainGet(options) || options.cacheBust) {
                return sendRequest.call(this, href, options, callback);
            }
            // PJAX aborts this proxy when another navigation starts, without aborting the prefetch.
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
                // Asynchronously, as a request: PJAX keeps the returned request first.
                Promise.resolve().then(() => prefetched.onResponse(...prefetched.response));
            }
            return request;
        }

        return { prefetch, doRequest };
    }

    window.IcarusPjaxPrefetch = { create };
}());
