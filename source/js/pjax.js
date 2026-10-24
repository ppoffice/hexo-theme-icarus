(function() {
    const page = window.IcarusPjaxPage;

    function initPjax() {
        try {
            const Pjax = window.Pjax || function() {};
            const pjax = new Pjax({
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
                const afterAllSwitches = pjax.afterAllSwitches;
                pjax.afterAllSwitches = function() {
                    // Restore the new navbar before PJAX requests main.js, which may be slow or fail.
                    window.IcarusNavbar.init();
                    return afterAllSwitches.call(this);
                };
                pjax.switchSelectors = function(selectors, fromEl, toEl, options) {
                    page.resolveUrls(fromEl, this.state.href);
                    window.IcarusNavbar.destroy();
                    return switchSelectors.call(this, selectors, fromEl, toEl, options);
                };
            }
            if (pjax.doRequest) {
                const requests = window.IcarusPjaxPrefetch.create(pjax, pjax.doRequest);
                pjax.doRequest = requests.doRequest;
                document.addEventListener('icarus:prefetch', event => {
                    event.preventDefault();
                    requests.prefetch(event.detail.url);
                });
            }
        } catch (e) {
            console.warn('PJAX error: ' + e);
        }
    }

    document.addEventListener('pjax:complete', page.complete);
    document.addEventListener('DOMContentLoaded', initPjax);
}());
