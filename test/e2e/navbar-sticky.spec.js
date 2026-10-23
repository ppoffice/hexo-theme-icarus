const { test, expect, jqueryHandlerCounts } = require('./fixtures');

// navbar.sticky: the navbar stays at the top of the window ("navbar-sticky" at all widths,
// "navbar-sticky-mobile" below the tablet width).
const NARROW = { width: 375, height: 800 };
const WIDE = { width: 1440, height: 900 };
const POST = '/2023/08/01/long-toc/'; // 24 sections

/** The top and bottom of an element in the window. */
function box(page, selector) {
    return page.locator(selector).first().evaluate(el => {
        const rect = el.getBoundingClientRect();
        return { top: rect.top, bottom: rect.bottom };
    });
}

/** Scroll the page instantly and wait for the next frame. */
async function scrollPage(page, y) {
    await page.evaluate(y => new Promise(resolve => {
        window.scrollTo({ top: y, behavior: 'instant' });
        requestAnimationFrame(() => requestAnimationFrame(resolve));
    }), y);
}

/** The top of the element in the window once the page has stopped scrolling. */
async function settledTop(page, selector) {
    let last = null;
    await expect.poll(async () => {
        const { top } = await box(page, selector);
        const settled = last !== null && Math.abs(top - last) < 0.5;
        last = top;
        return settled;
    }, { intervals: [100] }).toBe(true);
    return last;
}

/** The region of the page (navbar, table of contents, its mask, search box or column) painted at a point of the window. */
function regionAt(page, x, y) {
    return page.evaluate(([x, y]) => {
        const el = document.elementFromPoint(x, y);
        const region = el && el.closest('.navbar-main, #toc, #toc-mask, .searchbox, .column');
        if (!region) {
            return null;
        }
        return region.id ? '#' + region.id : '.' + Array.from(region.classList).find(name => /^(navbar-main|searchbox|column-\w+)$/.test(name));
    }, [x, y]);
}

/**
 * Click the middle of an element with the mouse, where it is: locator.click() first scrolls the
 * page to bring the element into view, which it can do for an element in the sticky navbar.
 */
async function clickInPlace(page, selector) {
    const { x, y, width, height } = await page.locator(selector).first().boundingBox();
    await page.mouse.click(x + (width / 2), y + (height / 2));
}

/** Whether the navbar has an opaque background, so that the content does not show through it. */
function navbarIsOpaque(page) {
    return page.locator('.navbar-main').evaluate(el => {
        const color = getComputedStyle(el).backgroundColor;
        const alpha = color.startsWith('rgba') ? parseFloat(color.split(',')[3]) : 1;
        return color !== 'transparent' && alpha === 1;
    });
}

/** Click a link and wait until PJAX has swapped the page in and re-run its scripts. */
async function pjaxClick(page, locator) {
    const done = page.evaluate(() => new Promise(resolve => document.addEventListener('pjax:complete', resolve, { once: true })));
    await locator.click();
    await done;
    await page.waitForLoadState('networkidle');
}

