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
            expect(text.contrast).toBeGreaterThan(4.5);
            // A warning, on the background of the post: as dark (or light) as it.
            expect(Math.abs(text.background - content.background)).toBeLessThan(0.15);
            const edge = await page.locator(`${NOTICE} .message-body`).evaluate(el => getComputedStyle(el).borderLeftColor);
            expect(edge).not.toBe(await page.locator('.article > .content p').first().evaluate(el => getComputedStyle(el).color));
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
