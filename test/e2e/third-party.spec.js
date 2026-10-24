/**
 * Comment and analytics plugins from hexo-component-inferno, with and without PJAX.
 *
 * The fixture variant uses Gitalk, whose library and stylesheet are replaced by the stubs
 * below, and Matomo and Umami, whose scripts get the empty response of the offline CDN.
 */
const { test, expect } = require('./fixtures');

const VARIANT = 'pjax-comment-analytics';
const GITALK_JS = 'https://cdn.jsdelivr.net/npm/@aifire/gitalk@2.0.0-beta.2/dist/gitalk.js';
const GITALK_CSS = 'https://cdn.jsdelivr.net/npm/@aifire/gitalk@2.0.0-beta.2/dist/gitalk.css';

// Counts how many times the library is loaded and comments are rendered, and marks the container.
const GITALK_STUB = `
window.__gitalkLoads = (window.__gitalkLoads || 0) + 1;
window.Gitalk = function (options) { this.options = options; };
window.Gitalk.prototype.destroy = function () { window.__gitalkDestroys = (window.__gitalkDestroys || 0) + 1; };
window.Gitalk.prototype.render = function (id) {
    var el = document.getElementById(id);
    el.setAttribute('data-gitalk-id', this.options.id);
    el.textContent = 'Gitalk ' + this.options.id;
    window.__gitalkRenders = (window.__gitalkRenders || 0) + 1;
};`;
const GITALK_STYLE = '#comment-container { border-top: 3px solid rgb(1, 2, 3); }';

const js = body => ({ status: 200, contentType: 'application/javascript', body });
const css = body => ({ status: 200, contentType: 'text/css', body });

/** Answer a URL with the given response, once release() is called. */
async function hold(page, url, response) {
    let release;
    const released = new Promise(resolve => { release = resolve; });
    await page.route(url, async route => {
        await released;
        await route.fulfill(response);
    });
    return release;
}

async function stubGitalk(page) {
    await page.route(GITALK_JS, route => route.fulfill(js(GITALK_STUB)));
    await page.route(GITALK_CSS, route => route.fulfill(css(GITALK_STYLE)));
}

/** Click a link and wait until PJAX has swapped the page in and its scripts have run. */
async function pjaxClick(page, locator) {
    const done = page.evaluate(() => new Promise(resolve => document.addEventListener('pjax:complete', resolve, { once: true })));
    await locator.click();
    await done;
    await page.waitForLoadState('networkidle');
}

const container = page => page.locator('#comment-container');
const commentScripts = page => page.locator(`script[src="${GITALK_JS}"]`);
const pageViews = page => page.evaluate(() => (window._paq || []).filter(command => command[0] === 'trackPageView').length);

