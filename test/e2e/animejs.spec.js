const { test, expect } = require('./fixtures');

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

    test('content stays visible when animation.js cannot be loaded', async ({ page, visit }) => {
        await page.route('**/js/animation.js', route => route.abort());
        await visit('/', { variant: 'animejs' });
        await expect.poll(() => opacity(page, 'body > .section')).toBe('1');
        expect(await opacity(page, 'body > .navbar')).toBe('1');
    });

    test('does not animate for visitors who prefer reduced motion', async ({ page, visit }) => {
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await visit('/', { variant: 'animejs' });
        expect(await page.evaluate(() => document.documentElement.classList.contains('is-animating'))).toBe(false);
        expect(await opacity(page, 'body > .section')).toBe('1');
        expect(await page.locator('.column-main > .card').first().evaluate(el => el.style.transform)).toBe('');
    });

    test('removes the hiding class once the page is revealed', async ({ page, visit }) => {
        await visit('/', { variant: 'animejs' });
        await expect.poll(() => page.evaluate(() => document.documentElement.classList.contains('is-animating'))).toBe(false);
    });
});

test.describe('animejs plugin without JavaScript', () => {
    test.use({ javaScriptEnabled: false });

    test('shows the page', async ({ page, visit }) => {
        await visit('/', { variant: 'animejs' });
        expect(await opacity(page, 'body > .section')).toBe('1');
        expect(await opacity(page, 'body > .navbar')).toBe('1');
    });
});
