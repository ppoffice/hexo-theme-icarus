const { test, expect, jqueryHandlerCounts } = require('./fixtures');

// The fixture menu (5 links and a sub-menu) plus its icons do not fit on one line at 375px, and
// fit at 1440px.
const NARROW = { width: 375, height: 800 };
const WIDE = { width: 1440, height: 900 };

/** Whether the navbar scrolls horizontally. */
function navbarScrolls(page) {
    return page.locator('.navbar-main').evaluate(navbar => Array.from(navbar.querySelectorAll('.navbar-container, .navbar-menu'))
        .some(el => el.scrollWidth > el.clientWidth + 1));
}

/** Click a link and wait until PJAX has swapped the page in and re-run its scripts. */
async function pjaxClick(page, locator) {
    const done = page.evaluate(() => new Promise(resolve => document.addEventListener('pjax:complete', resolve, { once: true })));
    await locator.click();
    await done;
    await page.waitForLoadState('networkidle');
}

test.describe('navbar menu on a narrow screen', () => {
    test.beforeEach(async ({ page, visit }) => {
        await page.setViewportSize(NARROW);
        await visit('/');
    });

    test('folds the menu links behind a toggle instead of scrolling', async ({ page, diagnostics }) => {
        const navbar = page.locator('.navbar-main');
        await expect(navbar).toHaveClass(/is-collapsed/);
        expect(await navbarScrolls(page)).toBe(false);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
        await expect(page.locator('.navbar-toggle')).toBeVisible();
        await expect(page.locator('.navbar-toggle')).toHaveAttribute('aria-expanded', 'false');
        await expect(page.locator('.navbar-start')).toBeHidden();
        // The icons stay in the bar, within the screen.
        for (const selector of ['.navbar-end a[title="GitHub"]', '.navbar-end a[title="Example"]', '.navbar-end .search']) {
            const box = await page.locator(selector).boundingBox();
            expect(box, selector).not.toBeNull();
            expect(box.x, selector).toBeGreaterThanOrEqual(0);
            expect(box.x + box.width, selector).toBeLessThanOrEqual(NARROW.width);
        }
        expect(diagnostics.pageErrors).toEqual([]);
        expect(diagnostics.consoleErrors).toEqual([]);
    });

    test('opens and closes the links as a drop-down below the bar', async ({ page }) => {
        const toggle = page.locator('.navbar-toggle');
        await toggle.click();
        await expect(toggle).toHaveAttribute('aria-expanded', 'true');
        // The links and the sub-menu (its button, its links closed).
        const links = page.locator('#navbar-main-menu > .navbar-item');
        await expect(links).toHaveCount(6);
        for (const link of await links.all()) {
            await expect(link).toBeVisible();
        }
        // One link per line, below the toggle and inside the navbar.
        const boxes = await links.evaluateAll(els => els.map(el => el.getBoundingClientRect().toJSON()));
        const toggleBox = await toggle.boundingBox();
        const navbarBox = await page.locator('.navbar-main').boundingBox();
        expect(boxes[0].top).toBeGreaterThanOrEqual(toggleBox.y + toggleBox.height - 1);
        boxes.slice(1).forEach((box, i) => expect(box.top).toBeGreaterThanOrEqual(boxes[i].bottom - 1));
        expect(boxes[5].bottom).toBeLessThanOrEqual(navbarBox.y + navbarBox.height);
        // The current page stays marked.
        await expect(page.locator('#navbar-main-menu .navbar-item.is-active')).toHaveText('Home');
        expect(await navbarScrolls(page)).toBe(false);

        await toggle.click();
        await expect(toggle).toHaveAttribute('aria-expanded', 'false');
        await expect(page.locator('.navbar-start')).toBeHidden();
    });

    test('works from the keyboard and closes on Escape', async ({ page }) => {
        const toggle = page.locator('.navbar-toggle');
        await toggle.focus();
        await page.keyboard.press('Enter');
        await expect(toggle).toHaveAttribute('aria-expanded', 'true');
        // The links come right after the toggle in the tab order.
        await page.keyboard.press('Tab');
        await expect(page.locator('#navbar-main-menu .navbar-item').first()).toBeFocused();
        await page.keyboard.press('Escape');
        await expect(toggle).toHaveAttribute('aria-expanded', 'false');
        await expect(page.locator('.navbar-start')).toBeHidden();
        await expect(toggle).toBeFocused();
        await page.keyboard.press('Space');
        await expect(toggle).toHaveAttribute('aria-expanded', 'true');
        await page.keyboard.press('Space');
        await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    });

    test('does not trap the focus', async ({ page }) => {
        await page.locator('.navbar-toggle').click();
        const links = page.locator('#navbar-main-menu .navbar-item');
        await links.last().focus();
        await page.keyboard.press('Tab');
        await expect(page.locator('.navbar-end a[title="GitHub"]')).toBeFocused();
    });

    test('closes on a click outside of it', async ({ page }) => {
        const toggle = page.locator('.navbar-toggle');
        await toggle.click();
        await expect(toggle).toHaveAttribute('aria-expanded', 'true');
        await page.locator('.column-main').click({ position: { x: 5, y: 5 } });
        await expect(toggle).toHaveAttribute('aria-expanded', 'false');
        await expect(page.locator('.navbar-start')).toBeHidden();
    });

    test('follows a link of the drop-down', async ({ page }) => {
        await page.locator('.navbar-toggle').click();
        await page.locator('#navbar-main-menu a', { hasText: 'Archives' }).click();
        await expect(page).toHaveURL(/\/archives\/$/);
        await expect(page.locator('.navbar-main')).toHaveClass(/is-collapsed/);
        await expect(page.locator('.navbar-toggle')).toHaveAttribute('aria-expanded', 'false');
        await page.locator('.navbar-toggle').click();
        await expect(page.locator('#navbar-main-menu .navbar-item.is-active')).toHaveText('Archives');
    });

    test('unfolds the links again when the screen gets wide enough', async ({ page }) => {
        await page.locator('.navbar-toggle').click();
        await page.setViewportSize(WIDE);
        await expect(page.locator('.navbar-main')).not.toHaveClass(/is-collapsed/);
        await expect(page.locator('.navbar-main')).not.toHaveClass(/is-open/);
        await expect(page.locator('.navbar-toggle')).toBeHidden();
        await expect(page.locator('.navbar-toggle')).toHaveAttribute('aria-expanded', 'false');
        await expect(page.locator('.navbar-start a', { hasText: 'About' })).toBeVisible();
        // Inline again: all the links on the same line.
        const tops = await page.locator('.navbar-start > .navbar-item').evaluateAll(els => els.map(el => Math.round(el.getBoundingClientRect().top)));
        expect(new Set(tops).size).toBe(1);

        await page.setViewportSize(NARROW);
        await expect(page.locator('.navbar-main')).toHaveClass(/is-collapsed/);
        await expect(page.locator('.navbar-start')).toBeHidden();
    });
});

