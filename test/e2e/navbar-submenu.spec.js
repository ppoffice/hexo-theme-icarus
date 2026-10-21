const { test, expect, jqueryHandlerCounts } = require('./fixtures');

// The fixture menu has a "Posts" sub-menu (Hello World, Code Blocks) between Tags and About.
const NARROW = { width: 375, height: 800 };
const WIDE = { width: 1440, height: 900 };
const HELLO = /\/2024\/03\/01\/hello-world\/$/;

const button = page => page.locator('.navbar-start .navbar-link', { hasText: 'Posts' });
const dropdown = page => page.locator('#navbar-main-menu-4');
const subLink = (page, name) => dropdown(page).locator('a', { hasText: name });

/** Whether the navbar scrolls horizontally. */
function navbarScrolls(page) {
    return page.locator('.navbar-main').evaluate(navbar => Array.from(navbar.querySelectorAll('.navbar-container, .navbar-menu'))
        .some(el => el.scrollWidth > el.clientWidth + 1));
}

/** Let the resize observer and font loading refit the navbar. */
function frames(page, count = 3) {
    return page.evaluate(count => new Promise(resolve => {
        (function next(n) {
            n > 0 ? requestAnimationFrame(() => next(n - 1)) : resolve();
        }(count));
    }), count);
}

/** Click a link and wait until PJAX has swapped the page in and re-run its scripts. */
async function pjaxClick(page, locator) {
    const done = page.evaluate(() => new Promise(resolve => document.addEventListener('pjax:complete', resolve, { once: true })));
    await locator.click();
    await done;
    await page.waitForLoadState('networkidle');
}

/** Left edge of the element's text: its box plus its left padding and border. */
function textStart(locator) {
    return locator.evaluate(el => {
        const style = getComputedStyle(el);
        return el.getBoundingClientRect().left + parseFloat(style.paddingLeft) + parseFloat(style.borderLeftWidth);
    });
}

const fontSize = locator => locator.evaluate(el => getComputedStyle(el).fontSize);
const background = locator => locator.evaluate(el => getComputedStyle(el).backgroundColor);

/** Whether every corner of the element is the topmost element at that point, inside the window. */
function fullyVisible(locator) {
    return locator.evaluate(el => {
        const rect = el.getBoundingClientRect();
        // Inset, past rounded corners.
        const points = [[rect.left + 8, rect.top + 8], [rect.right - 8, rect.top + 8], [rect.left + 8, rect.bottom - 8], [rect.right - 8, rect.bottom - 8]];
        return rect.width > 0 && rect.left >= 0 && rect.right <= document.documentElement.clientWidth
            && points.every(([x, y]) => el.contains(document.elementFromPoint(x, y)));
    });
}

