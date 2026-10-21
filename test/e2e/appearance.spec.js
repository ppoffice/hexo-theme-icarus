const { test, expect } = require('./fixtures');

// The appearance setting: "appearance-auto" follows the system color scheme, "appearance-dark" is
// always dark and "default" (light) never is.
const POST = '/2023/07/01/typography/';
const NARROW = { width: 375, height: 800 };
const ATOM_ONE_DARK = 'rgb(40, 44, 52)';
const ATOM_ONE_LIGHT = 'rgb(250, 250, 250)';

/**
 * Colors of the elements matching a selector, as seen on the page: the text color and the
 * background behind it (the backgrounds of the element and its ancestors, blended), with the
 * relative luminance of both and their WCAG contrast ratio.
 */
function colorsOf(page, selector) {
    return page.locator(selector).evaluateAll(elements => {
        const parse = value => {
            const [r, g, b, a = 1] = value.match(/[\d.]+/g).map(Number);
            return { r, g, b, a };
        };
        const blend = (top, bottom) => ({
            r: (top.r * top.a) + (bottom.r * (1 - top.a)),
            g: (top.g * top.a) + (bottom.g * (1 - top.a)),
            b: (top.b * top.a) + (bottom.b * (1 - top.a)),
            a: 1
        });
        const luminance = ({ r, g, b }) => {
            const channel = value => {
                value /= 255;
                return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
            };
            return (0.2126 * channel(r)) + (0.7152 * channel(g)) + (0.0722 * channel(b));
        };
        return elements.map(el => {
            const layers = [];
            for (let node = el; node; node = node.parentElement) {
                layers.push(parse(getComputedStyle(node).backgroundColor));
            }
            // The canvas is white unless <html> has a background.
            const background = layers.reverse().reduce((under, layer) => blend(layer, under), { r: 255, g: 255, b: 255, a: 1 });
            const color = blend(parse(getComputedStyle(el).color), background);
            const [light, dark] = [luminance(color), luminance(background)].sort((a, b) => b - a);
            return {
                text: el.textContent.trim().slice(0, 30),
                color: luminance(color),
                background: luminance(background),
                contrast: (light + 0.05) / (dark + 0.05)
            };
        });
    });
}

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
});
