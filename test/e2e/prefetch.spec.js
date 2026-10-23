const { test, expect } = require('./fixtures');

const POST = '/2024/03/01/hello-world/';

/** Record the requests of the pages of the site (not their scripts, stylesheets, ...). */
function recordPageRequests(page) {
    const requests = [];
    page.context().on('request', request => {
        const url = new URL(request.url());
        if (url.hostname === '127.0.0.1' && (url.pathname.endsWith('/') || url.pathname.endsWith('.html'))) {
            requests.push({ path: url.pathname, pjax: request.headers()['x-pjax'] === 'true' });
        }
    });
    return requests;
}

/** The speculation rules prefetching the pages, which the browser, not the page, requests. */
async function speculationRules(page) {
    const rules = await page.locator('script[type="speculationrules"]').allTextContents();
    return rules.map(JSON.parse);
}

/** Click a link and wait until PJAX has swapped the page in. */
async function pjaxClick(page, locator) {
    const done = page.evaluate(() => new Promise(resolve => document.addEventListener('pjax:complete', resolve, { once: true })));
    await locator.click();
    await done;
    await page.waitForLoadState('networkidle');
}

/** Add a link to the main column, to hover over it. */
async function addLink(page, href, attributes = {}) {
    await page.evaluate(([href, attributes]) => {
        const link = document.createElement('a');
        link.href = href;
        link.id = 'test-link';
        link.textContent = 'Test link';
        Object.entries(attributes).forEach(([name, value]) => link.setAttribute(name, value));
        document.querySelector('.column-main').prepend(link);
    }, [href, attributes]);
    return page.locator('#test-link');
}

