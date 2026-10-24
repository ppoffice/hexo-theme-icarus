const { test, expect, colorsOf } = require('./fixtures');

// The appearance setting: "appearance-auto" follows the system color scheme, "appearance-dark" is
// always dark and "default" (light) never is.
const POST = '/2023/07/01/typography/';
const NARROW = { width: 375, height: 800 };
const ATOM_ONE_DARK = 'rgb(40, 44, 52)';
const ATOM_ONE_LIGHT = 'rgb(250, 250, 250)';

async function colorOf(page, selector) {
    const colors = await colorsOf(page, selector);
    expect(colors.length, selector).toBeGreaterThan(0);
    return colors[0];
}

const isDark = colors => colors.background < 0.05 && colors.color > 0.3;
const isLight = colors => colors.background > 0.8 && colors.color < 0.2;

/** The image each logo shows (navbar, footer) and its size. */
function logos(page) {
    return page.locator('.navbar-logo img, .footer-logo img').evaluateAll(images => Promise.all(images.map(async img => {
        await img.decode();
        const { width, height } = img.getBoundingClientRect();
        return { src: new URL(img.currentSrc).pathname, width: Math.round(width), height: Math.round(height) };
    })));
}

const codeBackground = page => page.locator('figure.highlight').first().evaluate(el => getComputedStyle(el).backgroundColor);

test.describe('manual appearance toggle', () => {
    for (const colorScheme of ['light', 'dark']) {
        test(`overrides a ${colorScheme} system, including logos and code, and survives reload`, async ({ page, visit, diagnostics }) => {
            await page.emulateMedia({ colorScheme });
            await visit(POST, { variant: 'appearance-auto' });
            const toggle = page.getByRole('button', { name: 'Toggle dark mode' });
            await expect(toggle).toBeVisible();
            await toggle.click();
            const dark = colorScheme === 'light';
            await expect(page.locator('html')).toHaveAttribute('data-appearance', dark ? 'dark' : 'light');
            await expect(toggle).toHaveAttribute('aria-pressed', String(dark));
            await expect.poll(() => codeBackground(page)).toBe(dark ? ATOM_ONE_DARK : ATOM_ONE_LIGHT);
            expect((await logos(page)).map(logo => logo.src)).toEqual(Array(2).fill(dark ? '/img/logo-dark.svg' : '/img/logo.svg'));
            expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe(dark ? 'dark' : 'light');
            await page.reload();
            await expect(page.locator('html')).toHaveAttribute('data-appearance', dark ? 'dark' : 'light');
            await expect.poll(() => codeBackground(page)).toBe(dark ? ATOM_ONE_DARK : ATOM_ONE_LIGHT);
            expect(diagnostics.pageErrors).toEqual([]);
        });
    }

    test('fixed pages have no toggle', async ({ page, visit }) => {
        for (const variant of ['default', 'appearance-dark', 'cyberpunk']) {
            await visit('/', { variant });
            await expect(page.locator('.appearance-toggle')).toHaveCount(0);
        }
    });

    test('tracks system changes until a manual choice, including on mobile', async ({ page, visit }) => {
        await page.setViewportSize(NARROW);
        await page.emulateMedia({ colorScheme: 'light' });
        await visit(POST, { variant: 'appearance-auto' });
        const toggle = page.getByRole('button', { name: 'Toggle dark mode' });
        await expect(toggle).toBeVisible();
        await expect(toggle).toHaveAttribute('aria-pressed', 'false');
        await page.emulateMedia({ colorScheme: 'dark' });
        await expect(toggle).toHaveAttribute('aria-pressed', 'true');
        await toggle.focus();
        await page.keyboard.press('Enter');
        await expect(page.locator('html')).toHaveAttribute('data-appearance', 'light');
        await page.emulateMedia({ colorScheme: 'light' });
        await page.emulateMedia({ colorScheme: 'dark' });
        await expect(toggle).toHaveAttribute('aria-pressed', 'false');
        expect(isLight(await colorOf(page, '.column-main .card'))).toBe(true);
    });
});

/**
 * The article licensing block (a .box) is flat in every appearance: no shadow, and set apart from
 * the card it is in by a lighter background only.
 */
async function expectFlatLicensing(page, dark) {
    const styles = await page.locator('.article-licensing').first().evaluate(el => {
        const style = element => getComputedStyle(element);
        return {
            shadow: style(el).boxShadow,
            background: style(el).backgroundColor,
            card: style(el.closest('.card')).backgroundColor
        };
    });
    expect(styles.shadow).toBe('none');
    expect(styles.background).not.toBe(styles.card);
    expect(isDark(await colorOf(page, '.article-licensing .licensing-title a'))).toBe(dark);
}