test.describe('sticky navbar on a narrow screen', () => {
    test.beforeEach(async ({ page }) => {
        await page.setViewportSize(NARROW);
    });

    test('stays at the top of the window without moving the content', async ({ page, visit, diagnostics }) => {
        await visit(POST, { variant: 'navbar-sticky' });
        const navbar = await box(page, '.navbar-main');
        const section = await box(page, 'body > .section');
        // It keeps its place in the page: the content starts right below it, as without the option.
        expect(navbar.top).toBe(0);
        expect(Math.abs(section.top - navbar.bottom)).toBeLessThan(1);
        expect(await page.evaluate(() => document.documentElement.style.getPropertyValue('--navbar-height')))
            .toBe(`${navbar.bottom - navbar.top}px`);

        await scrollPage(page, 2000);
        expect(await page.evaluate(() => window.scrollY)).toBe(2000);
        expect(await box(page, '.navbar-main')).toEqual(navbar);
        // Over the content, which does not show through it.
        expect(await regionAt(page, NARROW.width / 2, navbar.bottom / 2)).toBe('.navbar-main');
        expect(await navbarIsOpaque(page)).toBe(true);
        expect(diagnostics.pageErrors).toEqual([]);
        expect(diagnostics.consoleErrors).toEqual([]);
    });

    test('scrolls away with the page without the option', async ({ page, visit }) => {
        await visit(POST);
        await expect(page.locator('.navbar-main')).not.toHaveAttribute('data-sticky');
        await scrollPage(page, 2000);
        expect((await box(page, '.navbar-main')).bottom).toBeLessThan(0);
    });

    test('opens the folded menu below the logo once scrolled', async ({ page, visit }) => {
        await visit(POST, { variant: 'navbar-sticky' });
        await scrollPage(page, 2000);
        // The content below the open menu stays where it was.
        const heading = page.locator('.article .content h2').filter({ hasText: /^Section 9$/ });
        const headingTop = (await heading.boundingBox()).y;
        const toggle = page.locator('.navbar-toggle');
        await clickInPlace(page, '.navbar-toggle');
        await expect(toggle).toHaveAttribute('aria-expanded', 'true');
        expect(await page.evaluate(() => window.scrollY)).toBe(2000);
        expect(Math.abs((await heading.boundingBox()).y - headingTop)).toBeLessThan(1);
        const links = page.locator('#navbar-main-menu > .navbar-item');
        await expect(links).toHaveCount(6);
        const navbar = await box(page, '.navbar-main');
        expect(navbar.top).toBe(0);
        for (const link of await links.all()) {
            await expect(link).toBeVisible();
            const { top, bottom } = await link.evaluate(el => el.getBoundingClientRect().toJSON());
            expect(bottom).toBeLessThanOrEqual(navbar.bottom);
            expect(await regionAt(page, NARROW.width / 2, (top + bottom) / 2)).toBe('.navbar-main');
        }
        // The sub-menu opens in the column, over the page too.
        await clickInPlace(page, '#navbar-main-menu .navbar-link');
        await expect(page.locator('#navbar-main-menu .navbar-dropdown a').first()).toBeVisible();
        expect(Math.abs((await heading.boundingBox()).y - headingTop)).toBeLessThan(1);
        // The height of the closed navbar stays the scroll offset of the anchors.
        const closed = await page.evaluate(() => document.documentElement.style.getPropertyValue('--navbar-height'));
        expect(parseFloat(closed)).toBeLessThan(navbar.bottom);

        await page.keyboard.press('Escape');
        await page.keyboard.press('Escape');
        await expect(toggle).toHaveAttribute('aria-expanded', 'false');
        await expect(page.locator('.navbar-start')).toBeHidden();
        expect(await page.locator('.navbar-main').evaluate(el => el.style.marginBottom)).toBe('');
        expect(Math.abs((await heading.boundingBox()).y - headingTop)).toBeLessThan(1);
        // A link of the menu is followed from the sticky navbar.
        await toggle.click();
        await page.locator('#navbar-main-menu a', { hasText: 'Archives' }).click();
        await expect(page).toHaveURL(/\/archives\/$/);
    });

    test('keeps a folded menu taller than the window within it', async ({ page, visit }) => {
        await page.setViewportSize({ width: NARROW.width, height: 300 });
        await visit(POST, { variant: 'navbar-sticky' });
        await scrollPage(page, 2000);
        await clickInPlace(page, '.navbar-toggle');
        await clickInPlace(page, '#navbar-main-menu .navbar-link');
        await expect(page.locator('#navbar-main-menu .navbar-dropdown a').first()).toBeVisible();
        const navbar = await box(page, '.navbar-main');
        expect(navbar.bottom).toBeLessThanOrEqual(300);
        // The last link scrolls into the window with the menu, not with the page.
        const scrolls = await page.locator('.navbar-main').evaluate(el => {
            const overflows = el.scrollHeight > el.clientHeight;
            el.scrollTop = el.scrollHeight;
            return overflows;
        });
        expect(scrolls).toBe(true);
        const last = page.locator('#navbar-main-menu > .navbar-item').last();
        const { top, bottom } = await last.evaluate(el => el.getBoundingClientRect().toJSON());
        expect(bottom).toBeLessThanOrEqual(300);
        expect(await regionAt(page, NARROW.width / 2, (top + bottom) / 2)).toBe('.navbar-main');
        expect(await page.evaluate(() => window.scrollY)).toBe(2000);
    });

    test('lands the table of contents entries below it, under the drawer and its mask', async ({ page, visit }) => {
        await visit(POST, { variant: 'navbar-sticky' });
        await page.locator('.navbar-main .catalogue').click();
        await expect(page.locator('#toc')).toHaveClass(/is-active/);
        // The mask covers the navbar, and the drawer is above both.
        const navbar = await box(page, '.navbar-main');
        expect(await regionAt(page, 5, navbar.bottom / 2)).toBe('#toc-mask');
        const toc = await box(page, '#toc');
        expect(await regionAt(page, NARROW.width / 2, toc.top + 10)).toBe('#toc');

        await page.locator('#toc a[data-href="#Section-12"]').click();
        await expect(page.locator('#toc')).not.toHaveClass(/is-active/);
        const top = await settledTop(page, '#Section-12');
        expect(top).toBeGreaterThanOrEqual(navbar.bottom - 1);
        expect(top).toBeLessThan(navbar.bottom + 40);
        expect((await box(page, '.navbar-main')).top).toBe(0);
    });

    test('does not scroll the page when its links get the focus', async ({ page, visit }) => {
        await visit(POST, { variant: 'navbar-sticky' });
        await scrollPage(page, 2000);
        await page.keyboard.press('Tab');
        await expect(page.locator('.navbar-logo')).toBeFocused();
        await page.keyboard.press('Tab');
        await expect(page.locator('.navbar-toggle')).toBeFocused();
        // Open the folded menu, go through its links and close it again, giving the focus back.
        await page.keyboard.press('Enter');
        for (let i = 0; i < 6; i++) {
            await page.keyboard.press('Tab');
        }
        await page.keyboard.press('Escape');
        await expect(page.locator('.navbar-toggle')).toBeFocused();
        expect(await page.evaluate(() => window.scrollY)).toBe(2000);
    });

    test('keeps the elements of the page focused with the keyboard out from under it', async ({ page, visit }) => {
        await visit(POST, { variant: 'navbar-sticky' });
        // Two links of the content, the second one under the navbar once the first one is focused.
        await page.evaluate(() => new Promise(resolve => {
            const first = Object.assign(document.createElement('a'), { href: '#first', textContent: 'First' });
            const gap = Object.assign(document.createElement('p'), { style: 'height: 60px' });
            const second = Object.assign(document.createElement('a'), { href: '#second', textContent: 'Second' });
            document.getElementById('Section-12').after(first, gap, second);
            first.focus({ preventScroll: true });
            requestAnimationFrame(() => requestAnimationFrame(() => {
                window.scrollBy({ top: second.getBoundingClientRect().top - 60, behavior: 'instant' });
                requestAnimationFrame(resolve);
            }));
        }));
        const navbar = await box(page, '.navbar-main');
        for (const [key, name] of [['Tab', 'Second'], ['Shift+Tab', 'First']]) {
            const link = page.locator('.article .content a', { hasText: name });
            expect((await link.boundingBox()).y, name).toBeLessThan(navbar.bottom);
            await page.keyboard.press(key);
            await expect(link).toBeFocused();
            await expect.poll(async () => (await link.boundingBox()).y, name).toBeGreaterThanOrEqual(navbar.bottom);
        }
    });

    test('lands the anchor of the URL below it', async ({ page, visit }) => {
        await visit(POST + '#Section-12', { variant: 'navbar-sticky' });
        const navbar = await box(page, '.navbar-main');
        const top = await settledTop(page, '#Section-12');
        expect(top).toBeGreaterThanOrEqual(navbar.bottom - 1);
        expect(top).toBeLessThan(navbar.bottom + 40);
    });

    test('stays under the search box', async ({ page, visit }) => {
        await visit(POST, { variant: 'navbar-sticky' });
        await scrollPage(page, 2000);
        await page.locator('.navbar-main .search').click();
        await expect(page.locator('.searchbox')).toHaveClass(/show/);
        const navbar = await box(page, '.navbar-main');
        expect(await regionAt(page, 2, navbar.bottom / 2)).toBe('.searchbox');
    });

    test('goes back to the top with the back-to-top button', async ({ page, visit }) => {
        await visit(POST, { variant: 'navbar-sticky' });
        // On mobile screens, it shows while scrolling up.
        await scrollPage(page, 3000);
        await scrollPage(page, 2900);
        const button = page.locator('#back-to-top');
        await expect(button).toHaveClass(/rise-up/);
        await expect(button).toBeInViewport();
        // It rises into the window with a transition, from below its bottom.
        await expect.poll(async () => (await box(page, '#back-to-top')).bottom).toBeLessThanOrEqual(NARROW.height);
        await button.click();
        await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
        expect((await box(page, '.navbar-main')).top).toBe(0);
    });

    test('stays at the top in the cyberpunk variant and the dark appearance', async ({ page, visit }) => {
        for (const post of ['/2024/04/08/sticky-cyberpunk/', '/2024/04/09/sticky-dark/']) {
            await visit(post, { variant: 'navbar-sticky' });
            await page.evaluate(() => { document.querySelector('.article .content').style.minHeight = '3000px'; });
            await scrollPage(page, 1000);
            const navbar = await box(page, '.navbar-main');
            expect(navbar.top, post).toBe(0);
            expect(await regionAt(page, NARROW.width / 2, navbar.bottom / 2), post).toBe('.navbar-main');
            expect(await navbarIsOpaque(page), post).toBe(true);
            await page.locator('.navbar-toggle').click();
            await expect(page.locator('#navbar-main-menu a', { hasText: 'Archives' }), post).toBeVisible();
            expect((await box(page, '#navbar-main-menu > .navbar-item:last-child')).bottom, post)
                .toBeLessThanOrEqual((await box(page, '.navbar-main')).bottom);
        }
    });

    test('also sticks with the mobile-only option', async ({ page, visit }) => {
        await visit(POST, { variant: 'navbar-sticky-mobile' });
        await expect(page.locator('.navbar-main')).toHaveAttribute('data-sticky', 'mobile');
        await scrollPage(page, 2000);
        expect((await box(page, '.navbar-main')).top).toBe(0);
        await page.locator('.navbar-main .catalogue').click();
        await page.locator('#toc a[data-href="#Section-12"]').click();
        const navbar = await box(page, '.navbar-main');
        const top = await settledTop(page, '#Section-12');
        expect(top).toBeGreaterThanOrEqual(navbar.bottom - 1);
        expect(top).toBeLessThan(navbar.bottom + 40);
    });
});

