const { test, expect, knownBug } = require('./fixtures');

test.describe('images and tables', () => {
    test.beforeEach(async ({ visit }) => {
        await visit('/2024/02/10/images-and-tables/');
    });

    test('content images become gallery links with a caption from the alt text', async ({ page }) => {
        const image = page.locator('.article img[alt="Fixture avatar"]');
        const link = page.locator('.article a.gallery-item:has(img[alt="Fixture avatar"])');
        await expect(link).toHaveAttribute('href', '/img/avatar.png');
        await expect(image.locator('xpath=following-sibling::p[contains(@class, "caption")]')).toHaveText('Fixture avatar');
    });

    test('images that are already links are not wrapped again', async ({ page }) => {
        const image = page.locator('.article img[alt="Linked image"]');
        await expect(image.locator('xpath=..')).toHaveAttribute('href', 'https://example.com/');
        await expect(image.locator('xpath=..')).not.toHaveClass(/gallery-item/);
    });

    test('images with .not-gallery-item are left alone', async ({ page }) => {
        await expect(page.locator('.article a.gallery-item:has(img.not-gallery-item)')).toHaveCount(0);
    });

    test('wide tables get a horizontal scroll wrapper, narrow ones do not', async ({ page }) => {
        const tables = page.locator('.article > .content table');
        await expect(tables).toHaveCount(2);
        await expect(page.locator('.table-overflow table')).toHaveCount(1);
        await expect(page.locator('.table-overflow table th').first()).toHaveText('Column one');
    });
});

test.describe('[known bug] image alt text', () => {
    test('is shown as text in captions, never parsed as HTML', async ({ page, visit }) => {
        knownBug('main.js concatenates this.alt into an HTML string');
        await visit('/2023/10/01/image-alt-html/');
        const captions = page.locator('.article p.caption');
        await expect(captions).toHaveText(['<img src=x onerror=window.__icarusInjected=1>', 'a < b & "c"']);
        expect(await page.evaluate(() => window.__icarusInjected)).toBeUndefined();
    });
});
