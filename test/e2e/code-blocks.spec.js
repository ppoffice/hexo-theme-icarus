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
        expect(copied.replace(/\r\n/g, '\n').trim()).toBe('const answer = 42;\nconsole.log(answer);');
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

test.describe('folded code blocks with a preview (fold_preview: 3)', () => {
    const POST = '/2024/06/01/fold-preview/';

    /** The lines of a block whose box is within its code body, which clips them. */
    const shownLines = block => block.evaluate(figure => {
        const body = figure.querySelector('.highlight-body').getBoundingClientRect();
        return [...figure.querySelectorAll('.code .line')].filter(line => {
            const rect = line.getBoundingClientRect();
            return rect.top >= body.top && rect.bottom <= body.bottom + 0.5;
        }).length;
    });
    const mask = block => block.locator('.highlight-body').evaluate(el => getComputedStyle(el).maskImage);

    async function expectPreview(block) {
        await expect(block).toHaveClass(/\bfolded\b/);
        await expect(block.locator('.highlight-body')).toBeVisible();
        expect(await shownLines(block), 'the first 3 lines show').toBe(3);
        expect(await mask(block), 'and fade out').toMatch(/linear-gradient/);
        await expect(block.locator('figcaption .fold i')).toHaveClass(/fa-angle-right/);
    }

    async function expectUnfolded(block) {
        await expect(block).not.toHaveClass(/\bfolded\b/);
        expect(await shownLines(block)).toBe(8);
        expect(await mask(block)).toBe('none');
        await expect(block.locator('figcaption .fold i')).toHaveClass(/fa-angle-down/);
    }

    test('a block marked >folded shows its first lines, and clicking them unfolds it', async ({ page, visit, diagnostics }) => {
        await visit(POST, { variant: 'fold-preview' });
        const block = page.locator('figure.highlight').first();
        await expect(block.locator('figcaption')).not.toContainText('>folded');
        await expectPreview(block);
        await block.locator('.highlight-body').click();
        await expectUnfolded(block);
        await block.locator('.highlight-body').click();
        await expectUnfolded(block);
        expect(diagnostics.pageErrors).toEqual([]);
    });

    test('the fold toggle switches between the preview and the whole block', async ({ page, visit }) => {
        await visit(POST, { variant: 'fold-preview' });
        const block = page.locator('figure.highlight').nth(1);
        await expectUnfolded(block);
        await block.locator('figcaption .level-left').click();
        await expectPreview(block);
        await block.locator('figcaption .level-left').click();
        await expectUnfolded(block);
    });

    test('a block that fits in its preview shows in full, without a fade or a fold toggle', async ({ page, visit }) => {
        await visit(POST, { variant: 'fold-preview' });
        const block = page.locator('figure.highlight').nth(2);
        await expect(block.locator('figcaption')).toHaveText('Short');
        await expect(block).not.toHaveClass(/\b(folded|foldable|fold-preview)\b/);
        await expect(block.locator('figcaption .fold')).toHaveCount(0);
        expect(await mask(block)).toBe('none');
        await block.locator('figcaption .level-left').click();
        await expect(block).not.toHaveClass(/\bfolded\b/);
    });

    test('blocks fold with a preview after PJAX navigation', async ({ page, visit, diagnostics }) => {
        await visit('/', { variant: 'fold-preview' });
        await page.evaluate(() => { window.__noFullReload = true; });
        const done = page.evaluate(() => new Promise(resolve => document.addEventListener('pjax:complete', resolve, { once: true })));
        await page.locator(`.column-main .title a[href="${POST}"]`).first().click();
        await done;
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveTitle(/^Fold Preview/);
        expect(await page.evaluate(() => window.__noFullReload)).toBe(true);
        const block = page.locator('figure.highlight').first();
        await expectPreview(block);
        await block.locator('figcaption .level-left').click();
        await expectUnfolded(block);
        await block.locator('figcaption .level-left').click();
        await expectPreview(block);
        expect(diagnostics.pageErrors).toEqual([]);
    });

    for (const variant of ['fold-preview-dark', 'fold-preview-cyberpunk']) {
        test(`the preview fades into the dark background of the block (${variant})`, async ({ page, visit }) => {
            await visit(POST, { variant });
            const block = page.locator('figure.highlight').first();
            await expectPreview(block);
            const background = (await block.evaluate(el => getComputedStyle(el).backgroundColor)).match(/\d+/g).slice(0, 3).map(Number);
            expect(Math.max(...background), 'the block is dark').toBeLessThan(80);
            // How far the rendered first and last lines of the preview stand out from the background
            const body = await block.locator('.highlight-body').boundingBox();
            const lines = block.locator('.code .line');
            const png = await page.screenshot({ clip: body });
            const contrast = await page.evaluate(async ({ src, rows, background }) => {
                const image = new Image();
                image.src = src;
                await image.decode();
                const canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                const context = canvas.getContext('2d');
                context.drawImage(image, 0, 0);
                return rows.map(([y, height]) => {
                    const data = context.getImageData(0, Math.round(y), image.width, Math.round(height)).data;
                    let max = 0;
                    for (let i = 0; i < data.length; i += 4) {
                        max = Math.max(max, ...[0, 1, 2].map(c => Math.abs(data[i + c] - background[c])));
                    }
                    return max;
                });
            }, {
                src: 'data:image/png;base64,' + png.toString('base64'),
                rows: await Promise.all([0, 2].map(async i => {
                    const box = await lines.nth(i).boundingBox();
                    return [box.y - body.y, box.height];
                })),
                background
            });
            expect(contrast[0], 'the first line shows').toBeGreaterThan(80);
            expect(contrast[1], 'the last line fades out').toBeLessThan(contrast[0] / 2);
        });
    }
});
