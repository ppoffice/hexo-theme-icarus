const fs = require('fs');
const path = require('path');
const { test, expect } = require('@playwright/test');
const { render } = require('../support/render');

// Exercise the real component, stylesheet and client renderer without a live third-party dependency.
// eslint-disable-next-line n/no-extraneous-require
const stylus = require(require.resolve('stylus', { paths: [require.resolve('hexo-renderer-stylus')] }));
const api = 'https://github-contributions-api.jogruber.de/v4/**';
const end = Date.parse('2026-10-24T00:00:00Z');
const contributions = Array.from({ length: 371 }, (_, i) => ({
    date: new Date(end - ((370 - i) * 86400000)).toISOString().slice(0, 10),
    count: i % 5,
    level: i % 5
}));
let html;
const styles = {};

test.beforeAll(async () => {
    await render(() => null);
    const Calendar = require('hexo-component-inferno/lib/view/widget/github_calendar');
    ({ html } = await render(Calendar.Cacheable, { widget: { username: 'octocat' } }));
    let filter;
    require('../../include/stylus')({ theme: { config: {} }, extend: { filter: { register: (name, fn) => {
        if (name === 'stylus:renderer') filter = fn;
    } } } });
    const stylusPlugin = filter;
    for (const variant of ['default', 'cyberpunk', 'm3e']) {
        const file = path.resolve(__dirname, '../../source/css/' + variant + '.styl');
        styles[variant] = await new Promise((resolve, reject) => stylus(fs.readFileSync(file, 'utf8')).set('filename', file).use(stylusPlugin)
            .render((err, output) => {
                if (err) reject(err);
                else resolve(output);
            }));
    }
});

async function mount(page, variant = 'default') {
    const calendarCss = fs.readFileSync(require.resolve('hexo-component-inferno/asset/css/github-calendar.css'), 'utf8');
    await page.setContent('<html lang="en"><head><style>' + calendarCss + styles[variant] + '</style></head><body><aside style="width:278px">' + html + '</aside></body></html>');
    await page.addScriptTag({ path: require.resolve('hexo-component-inferno/asset/js/github-calendar.js') });
    await page.evaluate(() => window.HexoGithubCalendar.init());
}

test('keeps fixed-size cells while changing the recent range without refetching', async ({ page }) => {
    let requests = 0;
    await page.route(api, route => {
        requests++;
        return route.fulfill({ json: { contributions } });
    });
    await mount(page);
    const cells = page.locator('.github-calendar-grid rect');
    await expect(cells.last()).toHaveAttribute('data-date', '2026-10-24');
    const first = await cells.first().getAttribute('data-date');
    for (const width of [448, 848, 278]) {
        await page.locator('aside').evaluate((el, width) => { el.style.width = width + 'px'; }, width);
        const available = await page.locator('.github-calendar-chart').evaluate(el => el.clientWidth);
        await expect.poll(() => page.locator('.github-calendar-grid svg').getAttribute('width')).toBe(String((Math.min(53, Math.floor((available + 3) / 14)) * 14) - 3));
        const metrics = await page.locator('.github-calendar-chart').evaluate(el => ({
            width: el.clientWidth, scroll: el.scrollWidth, cell: el.querySelector('rect').getBoundingClientRect().width
        }));
        expect(metrics.scroll).toBeLessThanOrEqual(metrics.width);
        expect(metrics.cell).toBe(11);
        await expect(cells.last()).toHaveAttribute('data-date', '2026-10-24');
    }
    await expect(cells.first()).toHaveAttribute('data-date', first);
    await expect(page.locator('.github-calendar-status')).toBeHidden();
    expect(await page.locator('.widget').innerText()).not.toContain('octocat');
    expect(requests).toBe(1);
});

test('aligns weekdays and renders zero counts, month labels and dark colors', async ({ page }) => {
    await page.route(api, route => route.fulfill({ json: { contributions } }));
    await mount(page);
    const last = page.locator('rect[data-date="2026-10-24"]');
    await expect(last).toHaveAttribute('y', '102'); // Saturday
    await expect(page.locator('rect[data-date="2026-10-23"]')).toHaveAttribute('y', '88');
    await expect(page.locator('rect[data-date="2026-10-24"] title')).toHaveText('Oct 24, 2026: 0');
    expect(await page.locator('svg text').count()).toBeGreaterThan(1);
    const light = await page.locator('svg text').first().evaluate(el => getComputedStyle(el).fill);
    await page.locator('html').evaluate(el => el.setAttribute('data-appearance', 'dark'));
    expect(await page.locator('svg text').first().evaluate(el => getComputedStyle(el).fill)).not.toBe(light);
    expect(await page.locator('rect[data-level="4"]').first().evaluate(el => getComputedStyle(el).fill)).not.toBe(
        await page.locator('rect[data-level="0"]').first().evaluate(el => getComputedStyle(el).fill));
});

