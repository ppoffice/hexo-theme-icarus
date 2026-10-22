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

    // The variant can be set per page in the front-matter
    test('PJAX switches the variant stylesheets from page to page without reloading', async ({ page, visit, diagnostics }) => {
        const CYBERPUNK_POST = '/2024/04/03/cyberpunk-variant/';
        const DEFAULT_POST = '/2024/03/01/hello-world/';
        // The theme stylesheet, and the first font family of the web font stylesheet
        const stylesheets = () => page.evaluate(() => Array.from(document.querySelectorAll('link[rel="stylesheet"]'), link => link.getAttribute('href'))
            .filter(href => href.startsWith('/css/') || href.includes('family='))
            .map(href => {
                const family = href.match(/family=(\w+)/);
                return family ? family[1] : href;
            }));
        const navbar = () => page.locator('.navbar-main').evaluate(el => getComputedStyle(el).backgroundColor);
        const pjaxClick = async locator => {
            const done = page.evaluate(() => new Promise(resolve => document.addEventListener('pjax:complete', resolve, { once: true })));
            await locator.click();
            await done;
            await page.waitForLoadState('networkidle');
        };

        await visit('/', { variant: 'variant-per-page' });
        await page.evaluate(() => { window.notReloaded = true; });
        expect(await stylesheets()).toEqual(['Ubuntu', '/css/default.css']);
        const defaultNavbar = await navbar();

        await pjaxClick(page.locator(`.column-main a[href="${CYBERPUNK_POST}"]`).first());
        expect(await stylesheets()).toEqual(['Oxanium', '/css/cyberpunk.css']);
        await expect.poll(navbar).not.toBe(defaultNavbar);

        await pjaxClick(page.locator(`.content a[href="${DEFAULT_POST}"]`));
        expect(await stylesheets()).toEqual(['Ubuntu', '/css/default.css']);
        await expect.poll(navbar).toBe(defaultNavbar);

        expect(await page.evaluate(() => window.notReloaded)).toBe(true);
        expect(diagnostics.pageErrors).toEqual([]);
        expect(diagnostics.consoleErrors).toEqual([]);
        expect(diagnostics.failedRequests).toEqual([]);
    });

    test('keeps the code block controls working', async ({ page, visit, context }) => {
        await context.grantPermissions(['clipboard-read', 'clipboard-write']);
        await visit('/2024/02/20/code-blocks/', { variant: 'cyberpunk' });
        await page.locator('figure.highlight button.copy').first().click();
        expect((await page.evaluate(() => navigator.clipboard.readText())).trim()).toBe('const answer = 42;\nconsole.log(answer);');
    });
});
