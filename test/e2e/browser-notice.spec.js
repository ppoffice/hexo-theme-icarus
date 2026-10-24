const { test, expect } = require('./fixtures');

const M3E = '/2024/06/01/browser-m3e/';
const OFF = '/2024/06/02/browser-off/';

async function missingFeature(page, property, value) {
    await page.addInitScript(({ property, value }) => {
        const supports = CSS.supports.bind(CSS);
        CSS.supports = function(name, input) {
            return name === property && input === value ? false : supports.apply(CSS, arguments);
        };
    }, { property, value });
}

test('supported browsers keep a single hidden notice before the navbar', async ({ page, visit }) => {
    await visit('/', { variant: 'browser-notice' });
    await expect(page.locator('#outdated')).toHaveCount(1);
    await expect(page.locator('#outdated')).toBeHidden();
    expect(await page.locator('body > :first-child').getAttribute('id')).toBe('browser-notice');
});

for (const width of [375, 1440]) {
    test(`unsupported browsers see the notice first and can dismiss it (${width}px)`, async ({ page, visit }) => {
        await page.setViewportSize({ width, height: 900 });
        await missingFeature(page, 'display', 'flex');
        await visit('/', { variant: 'browser-notice' });
        const notice = page.locator('#outdated');
        await expect(notice).toBeVisible();
        const box = await notice.boundingBox();
        expect(box.y).toBe(0);
        expect((await page.locator('.navbar-main').boundingBox()).y).toBeGreaterThanOrEqual(box.y + box.height);
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
        await notice.getByRole('button', { name: 'Dismiss' }).click();
        await expect(notice).toBeHidden();
        expect((await page.locator('.navbar-main').boundingBox()).y).toBe(0);
    });
}

for (const [property, value] of [
    ['color', 'oklch(0.5 0.17 285)'],
    ['color', 'color-mix(in oklab, black, white)'],
    ['selector(:where(*))', undefined]
]) {
    test(`PJAX updates the top notice for ${value || property} and per-page disabling`, async ({ page, visit, diagnostics }) => {
        await missingFeature(page, property, value);
        await visit('/', { variant: 'browser-notice' });
        await expect(page.locator('#outdated')).toBeHidden();
        await page.evaluate(() => { window.__noticeDocument = true; });
        await page.locator(`.column-main a[href="${M3E}"]`).first().click();
        await expect(page).toHaveURL(new RegExp(M3E));
        await expect(page.locator('#outdated')).toBeVisible();
        await expect(page.locator('#outdated')).toHaveCount(1);
        expect((await page.locator('#outdated').boundingBox()).y).toBe(0);
        await page.locator(`.article .content a[href="${OFF}"]`).click();
        await expect(page).toHaveURL(new RegExp(OFF));
        await expect(page.locator('#outdated')).toHaveCount(0);
        await page.goBack();
        await expect(page.locator('#outdated')).toBeVisible();
        expect(await page.evaluate(() => window.__noticeDocument)).toBe(true);
        expect(diagnostics.pageErrors).toEqual([]);
    });
}

test('declaration and selector parsing work without CSS.supports', async ({ page, visit }) => {
    await page.addInitScript(() => { CSS.supports = undefined; });
    await visit(M3E, { variant: 'browser-notice' });
    await expect(page.locator('#outdated')).toHaveCount(1);
    await expect(page.locator('#outdated')).toBeHidden();
});