test.describe('comments', () => {
    test('load the comment library asynchronously and the stylesheet without blocking the page', async ({ page }) => {
        const sites = JSON.parse(process.env.ICARUS_E2E_SITES);
        const releaseCss = await hold(page, GITALK_CSS, css(GITALK_STYLE));
        const releaseJs = await hold(page, GITALK_JS, js(GITALK_STUB));
        // A stylesheet that applies right away would keep the parser from running the scripts after
        // it, and from reaching DOMContentLoaded, until it is loaded, which the test holds back.
        await page.goto(sites[VARIANT] + '/2024/03/01/hello-world/', { waitUntil: 'domcontentloaded' });
        await expect(page.locator('.article .title').first()).toBeVisible();
        expect(await page.evaluate(() => document.readyState)).not.toBe('loading');
        const link = page.locator('#comments link[rel="stylesheet"]');
        await expect(link).toHaveAttribute('media', 'print');
        await expect(link).toHaveAttribute('href', GITALK_CSS);
        await expect(page.locator(`head script[src="${GITALK_JS}"]`)).toHaveAttribute('data-loaded', 'false');
        expect(await page.locator(`head script[src="${GITALK_JS}"]`).evaluate(script => script.async)).toBe(true);
        await expect(container(page)).toBeEmpty();

        releaseCss();
        await expect(link, 'applied once loaded').toHaveAttribute('media', 'all');
        await expect(container(page)).toHaveCSS('border-top-color', 'rgb(1, 2, 3)');

        releaseJs();
        await expect(container(page)).toHaveText(/^Gitalk [0-9a-f]{32}$/);
        await expect(commentScripts(page)).toHaveCount(1);
        await expect(commentScripts(page)).toHaveAttribute('data-loaded', 'true');
    });

    test('are initialised again on the post PJAX switches to, without loading the library again', async ({ page, visit, diagnostics }) => {
        await stubGitalk(page);
        await visit('/2024/03/01/hello-world/', { variant: VARIANT });
        await expect(container(page)).toHaveText(/^Gitalk /);
        const firstId = await container(page).getAttribute('data-gitalk-id');
        await page.evaluate(() => { window.__noFullReload = true; });

        await pjaxClick(page, page.locator('.article-nav-next'));
        await expect(page).toHaveTitle('Code Blocks - Icarus Fixture');
        await expect(container(page)).toHaveText(/^Gitalk /);
        const secondId = await container(page).getAttribute('data-gitalk-id');
        expect(secondId).toMatch(/^[0-9a-f]{32}$/);
        expect(secondId).not.toBe(firstId);
        await expect(page.locator('#comments link[rel="stylesheet"]')).toHaveAttribute('media', 'all');

        await pjaxClick(page, page.locator('.article-nav-prev'));
        await expect(container(page)).toHaveAttribute('data-gitalk-id', firstId);

        expect(await page.evaluate(() => [window.__gitalkLoads, window.__gitalkRenders, window.__noFullReload])).toEqual([1, 3, true]);
        await expect(commentScripts(page)).toHaveCount(1);
        expect(diagnostics.pageErrors).toEqual([]);
    });

    test('are initialised on a post PJAX switches to from a page without comments', async ({ page, visit, diagnostics }) => {
        await stubGitalk(page);
        await visit('/', { variant: VARIANT });
        await expect(page.locator('#comments')).toHaveCount(0);
        await page.evaluate(() => { window.__noFullReload = true; });

        await pjaxClick(page, page.locator('.column-main a[href="/2024/03/01/hello-world/"]').first());
        await expect(page).toHaveTitle('Hello World - Icarus Fixture');
        await expect(container(page)).toHaveText(/^Gitalk [0-9a-f]{32}$/);
        await expect(page.locator('#comments link[rel="stylesheet"]')).toHaveAttribute('media', 'all');
        await pjaxClick(page, page.locator('.navbar-start a', { hasText: 'Home' }));
        await expect(page.locator('#comments')).toHaveCount(0);

        expect(await page.evaluate(() => window.__noFullReload)).toBe(true);
        expect(diagnostics.pageErrors).toEqual([]);
    });
});

test.describe('analytics with PJAX', () => {
    test.beforeEach(async ({ page }) => {
        await stubGitalk(page);
    });

    test('Matomo tracks the first page and each page PJAX switches to once', async ({ page, visit }) => {
        await visit('/2024/03/01/hello-world/', { variant: VARIANT });
        expect(await pageViews(page)).toBe(1);
        await page.evaluate(() => { window.__noFullReload = true; });

        await pjaxClick(page, page.locator('.article-nav-next'));
        expect(await pageViews(page)).toBe(2);
        await pjaxClick(page, page.locator('.article-nav-prev'));
        expect(await pageViews(page)).toBe(3);

        const urls = await page.evaluate(() => window._paq.filter(command => command[0] === 'setCustomUrl').map(command => new URL(command[1]).pathname));
        expect(urls).toEqual(['/2024/02/20/code-blocks/', '/2024/03/01/hello-world/']);
        expect(await page.evaluate(() => window.__noFullReload)).toBe(true);
    });

    test('the scripts of <head> are not run again by PJAX', async ({ page, visit }) => {
        await visit('/2024/03/01/hello-world/', { variant: VARIANT });
        const umami = page.locator('head script[src="https://cloud.umami.is/script.js"][data-website-id="fixture-umami"]');
        await expect(umami).toHaveCount(1);
        const requests = [];
        page.on('request', request => requests.push(request.url()));

        await pjaxClick(page, page.locator('.article-nav-next'));
        await expect(page).toHaveTitle('Code Blocks - Icarus Fixture');
        await expect(umami).toHaveCount(1);
        expect(requests.filter(url => /umami|matomo/.test(url))).toEqual([]);
    });
});
