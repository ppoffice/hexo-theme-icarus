const { test, expect, jqueryHandlerCounts } = require('./fixtures');

/** Click a link and wait until PJAX has swapped the page in. */
async function pjaxClick(page, locator) {
    const done = page.evaluate(() => new Promise(resolve => document.addEventListener('pjax:complete', resolve, { once: true })));
    await locator.click();
    await done;
    // pjax:complete fires when the content is swapped; the data-pjax scripts (main.js, ...) are
    // then downloaded and executed again. Wait for those requests to settle before interacting.
    await page.waitForLoadState('networkidle');
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

    test('does not accumulate window event handlers across navigations', async ({ page }) => {
        const before = await jqueryHandlerCounts(page);
        for (let i = 0; i < 3; i++) {
            await pjaxClick(page, page.locator('.navbar-start a', { hasText: 'Archives' }));
            await pjaxClick(page, page.locator('.navbar-start a', { hasText: 'Home' }));
        }
        expect(await jqueryHandlerCounts(page)).toEqual(before);
    });

    test('keeps a single toc mask across navigations', async ({ page }) => {
        for (let i = 0; i < 2; i++) {
            await pjaxClick(page, page.locator('.column-main a[href="/2024/03/01/hello-world/"]').first());
            await pjaxClick(page, page.locator('.navbar-start a', { hasText: 'Home' }));
        }
        await pjaxClick(page, page.locator('.column-main a[href="/2024/03/01/hello-world/"]').first());
        await expect(page.locator('#toc-mask')).toHaveCount(1);
    });

    test('removes the toc mask on pages without a toc', async ({ page }) => {
        await pjaxClick(page, page.locator('.column-main a[href="/2024/03/01/hello-world/"]').first());
        await expect(page.locator('#toc-mask')).toHaveCount(1);
        await pjaxClick(page, page.locator('.navbar-start a', { hasText: 'Home' }));
        await expect(page.locator('#toc-mask')).toHaveCount(0);
    });

    test('the mobile toc still opens and closes after navigating', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 800 });
        for (let i = 0; i < 2; i++) {
            await pjaxClick(page, page.locator('.column-main a[href="/2024/03/01/hello-world/"]').first());
            await pjaxClick(page, page.locator('.navbar-logo'));
        }
        await pjaxClick(page, page.locator('.column-main a[href="/2024/03/01/hello-world/"]').first());
        await page.locator('.navbar-main .catalogue').click();
        await expect(page.locator('#toc')).toHaveClass(/is-active/);
        await expect(page.locator('#toc-mask')).toHaveClass(/is-active/);
        await page.locator('#toc-mask').click({ position: { x: 5, y: 5 } });
        await expect(page.locator('#toc')).not.toHaveClass(/is-active/);
        await expect(page.locator('#toc-mask')).not.toHaveClass(/is-active/);
    });

    test('copies code once per click after navigating', async ({ page, context }) => {
        await context.grantPermissions(['clipboard-read', 'clipboard-write']);
        for (let i = 0; i < 2; i++) {
            await pjaxClick(page, page.locator('.column-main a[href="/2024/02/20/code-blocks/"]').first());
            await pjaxClick(page, page.locator('.navbar-start a', { hasText: 'Home' }));
        }
        await pjaxClick(page, page.locator('.column-main a[href="/2024/02/20/code-blocks/"]').first());
        await page.evaluate(() => {
            window.__copies = 0;
            document.addEventListener('copy', () => { window.__copies++; });
        });
        await page.locator('figure.highlight .copy').first().click();
        expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('const answer = 42;');
        expect(await page.evaluate(() => window.__copies)).toBe(1);
    });
});
