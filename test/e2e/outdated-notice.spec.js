const { test, expect, colorsOf } = require('./fixtures');

// The "outdated-notice" variant shows it on posts last updated 365 days ago or more, in the
// browser of the reader, whatever the time of the build.
const POST = '/2024/03/01/hello-world/'; // updated on 2024-03-05 12:00:00 UTC
const DARK_POST = '/2024/04/07/outdated-dark/';
const CYBERPUNK_POST = '/2024/04/08/outdated-cyberpunk/';
const NOTICE = '.article-outdated';
const ago = days => `This post was last updated ${days} days ago. Some of its content may be outdated.`;

test.describe('outdated notice', () => {
    test('gives the number of days since the last update of an outdated post', async ({ page, visit, diagnostics }) => {
        await page.clock.setFixedTime(new Date('2025-03-15T12:00:00Z'));
        await visit(POST, { variant: 'outdated-notice' });
        await expect(page.locator(NOTICE)).toBeVisible();
        await expect(page.locator(NOTICE)).toHaveText(ago(375));
        await expect(page.locator(`${NOTICE} time`)).toHaveAttribute('datetime', '2024-03-05T12:00:00.000Z');
        expect(diagnostics.pageErrors).toEqual([]);
    });

    test('is hidden on a post updated less than the configured days ago, even if it was outdated at build time', async ({ page, visit }) => {
        await page.clock.setFixedTime(new Date('2025-03-04T12:00:00Z'));
        await visit(POST, { variant: 'outdated-notice' });
        await expect(page.locator(NOTICE)).toHaveCount(1);
        await expect(page.locator(NOTICE)).toBeHidden();
    });

    test('is not shown on the index, nor on posts that turn it off', async ({ page, visit }) => {
        await visit('/', { variant: 'outdated-notice' });
        await expect(page.locator('.column-main .article')).not.toHaveCount(0);
        await expect(page.locator(NOTICE)).toHaveCount(0);
        await visit('/2024/04/09/outdated-off/', { variant: 'outdated-notice' });
        await expect(page.locator(NOTICE)).toHaveCount(0);
    });

    test('is not shown when disabled', async ({ page, visit }) => {
        await visit(POST);
        await expect(page.locator(NOTICE)).toHaveCount(0);
    });

    test('is shown again after a PJAX navigation', async ({ page, visit, diagnostics }) => {
        await page.clock.setFixedTime(new Date('2025-04-17T10:00:00Z'));
        await visit(DARK_POST, { variant: 'outdated-notice' });
        await expect(page.locator(NOTICE)).toHaveText(ago(375));
        await page.evaluate(() => { window.notReloaded = true; });

        const done = page.evaluate(() => new Promise(resolve => document.addEventListener('pjax:complete', resolve, { once: true })));
        await page.locator(`.content a[href="${CYBERPUNK_POST}"]`).click();
        await done;
        await expect(page.locator(NOTICE)).toBeVisible();
        await expect(page.locator(NOTICE)).toHaveText(ago(374));
        expect(await page.evaluate(() => window.notReloaded)).toBe(true);
        expect(diagnostics.pageErrors).toEqual([]);
    });

    for (const [description, urlPath] of [['light', POST], ['dark', DARK_POST], ['cyberpunk', CYBERPUNK_POST]]) {
        test(`is readable on a ${description} post`, async ({ page, visit }) => {
            await visit(urlPath, { variant: 'outdated-notice' });
            await expect(page.locator(NOTICE)).toBeVisible();
            const [text] = await colorsOf(page, `${NOTICE} .article-outdated-text`);
            const [content] = await colorsOf(page, '.article > .content p');
            // The colors of the other warning messages (Bulma's light text only reaches about 4.2)
            expect(text.contrast).toBeGreaterThan(4);
            const textColor = selector => page.locator(selector).first().evaluate(el => getComputedStyle(el).color);
            await page.locator('.article > .content').evaluate(el => el.insertAdjacentHTML('afterbegin',
                '<div class="message is-warning" id="reference"><div class="message-body">Reference</div></div>'));
            expect(await textColor(`${NOTICE} .message-body`)).toBe(await textColor('#reference .message-body'));
            await page.locator('#reference').evaluate(el => el.remove());
            // A warning, on the background of the post: as dark (or light) as it.
            expect(Math.abs(text.background - content.background)).toBeLessThan(0.15);
            const background = selector => page.locator(selector).first().evaluate(el => getComputedStyle(el).backgroundColor);
            expect(await background(NOTICE)).not.toBe(await background('.column-main .card'));
            // Immersive: across the whole width of the card
            const box = selector => page.locator(selector).first().boundingBox();
            const [notice, card] = [await box(NOTICE), await box('.column-main .card')];
            expect(Math.abs(notice.x - card.x)).toBeLessThan(1);
            expect(Math.abs(notice.width - card.width)).toBeLessThan(1);
            // The wrapped text lines up with its first line, after the icon
            await page.setViewportSize({ width: 375, height: 800 });
            const lines = await page.locator(`${NOTICE} .article-outdated-text`).evaluate(el => {
                const range = document.createRange();
                range.selectNodeContents(el);
                // The start of each line: the leftmost of the boxes on it
                const starts = {};
                for (const rect of range.getClientRects()) {
                    const top = Math.round(rect.top);
                    starts[top] = Math.min(starts[top] === undefined ? Infinity : starts[top], Math.round(rect.left));
                }
                return Object.values(starts);
            });
            expect(lines.length).toBeGreaterThan(1);
            expect(new Set(lines).size).toBe(1);
        });
    }

    test.describe('without JavaScript', () => {
        test.use({ javaScriptEnabled: false });

        test('gives the date of the last update of a post outdated at build time', async ({ page, visit }) => {
            await visit(POST, { variant: 'outdated-notice' });
            await expect(page.locator(NOTICE)).toBeVisible();
            await expect(page.locator(NOTICE)).toHaveText('This post was last updated on 2024-03-05. Some of its content may be outdated.');
        });
    });
});