test.describe('navbar sub-menu on a wide screen', () => {
    test.beforeEach(async ({ page, visit }) => {
        await page.setViewportSize(WIDE);
        await visit('/');
        await frames(page);
    });

    test('opens and closes a drop-down below its button', async ({ page, diagnostics }) => {
        await expect(page.locator('.navbar-main')).not.toHaveClass(/is-collapsed/);
        await expect(button(page)).toHaveAttribute('aria-expanded', 'false');
        await expect(button(page)).toHaveAttribute('aria-controls', 'navbar-main-menu-4');
        await expect(dropdown(page)).toBeHidden();

        await button(page).click();
        await expect(button(page)).toHaveAttribute('aria-expanded', 'true');
        await expect(subLink(page, 'Hello World')).toBeVisible();
        await expect(subLink(page, 'Code Blocks')).toBeVisible();
        // Not clipped by the navbar, above the page content, aligned under the button.
        expect(await fullyVisible(dropdown(page))).toBe(true);
        for (const name of ['Hello World', 'Code Blocks']) {
            expect(await fullyVisible(subLink(page, name)), name).toBe(true);
        }
        const [panel, navbar, main] = await Promise.all(['#navbar-main-menu-4', '.navbar-container', '.column-main']
            .map(selector => page.locator(selector).first().boundingBox()));
        expect(panel.y - (navbar.y + navbar.height)).toBeGreaterThanOrEqual(0);
        expect(panel.y - (navbar.y + navbar.height)).toBeLessThan(8);
        expect(panel.y + panel.height).toBeGreaterThan(main.y);
        // Its link names start where the button name does, in the same font size.
        const [buttonText, linkText] = await Promise.all([button(page), subLink(page, 'Hello World')].map(textStart));
        expect(Math.abs(buttonText - linkText)).toBeLessThan(1);
        expect(await fontSize(subLink(page, 'Hello World'))).toBe(await fontSize(page.locator('.navbar-start > a').first()));
        // The open button keeps the look of the other links: no background.
        await page.mouse.move(5, WIDE.height - 5);
        expect(await background(button(page))).toBe('rgba(0, 0, 0, 0)');
        // Opening it neither folds nor scrolls the menu.
        await frames(page);
        await expect(page.locator('.navbar-main')).not.toHaveClass(/is-collapsed/);
        expect(await navbarScrolls(page)).toBe(false);

        // Closed with its button, although the mouse is still over it.
        await button(page).click();
        await expect(button(page)).toHaveAttribute('aria-expanded', 'false');
        await expect(dropdown(page)).toBeHidden();
        expect(diagnostics.pageErrors).toEqual([]);
        expect(diagnostics.consoleErrors).toEqual([]);
    });

    test('works from the keyboard and closes on Escape', async ({ page }) => {
        await button(page).focus();
        await page.keyboard.press('Enter');
        await expect(button(page)).toHaveAttribute('aria-expanded', 'true');
        // Its links come right after the button in the tab order.
        await page.keyboard.press('Tab');
        await expect(subLink(page, 'Hello World')).toBeFocused();
        await page.keyboard.press('Escape');
        await expect(button(page)).toHaveAttribute('aria-expanded', 'false');
        await expect(dropdown(page)).toBeHidden();
        await expect(button(page)).toBeFocused();
        await page.keyboard.press('Space');
        await expect(button(page)).toHaveAttribute('aria-expanded', 'true');
        await page.keyboard.press('Space');
        await expect(button(page)).toHaveAttribute('aria-expanded', 'false');

        // Tabbing out of it closes it.
        await page.keyboard.press('Enter');
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');
        await expect(page.locator('.navbar-start > a', { hasText: 'About' })).toBeFocused();
        await expect(button(page)).toHaveAttribute('aria-expanded', 'false');
        await expect(dropdown(page)).toBeHidden();
    });

    test('closes on a click outside of it', async ({ page }) => {
        await button(page).click();
        await page.locator('.column-main').click({ position: { x: 5, y: 5 } });
        await expect(button(page)).toHaveAttribute('aria-expanded', 'false');
        await expect(dropdown(page)).toBeHidden();
    });

    test('follows a link of the drop-down and marks the sub-menu active', async ({ page }) => {
        await button(page).click();
        await subLink(page, 'Hello World').click();
        await expect(page).toHaveURL(HELLO);
        await expect(button(page)).toHaveAttribute('aria-expanded', 'false');
        await expect(dropdown(page)).toBeHidden();
        await expect(button(page)).toHaveClass(/is-active/);
        await expect(page.locator('.navbar-start .is-active')).toHaveCount(2);
        await button(page).click();
        await expect(dropdown(page).locator('.navbar-item.is-active')).toHaveText('Hello World');
    });

    test('opens one drop-down at a time', async ({ page }) => {
        // A second sub-menu, as configured with another object value.
        await page.locator('.has-dropdown').evaluate(group => {
            const copy = group.cloneNode(true);
            copy.querySelector('.navbar-link').textContent = 'More';
            copy.querySelector('.navbar-link').setAttribute('aria-controls', 'navbar-main-menu-9');
            copy.querySelector('.navbar-dropdown').id = 'navbar-main-menu-9';
            group.after(copy);
        });
        const more = page.locator('.navbar-link', { hasText: 'More' });
        await button(page).click();
        await more.click();
        await expect(more).toHaveAttribute('aria-expanded', 'true');
        await expect(button(page)).toHaveAttribute('aria-expanded', 'false');
        await expect(page.locator('#navbar-main-menu-9')).toBeVisible();
        await expect(dropdown(page)).toBeHidden();
        // Hovering the other one closes it too.
        await button(page).hover();
        await expect(more).toHaveAttribute('aria-expanded', 'false');
        await expect(page.locator('#navbar-main-menu-9')).toBeHidden();
        await expect(dropdown(page)).toBeVisible();
    });

    test('opens on hover with a mouse', async ({ page }) => {
        await button(page).hover();
        await expect(dropdown(page)).toBeVisible();
        await expect(button(page)).toHaveAttribute('aria-expanded', 'false');
        // From the button down to its links, across the gap between them.
        const [from, to] = await Promise.all([button(page).boundingBox(), subLink(page, 'Hello World').boundingBox()]);
        await page.mouse.move(from.x + 10, from.y + (from.height / 2));
        await page.mouse.move(from.x + 10, to.y + (to.height / 2), { steps: 40 });
        await expect(dropdown(page)).toBeVisible();
        await subLink(page, 'Code Blocks').hover();
        await expect(dropdown(page)).toBeVisible();
        expect(await fullyVisible(dropdown(page))).toBe(true);
        await page.mouse.move(5, WIDE.height - 5);
        await expect(dropdown(page)).toBeHidden();
        // Escape hides it while hovered.
        await button(page).hover();
        await expect(dropdown(page)).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(dropdown(page)).toBeHidden();
    });

    test('stays within the window with long link names', async ({ page }) => {
        await subLink(page, 'Code Blocks').evaluate(el => { el.textContent = 'A sub-menu link with a very long name '.repeat(8); });
        await button(page).click();
        await expect(dropdown(page)).toBeVisible();
        expect(await fullyVisible(dropdown(page))).toBe(true);
        const box = await dropdown(page).boundingBox();
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(WIDE.width);
        // The long name wraps.
        const [short, long] = await Promise.all(['Hello World', 'A sub-menu'].map(name => subLink(page, name).boundingBox()));
        expect(long.height).toBeGreaterThan(short.height * 1.5);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    });

    test('is not counted when fitting the menu', async ({ page }) => {
        await button(page).click();
        // A drop-down far wider than the navbar, then a refit: the menu stays unfolded.
        await page.addStyleTag({ content: '.navbar-main .navbar-dropdown { margin-left: 3000px; }' });
        // (narrower container: the resize observer refits)
        await page.setViewportSize({ width: 1200, height: WIDE.height });
        await frames(page, 5);
        await expect(page.locator('.navbar-main')).not.toHaveClass(/is-collapsed/);
        await expect(button(page)).toHaveAttribute('aria-expanded', 'true');
        // Nor does it make the navbar scroll (and clip it).
        await expect(page.locator('.navbar-main')).not.toHaveClass(/is-scrolling/);
        expect(await page.locator('.navbar-container').evaluate(el => getComputedStyle(el).overflowX)).toBe('visible');
        expect(await fullyVisible(dropdown(page))).toBe(true);
    });
});

