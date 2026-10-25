const { test, expect } = require('./fixtures');

for (const variant of ['default', 'appearance-dark', 'appearance-auto', 'm3e']) {
    test(`article reading progress follows scroll (${variant})`, async ({ page, visit }) => {
        await page.emulateMedia({ colorScheme: 'dark' });
        await visit('/2023/07/01/typography/', { variant });
        const progress = () => page.locator('body').evaluate(el => {
            const style = getComputedStyle(el, '::after');
            return { scale: new DOMMatrixReadOnly(style.transform).a, height: style.height,
                color: style.backgroundColor, position: style.position };
        });
        await page.evaluate(() => scrollTo(0, 0));
        await expect.poll(async () => (await progress()).scale).toBe(0);
        await page.evaluate(() => scrollTo(0, (document.documentElement.scrollHeight - innerHeight) / 2));
        await expect.poll(async () => Math.abs((await progress()).scale - .5)).toBeLessThan(.02);
        await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
        await expect.poll(async () => (await progress()).scale).toBe(1);
        expect(await progress()).toMatchObject({ height: '3px', position: 'fixed' });
        if (variant !== 'm3e') expect((await progress()).color).toBe('rgb(50, 115, 220)');
        await visit('/', { variant });
        expect(await page.locator('body').evaluate(el => getComputedStyle(el, '::after').content)).toBe('none');
    });
}