test('does not hide May behind a partial April label at the start of the visible range', async ({ page }) => {
    await page.route(api, route => route.fulfill({ json: { contributions } }));
    await mount(page);
    await page.locator('aside').evaluate(el => { el.style.width = '450px'; });
    for (const weeks of [26, 27, 28]) {
        const width = (weeks * 14) - 3;
        await page.locator('.github-calendar-chart').evaluate((el, width) => { el.style.width = width + 'px'; }, width);
        await expect(page.locator('svg')).toHaveAttribute('width', String(width));
        await expect.poll(() => page.locator('svg text').allTextContents()).toContain('May');
        await expect(page.locator('rect[data-date^="2026-05-"]')).toHaveCount(31);
        const labels = await page.locator('svg text').evaluateAll(nodes => nodes.map(el => ({
            x: Number(el.getAttribute('x')), width: el.getComputedTextLength()
        })));
        for (let i = 1; i < labels.length; i++) {
            expect(labels[i].x).toBeGreaterThanOrEqual(labels[i - 1].x + labels[i - 1].width);
        }
    }
});

test('reinitializes after page replacement and reuses the cached request', async ({ page }) => {
    let requests = 0;
    await page.route(api, route => {
        requests++;
        return route.fulfill({ json: { contributions } });
    });
    await mount(page);
    await expect(page.locator('svg rect').last()).toHaveAttribute('data-date', '2026-10-24');
    await page.locator('aside').evaluate((el, html) => { el.innerHTML = html; }, html);
    await page.evaluate(() => window.HexoGithubCalendar.init());
    await expect(page.locator('svg rect').last()).toHaveAttribute('data-date', '2026-10-24');
    expect(requests).toBe(1);
});

for (const variant of ['default', 'cyberpunk', 'm3e']) {
    test(`${variant} follows its theme color and appearance while preserving a custom color`, async ({ page }) => {
        await page.route(api, route => route.fulfill({ json: { contributions } }));
        await mount(page, variant);
        const cell = page.locator('rect[data-level="4"]').first();
        await expect(cell).toBeVisible();
        const fill = () => cell.evaluate(el => getComputedStyle(el).fill);
        const light = await fill();
        await page.locator('html').evaluate(el => el.setAttribute('data-appearance', 'dark'));
        const dark = await fill();
        if (variant === 'cyberpunk') {
            expect(dark).toBe(light);
            expect(await page.locator('.github-calendar-chart').evaluate(el => getComputedStyle(el).getPropertyValue('--github-calendar-default-color').trim())).toBe('#fcee09');
        } else {
            expect(dark).not.toBe(light);
        }
        await page.locator('html').evaluate(el => el.setAttribute('data-appearance', 'auto'));
        await page.emulateMedia({ colorScheme: 'dark' });
        expect(await fill()).toBe(dark);
        await page.emulateMedia({ colorScheme: 'light' });
        expect(await fill()).toBe(light);
        if (variant === 'm3e') {
            await page.locator('html').evaluate(el => el.style.setProperty('--m3-h', '150'));
            expect(await fill()).not.toBe(light);
        }
        await page.locator('.github-calendar-chart').evaluate(el => el.style.setProperty('--github-calendar-color', '#40c463'));
        const custom = await fill();
        await page.locator('html').evaluate(el => el.setAttribute('data-appearance', 'dark'));
        expect(await fill()).toBe(custom);
    });
}

for (const [name, response] of [
    ['HTTP errors', { status: 503, body: 'Unavailable' }],
    ['empty data', { json: { contributions: [] } }],
    ['malformed data', { json: { contributions: [{ date: 'not-a-date', level: 8, count: -1 }] } }]
]) {
    test(`shows a usable GitHub fallback for ${name} and retries on reinitialization`, async ({ page }) => {
        let requests = 0;
        await page.route(api, route => {
            requests++;
            return route.fulfill(requests === 1 ? response : { json: { contributions } });
        });
        await mount(page);
        await expect(page.locator('.github-calendar-status')).toContainText('Could not load contributions');
        await expect(page.locator('.github-calendar-link')).toHaveText('GitHub Contributions');
        await expect(page.locator('.github-calendar-link')).toHaveAttribute('href', 'https://github.com/octocat?tab=overview');
        await page.evaluate(() => window.HexoGithubCalendar.init());
        await expect(page.locator('svg rect').last()).toHaveAttribute('data-date', '2026-10-24');
        expect(requests).toBe(2);
    });
}
