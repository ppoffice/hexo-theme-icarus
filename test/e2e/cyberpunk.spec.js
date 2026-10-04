const { test, expect } = require('./fixtures');

test.describe('cyberpunk variant', () => {
    for (const urlPath of ['/', '/2024/03/01/hello-world/', '/2024/02/20/code-blocks/', '/archives/']) {
        test(`${urlPath} loads cleanly`, async ({ page, visit, diagnostics }) => {
            await visit(urlPath, { variant: 'cyberpunk' });
            await expect(page.locator('link[href="/css/cyberpunk.css"]')).toHaveCount(1);
            await expect(page.locator('.column-main')).toBeVisible();
            expect(diagnostics.pageErrors).toEqual([]);
            expect(diagnostics.failedRequests).toEqual([]);
        });
    }

    test('applies the variant colors to the navbar and footer', async ({ page, visit }) => {
        await visit('/', { variant: 'cyberpunk' });
        const background = selector => page.locator(selector).evaluate(el => getComputedStyle(el).backgroundColor);
        const navbar = await background('.navbar-main');
        expect(navbar).not.toBe('rgb(255, 255, 255)');
        expect(await background('body > footer.footer')).toBe(navbar);
    });

    test('keeps the code block controls working', async ({ page, visit, context }) => {
        await context.grantPermissions(['clipboard-read', 'clipboard-write']);
        await visit('/2024/02/20/code-blocks/', { variant: 'cyberpunk' });
        await page.locator('figure.highlight button.copy').first().click();
        expect((await page.evaluate(() => navigator.clipboard.readText())).trim()).toBe('const answer = 42;\nconsole.log(answer);');
    });
});
