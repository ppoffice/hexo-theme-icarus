const { test, expect } = require('./fixtures');

const surface = page => page.locator('html').evaluate(el => getComputedStyle(el).backgroundColor);
const shape = locator => locator.evaluate(el => {
    const s = getComputedStyle(el);
    return [s.borderTopLeftRadius, s.borderTopRightRadius, s.borderBottomRightRadius, s.borderBottomLeftRadius, s.fontVariationSettings];
});

async function expectStableShape(page, locator) {
    await page.mouse.move(0, 0);
    const before = await shape(locator);
    await locator.hover();
    await expect.poll(() => shape(locator)).toEqual(before);
    await page.mouse.down();
    try {
        expect(await shape(locator)).toEqual(before);
        expect(await locator.evaluate(el => getComputedStyle(el).transitionProperty)).not.toMatch(/border-radius|font-variation-settings|--m3-card-r/);
    } finally {
        await page.mouse.move(0, 0);
        await page.mouse.up();
    }
}

test.describe('Material 3 Expressive', () => {
    test.use({ viewport: { width: 1600, height: 1000 } });
    test('follows the system only for auto and keeps forced appearances', async ({ page, visit, diagnostics }) => {
        await page.emulateMedia({ colorScheme: 'light' });
        await visit('/', { variant: 'm3e' });
        const light = await surface(page);
        expect(light).toBe('oklch(0.975 0.01 285)');
        await page.emulateMedia({ colorScheme: 'dark' });
        expect(await surface(page)).toBe('oklch(0.16 0.012 285)');
        await visit('/2024/05/01/m3e-light/', { variant: 'm3e' });
        expect(await surface(page)).toBe(light);
        await page.emulateMedia({ colorScheme: 'light' });
        await visit('/2024/05/02/m3e-dark/', { variant: 'm3e' });
        expect(await surface(page)).toBe('oklch(0.16 0.012 285)');
        expect(diagnostics.pageErrors).toEqual([]);
        expect(diagnostics.failedRequests).toEqual([]);
    });

    test('renders expressive cards and remains within a mobile viewport', async ({ page, visit }) => {
        await page.setViewportSize({ width: 375, height: 800 });
        await visit('/2023/07/01/typography/', { variant: 'm3e' });
        await expect(page.locator('.column-main > .card').first()).toHaveCSS('border-top-left-radius', '36px');
        await expect(page.locator('.card.widget[data-type="profile"]')).toHaveCSS('border-top-left-radius', '40px');
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
        await visit('/archives/', { variant: 'm3e' });
        await expect(page.locator('.timeline').first()).toBeVisible();
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
    });

    test('reduces card transitions as well as decorative animations', async ({ page, visit }) => {
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await visit('/', { variant: 'm3e' });
        const durations = await page.locator('.column-main > .card').first().evaluate(el => getComputedStyle(el).transitionDuration);
        expect(durations.split(',').every(value => parseFloat(value) <= 0.00001)).toBe(true);
        const duration = await page.locator('body').evaluate(el => getComputedStyle(el, '::before').animationDuration);
        expect(parseFloat(duration)).toBeLessThanOrEqual(0.00001);
    });

    test('keeps card containers, titles and thumbnails stable on hover and press', async ({ page, visit }) => {
        await visit('/', { variant: 'm3e' });
        for (const selector of ['.column-main > .card', '.article .title a',
            '.widget[data-type="profile"]', '.widget article.media .image']) {
            await expectStableShape(page, page.locator(selector + ':visible').first());
        }
    });

    test('keeps messages and archive thumbnails stable and leaves ellipses unfilled', async ({ page, visit }) => {
        await visit('/2023/07/01/typography/', { variant: 'm3e' });
        for (const selector of ['.message-header', '.message-body']) {
            await expectStableShape(page, page.locator(selector).first());
        }
        await visit('/archives/', { variant: 'm3e' });
        await expectStableShape(page, page.locator('.timeline .media .image').first());
        // A long paginator uses the same component as the smaller fixture paginator.
        await page.locator('.pagination-list').first().evaluate(el => {
            el.insertAdjacentHTML('beforeend', '<li><span class="pagination-ellipsis">…</span></li>');
        });
        await expect(page.locator('.pagination-ellipsis').first()).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    });

    test('keeps back-to-top square and shadowless at the footer', async ({ page, visit }) => {
        await visit('/2023/07/01/typography/', { variant: 'm3e' });
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        const button = page.locator('#back-to-top');
        await expect(button).toHaveClass(/is-rounded/);
        const size = await button.boundingBox();
        expect(size.width).toBe(size.height);
        await expect(button).toHaveCSS('box-shadow', 'none');
    });

    test('uses connected list rows in every list widget and readable post navigation', async ({ page, visit }) => {
        await visit('/2023/07/01/typography/', { variant: 'm3e' });
        await page.mouse.move(0, 0);
        const archive = page.locator('.widget[data-type="archives"] .menu-list a:visible').first();
        for (const type of ['categories', 'links', 'toc']) {
            const row = page.locator(`.widget[data-type="${type}"] .menu-list a:not(.is-active):visible`).first();
            await expect(row).toHaveCSS('background-color', 'oklch(0.95 0.015 285)');
        }
        await expect(archive).toHaveCSS('background-color', 'oklch(0.95 0.015 285)');
        const nav = page.locator('.post-navigation a').first();
        await nav.hover();
        await expect(nav).toHaveCSS('color', 'oklch(0.99 0.01 285)');
        await expect(nav.locator('span')).toHaveCSS('color', 'oklch(0.99 0.01 285)');
        const tags = page.locator('.article-tags');
        await expect(tags).toHaveCSS('align-items', 'center');
        await page.mouse.move(0, 0);
        const link = tags.locator('a').first();
        const chip = page.locator('.widget[data-type="tags"] .tags').first();
        expect((await shape(link)).slice(0, 4)).toEqual((await shape(chip)).slice(0, 4));
        expect(await link.evaluate(el => getComputedStyle(el).backgroundColor)).toBe(await chip.evaluate(el => getComputedStyle(el).backgroundColor));
    });

    test('styles count-free tags and unnumbered TOCs like their numbered versions', async ({ page, visit }) => {
        await visit('/2023/07/01/typography/', { variant: 'm3e' });
        const tag = page.locator('.widget[data-type="tags"] .tag').first();
        const tagStyle = await tag.evaluate(el => {
            const s = getComputedStyle(el);
            return { color: s.color, font: s.fontSize, opacity: s.opacity, height: s.height };
        });
        const headingStyle = await page.locator('#toc .level-left .level-item:last-child').first().evaluate(el => {
            const s = getComputedStyle(el);
            return { font: s.fontSize, family: s.fontFamily, weight: s.fontWeight };
        });
        await visit('/2024/05/03/m3e-components/', { variant: 'm3e' });
        expect(await page.locator('.widget[data-type="tags"] .tag').first().evaluate(el => {
            const s = getComputedStyle(el);
            return { color: s.color, font: s.fontSize, opacity: s.opacity, height: s.height };
        })).toEqual(tagStyle);
        expect(await page.locator('#toc .level-left .level-item').first().evaluate(el => {
            const s = getComputedStyle(el);
            return { font: s.fontSize, family: s.fontFamily, weight: s.fontWeight };
        })).toEqual(headingStyle);
        const input = page.locator('.widget[data-type="subscribe-email"] .input');
        await expect(input).toHaveCSS('border-top-left-radius', '12px');
        await expect(input).toHaveCSS('border-top-right-radius', '12px');
        await expect(page.locator('.widget[data-type="subscribe-email"] .button')).toHaveCSS('border-top-left-radius', '12px');
        await expect(input).toHaveCSS('height', '48px');
        await expect(input).toHaveCSS('border-top-width', '2px');
        await expect(page.locator('.widget[data-type="subscribe-email"] .icon')).toHaveCSS('height', '48px');
    });

    test('preserves semantic tags and gallery captions in light and dark appearances', async ({ page, visit }) => {
        await visit('/2024/05/03/m3e-components/', { variant: 'm3e' });
        for (const colorScheme of ['light', 'dark']) {
            await page.emulateMedia({ colorScheme });
            for (const [name, token] of [['success', 'success'], ['warning', 'warning'], ['danger', 'error']]) {
                const tag = page.locator(`.content a.tag.is-${name}`);
                const expected = await page.evaluate(token => {
                    const el = document.createElement('span');
                    el.style.color = `var(--m3-on-${token}-container)`;
                    document.body.appendChild(el);
                    const color = getComputedStyle(el).color;
                    el.remove();
                    return color;
                }, token);
                await expect(tag).toHaveCSS('color', expected);
                await tag.hover();
                await expect(tag).toHaveCSS('color', expected);
                await expect(tag).toHaveCSS('text-decoration-line', 'none');
            }
        }
        await expect(page.locator('.justified-gallery > a')).toHaveCSS('overflow', 'hidden');
        await expect(page.locator('.justified-gallery .caption')).toHaveCSS('border-bottom-right-radius', '16px');
        await expect(page.locator('.gallery-item a')).toHaveCSS('text-decoration-line', 'none');
        await expect(page.locator('.content blockquote')).toHaveCSS('border-inline-start-width', '0px');
        await expect(page.locator('.content blockquote')).toHaveCSS('border-top-left-radius', '28px');
    });

    test('lets donation popovers escape the card and uses a font chevron for Read more', async ({ page, visit }) => {
        await visit('/2023/07/01/typography/', { variant: 'm3e' });
        const donate = page.locator('.donate');
        await donate.hover();
        await expect(donate.locator('.qrcode')).toBeVisible();
        const clipped = await donate.locator('.qrcode').evaluate(el => {
            const qr = el.getBoundingClientRect();
            for (let node = el.parentElement; node; node = node.parentElement) {
                const s = getComputedStyle(node);
                const rect = node.getBoundingClientRect();
                if (s.overflowY === 'hidden' && (qr.top < rect.top || qr.bottom > rect.bottom)) return true;
            }
            return false;
        });
        expect(clipped).toBe(false);
        await visit('/', { variant: 'm3e' });
        const chevron = await page.locator('.article-more').first().evaluate(el => {
            const s = getComputedStyle(el, '::after');
            return { content: s.content, font: s.fontFamily };
        });
        expect(chevron.content).toBe('"\uf054"');
        expect(chevron.font).toContain('Font Awesome');
    });

    test('styles Algolia pagination, unlined hits and an inset close button', async ({ page, visit }) => {
        await visit('/', { variant: 'm3e' });
        // The selectors and hierarchy are those emitted by asset/js/algolia.js and InstantSearch.
        // No external search request is necessary to exercise the visual states.
        await page.locator('.searchbox').evaluate(el => {
            el.classList.add('show');
            el.querySelector('.searchbox-body').innerHTML = '<section class="searchbox-result-section"><a class="searchbox-result-item" href="/about/">Result one</a></section><section class="searchbox-result-section"><a class="searchbox-result-item" href="/about/">Result two</a></section>';
            el.querySelector('.searchbox-container').insertAdjacentHTML('beforeend', '<div class="searchbox-footer"><ul class="searchbox-pagination"><li class="searchbox-pagination-item disabled"><span class="searchbox-pagination-link">‹</span></li><li class="searchbox-pagination-item active"><a class="searchbox-pagination-link">1</a></li><li class="searchbox-pagination-item"><a class="searchbox-pagination-link">2</a></li></ul></div>');
        });
        const current = page.locator('.searchbox-pagination .active a');
        await expect(current).toHaveCSS('background-color', 'oklch(0.5 0.17 285)');
        await expect(current).toHaveCSS('border-top-left-radius', '20px');
        await expect(page.locator('.searchbox-pagination .disabled span')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
        await expect(page.locator('.searchbox-result-section').first()).toHaveCSS('border-bottom-width', '0px');
        const close = page.locator('.searchbox-close');
        await close.hover();
        const inset = await close.evaluate(el => {
            const button = el.getBoundingClientRect();
            const box = el.closest('.searchbox-container').getBoundingClientRect();
            return { top: button.top - box.top, right: box.right - button.right, width: button.width, height: button.height };
        });
        expect(inset).toEqual({ top: 8, right: 8, width: 40, height: 40 });
    });

    test('lets the entry script initialize cards and sidebars without CSS transition interference', async ({ page, visit }) => {
        await page.addInitScript(() => {
            const schedule = window.setTimeout;
            window.setTimeout = function(callback, delay, ...args) {
                if (!window.entryInitialization && document.documentElement.classList.contains('is-animating')) {
                    const cards = [...document.querySelectorAll('.column-main > .card, .column-left > .card, .column-right > .card')];
                    if (cards.length && cards.every(el => el.style.opacity === '0')) {
                        window.entryInitialization = cards.map(el => ({ inline: el.style.transitionDuration, computed: getComputedStyle(el).transitionDuration }));
                    }
                }
                return schedule(callback, delay, ...args);
            };
        });
        await visit('/', { variant: 'm3e-animation' });
        const states = await page.evaluate(() => window.entryInitialization);
        expect(states.length).toBeGreaterThan(2);
        expect(states.every(s => s.inline === '0s' && s.computed === '0s')).toBe(true);
        for (const selector of ['.column-main > .card:visible', '.column-left > .card:visible', '.column-right > .card:visible']) {
            await expect(page.locator(selector).first()).toHaveCSS('opacity', '1');
        }
    });

    test('morphs interactive shapes within bounded radii without press overshoot', async ({ page, visit }) => {
        await visit('/', { variant: 'm3e' });
        for (const [selector, target] of [['.navbar-start > a', 24], ['.article-more', 24],
            ['.widget[data-type="archives"] .menu-list a', 16], ['.widget[data-type="tags"] .tags', 15]]) {
            await page.mouse.move(0, 0);
            const link = page.locator(selector + ':visible').first();
            const start = await link.evaluate(el => parseFloat(getComputedStyle(el).borderTopLeftRadius));
            await link.hover();
            const radii = await link.evaluate(el => new Promise(resolve => {
                const values = [];
                const started = performance.now();
                function sample() {
                    values.push(parseFloat(getComputedStyle(el).borderTopLeftRadius));
                    if (performance.now() - started < 300) requestAnimationFrame(sample);
                    else resolve(values);
                }
                requestAnimationFrame(sample);
            }));
            expect(radii.every(value => value >= Math.min(start, target) - .01 && value <= Math.max(start, target) + .01)).toBe(true);
            await expect(link).toHaveCSS('border-top-left-radius', target + 'px');
            await page.mouse.down();
            await expect(link).toHaveCSS('border-top-left-radius', target + 'px');
            await page.mouse.move(0, 0);
            await page.mouse.up();
        }
    });

    test('uses archive tones on tags but leaves recent posts transparent', async ({ page, visit }) => {
        await visit('/2023/07/01/typography/', { variant: 'm3e' });
        const recent = page.locator('.widget[data-type="recent-posts"] article.media:visible').first();
        await expect(recent).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
        await recent.hover();
        await expect(recent).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
        for (const selector of ['.article-tags a', '.widget[data-type="tags"] .tags', '.widget[data-type="archives"] .menu-list a']) {
            await page.mouse.move(0, 0);
            const item = page.locator(selector + ':visible').first();
            await expect(item).toHaveCSS('background-color', 'oklch(0.95 0.015 285)');
            await item.hover();
            await expect(item).toHaveCSS('background-color', 'oklch(0.91 0.04 285)');
        }
    });

    test('spaces and shapes nested category and TOC rows identically', async ({ page, visit }) => {
        await visit('/2024/05/03/m3e-components/', { variant: 'm3e' });
        const geometry = [];
        for (const type of ['categories', 'toc']) {
            const group = page.locator(`.widget[data-type="${type}"] .menu-list li > ul`).first();
            await expect(group).toBeVisible();
            geometry.push(await group.evaluate(el => {
                const links = [...el.children].map(li => li.querySelector('a'));
                const s = getComputedStyle(el);
                return { margin: s.margin, padding: s.padding, border: s.borderInlineStartWidth,
                    corners: links.map(a => getComputedStyle(a).borderRadius),
                    gap: links[1].getBoundingClientRect().top - links[0].getBoundingClientRect().bottom };
            }));
        }
        expect(geometry[0].gap).toBe(2);
        expect(geometry[1]).toEqual(geometry[0]);
    });

    test('focuses search with a tonal field instead of a heavy outline and loads curved masks', async ({ page, visit }) => {
        await visit('/', { variant: 'm3e' });
        await page.locator('.searchbox').evaluate(el => el.classList.add('show'));
        const input = page.locator('.searchbox-input');
        await input.focus();
        await expect(input).toHaveCSS('outline-style', 'none');
        await expect(input).toHaveCSS('border-top-width', '0px');
        await expect(input).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
        await expect(input).toHaveCSS('box-shadow', 'none');
        await expect(page.locator('.searchbox-header')).toHaveCSS('background-color', 'oklch(0.9 0.08 285)');
        for (const [selector, file] of [['body', 'm3e-cookie12.svg'], ['html', 'm3e-flower.svg']]) {
            const mask = await page.locator(selector).evaluate(el => getComputedStyle(el, '::before').maskImage);
            expect(mask).toContain(file);
            const response = await page.request.get(new URL('/img/' + file, page.url()).href);
            expect(response.ok()).toBe(true);
            const svg = await response.text();
            expect(svg).toMatch(/<path d="M[^"]+C/);
            expect(svg).not.toMatch(/<path d="[^"]*L/);
        }
    });

    test('layers back-to-top above licensing but below the search dialog', async ({ page, visit }) => {
        await visit('/2023/07/01/typography/', { variant: 'm3e' });
        const license = page.locator('.article-licensing');
        await license.scrollIntoViewIfNeeded();
        const bounds = await license.boundingBox();
        const button = page.locator('#back-to-top');
        await button.evaluate((el, bounds) => {
            Object.assign(el.style, { left: bounds.x + 'px', top: bounds.y + 'px', bottom: 'auto', transform: 'none', opacity: '1' });
        }, bounds);
        await expect.poll(() => button.evaluate(el => {
            const r = el.getBoundingClientRect();
            return el.contains(document.elementFromPoint(r.x + (r.width / 2), r.y + (r.height / 2)));
        })).toBe(true);
        await page.locator('.searchbox').evaluate(el => el.classList.add('show'));
        await expect.poll(() => button.evaluate(el => {
            const r = el.getBoundingClientRect();
            return Boolean(document.elementFromPoint(r.x + (r.width / 2), r.y + (r.height / 2)).closest('.searchbox'));
        })).toBe(true);
    });

    test('fits the subscription field to its container rather than the viewport', async ({ page, visit }) => {
        await visit('/2024/05/03/m3e-components/', { variant: 'm3e' });
        const widget = page.locator('.widget[data-type="subscribe-email"]');
        for (const width of [180, 240, 320, 480]) {
            await widget.evaluate((el, width) => { el.style.width = width + 'px'; }, width);
            const layout = await widget.evaluate(el => {
                const field = el.querySelector('.field').getBoundingClientRect();
                const input = el.querySelector('.input').getBoundingClientRect();
                const button = el.querySelector('.button').getBoundingClientRect();
                return { field: field.width, input: input.width, button: button.width, stacked: button.top >= input.bottom,
                    overflow: Math.max(input.right, button.right) - field.right };
            });
            expect(layout.overflow).toBeLessThanOrEqual(1);
            expect(layout.input).toBeGreaterThanOrEqual(Math.min(160, layout.field));
            if (layout.field <= 240) {
                expect(layout.stacked).toBe(true);
                expect(layout.button).toBe(layout.field);
            } else {
                expect(layout.stacked).toBe(false);
            }
        }
    });

    test('uses a rounded surface instead of an oversized capsule on two-row navbars', async ({ page, visit }) => {
        await visit('/', { variant: 'm3e' });
        for (const width of [713, 769, 900, 1087]) {
            await page.setViewportSize({ width, height: 900 });
            await expect(page.locator('.navbar-container')).toHaveCSS('border-top-left-radius', '28px');
            // ResizeObserver/requestAnimationFrame refits the menu after resize.
            await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
        }
    });

    test('grows Profile and footer button corners on hover with transitions', async ({ page, visit }) => {
        await visit('/', { variant: 'm3e' });
        const profile = page.locator('.widget[data-type="profile"]:visible');
        const buttons = [...await profile.locator('nav.is-mobile > .level-item').all(), profile.locator('.button.is-primary')];
        for (const button of buttons) {
            await page.mouse.move(0, 0);
            const before = await button.evaluate(el => parseFloat(getComputedStyle(el).borderTopLeftRadius));
            await button.hover();
            await expect(button).toHaveCSS('border-top-left-radius', '24px');
            expect(before).toBeLessThan(24);
            expect(await button.evaluate(el => getComputedStyle(el).transitionProperty)).toContain('border-radius');
        }
        const footer = page.locator('.footer .level-end .button').first();
        await expect(footer).toHaveCSS('height', '44px');
        await expect(footer).toHaveCSS('border-top-left-radius', '12px');
        await footer.hover();
        await expect(footer).toHaveCSS('border-top-left-radius', '22px');
        await expect(footer).toHaveCSS('background-color', 'oklch(0.91 0.04 285)');
    });

    test('only grows corners on navigation, buttons, tags and post links', async ({ page, visit }) => {
        const corners = async locator => (await shape(locator)).slice(0, 4).map(parseFloat);
        const scenarios = [
            ['/', ['.navbar-start > a', '.navbar-end .navbar-item', '.article-more', '.pagination-next']],
            ['/page/2/', ['.pagination-previous']],
            ['/2023/07/01/typography/', ['.post-navigation a', 'figure.highlight .copy', '.article-tags a']],
            ['/2024/05/03/m3e-components/', ['.content a.tag']]
        ];
        for (const [path, selectors] of scenarios) {
            await visit(path, { variant: 'm3e' });
            for (const selector of selectors) {
                const button = page.locator(selector + ':visible').first();
                await page.mouse.move(0, 0);
                const before = await corners(button);
                await button.hover();
                await expect.poll(async () => {
                    const after = await corners(button);
                    return after.every((r, i) => r >= before[i]) && after.some((r, i) => r > before[i]);
                }, { message: selector }).toBe(true);
            }
        }
    });

    test('uses an opaque navbar surface for desktop submenus in light and dark modes', async ({ page, visit }) => {
        await visit('/', { variant: 'm3e' });
        await page.locator('.navbar-link').first().click();
        const dropdown = page.locator('.navbar-dropdown').first();
        await expect(dropdown).toBeVisible();
        for (const colorScheme of ['light', 'dark']) {
            await page.emulateMedia({ colorScheme });
            const background = await page.evaluate(() => {
                const probe = document.createElement('span');
                probe.style.backgroundColor = 'var(--m3-navbar)';
                document.body.appendChild(probe);
                const color = getComputedStyle(probe).backgroundColor;
                probe.remove();
                return color;
            });
            await expect(dropdown).toHaveCSS('background-color', background);
            expect(background).not.toContain('/');
        }
    });

    test('paints terminal flowers over the timeline tail eraser, including on hover', async ({ page, visit }) => {
        await visit('/archives/', { variant: 'm3e' });
        const markers = page.locator('.timeline .media:last-child');
        expect(await markers.count()).toBeGreaterThan(0);
        for (const row of await markers.all()) {
            await row.hover();
            const layers = await row.evaluate(el => ({ marker: getComputedStyle(el, '::before').zIndex, tail: getComputedStyle(el, '::after').zIndex }));
            expect(Number(layers.marker)).toBeGreaterThan(Number(layers.tail));
        }
    });

    test('removes search container corners only when the dialog fills the screen', async ({ page, visit }) => {
        await visit('/', { variant: 'm3e' });
        await page.locator('.searchbox').evaluate(el => el.classList.add('show'));
        const box = page.locator('.searchbox-container');
        for (const [width, height] of [[320, 700], [375, 800], [559, 800], [800, 400]]) {
            await page.setViewportSize({ width, height });
            await expect(box).toHaveCSS('border-radius', '0px');
            await expect(box).toHaveCSS('box-shadow', 'none');
            expect(await box.boundingBox()).toEqual({ x: 0, y: 0, width, height });
        }
        await page.setViewportSize({ width: 900, height: 900 });
        await expect(box).toHaveCSS('border-radius', '28px');
    });

    test('pairs Roboto Flex with variable Noto Sans SC while keeping code monospaced', async ({ page, visit }) => {
        await visit('/2023/07/01/typography/', { variant: 'm3e' });
        const family = await page.locator('body').evaluate(el => getComputedStyle(el).fontFamily);
        expect(family).toMatch(/^"Roboto Flex", "Noto Sans SC"/);
        await expect(page.locator('body')).toHaveCSS('font-optical-sizing', 'auto');
        const heading = page.locator('.article h1.title');
        await expect(heading).toHaveCSS('font-weight', '700');
        const axes = await heading.evaluate(el => getComputedStyle(el).fontVariationSettings);
        expect(axes).toContain('"wdth" 112');
        expect(axes).toContain('"opsz" 144');
        await visit('/', { variant: 'm3e' });
        const listTitle = page.locator('.article .title a').first();
        await expect(listTitle).toHaveCSS('font-weight', '700');
        const listAxes = await listTitle.evaluate(el => getComputedStyle(el).fontVariationSettings);
        expect(listAxes).toContain('"wdth" 108');
        expect(listAxes).toContain('"opsz" 144');
        await expectStableShape(page, listTitle);
        await visit('/2023/07/01/typography/', { variant: 'm3e' });
        const codeFamily = await page.locator('figure.highlight pre').first().evaluate(el => getComputedStyle(el).fontFamily);
        expect(codeFamily).toContain('Roboto Mono');
    });

    test('chips category names including the current category, keeping the index plain', async ({ page, visit }) => {
        await visit('/categories/Guides/Hexo/', { variant: 'm3e' });
        const path = page.locator('.column-main .breadcrumb');
        const links = path.locator('a');
        expect(await links.allTextContents()).toEqual(['Categories', 'Guides', 'Hexo']);
        expect(await links.evaluateAll(es => es.map(el => el.getAttribute('href')))).toEqual(['/categories/', '/categories/Guides/', '#']);
        await expect(links.first()).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
        await expect(links.first()).toHaveCSS('border-radius', '0px');
        await expect(links.first()).toHaveCSS('padding-left', '0px');
        const padding = await links.nth(1).evaluate(el => {
            const s = getComputedStyle(el);
            return { left: parseFloat(s.paddingLeft), right: parseFloat(s.paddingRight) };
        });
        expect(padding.left).toBeGreaterThan(8);
        expect(padding.left).toBe(padding.right);
        const ancestor = links.nth(1);
        await expect(ancestor).toHaveCSS('background-color', 'oklch(0.95 0.015 285)');
        await expect(ancestor).toHaveCSS('border-radius', '8px');
        await ancestor.hover();
        await expect(ancestor).toHaveCSS('border-radius', '16px');
        await expect(ancestor).toHaveCSS('text-decoration-line', 'none');
        await expect(links.last()).toHaveAttribute('aria-current', 'page');
        await expect(links.last()).toHaveCSS('background-color', 'oklch(0.95 0.015 285)');
        await expect(links.last()).toHaveCSS('color', 'oklch(0.42 0.025 285)');
        await expect(links.last()).toHaveCSS('border-radius', '8px');
        await expect(links.last()).toHaveCSS('pointer-events', 'none');
        await links.last().evaluate(el => { el.textContent = 'A-very-long-category-name-with-multiple-words-and-中文分类名称'; });
        for (const width of [375, 320]) {
            await page.setViewportSize({ width, height: 800 });
            const fits = await path.evaluate(el => {
                const r = el.getBoundingClientRect();
                return [...el.querySelectorAll('a')].every(a => a.getBoundingClientRect().right <= r.right + 1);
            });
            expect(fits).toBe(true);
            const bounds = await path.boundingBox();
            expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
        }
    });

    test('chips tag names including the current tag, keeping the index plain', async ({ page, visit }) => {
        await visit('/tags/hexo/', { variant: 'm3e' });
        const links = page.locator('.column-main .breadcrumb a');
        expect(await links.allTextContents()).toEqual(['Tags', 'hexo']);
        await expect(links.first()).toHaveAttribute('href', '/tags/');
        await expect(links.first()).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
        await expect(links.first()).toHaveCSS('border-radius', '0px');
        await expect(links.last()).toHaveAttribute('aria-current', 'page');
        await expect(links.last()).toHaveCSS('background-color', 'oklch(0.95 0.015 285)');
        await expect(links.last()).toHaveCSS('color', 'oklch(0.42 0.025 285)');
        await expect(links.last()).toHaveCSS('border-radius', '8px');
        await expect(links.last()).toHaveCSS('pointer-events', 'none');
    });
});
