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

test.describe('relative article dates', () => {
    // Posted 2024-03-01T10:00Z, updated 2024-03-05T12:00Z
    const url = '/2024/03/01/hello-world/';

    for (const [now, posted, updated] of [
        ['2024-03-08T10:00:00Z', '7 days ago', '3 days ago'],
        ['2024-03-01T10:00:30Z', '30 seconds ago', 'in 4 days'],
        ['2024-03-01T12:00:00Z', '2 hours ago', 'in 4 days'],
        ['2024-05-01T10:00:00Z', '2 months ago', '2 months ago'],
        ['2026-10-04T10:00:00Z', '3 years ago', '3 years ago']
    ]) {
        test(`at ${now}: "${posted}" / "${updated}"`, async ({ page, visit }) => {
            await page.clock.setFixedTime(new Date(now));
            await visit(url);
            const times = page.locator('.article-meta time');
            await expect(times).toHaveText([posted, updated]);
            await expect(times.first()).toHaveAttribute('datetime', /^2024-03-01T10:00:00/);
        });
    }

    test('are written in the page language', async ({ page, visit }) => {
        await page.clock.setFixedTime(new Date('2024-03-08T10:00:00Z'));
        await visit(url, { variant: 'zh-CN' });
        await expect(page.locator('.article-meta time')).toHaveText(['7天前', '3天前']);
    });

    test('keep the server-rendered date when Intl.RelativeTimeFormat is unavailable', async ({ page, visit }) => {
        await page.addInitScript(() => { delete Intl.RelativeTimeFormat; });
        await visit(url);
        await expect(page.locator('.article-meta time').first()).toHaveText('2024-03-01');
    });
});

test('refuses a tampered CDN script (Subresource Integrity)', async ({ page, visit, diagnostics }) => {
    await page.route('https://cdn.jsdelivr.net/npm/jquery@*/**', route => route.fulfill({
        status: 200,
        contentType: 'application/javascript',
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: 'window.__tampered = true;'
    }));
    await visit('/');
    expect(await page.evaluate(() => window.__tampered)).toBeUndefined();
    expect(diagnostics.consoleErrors.join('\n')).toMatch(/integrity/i);
});