test.describe('sticky navbar on a wide screen', () => {
    test.beforeEach(async ({ page }) => {
        await page.setViewportSize(WIDE);
    });

    test('stays at the top above the sticky column, which sticks below it', async ({ page, visit }) => {
        await visit(POST, { variant: 'navbar-sticky' });
        await scrollPage(page, 3000);
        const navbar = await box(page, '.navbar-main');
        expect(navbar.top).toBe(0);
        // The right column of the fixture is sticky (sidebar.right.sticky).
        const column = await box(page, '.column-right');
        expect(column.top).toBeGreaterThanOrEqual(navbar.bottom);
        expect(column.top).toBeLessThan(navbar.bottom + 20);
        expect(await regionAt(page, WIDE.width - 200, navbar.bottom / 2)).toBe('.navbar-main');
    });

    test('opens the sub-menu drop-down over the page once scrolled', async ({ page, visit }) => {
        await visit(POST, { variant: 'navbar-sticky' });
        await scrollPage(page, 3000);
        await page.locator('.navbar-main .navbar-link').click();
        const links = page.locator('.navbar-main .navbar-dropdown a');
        await expect(links.first()).toBeVisible();
        for (const link of await links.all()) {
            const { left, top, width, height } = await link.evaluate(el => el.getBoundingClientRect().toJSON());
            expect(await regionAt(page, left + (width / 2), top + (height / 2))).toBe('.navbar-main');
        }
        await page.keyboard.press('Escape');
        await expect(links.first()).toBeHidden();
    });

    test('lands the table of contents entries below it', async ({ page, visit }) => {
        await visit(POST, { variant: 'navbar-sticky' });
        await page.locator('#toc a[data-href="#Section-12"]').click();
        const navbar = await box(page, '.navbar-main');
        const top = await settledTop(page, '#Section-12');
        expect(top).toBeGreaterThanOrEqual(navbar.bottom - 1);
        expect(top).toBeLessThan(navbar.bottom + 40);
    });

    test('scrolls away with the mobile-only option', async ({ page, visit }) => {
        await visit(POST, { variant: 'navbar-sticky-mobile' });
        await scrollPage(page, 2000);
        expect((await box(page, '.navbar-main')).bottom).toBeLessThan(0);
        // The sticky column keeps its usual offset.
        expect((await box(page, '.column-right')).top).toBeLessThan(20);
    });
});