async function expectReadable(page, selectors) {
    for (const selector of selectors) {
        const elements = await colorsOf(page, selector);
        expect(elements.length, selector).toBeGreaterThan(0);
        for (const colors of elements) {
            expect(colors.contrast, `${selector} "${colors.text}"`).toBeGreaterThanOrEqual(4.5);
        }
    }
}

test.describe('appearance: auto, with a dark system color scheme', () => {
    test.use({ colorScheme: 'dark' });

    test('pages are dark, with the dark code highlight theme', async ({ page, visit, diagnostics }) => {
        await visit(POST, { variant: 'appearance-auto' });
        for (const selector of ['body', '.column-main .card', '.navbar-main', 'body > footer.footer', '.column-left .widget']) {
            expect(isDark(await colorOf(page, selector)), selector).toBe(true);
        }
        expect(await codeBackground(page)).toBe(ATOM_ONE_DARK);
        expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe('dark');
        expect(diagnostics.pageErrors).toEqual([]);
        expect(diagnostics.consoleErrors).toEqual([]);
        expect(diagnostics.failedRequests).toEqual([]);
    });

    test('the article licensing block is flat, lighter than its card', async ({ page, visit }) => {
        await visit(POST, { variant: 'appearance-auto' });
        await expectFlatLicensing(page, true);
    });

    test('the navbar and footer show the dark logo, at the size of the logo', async ({ page, visit }) => {
        await visit('/');
        const light = await logos(page);
        await visit('/', { variant: 'appearance-auto' });
        const dark = await logos(page);
        expect(dark.map(logo => logo.src)).toEqual(['/img/logo-dark.svg', '/img/logo-dark.svg']);
        expect(dark.map(({ width, height }) => [width, height])).toEqual(light.map(({ width, height }) => [width, height]));
        expect(dark[0].height).toBeGreaterThan(0);
    });

    test('text, muted text and links are readable (WCAG AA contrast)', async ({ page, visit }) => {
        await visit(POST, { variant: 'appearance-auto' });
        await expectReadable(page, [
            '.content > p', '.content li', '.content blockquote p', '.content td',
            '.article-meta', '.menu-label', 'article.media .date', 'article.media .categories',
            '.content > p a', '.content blockquote a', '.message-body a', 'footer.footer a',
            '.navbar-start .navbar-item', '#toc .menu-list a',
            '.article-licensing .licensing-title a', '.widget .menu-list a .level-item:not(.tag)'
        ]);
        // Buttons keep their own colors when hovered
        await page.locator('.donate').first().hover();
        await expectReadable(page, ['.donate']);
        await visit('/', { variant: 'appearance-auto' });
        await page.locator('.article-more').first().hover();
        await expectReadable(page, ['.navbar-item.is-active', '.pagination-link', '.pagination-next a', '.article-more', '.widget .tags .tag']);
    });

    test('the navbar sub-menu drop-down is dark', async ({ page, visit }) => {
        await visit('/', { variant: 'appearance-auto' });
        await page.locator('.navbar-start .navbar-link').click();
        const dropdown = page.locator('.navbar-start .navbar-dropdown');
        await expect(dropdown).toBeVisible();
        expect(isDark(await colorOf(page, '.navbar-start .navbar-dropdown a'))).toBe(true);
        await expectReadable(page, ['.navbar-start .navbar-dropdown a']);
        // Hovered links stay readable
        await dropdown.locator('a').first().hover();
        await expectReadable(page, ['.navbar-start .navbar-dropdown a']);
    });

    test('the folded navbar menu and its sub-menu are dark on mobile', async ({ page, visit }) => {
        await page.setViewportSize(NARROW);
        await visit('/', { variant: 'appearance-auto' });
        await page.locator('.navbar-toggle').click();
        await page.locator('.navbar-start .navbar-link').click();
        await expect(page.locator('.navbar-start .navbar-dropdown a').first()).toBeVisible();
        for (const selector of ['.navbar-start .navbar-item:not(.is-active)', '.navbar-start .navbar-dropdown a']) {
            expect(isDark(await colorOf(page, selector)), selector).toBe(true);
        }
        await expectReadable(page, ['.navbar-start .navbar-item', '.navbar-start .navbar-dropdown a']);
        await page.locator('.navbar-start .navbar-dropdown a').first().hover();
        expect(isDark(await colorOf(page, '.navbar-start .navbar-dropdown a:hover'))).toBe(true);
        await expectReadable(page, ['.navbar-start .navbar-dropdown a:hover']);
    });

    test('the table of contents over the page is dark on mobile', async ({ page, visit }) => {
        await page.setViewportSize(NARROW);
        await visit(POST, { variant: 'appearance-auto' });
        await page.locator('.navbar-main .catalogue').click();
        await expect(page.locator('#toc')).toBeVisible();
        await expect(page.locator('#toc-mask')).toBeVisible();
        expect(isDark(await colorOf(page, '#toc .menu-label'))).toBe(true);
        await expectReadable(page, ['#toc .menu-label', '#toc .menu-list a']);
    });
});