test.describe('navbar sub-menu in the folded menu', () => {
    test.beforeEach(async ({ page, visit }) => {
        await page.setViewportSize(NARROW);
        await visit('/');
        await frames(page);
    });

    test('expands its links below its button', async ({ page, diagnostics }) => {
        await expect(page.locator('.navbar-main')).toHaveClass(/is-collapsed/);
        await page.locator('.navbar-toggle').click();
        await expect(button(page)).toBeVisible();
        await expect(dropdown(page)).toBeHidden();
        // Hovering does not expand it here.
        await button(page).hover();
        await expect(dropdown(page)).toBeHidden();

        await button(page).click();
        await expect(button(page)).toHaveAttribute('aria-expanded', 'true');
        await expect(page.locator('.navbar-toggle')).toHaveAttribute('aria-expanded', 'true');
        const [buttonBox, first, second, about, navbar] = await Promise.all([
            button(page), subLink(page, 'Hello World'), subLink(page, 'Code Blocks'),
            page.locator('.navbar-start > a', { hasText: 'About' }), page.locator('.navbar-main')
        ].map(locator => locator.boundingBox()));
        // In the column: one link per line under the button, centered like it, before About.
        expect(first.y).toBeGreaterThanOrEqual(buttonBox.y + buttonBox.height - 1);
        expect(second.y).toBeGreaterThanOrEqual(first.y + first.height - 1);
        expect(about.y).toBeGreaterThanOrEqual(second.y + second.height - 1);
        expect(about.y + about.height).toBeLessThanOrEqual(navbar.y + navbar.height);
        const center = box => box.x + (box.width / 2);
        expect(Math.abs(center(first) - center(about))).toBeLessThan(2);
        expect(await dropdown(page).evaluate(el => getComputedStyle(el).position)).toBe('static');
        // Like the other links, without a background; its links in the same size, dimmed.
        await page.mouse.move(5, NARROW.height - 5);
        expect(await background(button(page))).toBe('rgba(0, 0, 0, 0)');
        const home = page.locator('.navbar-start > a', { hasText: 'Home' });
        expect(await fontSize(subLink(page, 'Code Blocks'))).toBe(await fontSize(home));
        const color = locator => locator.evaluate(el => getComputedStyle(el).color);
        expect(await color(subLink(page, 'Code Blocks'))).not.toBe(await color(page.locator('.navbar-start > a', { hasText: 'About' })));
        // The menu stays folded, without scrolling.
        await frames(page);
        await expect(page.locator('.navbar-main')).toHaveClass(/is-collapsed/);
        expect(await navbarScrolls(page)).toBe(false);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

        await button(page).click();
        await expect(button(page)).toHaveAttribute('aria-expanded', 'false');
        await expect(dropdown(page)).toBeHidden();
        expect(diagnostics.pageErrors).toEqual([]);
        expect(diagnostics.consoleErrors).toEqual([]);
    });

    test('closes the sub-menu, then the menu, on Escape', async ({ page }) => {
        await page.locator('.navbar-toggle').click();
        await button(page).click();
        await subLink(page, 'Hello World').focus();
        await page.keyboard.press('Escape');
        await expect(button(page)).toHaveAttribute('aria-expanded', 'false');
        await expect(button(page)).toBeFocused();
        await expect(page.locator('.navbar-toggle')).toHaveAttribute('aria-expanded', 'true');
        await page.keyboard.press('Escape');
        await expect(page.locator('.navbar-toggle')).toHaveAttribute('aria-expanded', 'false');
        await expect(page.locator('.navbar-toggle')).toBeFocused();
        // Reopening the menu shows the sub-menu closed.
        await page.keyboard.press('Enter');
        await expect(button(page)).toHaveAttribute('aria-expanded', 'false');
    });

    test('follows a link of the sub-menu', async ({ page }) => {
        await page.locator('.navbar-toggle').click();
        await button(page).click();
        await subLink(page, 'Hello World').click();
        await expect(page).toHaveURL(HELLO);
        await expect(page.locator('.navbar-main')).toHaveClass(/is-collapsed/);
        await expect(page.locator('.navbar-toggle')).toHaveAttribute('aria-expanded', 'false');
        await page.locator('.navbar-toggle').click();
        await expect(button(page)).toHaveClass(/is-active/);
        await button(page).click();
        await expect(dropdown(page).locator('.navbar-item.is-active')).toHaveText('Hello World');
    });

    test('closes when the menu unfolds', async ({ page }) => {
        await page.locator('.navbar-toggle').click();
        await button(page).click();
        await page.setViewportSize(WIDE);
        await expect(page.locator('.navbar-main')).not.toHaveClass(/is-collapsed/);
        await expect(button(page)).toHaveAttribute('aria-expanded', 'false');
        await page.mouse.move(5, WIDE.height - 5);
        await expect(dropdown(page)).toBeHidden();
    });
});

