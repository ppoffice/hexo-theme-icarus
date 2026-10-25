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

    test('opens from the keyboard on mobile', async ({ page, visit }) => {
        await page.setViewportSize({ width: 375, height: 800 });
        await visit('/2024/03/01/hello-world/');
        await page.locator('.navbar-main .catalogue').focus();
        await page.keyboard.press('Enter');
        await expect(page.locator('#toc')).toHaveClass(/is-active/);
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

test.describe('table of contents in a scrollable container', () => {
    const POST = '/2023/08/01/long-toc/'; // 24 sections

    /** Scroll the page so a heading is at the top and wait until toc.js highlights its entry. */
    async function readSection(page, id) {
        const scrollY = await page.locator('#' + id).evaluate(heading => {
            window.scrollTo({ top: heading.getBoundingClientRect().top + window.scrollY - 10, behavior: 'instant' });
            return window.scrollY;
        });
        await expect(page.locator(`#toc a[data-href="#${id}"]`)).toHaveClass(/is-active/);
        return scrollY;
    }

    /** Where the active toc entry is in its scroll container. */
    function activeEntry(page, container) {
        return page.locator(container).evaluate(el => {
            const entry = Array.from(el.querySelectorAll('a.is-active')).pop();
            const box = el.getBoundingClientRect();
            const rect = entry.getBoundingClientRect();
            return {
                visible: rect.top >= box.top - 1 && rect.bottom <= box.bottom + 1,
                // distance between the centers of the entry and of the container
                offCenter: Math.round(Math.abs((rect.top + rect.bottom - box.top - box.bottom) / 2))
            };
        });
    }

    test('keeps the active entry around the middle without scrolling the page', async ({ page, visit }) => {
        await page.setViewportSize({ width: 1440, height: 700 });
        await visit(POST);
        await page.addStyleTag({ content: '#toc .menu { max-height: 200px; overflow-y: auto; }' });
        const scrollY = await readSection(page, 'Section-14');
        await expect.poll(async () => (await activeEntry(page, '#toc .menu')).offCenter).toBeLessThan(20);
        expect((await activeEntry(page, '#toc .menu')).visible).toBe(true);
        expect(await page.evaluate(() => window.scrollY)).toBe(scrollY);

        // The last entries cannot be centered: the container stops at the end of the list.
        await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
        await expect(page.locator('#toc a[data-href="#Section-24"]')).toHaveClass(/is-active/);
        await expect.poll(() => page.locator('#toc .menu').evaluate(el => el.scrollHeight - el.clientHeight - el.scrollTop)).toBeLessThan(1);
        expect((await activeEntry(page, '#toc .menu')).visible).toBe(true);
    });

    test('does not animate when the reader prefers reduced motion', async ({ page, visit }) => {
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.setViewportSize({ width: 1440, height: 700 });
        await visit(POST);
        await page.addStyleTag({ content: '#toc .menu { max-height: 200px; overflow-y: auto; }' });
        await readSection(page, 'Section-14');
        // One frame after the highlight moved, the entry is already in place.
        const offCenter = await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => {
            const menu = document.querySelector('#toc .menu');
            const box = menu.getBoundingClientRect();
            const rect = Array.from(menu.querySelectorAll('a.is-active')).pop().getBoundingClientRect();
            resolve(Math.round(Math.abs((rect.top + rect.bottom - box.top - box.bottom) / 2)));
        }))));
        expect(offCenter).toBeLessThan(20);
    });

    test('still scrolls the page to the heading of a clicked entry', async ({ page, visit }) => {
        await page.setViewportSize({ width: 1440, height: 700 });
        await visit(POST);
        await page.addStyleTag({ content: '#toc .menu { max-height: 200px; overflow-y: auto; }' });
        await page.locator('#toc a[data-href="#Section-6"]').click();
        await expect.poll(() => page.locator('#Section-6').evaluate(el => Math.round(el.getBoundingClientRect().top))).toBeLessThan(100);
        await expect(page.locator('#toc a[data-href="#Section-6"]')).toHaveClass(/is-active/);
        await expect.poll(() => activeEntry(page, '#toc .menu')).toMatchObject({ visible: true });
    });

    test('does not scroll a container that is not scrollable', async ({ page, visit }) => {
        await page.setViewportSize({ width: 1440, height: 700 });
        await visit(POST);
        // overflow: hidden clips the list, but the reader cannot scroll it: leave it alone.
        await page.addStyleTag({ content: '#toc .menu { max-height: 200px; overflow-y: hidden; }' });
        const scrollY = await readSection(page, 'Section-14');
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve, 500))));
        const scrollTops = await page.locator('#toc, #toc .card-content, #toc .menu').evaluateAll(els => els.map(el => el.scrollTop));
        expect(scrollTops).toEqual([0, 0, 0]);
        expect(await page.evaluate(() => window.scrollY)).toBe(scrollY);
    });

    test('shows the active entry when the mobile overlay opens', async ({ page, visit }) => {
        await page.setViewportSize({ width: 375, height: 400 });
        await visit(POST);
        const scrollY = await readSection(page, 'Section-18');
        // Like a sticky navbar would: click() would first scroll the page up to the button.
        await page.locator('.navbar-main .catalogue').dispatchEvent('click');
        await expect(page.locator('#toc')).toHaveClass(/is-active/);
        await expect.poll(async () => (await activeEntry(page, '#toc .menu')).offCenter).toBeLessThan(20);
        expect((await activeEntry(page, '#toc .menu')).visible).toBe(true);
        expect(await page.evaluate(() => window.scrollY)).toBe(scrollY);
    });
});