test.describe('appearance: auto, with a light system color scheme', () => {
    test.use({ colorScheme: 'light' });

    test('pages are light, with the light code highlight theme', async ({ page, visit, diagnostics }) => {
        await visit(POST, { variant: 'appearance-auto' });
        for (const selector of ['body', '.column-main .card', '.navbar-main', 'body > footer.footer']) {
            expect(isLight(await colorOf(page, selector)), selector).toBe(true);
        }
        expect(await codeBackground(page)).toBe(ATOM_ONE_LIGHT);
        expect((await logos(page)).map(logo => logo.src)).toEqual(['/img/logo.svg', '/img/logo.svg']);
        expect(diagnostics.consoleErrors).toEqual([]);
    });
});

test.describe('appearance: dark', () => {
    for (const colorScheme of ['light', 'dark']) {
        test.describe(`with a ${colorScheme} system color scheme`, () => {
            test.use({ colorScheme });

            test('pages are dark, with the dark code highlight theme', async ({ page, visit, diagnostics }) => {
                await visit(POST, { variant: 'appearance-dark' });
                for (const selector of ['body', '.column-main .card', '.navbar-main', 'body > footer.footer']) {
                    expect(isDark(await colorOf(page, selector)), selector).toBe(true);
                }
                expect(await codeBackground(page)).toBe(ATOM_ONE_DARK);
                expect((await logos(page)).map(logo => logo.src)).toEqual(['/img/logo-dark.svg', '/img/logo-dark.svg']);
                await expectReadable(page, ['.content > p', '.article-meta', '.menu-label', '.content > p a', '.navbar-start .navbar-item']);
                expect(diagnostics.consoleErrors).toEqual([]);
                expect(diagnostics.failedRequests).toEqual([]);
            });

            test('the article licensing block is flat, lighter than its card', async ({ page, visit }) => {
                await visit(POST, { variant: 'appearance-dark' });
                await expectFlatLicensing(page, true);
            });
        });
    }
});

test.describe('appearance: light (the default)', () => {
    test.use({ colorScheme: 'dark' });

    test('pages stay light with a dark system color scheme', async ({ page, visit }) => {
        await visit(POST);
        for (const selector of ['body', '.column-main .card', '.navbar-main', 'body > footer.footer']) {
            expect(isLight(await colorOf(page, selector)), selector).toBe(true);
        }
        expect(await codeBackground(page)).toBe(ATOM_ONE_LIGHT);
        expect((await logos(page)).map(logo => logo.src)).toEqual(['/img/logo.svg', '/img/logo.svg']);
        expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe('normal');
    });

    test('the article licensing block is flat, darker than its card', async ({ page, visit }) => {
        await visit(POST);
        await expectFlatLicensing(page, false);
    });
});