test.describe('prefetch plugin', () => {
    test('is disabled by default', async ({ page, visit }) => {
        await visit('/');
        await expect(page.locator('script[src="/js/prefetch.js"]')).toHaveCount(0);
    });

    test.describe('without PJAX', () => {
        test('prefetches the page of a hovered link, which the navigation uses', async ({ page, visit }) => {
            await visit('/', { variant: 'prefetch' });
            const link = page.locator(`.column-main a[href="${POST}"]`).first();
            await link.hover();
            const url = new URL(POST, page.url()).href;
            await expect.poll(() => speculationRules(page)).toEqual([{ prefetch: [{ source: 'list', urls: [url] }] }]);
            // The fixture server sends no cache headers: the page comes from the prefetch cache.
            await link.click();
            await expect(page).toHaveURL(url);
            expect(await page.evaluate(() => performance.getEntriesByType('navigation')[0].deliveryType)).toBe('navigational-prefetch');
        });

        test('prefetches the page of a touched link', async ({ page, visit }) => {
            await visit('/', { variant: 'prefetch' });
            await page.locator(`.column-main a[href="${POST}"]`).first().dispatchEvent('touchstart');
            await expect.poll(() => speculationRules(page)).toEqual([{ prefetch: [{ source: 'list', urls: [new URL(POST, page.url()).href] }] }]);
        });

        test('prefetches with <link rel="prefetch"> without speculation rules', async ({ page, visit }) => {
            await page.addInitScript(() => { HTMLScriptElement.supports = () => false; });
            await visit('/', { variant: 'prefetch' });
            const requests = recordPageRequests(page);
            await page.locator(`.column-main a[href="${POST}"]`).first().hover();
            await expect.poll(() => requests).toEqual([{ path: POST, pjax: false }]);
            await expect(page.locator('link[rel="prefetch"]')).toHaveAttribute('href', new URL(POST, page.url()).href);
        });

        test('prefetches each page once', async ({ page, visit }) => {
            await visit('/', { variant: 'prefetch' });
            const link = page.locator(`.column-main a[href="${POST}"]`).first();
            for (let i = 0; i < 3; i++) {
                await link.hover();
                await page.mouse.move(0, 0);
            }
            await expect(page.locator('script[type="speculationrules"]')).toHaveCount(1);
        });

        for (const [name, href, attributes] of [
            ['external links', 'https://example.com/post/'],
            ['downloads', '/2024/02/20/code-blocks/', { download: '' }],
            ['opted-out links', '/2024/02/20/code-blocks/', { 'data-no-prefetch': '' }],
            ['files other than pages', '/img/avatar.png'],
            ['anchors of the current page', '#test'],
            ['the current page', '/']
        ]) {
            test(`does not prefetch ${name}`, async ({ page, visit, diagnostics }) => {
                await visit('/', { variant: 'prefetch' });
                const requests = recordPageRequests(page);
                const link = await addLink(page, href, attributes);
                await link.hover();
                await link.dispatchEvent('touchstart');
                await page.waitForTimeout(200);
                await expect(page.locator('script[type="speculationrules"], link[rel="prefetch"]')).toHaveCount(0);
                expect(requests).toEqual([]);
                expect(diagnostics.external).toEqual(expect.not.arrayContaining(['https://example.com/post/']));
            });
        }

        test('does not prefetch when the visitor saves data', async ({ page, visit }) => {
            await page.addInitScript(() => {
                Object.defineProperty(Navigator.prototype, 'connection', { get: () => ({ saveData: true, effectiveType: '4g' }) });
            });
            await visit('/', { variant: 'prefetch' });
            const requests = recordPageRequests(page);
            await page.locator(`.column-main a[href="${POST}"]`).first().hover();
            await page.waitForTimeout(200);
            expect(requests).toEqual([]);
        });
    });

    test.describe('with PJAX', () => {
        test.beforeEach(async ({ page, visit }) => {
            await visit('/', { variant: 'pjax-prefetch' });
            await page.evaluate(() => { window.__noFullReload = true; });
        });

        test('prefetches with the request of PJAX, which the navigation reuses', async ({ page, diagnostics }) => {
            const requests = recordPageRequests(page);
            const link = page.locator(`.column-main a[href="${POST}"]`).first();
            await link.hover();
            await expect.poll(() => requests).toEqual([{ path: POST, pjax: true }]);
            // The fixture server sends no cache headers: the browser cache could not be reused.
            await pjaxClick(page, link);
            await expect(page).toHaveTitle('Hello World - Icarus Fixture');
            expect(requests).toEqual([{ path: POST, pjax: true }]);
            expect(await page.evaluate(() => window.__noFullReload)).toBe(true);
            expect(diagnostics.pageErrors).toEqual([]);
        });

        test('uses a prefetch that is still loading', async ({ page }) => {
            const requests = recordPageRequests(page);
            let release;
            const held = new Promise(resolve => { release = resolve; });
            await page.route(`**${POST}`, async route => {
                await held;
                await route.continue();
            });
            const link = page.locator(`.column-main a[href="${POST}"]`).first();
            await link.hover();
            await expect.poll(() => requests.length).toBe(1);
            const done = page.evaluate(() => new Promise(resolve => document.addEventListener('pjax:complete', resolve, { once: true })));
            await link.click();
            release();
            await done;
            await expect(page).toHaveTitle('Hello World - Icarus Fixture');
            expect(requests).toEqual([{ path: POST, pjax: true }]);
        });

        test('requests the page again when its prefetch fails', async ({ page }) => {
            const requests = recordPageRequests(page);
            let release;
            const held = new Promise(resolve => { release = resolve; });
            let failed = false;
            await page.route(`**${POST}`, async route => {
                if (failed) {
                    return route.continue();
                }
                failed = true;
                await held;
                return route.fulfill({ status: 503, body: 'Unavailable' });
            });
            const link = page.locator(`.column-main a[href="${POST}"]`).first();
            await link.hover();
            await expect.poll(() => requests.length).toBe(1);
            const done = page.evaluate(() => new Promise(resolve => document.addEventListener('pjax:complete', resolve, { once: true })));
            await link.click();
            release();
            await done;
            await expect(page).toHaveTitle('Hello World - Icarus Fixture');
            expect(requests).toEqual([{ path: POST, pjax: true }, { path: POST, pjax: true }]);
            expect(await page.evaluate(() => window.__noFullReload)).toBe(true);
        });

        test('prefetches a page again when its prefetch failed', async ({ page }) => {
            const requests = recordPageRequests(page);
            await page.route(`**${POST}`, route => route.fulfill({ status: 503, body: 'Unavailable' }));
            const link = page.locator(`.column-main a[href="${POST}"]`).first();
            await link.hover();
            await expect.poll(() => requests.length).toBe(1);
            await page.waitForLoadState('networkidle');
            await page.mouse.move(0, 0);
            await link.hover();
            await expect.poll(() => requests.length).toBe(2);
        });

        test('keeps prefetching on the pages switched in by PJAX', async ({ page }) => {
            await pjaxClick(page, page.locator('.navbar-start a', { hasText: 'Archives' }));
            const requests = recordPageRequests(page);
            const link = page.locator(`.column-main a[href="${POST}"]`).first();
            await link.hover();
            await expect.poll(() => requests).toEqual([{ path: POST, pjax: true }]);
            await pjaxClick(page, link);
            await expect(page).toHaveTitle('Hello World - Icarus Fixture');
            expect(requests).toHaveLength(1);
            // A page is prefetched again once its prefetch has been used
            await pjaxClick(page, page.locator('.navbar-start a', { hasText: 'Home' }));
            await page.locator(`.column-main a[href="${POST}"]`).first().hover();
            await expect.poll(() => requests.filter(r => r.path === POST)).toHaveLength(2);
            await expect(page.locator('script[src="/js/prefetch.js"]')).toHaveCount(1);
            expect(await page.evaluate(() => window.__noFullReload)).toBe(true);
        });
    });
});