test.describe('navbar menu around the width where it folds', () => {
    test('settles in one state at every width', async ({ page, visit }) => {
        await page.setViewportSize(NARROW);
        await visit('/');
        const states = [];
        // The expanded fixture navbar is about 550px wide.
        for (let width = 490; width <= 610; width += 6) {
            await page.setViewportSize({ width, height: 800 });
            // Let the resize observer refit, then sample the state over 10 frames.
            const samples = await page.evaluate(() => new Promise(resolve => {
                const navbar = document.querySelector('.navbar-main');
                const result = [];
                let frames = 0;
                (function sample() {
                    if (frames++ >= 3) {
                        result.push(navbar.classList.contains('is-collapsed'));
                    }
                    if (frames < 13) {
                        requestAnimationFrame(sample);
                    } else {
                        resolve(result);
                    }
                }());
            }));
            expect(new Set(samples).size, `${width}px: ${samples}`).toBe(1);
            expect(await navbarScrolls(page), `${width}px`).toBe(false);
            states.push(samples[0]);
        }
        // Folded on the narrow side, unfolded on the wide side, switching once.
        expect(states[0]).toBe(true);
        expect(states[states.length - 1]).toBe(false);
        expect(states.filter((collapsed, i) => i > 0 && collapsed !== states[i - 1])).toHaveLength(1);
    });
});