test.describe('appearance per page (front-matter)', () => {
    const DARK_POST = '/2024/04/02/dark-appearance/';
    const AUTO_POST = '/2024/04/01/auto-appearance/';
    const LIGHT_POST = '/2024/02/20/code-blocks/';
    const state = page => page.evaluate(() => ({
        attribute: document.documentElement.getAttribute('data-appearance'),
        colorScheme: (document.querySelector('meta[name="color-scheme"]') || {}).content || null,
        themes: Array.from(document.querySelectorAll('link[href*="highlight.js"]'), link => link.href.split('/').pop() + (link.media ? ' ' + link.media : ''))
    }));

    /** Click a link and wait until PJAX has swapped the page in and re-run its scripts. */
    async function pjaxClick(page, locator) {
        const done = page.evaluate(() => new Promise(resolve => document.addEventListener('pjax:complete', resolve, { once: true })));
        await locator.click();
        await done;
        await page.waitForLoadState('networkidle');
    }

    test('PJAX keeps a manual choice on auto pages without overriding fixed pages', async ({ page, visit, diagnostics }) => {
        await page.emulateMedia({ colorScheme: 'light' });
        await visit('/', { variant: 'appearance-per-page' });
        await page.evaluate(() => { window.notReloaded = true; });
        await pjaxClick(page, page.locator(`.column-main a[href="${AUTO_POST}"]`).first());
        const toggle = page.getByRole('button', { name: 'Toggle dark mode' });
        await toggle.click();
        await expect(page.locator('html')).toHaveAttribute('data-appearance', 'dark');
        await pjaxClick(page, page.locator(`.content a[href="${LIGHT_POST}"]`));
        await expect(page.locator('.appearance-toggle')).toHaveCount(0);
        expect(isLight(await colorOf(page, '.column-main .card'))).toBe(true);
        await expect.poll(() => codeBackground(page)).toBe(ATOM_ONE_LIGHT);
        await pjaxClick(page, page.locator('.navbar-logo'));
        await pjaxClick(page, page.locator(`.column-main a[href="${AUTO_POST}"]`).first());
        await expect(toggle).toHaveAttribute('aria-pressed', 'true');
        await expect(page.locator('html')).toHaveAttribute('data-appearance', 'dark');
        expect((await logos(page)).map(logo => logo.src)).toEqual(Array(2).fill('/img/logo-dark.svg'));
        await expect.poll(() => codeBackground(page)).toBe(ATOM_ONE_DARK);
        // A repeated visit must not add another click handler.
        await toggle.click();
        await expect(page.locator('html')).toHaveAttribute('data-appearance', 'light');
        expect(await page.evaluate(() => window.notReloaded)).toBe(true);
        expect(diagnostics.pageErrors).toEqual([]);
        expect(diagnostics.failedRequests).toEqual([]);
    });

    test.describe('with a light system color scheme', () => {
        test.use({ colorScheme: 'light' });

        test('a dark post is dark while the other pages stay light', async ({ page, visit, diagnostics }) => {
            await visit('/', { variant: 'appearance-per-page' });
            expect(isLight(await colorOf(page, '.column-main .card'))).toBe(true);
            await visit(DARK_POST, { variant: 'appearance-per-page' });
            for (const selector of ['body', '.column-main .card', '.navbar-main', 'body > footer.footer']) {
                expect(isDark(await colorOf(page, selector)), selector).toBe(true);
            }
            expect(await codeBackground(page)).toBe(ATOM_ONE_DARK);
            expect((await logos(page)).map(logo => logo.src)).toEqual(['/img/logo-dark.svg', '/img/logo-dark.svg']);
            await expectReadable(page, ['.content > p', '.article-meta', '.menu-label', '.content > p a', '.navbar-start .navbar-item']);
            expect(diagnostics.consoleErrors).toEqual([]);
        });
    });

    test.describe('with a dark system color scheme', () => {
        test.use({ colorScheme: 'dark' });

        test('PJAX switches the appearance from page to page without reloading', async ({ page, visit, diagnostics }) => {
            await visit('/', { variant: 'appearance-per-page' });
            await page.evaluate(() => { window.notReloaded = true; });
            expect(await state(page)).toEqual({ attribute: null, colorScheme: null, themes: ['atom-one-light.css'] });
            expect(isLight(await colorOf(page, '.column-main .card'))).toBe(true);

            const expectPage = async (expected, dark, logo) => {
                expect(await state(page)).toEqual(expected);
                for (const selector of ['body', '.column-main .card', '.navbar-main', 'body > footer.footer']) {
                    expect((dark ? isDark : isLight)(await colorOf(page, selector)), selector).toBe(true);
                }
                await expect.poll(() => codeBackground(page)).toBe(dark ? ATOM_ONE_DARK : ATOM_ONE_LIGHT);
                expect((await logos(page)).map(({ src }) => src)).toEqual([logo, logo]);
                expect(await page.evaluate(() => window.notReloaded)).toBe(true);
            };

            await pjaxClick(page, page.locator(`.column-main a[href="${DARK_POST}"]`).first());
            await expectPage({ attribute: 'dark', colorScheme: 'dark', themes: ['atom-one-dark.css'] }, true, '/img/logo-dark.svg');

            await pjaxClick(page, page.locator(`.content a[href="${AUTO_POST}"]`));
            await expectPage({
                attribute: 'auto',
                colorScheme: 'light dark',
                themes: ['atom-one-light.css (prefers-color-scheme: light)', 'atom-one-dark.css (prefers-color-scheme: dark)']
            }, true, '/img/logo-dark.svg');

            await pjaxClick(page, page.locator(`.content a[href="${LIGHT_POST}"]`));
            await expectPage({ attribute: null, colorScheme: null, themes: ['atom-one-light.css'] }, false, '/img/logo.svg');

            // The logos, whose images were switched, still navigate with PJAX
            for (const locator of ['.navbar-logo', `.column-main a[href="${DARK_POST}"] >> nth=0`, '.footer-logo']) {
                await pjaxClick(page, page.locator(locator));
            }
            await expect(page).toHaveURL(/\/$/);
            expect(await state(page)).toEqual({ attribute: null, colorScheme: null, themes: ['atom-one-light.css'] });
            expect(await page.evaluate(() => window.notReloaded)).toBe(true);

            expect(diagnostics.pageErrors).toEqual([]);
            expect(diagnostics.consoleErrors).toEqual([]);
            expect(diagnostics.failedRequests).toEqual([]);
        });
    });
});
