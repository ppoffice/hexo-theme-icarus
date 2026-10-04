const { test, expect } = require('./fixtures');

test.describe('responsive columns', () => {
    test('widescreen shows both sidebars', async ({ page, visit }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await visit('/');
        await expect(page.locator('.column-left')).toBeVisible();
        await expect(page.locator('.column-right')).toBeVisible();
        await expect(page.locator('.column-right-shadow')).toBeHidden();
        const [left, main, right] = await Promise.all(['.column-left', '.column-main', '.column-right']
            .map(selector => page.locator(selector).boundingBox()));
        expect(left.x).toBeLessThan(main.x);
        expect(main.x + main.width).toBeLessThanOrEqual(right.x + 1);
    });

    test('desktop moves the right sidebar widgets below the left sidebar', async ({ page, visit }) => {
        await page.setViewportSize({ width: 1100, height: 900 });
        await visit('/');
        await expect(page.locator('.column-right')).toBeHidden();
        const shadow = page.locator('.column-left .column-right-shadow');
        await expect(shadow).toBeVisible();
        await expect(shadow.locator('.widget')).toHaveCount(await page.locator('.column-right .widget').count());
    });

    test('mobile stacks the main column above the sidebars', async ({ page, visit }) => {
        await page.setViewportSize({ width: 375, height: 800 });
        await visit('/');
        const [main, left] = await Promise.all(['.column-main', '.column-left'].map(selector => page.locator(selector).boundingBox()));
        expect(main.y).toBeLessThan(left.y);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    });
});

test.describe('table of contents', () => {
    test('links to the headings of the post and scrolls to them', async ({ page, visit }) => {
        await page.setViewportSize({ width: 1440, height: 500 });
        await visit('/2024/03/01/hello-world/');
        // toc.js moves the target into data-href and scrolls smoothly on click.
        const links = page.locator('#toc .menu-list a[data-href]');
        await expect(links).toHaveCount(3); // First Section, Nested Heading, Second Section
        const targets = await links.evaluateAll(anchors => anchors.map(a => a.dataset.href));
        for (const href of targets) {
            await expect(page.locator(href)).toHaveCount(1);
        }
        await page.locator('#toc a[data-href="#Second-Section"]').click();
        await expect.poll(() => page.locator('#Second-Section').evaluate(el => Math.round(el.getBoundingClientRect().top))).toBeLessThan(100);
        await expect(page.locator('#toc a[data-href="#Second-Section"]')).toHaveClass(/is-active/);
    });

    test('opens as an overlay from the navbar on mobile and closes from the mask', async ({ page, visit }) => {
        await page.setViewportSize({ width: 375, height: 800 });
        await visit('/2024/03/01/hello-world/');
        await page.locator('.navbar-main .catalogue').click();
        await expect(page.locator('#toc')).toHaveClass(/is-active/);
        await expect(page.locator('#toc-mask')).toHaveClass(/is-active/);
        await page.locator('#toc-mask').click({ position: { x: 5, y: 5 } });
        await expect(page.locator('#toc')).not.toHaveClass(/is-active/);
    });
});

test.describe('back to top button', () => {
    test('appears after scrolling on desktop and scrolls back up', async ({ page, visit }) => {
        await page.setViewportSize({ width: 1440, height: 600 });
        await visit('/');
        const button = page.locator('#back-to-top');
        await expect(button).not.toHaveClass(/fade-in/);
        await page.mouse.wheel(0, 2500);
        await expect(button).toHaveClass(/fade-in/);
        await button.click();
        await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    });

    test('shows when scrolling up on mobile', async ({ page, visit }) => {
        await page.setViewportSize({ width: 375, height: 700 });
        await visit('/');
        const button = page.locator('#back-to-top');
        await page.evaluate(() => window.scrollTo(0, 1500));
        await expect(button).not.toHaveClass(/rise-up/);
        await page.evaluate(() => window.scrollTo(0, 1000));
        await expect(button).toHaveClass(/rise-up/);
    });
});

test.describe('search', () => {
    test('opens the search box and finds posts by title', async ({ page, visit }) => {
        await visit('/');
        await page.locator('.navbar-main .search').click();
        await expect(page.locator('.searchbox')).toHaveClass(/show/);
        await page.locator('.searchbox-input').fill('Code');
        await expect(page.locator('.searchbox-body a[href="/2024/02/20/code-blocks/"]').first()).toBeVisible();
        await expect(page.locator('.searchbox-body a[href="/about/"]')).toHaveCount(0);
        await page.locator('.searchbox-close').click();
        await expect(page.locator('.searchbox')).not.toHaveClass(/show/);
    });
});
