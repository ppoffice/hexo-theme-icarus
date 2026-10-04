const { test, expect, knownBug } = require('./fixtures');

const opacity = (page, selector) => page.locator(selector).first().evaluate(el => getComputedStyle(el).opacity);

test.describe('animejs plugin', () => {
    test('fades the page in after loading', async ({ page, visit, diagnostics }) => {
        await visit('/', { variant: 'animejs' });
        for (const selector of ['body > .navbar', 'body > .section', 'body > .footer', '.column-main > .card']) {
            await expect.poll(() => opacity(page, selector), selector).toBe('1');
        }
        await expect.poll(() => page.locator('.column-main > .card').first().evaluate(el => el.style.transform)).toBe('');
        expect(diagnostics.pageErrors).toEqual([]);
    });

    test('scrolls to the URL hash target after the animation', async ({ page, visit }) => {
        await page.setViewportSize({ width: 1440, height: 500 });
        await visit('/2024/03/01/hello-world/#Second-Section', { variant: 'animejs' });
        await expect.poll(() => page.locator('#Second-Section').evaluate(el => Math.round(el.getBoundingClientRect().top)), { timeout: 10000 })
            .toBeLessThan(100);
    });

    test('[known bug] content stays visible when animation.js cannot run', async ({ page, visit }) => {
        knownBug('a <style> in <head> hides the page until animation.js reveals it');
        await page.route('**/js/animation.js', route => route.abort());
        await visit('/', { variant: 'animejs' });
        await page.waitForTimeout(500);
        expect(await opacity(page, 'body > .section')).toBe('1');
    });
});