test.describe('navbar sub-menu with PJAX', () => {
    for (const viewport of [WIDE, NARROW]) {
        test(`toggles once per click after navigating (${viewport.width}px)`, async ({ page, visit }) => {
            await page.setViewportSize(viewport);
            await visit('/', { variant: 'pjax' });
            await page.evaluate(() => { window.__noFullReload = true; });
            const before = await jqueryHandlerCounts(page, 'document');
            const toggle = page.locator('.navbar-toggle');
            const openMenu = async () => {
                if (viewport === NARROW) {
                    await toggle.click();
                }
            };
            for (const name of ['Hello World', 'Code Blocks', 'Hello World']) {
                await openMenu();
                await button(page).click();
                await expect(button(page)).toHaveAttribute('aria-expanded', 'true');
                await pjaxClick(page, subLink(page, name));
                await expect(button(page)).toHaveAttribute('aria-expanded', 'false');
                await expect(page.locator('.navbar-main')).not.toHaveClass(/is-dropdown-open/);
                await page.mouse.move(5, viewport.height - 5);
                await expect(dropdown(page)).toBeHidden();
            }
            await openMenu();
            await expect(button(page)).toHaveClass(/is-active/);
            // One toggle per click.
            for (const expanded of ['true', 'false', 'true']) {
                await button(page).click();
                await expect(button(page)).toHaveAttribute('aria-expanded', expanded);
            }
            expect(await page.evaluate(() => window.__noFullReload)).toBe(true);
            expect(await jqueryHandlerCounts(page, 'document')).toEqual(before);
            await pjaxClick(page, page.locator('.navbar-start > a', { hasText: 'Archives' }));
            await expect(page).toHaveURL(/\/archives\/$/);
            await expect(button(page)).not.toHaveClass(/is-active/);
        });
    }
});