test.describe('back to top button', () => {
    test('appears after scrolling on desktop and scrolls back up', async ({ page, visit }) => {
        await page.setViewportSize({ width: 1440, height: 600 });
        await visit('/');
        const button = page.locator('#back-to-top');
        await expect(button).not.toHaveClass(/fade-in/);
        // The sidebar can grow as fixture widgets are added. Scroll past it rather
        // than assuming a fixed page length makes the desktop button visible.
        await page.mouse.wheel(0, await page.evaluate(() => document.documentElement.scrollHeight));
        await expect(button).toHaveClass(/fade-in/);
        await button.click();
        await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    });

    test('can be used from the keyboard', async ({ page, visit }) => {
        await page.setViewportSize({ width: 1440, height: 600 });
        await visit('/');
        await page.mouse.wheel(0, await page.evaluate(() => document.documentElement.scrollHeight));
        const button = page.locator('#back-to-top');
        await expect(button).toHaveClass(/fade-in/);
        await button.focus();
        await page.keyboard.press('Enter');
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

test.describe('form fields', () => {
    const fontSize = page => page.locator('.searchbox-input').evaluate(el => parseFloat(getComputedStyle(el).fontSize));

    test('use at least 16px on touch screens so iOS does not zoom on focus', async ({ page, visit }) => {
        await page.setViewportSize({ width: 375, height: 800 });
        await visit('/');
        expect(await fontSize(page)).toBeGreaterThanOrEqual(16);
    });

    test('keep the theme font size on desktop', async ({ page, visit }) => {
        await visit('/');
        expect(await fontSize(page)).toBe(14);
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

    const searchbox = page => page.locator('.searchbox');
    const button = page => page.locator('.navbar-main .search');
    const isOpen = page => searchbox(page).evaluate(el => el.classList.contains('show'));

    test('does not open when its button gets the focus', async ({ page, visit }) => {
        await visit('/');
        await button(page).focus();
        await expect(button(page)).toBeFocused();
        expect(await isOpen(page)).toBe(false);
    });

    for (const key of ['Enter', 'Space']) {
        test(`opens with ${key} on its button and closes on Escape, giving the focus back to the button`, async ({ page, visit }) => {
            await visit('/');
            await button(page).focus();
            await page.keyboard.press(key);
            await expect(searchbox(page)).toHaveClass(/show/);
            await expect(page.locator('.searchbox-input')).toBeFocused();
            await page.keyboard.press('Escape');
            await expect(searchbox(page)).not.toHaveClass(/show/);
            await expect(button(page)).toBeFocused();
        });
    }

    test('lets Tab move from the top of the page past its button to the article', async ({ page, visit }) => {
        await visit('/');
        const passed = [];
        for (let i = 0; i < 40; i++) {
            await page.keyboard.press('Tab');
            const focused = await page.evaluate(() => {
                const el = document.activeElement;
                return {
                    search: el.matches('.navbar-main .search'),
                    article: !!el.closest('.column-main article'),
                    open: document.querySelector('.searchbox').classList.contains('show')
                };
            });
            expect(focused.open, `search opened after ${i + 1} Tab presses`).toBe(false);
            passed.push(focused);
            if (focused.article) {
                break;
            }
        }
        expect(passed.some(focused => focused.search), 'reached the search button').toBe(true);
        expect(passed[passed.length - 1].article, 'reached the article').toBe(true);
    });

    test('opens with "/" outside of text fields, and with Ctrl+K or Cmd+K', async ({ page, visit }) => {
        await visit('/');
        for (const shortcut of ['/', 'Control+k', 'Meta+k']) {
            await page.locator('.column-main article').first().click({ position: { x: 5, y: 5 } });
            expect(await isOpen(page)).toBe(false);
            await page.keyboard.press(shortcut);
            await expect(searchbox(page), shortcut).toHaveClass(/show/);
            await expect(page.locator('.searchbox-input')).toBeFocused();
            await expect(page.locator('.searchbox-input'), `${shortcut} is not typed`).toHaveValue('');
            await page.keyboard.press('Escape');
            await expect(searchbox(page)).not.toHaveClass(/show/);
        }
        // "/" can still be typed in the search box
        await button(page).click();
        await page.keyboard.type('a/b');
        await expect(page.locator('.searchbox-input')).toHaveValue('a/b');
        await expect(searchbox(page)).toHaveClass(/show/);
    });

    test('closes when the focus leaves it', async ({ page, visit }) => {
        await visit('/');
        await button(page).click();
        await expect(page.locator('.searchbox-input')).toBeFocused();
        await page.keyboard.press('Shift+Tab');
        await expect(searchbox(page)).not.toHaveClass(/show/);
        expect(await page.evaluate(() => document.querySelector('.searchbox').contains(document.activeElement))).toBe(false);
    });
});
