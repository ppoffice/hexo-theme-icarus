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
 * Colors of the elements matching a selector, as seen on the page: the text color and the
 * background behind it (the backgrounds of the element and its ancestors, blended), with the
 * relative luminance of both and their WCAG contrast ratio.
 */
function colorsOf(page, selector) {
    return page.locator(selector).evaluateAll(elements => {
        const parse = value => {
            const [r, g, b, a = 1] = value.match(/[\d.]+/g).map(Number);
            return { r, g, b, a };
        };
        const blend = (top, bottom) => ({
            r: (top.r * top.a) + (bottom.r * (1 - top.a)),
            g: (top.g * top.a) + (bottom.g * (1 - top.a)),
            b: (top.b * top.a) + (bottom.b * (1 - top.a)),
            a: 1
        });
        const luminance = ({ r, g, b }) => {
            const channel = value => {
                value /= 255;
                return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
            };
            return (0.2126 * channel(r)) + (0.7152 * channel(g)) + (0.0722 * channel(b));
        };
        return elements.map(el => {
            const layers = [];
            for (let node = el; node; node = node.parentElement) {
                layers.push(parse(getComputedStyle(node).backgroundColor));
            }
            // The canvas is white unless <html> has a background.
            const background = layers.reverse().reduce((under, layer) => blend(layer, under), { r: 255, g: 255, b: 255, a: 1 });
            const color = blend(parse(getComputedStyle(el).color), background);
            const [light, dark] = [luminance(color), luminance(background)].sort((a, b) => b - a);
            return {
                text: el.textContent.trim().slice(0, 30),
                color: luminance(color),
                background: luminance(background),
                contrast: (light + 0.05) / (dark + 0.05)
            };
        });
    });
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

module.exports = { test, expect: base.expect, jqueryHandlerCounts, colorsOf, knownBug };
