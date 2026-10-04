const { test, expect, jqueryHandlerCounts, knownBug } = require('./fixtures');

/** Click a link and wait until PJAX has swapped the page in. */
async function pjaxClick(page, locator) {
    const done = page.evaluate(() => new Promise(resolve => document.addEventListener('pjax:complete', resolve, { once: true })));
    await locator.click();
    await done;
    // main.js and other data-pjax scripts are re-executed after the swap
    await page.waitForLoadState('load');
}

test.describe('PJAX navigation', () => {
    test.beforeEach(async ({ page, visit }) => {
        await visit('/', { variant: 'pjax' });
        await page.evaluate(() => { window.__noFullReload = true; });
    });

    test('swaps the page content without a full reload', async ({ page, diagnostics }) => {
        await pjaxClick(page, page.locator('.navbar-start a', { hasText: 'Archives' }));
        await expect(page).toHaveURL(/\/archives\/?$/);
        await expect(page).toHaveTitle('Archives - Icarus Fixture');
        await expect(page.locator('.column-main .timeline').first()).toBeVisible();
        await expect(page.locator('.navbar-start a.is-active')).toHaveText('Archives');
        expect(await page.evaluate(() => window.__noFullReload)).toBe(true);
        expect(diagnostics.pageErrors).toEqual([]);
    });

    test('re-initialises page scripts on the new page', async ({ page }) => {
        await pjaxClick(page, page.locator('.column-main a[href="/2024/02/20/code-blocks/"]').first());
        await expect(page).toHaveTitle('Code Blocks - Icarus Fixture');
        await expect(page.locator('figure.highlight .copy')).toHaveCount(3);
        expect(await page.evaluate(() => window.__noFullReload)).toBe(true);
    });

    test('supports the browser back button', async ({ page }) => {
        await pjaxClick(page, page.locator('.navbar-start a', { hasText: 'Tags' }));
        await expect(page).toHaveTitle('Tags - Icarus Fixture');
        await page.goBack();
        await expect(page).toHaveTitle('Icarus Fixture');
        await expect(page.locator('.column-main article').first()).toBeVisible();
    });

    test('[known bug] does not accumulate window event handlers across navigations', async ({ page }) => {
        knownBug('main.js and back_to_top.js bind resize/scroll handlers again on every PJAX navigation');
        const before = await jqueryHandlerCounts(page);
        for (let i = 0; i < 3; i++) {
            await pjaxClick(page, page.locator('.navbar-start a', { hasText: 'Archives' }));
            await pjaxClick(page, page.locator('.navbar-start a', { hasText: 'Home' }));
        }
        expect(await jqueryHandlerCounts(page)).toEqual(before);
    });

    test('[known bug] keeps a single toc mask across navigations', async ({ page }) => {
        knownBug('main.js appends a new #toc-mask to <body> on every PJAX navigation');
        for (let i = 0; i < 2; i++) {
            await pjaxClick(page, page.locator('.column-main a[href="/2024/03/01/hello-world/"]').first());
            await pjaxClick(page, page.locator('.navbar-start a', { hasText: 'Home' }));
        }
        await pjaxClick(page, page.locator('.column-main a[href="/2024/03/01/hello-world/"]').first());
        await expect(page.locator('#toc-mask')).toHaveCount(1);
    });
});
