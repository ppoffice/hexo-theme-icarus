const { test, expect } = require('./fixtures');

test.describe('code blocks', () => {
    test.beforeEach(async ({ visit }) => {
        await visit('/2024/02/20/code-blocks/');
    });

    test('get the hljs class and highlight-prefixed token classes', async ({ page }) => {
        const blocks = page.locator('figure.highlight');
        await expect(blocks).toHaveCount(3);
        for (const block of await blocks.all()) {
            await expect(block).toHaveClass(/\bhljs\b/);
        }
        await expect(page.locator('figure.highlight .code .line span.hljs-keyword').first()).toBeVisible();
        await expect(page.locator('figure.highlight .code .line span.keyword')).toHaveCount(0);
    });

    test('are colored by the configured highlight.js theme (atom-one-light)', async ({ page }) => {
        const keyword = page.locator('figure.highlight .code .line span.hljs-keyword').first();
        await expect(keyword).toHaveCSS('color', 'rgb(166, 38, 164)');
    });

    test('each block gets a copy button that copies the code', async ({ page, context }) => {
        await context.grantPermissions(['clipboard-read', 'clipboard-write']);
        const buttons = page.locator('figure.highlight figcaption .copy');
        await expect(buttons).toHaveCount(3);
        await buttons.first().click();
        const copied = await page.evaluate(() => navigator.clipboard.readText());
        expect(copied).toContain('const answer = 42;');
        expect(copied).toContain('console.log(answer);');
    });

    test('a block marked >folded starts folded and toggles on click', async ({ page }) => {
        const folded = page.locator('figure.highlight').nth(1);
        await expect(folded).toHaveClass(/\bfolded\b/);
        await expect(folded.locator('figcaption')).not.toContainText('>folded');
        await expect(folded.locator('.highlight-body')).toBeHidden();
        await folded.locator('figcaption .level-left').click();
        await expect(folded).not.toHaveClass(/\bfolded\b/);
        await expect(folded.locator('.highlight-body')).toBeVisible();
        await folded.locator('figcaption .level-left').click();
        await expect(folded).toHaveClass(/\bfolded\b/);
    });

    test('other blocks start unfolded with a fold toggle', async ({ page }) => {
        const first = page.locator('figure.highlight').first();
        await expect(first).not.toHaveClass(/\bfolded\b/);
        await expect(first.locator('figcaption .fold i')).toHaveClass(/fa-angle-down/);
        await expect(first.locator('.highlight-body')).toBeVisible();
    });

    test('caption text is kept in the left part of the caption bar', async ({ page }) => {
        await expect(page.locator('figure.highlight').first().locator('figcaption .level-left')).toContainText('Captioned example');
    });
});

test('a highlight span without a class does not break the page script', async ({ page, visit, diagnostics }) => {
    await visit('/2023/09/01/classless-span/');
    expect(diagnostics.pageErrors).toEqual([]);
    await expect(page.locator('figure.highlight .copy')).toHaveCount(2);
    const plain = page.locator('figure.highlight').first().locator('.code .line > span');
    await expect(plain).toHaveText('no class here');
    expect(await plain.getAttribute('class')).toBeFalsy();
});