test.describe('navbar menu on a wide screen', () => {
    test('shows the links inline without a toggle', async ({ page, visit }) => {
        await page.setViewportSize(WIDE);
        await visit('/');
        // Give the resize observer and font loading a chance to refit.
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        await expect(page.locator('.navbar-main')).not.toHaveClass(/is-collapsed/);
        await expect(page.locator('.navbar-toggle')).toBeHidden();
        await expect(page.locator('.navbar-start > .navbar-item')).toHaveCount(6);
        for (const link of await page.locator('.navbar-start > .navbar-item').all()) {
            await expect(link).toBeVisible();
        }
        expect(await navbarScrolls(page)).toBe(false);
    });

    test('folds a menu that does not fit next to the logo', async ({ page, visit }) => {
        await page.setViewportSize({ width: 1100, height: 800 });
        await visit('/');
        await expect(page.locator('.navbar-main')).not.toHaveClass(/is-collapsed/);
        // Longer link texts, as with more menu items.
        await page.locator('.navbar-start > a.navbar-item').evaluateAll(els => els.forEach(el => { el.textContent += ' with a long name'; }));
        await expect(page.locator('.navbar-main')).toHaveClass(/is-collapsed/);
        expect(await navbarScrolls(page)).toBe(false);
        await page.locator('.navbar-toggle').click();
        await expect(page.locator('#navbar-main-menu .navbar-item').first()).toBeVisible();
        // The toggle sits with the icons, on the right of the logo.
        const [logo, toggle] = await Promise.all(['.navbar-logo', '.navbar-toggle'].map(selector => page.locator(selector).boundingBox()));
        expect(toggle.x).toBeGreaterThan(logo.x + logo.width);
        expect(Math.abs(toggle.y - logo.y)).toBeLessThan(logo.height);
    });
});

test.describe('navbar menu without JavaScript', () => {
    test.use({ javaScriptEnabled: false });

    test('keeps the links, scrolling horizontally', async ({ page, visit }) => {
        await page.setViewportSize(NARROW);
        await visit('/');
        await expect(page.locator('.navbar-main')).not.toHaveClass(/is-collapsed/);
        await expect(page.locator('.navbar-toggle')).toBeHidden();
        await expect(page.locator('.navbar-start a', { hasText: 'Home' })).toBeVisible();
        expect(await navbarScrolls(page)).toBe(true);
    });
});

