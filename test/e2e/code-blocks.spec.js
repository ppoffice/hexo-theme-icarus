const { test, expect } = require('./fixtures');

const opacity = locator => locator.evaluate(el => getComputedStyle(el).opacity);

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
        const buttons = page.locator('figure.highlight figcaption button.copy');
        await expect(buttons).toHaveCount(3);
        await buttons.first().click();
        const copied = await page.evaluate(() => navigator.clipboard.readText());
        expect(copied.trim()).toBe('const answer = 42;\nconsole.log(answer);');
        expect(await page.evaluate(() => String(window.getSelection())), 'selection is cleared').toBe('');
    });

    test('copy buttons are labelled and confirm a copy', async ({ page, context }) => {
        await context.grantPermissions(['clipboard-read', 'clipboard-write']);
        const button = page.locator('figure.highlight button.copy').nth(2);
        await expect(button).toHaveAttribute('aria-label', 'Copy');
        await expect(button).toHaveAttribute('type', 'button');
        await button.focus();
        await page.keyboard.press('Enter');
        await expect(button).toHaveAttribute('aria-label', 'Copied!');
        await expect(button.locator('i')).toHaveClass(/fa-check/);
        expect((await page.evaluate(() => navigator.clipboard.readText())).trim()).toBe('let x = 1;');
        await expect(button).toHaveAttribute('aria-label', 'Copy', { timeout: 5000 });
        await expect(button.locator('i')).toHaveClass(/fa-copy/);
    });

    test('copy buttons only show while the mouse is over their code block', async ({ page }) => {
        const block = page.locator('figure.highlight').first();
        const button = block.locator('button.copy');
        const other = page.locator('figure.highlight').nth(2).locator('button.copy');
        await page.mouse.move(0, 0);
        await expect(button).toHaveCSS('opacity', '0');
        await block.locator('.highlight-body').hover();
        await expect.poll(async () => Number(await opacity(button))).toBeGreaterThan(0);
        await expect(other, 'only the hovered block shows its button').toHaveCSS('opacity', '0');
        await page.mouse.move(0, 0);
        await expect(button).toHaveCSS('opacity', '0');
    });

    test('a copy button shows while it has keyboard focus', async ({ page }) => {
        const button = page.locator('figure.highlight button.copy').first();
        // Start keyboard navigation from the text above the block, a few Tab presses from its button.
        await page.locator('.article .content p', { hasText: 'A code block with a caption:' }).click();
        await page.mouse.move(0, 0);
        await expect(button).toHaveCSS('opacity', '0');
        for (let i = 0; i < 10 && !await button.evaluate(el => el === document.activeElement); i++) {
            await page.keyboard.press('Tab');
        }
        await expect(button).toBeFocused();
        await expect(button).toHaveCSS('opacity', '1');
        await page.keyboard.press('Shift+Tab');
        await expect(button, 'hidden again once focus leaves the block').toHaveCSS('opacity', '0');
    });

    test('code blocks keep their own ids', async ({ page }) => {
        await expect(page.locator('figure.highlight[id^="code-"]')).toHaveCount(0);
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

test.describe('code blocks on a touch screen', () => {
    test.use({ hasTouch: true, isMobile: true });

    test('always show their copy buttons, since nothing can be hovered', async ({ page, visit }) => {
        await visit('/2024/02/20/code-blocks/');
        expect(await page.evaluate(() => matchMedia('(hover: hover) and (pointer: fine)').matches)).toBe(false);
        for (const button of await page.locator('figure.highlight button.copy').all()) {
            await expect(button).toHaveCSS('opacity', '0.7');
        }
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

test('copy buttons are translated', async ({ page, visit }) => {
    await visit('/2024/02/20/code-blocks/', { variant: 'zh-CN' });
    await expect(page.locator('figure.highlight button.copy').first()).toHaveAttribute('title', '复制');
});
