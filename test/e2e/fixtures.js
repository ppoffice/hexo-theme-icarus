/**
 * Shared Playwright fixtures:
 *   - every page is routed through the offline CDN stand-in (./cdn.js)
 *   - `diagnostics` collects uncaught page errors, console errors and failed local requests
 *   - `visit(path, { variant })` opens a page of a fixture site variant
 */
const base = require('@playwright/test');
const { routeExternal } = require('./cdn');

const test = base.test.extend({
    // Installed for every test, so pages never reach the network.
    diagnostics: [async ({ page }, use) => {
        const diagnostics = { pageErrors: [], consoleErrors: [], failedRequests: [], external: [] };
        page.on('pageerror', error => diagnostics.pageErrors.push(error.message));
        page.on('console', message => {
            if (message.type() === 'error') {
                diagnostics.consoleErrors.push(message.text());
            }
        });
        page.on('response', response => {
            if (response.status() >= 400) {
                diagnostics.failedRequests.push(`${response.status()} ${response.url()}`);
            }
        });
        const stats = await routeExternal(page.context());
        diagnostics.external = stats.external;
        await use(diagnostics);
    }, { auto: true }],

    visit: async ({ page }, use) => {
        const sites = JSON.parse(process.env.ICARUS_E2E_SITES || '{}');
        await use(async (urlPath, { variant = 'default' } = {}) => {
            if (!sites[variant]) {
                throw new Error(`Variant "${variant}" is not served; add it to VARIANTS in test/e2e/global-setup.js`);
            }
            const response = await page.goto(sites[variant] + urlPath);
            base.expect(response.status(), `GET ${urlPath}`).toBe(200);
            await page.waitForLoadState('load');
            return response;
        });
    }
});

/** jQuery event handler counts on window/document, e.g. { resize: 1, scroll: 1 } */
function jqueryHandlerCounts(page, target = 'window') {
    return page.evaluate(target => {
        const events = window.jQuery._data(target === 'window' ? window : document, 'events') || {};
        return Object.fromEntries(Object.entries(events).map(([type, handlers]) => [type, handlers.length]));
    }, target);
}

/**
 * Mark the current test as documenting a confirmed, unfixed bug: the test asserts the correct
 * behavior and is expected to fail. Playwright reports an error once it starts passing, so the
 * marker must then be removed and the test kept as a regression test.
 * Set SHOW_KNOWN_BUGS=1 to run these as normal tests and see why they currently fail.
 */
function knownBug(reason) {
    test.fail(!process.env.SHOW_KNOWN_BUGS, reason);
}

module.exports = { test, expect: base.expect, jqueryHandlerCounts, knownBug };