test.describe('navbar menu with PJAX', () => {
    for (const script of ['delayed', 'failed']) {
        for (const viewport of [NARROW, WIDE]) {
            test(`restores the new menu before main.js loads (${script}, ${viewport.width}px)`, async ({ page, visit, diagnostics }) => {
                await page.setViewportSize(viewport);
                await visit('/', { variant: 'pjax' });
                const before = await jqueryHandlerCounts(page, 'document');
                let intercept;
                const requested = new Promise(resolve => { intercept = resolve; });
                await page.route('**/js/main.js', route => intercept(route));
                await page.evaluate(() => {
                    window.__noFullReload = true;
                    window.__navbarInits = 0;
                    window.__mainLoaded = false;
                    const init = window.IcarusNavbar.init;
                    window.IcarusNavbar.init = () => { window.__navbarInits++; init(); };
                    const oldMenu = document.querySelector('.navbar-start');
                    const oldObserver = window.IcarusNavbarObserver;
                    document.addEventListener('pjax:complete', () => {
                        const navbar = document.querySelector('.navbar-main');
                        const toggle = navbar.querySelector('.navbar-toggle');
                        if (navbar.classList.contains('is-collapsed')) {
                            toggle.click();
                        }
                        const submenu = navbar.querySelector('.navbar-link');
                        submenu.click();
                        window.__newMenuObserver = window.IcarusNavbarObserver;
                        window.__newMenuInteraction = {
                            replaced: navbar.querySelector('.navbar-start') !== oldMenu,
                            observerReplaced: window.IcarusNavbarObserver !== oldObserver && !!window.IcarusNavbarObserver,
                            toggle: toggle.getAttribute('aria-expanded'),
                            submenu: submenu.getAttribute('aria-expanded')
                        };
                    }, { once: true });
                });
                // Do not use pjaxClick(): its networkidle wait hides a missing navbar lifecycle.
                const complete = page.evaluate(() => new Promise(resolve => document.addEventListener('pjax:complete', resolve, { once: true })));
                if (viewport.width === NARROW.width) {
                    await page.locator('.navbar-toggle').click();
                }
                await page.locator('.navbar-start a', { hasText: 'Archives' }).click();
                await complete;
                const route = await requested;
                try {
                    if (script === 'failed') {
                        await route.abort('failed');
                    }
                    expect(await page.evaluate(() => window.__newMenuInteraction)).toEqual({
                        replaced: true, observerReplaced: true,
                        toggle: viewport.width === NARROW.width ? 'true' : 'false', submenu: 'true'
                    });
                    expect(await page.evaluate(() => window.__navbarInits)).toBe(1);
                    await expect(page.locator('.navbar-start a.is-active')).toHaveText('Archives');
                    await page.locator('.navbar-link').click();
                    await expect(page.locator('.navbar-link')).toHaveAttribute('aria-expanded', 'false');
                    await page.locator('.navbar-link').click();
                    await expect(page.locator('.navbar-link')).toHaveAttribute('aria-expanded', 'true');
                } finally {
                    if (script === 'delayed') {
                        // Pjax removes its script node immediately, so observe execution rather
                        // than a load event that cannot reach the document from a detached node.
                        const response = await route.fetch();
                        const source = await response.text();
                        await route.fulfill({ response, body: source + '\nwindow.__mainLoaded = true;' });
                    }
                }
                if (script === 'delayed') {
                    // Loading the real main.js must keep the initialized menu and its open state.
                    await expect.poll(() => page.evaluate(() => window.__mainLoaded)).toBe(true);
                    expect(await page.evaluate(() => window.__navbarInits)).toBe(1);
                    expect(await page.evaluate(() => window.__newMenuObserver === window.IcarusNavbarObserver)).toBe(true);
                    await expect(page.locator('.navbar-link')).toHaveAttribute('aria-expanded', 'true');
                    await page.locator('.navbar-link').click();
                    await expect(page.locator('.navbar-link')).toHaveAttribute('aria-expanded', 'false');
                }
                expect(await jqueryHandlerCounts(page, 'document')).toEqual(before);
                expect(await page.locator('.navbar-toggle').evaluate(el => window.jQuery._data(el, 'events').click.length)).toBe(1);
                expect(await page.evaluate(() => window.__noFullReload)).toBe(true);
                expect(diagnostics.pageErrors).toEqual([]);
            });
        }
    }

    test('disposes queued resize, focus and font work when the page is replaced', async ({ page, visit }) => {
        await visit('/', { variant: 'navbar-sticky' });
        const result = await page.evaluate(async () => {
            const navbar = document.querySelector('.navbar-main');
            const frames = new Map();
            const cancelled = [];
            const observers = [];
            const fonts = [];
            window.IcarusNavbar.destroy();
            window.requestAnimationFrame = callback => { const id = frames.size + 1; frames.set(id, callback); return id; };
            window.cancelAnimationFrame = id => cancelled.push(id);
            window.ResizeObserver = class {
                constructor(callback) { this.callback = callback; observers.push(this); }
                observe() {}
                disconnect() { this.disconnected = true; }
            };
            Object.defineProperty(document.fonts, 'ready', { configurable: true, value: { then: callback => fonts.push(callback) } });
            let measurements = 0;
            let scrolls = 0;
            const measure = navbar.getBoundingClientRect.bind(navbar);
            navbar.getBoundingClientRect = () => { measurements++; return measure(); };
            window.scrollBy = () => { scrolls++; };
            window.IcarusNavbar.init();
            observers[0].callback();
            observers[0].callback();
            const target = document.querySelector('.navbar-logo').cloneNode(true);
            document.body.appendChild(target);
            target.matches = () => true;
            target.focus();
            const queued = frames.size;
            window.IcarusNavbar.init();
            const before = measurements;
            // Simulate callbacks already dequeued by the browser despite cancellation/disconnect.
            frames.forEach(callback => callback());
            observers[0].callback();
            fonts[0]();
            const staleMeasurements = measurements - before;
            const afterStale = frames.size;
            fonts[1]();
            const refreshed = measurements > before;
            navbar.remove();
            window.IcarusNavbar.init();
            const handlers = element => Object.values(window.jQuery._data(element, 'events') || {})
                .flat().filter(handler => handler.namespace === 'icarus-navbar').length;
            return {
                queued, cancelled: cancelled.length, disconnected: observers.every(observer => observer.disconnected),
                staleMeasurements, afterStale, scrolls, refreshed,
                handlers: handlers(document) + handlers(window), observer: window.IcarusNavbarObserver
            };
        });
        expect(result).toEqual({
            queued: 2, cancelled: 2, disconnected: true, staleMeasurements: 0, afterStale: 2,
            scrolls: 0, refreshed: true, handlers: 0, observer: null
        });
    });

    test('replaces the resize fallback without accumulating handlers', async ({ page, visit }) => {
        await page.addInitScript(() => { window.ResizeObserver = undefined; });
        await page.setViewportSize(NARROW);
        await visit('/', { variant: 'pjax' });
        const before = await jqueryHandlerCounts(page);
        await page.locator('.navbar-toggle').click();
        await pjaxClick(page, page.locator('#navbar-main-menu a', { hasText: 'Archives' }));
        expect(await jqueryHandlerCounts(page)).toEqual(before);
        await page.setViewportSize(WIDE);
        await expect(page.locator('.navbar-main')).not.toHaveClass(/is-collapsed/);
    });

    test('toggles once per click after navigating', async ({ page, visit }) => {
        await page.setViewportSize(NARROW);
        await visit('/', { variant: 'pjax' });
        await page.evaluate(() => {
            window.__noFullReload = true;
            window.__navbarModule = window.IcarusNavbar;
            const observer = window.IcarusNavbarObserver;
            const disconnect = observer.disconnect.bind(observer);
            observer.disconnect = () => { window.__navbarDisconnected = true; disconnect(); };
        });
        const before = await jqueryHandlerCounts(page, 'document');
        const toggle = page.locator('.navbar-toggle');
        for (const name of ['Archives', 'Tags', 'Home']) {
            await toggle.click();
            await pjaxClick(page, page.locator('#navbar-main-menu a', { hasText: name }));
            await expect(page.locator('.navbar-main')).toHaveClass(/is-collapsed/);
            await expect(toggle).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('.navbar-start')).toBeHidden();
        }
        expect(await page.evaluate(() => window.__noFullReload)).toBe(true);
        expect(await page.evaluate(() => window.__navbarDisconnected && window.IcarusNavbar === window.__navbarModule)).toBe(true);
        expect(await jqueryHandlerCounts(page, 'document')).toEqual(before);
        expect(await toggle.evaluate(el => window.jQuery._data(el, 'events').click.length)).toBe(1);

        await toggle.click();
        await expect(toggle).toHaveAttribute('aria-expanded', 'true');
        await expect(page.locator('#navbar-main-menu .navbar-item.is-active')).toHaveText('Home');
        await toggle.click();
        await expect(toggle).toHaveAttribute('aria-expanded', 'false');

        // The resize observer of the current page still refits the navbar.
        await page.setViewportSize(WIDE);
        await expect(page.locator('.navbar-main')).not.toHaveClass(/is-collapsed/);
    });
});

test.describe('navbar menu in the cyberpunk variant', () => {
    test('folds and opens inside the navbar', async ({ page, visit, diagnostics }) => {
        await page.setViewportSize(NARROW);
        await visit('/', { variant: 'cyberpunk' });
        await expect(page.locator('.navbar-main')).toHaveClass(/is-collapsed/);
        expect(await navbarScrolls(page)).toBe(false);
        await page.locator('.navbar-toggle').click();
        const last = await page.locator('#navbar-main-menu .navbar-item').last().boundingBox();
        const navbar = await page.locator('.navbar-main').boundingBox();
        expect(last.y + last.height).toBeLessThanOrEqual(navbar.y + navbar.height);
        await expect(page.locator('#navbar-main-menu .navbar-item.is-active')).toHaveText('Home');
        expect(diagnostics.pageErrors).toEqual([]);
    });
});