test.describe('navbar sub-menu in the cyberpunk variant', () => {

    /** The text color of the element differs from the first opaque background behind it. */
    function contrasts(locator) {
        return locator.evaluate(el => {
            let background = el;
            while (background && ['transparent', 'rgba(0, 0, 0, 0)'].includes(getComputedStyle(background).backgroundColor)) {
                background = background.parentElement;
            }
            return getComputedStyle(el).color !== getComputedStyle(background).backgroundColor;
        });
    }

    test('opens as a drop-down and in the folded menu', async ({ page, visit, diagnostics }) => {
        await page.setViewportSize(WIDE);
        await visit('/', { variant: 'cyberpunk' });
        await frames(page);
        await button(page).click();
        await expect(subLink(page, 'Hello World')).toBeVisible();
        expect(await fullyVisible(dropdown(page))).toBe(true);
        for (const name of ['Hello World', 'Code Blocks']) {
            expect(await contrasts(subLink(page, name)), name).toBe(true);
            await subLink(page, name).hover();
            expect(await contrasts(subLink(page, name)), `${name} hovered`).toBe(true);
        }
        // The current page (active) too, in the button and its link.
        await visit('/2024/03/01/hello-world/', { variant: 'cyberpunk' });
        await button(page).click();
        await page.mouse.move(5, WIDE.height - 5);
        await expect(subLink(page, 'Hello World')).toHaveClass(/is-active/);
        expect(await contrasts(subLink(page, 'Hello World')), 'active link').toBe(true);
        expect(await contrasts(button(page)), 'active button').toBe(true);
        // The active link is framed by the panel.
        const [panel, active] = await Promise.all([dropdown(page).boundingBox(), subLink(page, 'Hello World').boundingBox()]);
        expect(active.x).toBeGreaterThan(panel.x + 2);
        expect(active.x + active.width).toBeLessThan(panel.x + panel.width - 2);
        expect(active.y).toBeGreaterThan(panel.y + 2);

        await page.setViewportSize(NARROW);
        await expect(page.locator('.navbar-main')).toHaveClass(/is-collapsed/);
        await page.locator('.navbar-toggle').click();
        await button(page).click();
        const last = await subLink(page, 'Code Blocks').boundingBox();
        const navbar = await page.locator('.navbar-main').boundingBox();
        expect(last.y + last.height).toBeLessThanOrEqual(navbar.y + navbar.height);
        expect(await navbarScrolls(page)).toBe(false);
        expect(diagnostics.pageErrors).toEqual([]);
    });
});

test.describe('navbar sub-menu without JavaScript', () => {
    test.use({ javaScriptEnabled: false });

    test('shows its links next to its button when hovered or focused', async ({ page, visit }) => {
        await page.setViewportSize(WIDE);
        await visit('/');
        await expect(dropdown(page)).toBeHidden();
        await button(page).hover();
        await expect(subLink(page, 'Hello World')).toBeVisible();
        // Inline, in the navbar: right of the button, on the same line.
        const [buttonBox, link] = await Promise.all([button(page).boundingBox(), subLink(page, 'Hello World').boundingBox()]);
        expect(link.x).toBeGreaterThanOrEqual(buttonBox.x + buttonBox.width - 1);
        expect(Math.abs((link.y + (link.height / 2)) - (buttonBox.y + (buttonBox.height / 2)))).toBeLessThan(2);
        await page.mouse.move(5, WIDE.height - 5);
        await expect(dropdown(page)).toBeHidden();
    });

    test('reaches its links from the keyboard on a narrow screen', async ({ page, visit }) => {
        await page.setViewportSize(NARROW);
        await visit('/');
        await button(page).focus();
        await expect(subLink(page, 'Hello World')).toBeVisible();
        await page.keyboard.press('Tab');
        await expect(subLink(page, 'Hello World')).toBeFocused();
        await page.keyboard.press('Tab');
        await expect(subLink(page, 'Code Blocks')).toBeFocused();
        await page.keyboard.press('Enter');
        await expect(page).toHaveURL(/\/2024\/02\/20\/code-blocks\/$/);
    });
});
