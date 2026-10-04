const { test, expect } = require('./fixtures');

const PAGES = [
    '/',
    '/page/2/',
    '/archives/',
    '/archives/2024/03/',
    '/categories/',
    '/categories/Guides/Hexo/',
    '/tags/',
    '/tags/hexo/',
    '/about/',
    '/2024/03/01/hello-world/',
    '/2024/02/20/code-blocks/',
    '/2024/02/10/images-and-tables/',
    '/2024/01/20/word-count-zh/'
];

test.describe('every page loads cleanly', () => {
    for (const urlPath of PAGES) {
        test(urlPath, async ({ page, visit, diagnostics }) => {
            await visit(urlPath);
            await expect(page.locator('body > .navbar-main')).toBeVisible();
            await expect(page.locator('.column-main')).toBeVisible();
            await expect(page.locator('body > footer.footer')).toBeVisible();
            expect(diagnostics.pageErrors, 'uncaught exceptions').toEqual([]);
            expect(diagnostics.failedRequests, 'failed requests').toEqual([]);
            expect(diagnostics.consoleErrors, 'console errors').toEqual([]);
        });
    }
});

test('replaces article dates with relative times', async ({ page, visit }) => {
    await visit('/2024/03/01/hello-world/');
    const times = page.locator('.article-meta time');
    await expect(times).toHaveCount(2);
    await expect(times.first()).toHaveText(/ ago$/);
    await expect(times.first()).toHaveAttribute('datetime', /^2024-03-01T10:00:00/);
});