test.describe('sticky navbar with PJAX', () => {
    test('follows the option, the appearance and the variant of each page', async ({ page, visit, diagnostics }) => {
        await page.setViewportSize(NARROW);
        await visit('/2024/04/09/sticky-dark/', { variant: 'navbar-sticky' });
        await page.evaluate(() => { window.__noFullReload = true; });
        const before = await jqueryHandlerCounts(page, 'document');
        const content = page.locator('.article .content');
        const navbar = page.locator('.navbar-main');
        await expect(navbar).toHaveAttribute('data-sticky', 'all');

        // A cyberpunk page with the sticky navbar
        await pjaxClick(page, content.getByRole('link', { name: 'cyberpunk', exact: true }));
        await expect(navbar).toHaveAttribute('data-sticky', 'all');
        await page.evaluate(() => { document.querySelector('.article .content').style.minHeight = '3000px'; });
        await scrollPage(page, 1000);
        expect((await box(page, '.navbar-main')).top).toBe(0);
        expect(await navbarIsOpaque(page)).toBe(true);
        await page.locator('.navbar-toggle').click();
        await expect(page.locator('.navbar-toggle')).toHaveAttribute('aria-expanded', 'true');
        await page.locator('.navbar-toggle').click();
        await expect(page.locator('.navbar-toggle')).toHaveAttribute('aria-expanded', 'false');
        await scrollPage(page, 0);

        // A page whose navbar scrolls away
        await pjaxClick(page, content.getByRole('link', { name: 'off', exact: true }));
        await expect(navbar).not.toHaveAttribute('data-sticky');
        await page.evaluate(() => { document.querySelector('.article .content').style.minHeight = '3000px'; });
        await scrollPage(page, 1000);
        expect((await box(page, '.navbar-main')).bottom).toBeLessThan(0);
        await scrollPage(page, 0);

        // An anchor of another page, whose navbar is sticky again, lands below the navbar.
        await pjaxClick(page, content.getByRole('link', { name: 'section 12 of the long post' }));
        const bar = await box(page, '.navbar-main');
        const top = await settledTop(page, '#Section-12');
        expect(bar.top).toBe(0);
        expect(top).toBeGreaterThanOrEqual(bar.bottom - 1);
        expect(top).toBeLessThan(bar.bottom + 40);

        // The table of contents of the new page also lands below it.
        await page.locator('.navbar-main .catalogue').click();
        await page.locator('#toc a[data-href="#Section-3"]').click();
        const tocTop = await settledTop(page, '#Section-3');
        expect(tocTop).toBeGreaterThanOrEqual(bar.bottom - 1);
        expect(tocTop).toBeLessThan(bar.bottom + 40);

        expect(await page.evaluate(() => window.__noFullReload)).toBe(true);
        expect(await jqueryHandlerCounts(page, 'document')).toEqual(before);
        expect(diagnostics.pageErrors).toEqual([]);
    });
});

test.describe('sticky navbar without JavaScript', () => {
    test.use({ javaScriptEnabled: false });

    for (const viewport of [NARROW, WIDE]) {
        test(`lands the anchor of the URL below it at ${viewport.width}px`, async ({ page, visit }) => {
            await page.setViewportSize(viewport);
            await visit(POST + '#Section-12', { variant: 'navbar-sticky' });
            const navbar = await box(page, '.navbar-main');
            const top = await settledTop(page, '#Section-12');
            expect(navbar.top).toBe(0);
            expect(top).toBeGreaterThanOrEqual(navbar.bottom - 1);
            expect(top).toBeLessThan(navbar.bottom + 40);
        });
    }
});
