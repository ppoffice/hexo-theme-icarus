const { test, expect, jqueryHandlerCounts } = require('./fixtures');

/** Click a link and wait for the swapped page's scripts or a caller's semantic readiness check. */
async function pjaxClick(page, locator, ready = () => page.waitForLoadState('networkidle')) {
    const done = page.evaluate(() => new Promise(resolve => document.addEventListener('pjax:complete', resolve, { once: true })));
    await locator.click();
    await done;
    // pjax:complete fires when the content is swapped; the data-pjax scripts (main.js, ...) are
    // then downloaded and executed again. A plugin test can instead wait for its rendered output:
    // MathJax speech-worker requests from an earlier document can keep networkidle pending.
    await ready();
}

test.describe('PJAX navigation', () => {
    test.beforeEach(async ({ page, visit }) => {
        await visit('/', { variant: 'pjax' });
        await page.evaluate(() => { window.__noFullReload = true; });
    });

    test('swaps the page content without a full reload', async ({ page, diagnostics }) => {
        await pjaxClick(page, page.locator('.navbar-start a', { hasText: 'Archives' }));
        await expect(page).toHaveURL(/\/archives\/?$/);
        await expect(page).toHaveTitle('Archives - Icarus Fixture');
        await expect(page.locator('.column-main .timeline').first()).toBeVisible();
        await expect(page.locator('.navbar-start a.is-active')).toHaveText('Archives');
        expect(await page.evaluate(() => window.__noFullReload)).toBe(true);
        expect(diagnostics.pageErrors).toEqual([]);
    });

    test('re-initialises page scripts on the new page', async ({ page }) => {
        await pjaxClick(page, page.locator('.column-main a[href="/2024/02/20/code-blocks/"]').first());
        await expect(page).toHaveTitle('Code Blocks - Icarus Fixture');
        await expect(page.locator('figure.highlight .copy')).toHaveCount(3);
        expect(await page.evaluate(() => window.__noFullReload)).toBe(true);
    });

    test('supports the browser back button', async ({ page }) => {
        await pjaxClick(page, page.locator('.navbar-start a', { hasText: 'Tags' }));
        await expect(page).toHaveTitle('Tags - Icarus Fixture');
        await page.goBack();
        await expect(page).toHaveTitle('Icarus Fixture');
        await expect(page.locator('.column-main article').first()).toBeVisible();
    });

    test('does not accumulate window event handlers across navigations', async ({ page }) => {
        const before = await jqueryHandlerCounts(page);
        for (let i = 0; i < 3; i++) {
            await pjaxClick(page, page.locator('.navbar-start a', { hasText: 'Archives' }));
            await pjaxClick(page, page.locator('.navbar-start a', { hasText: 'Home' }));
        }
        expect(await jqueryHandlerCounts(page)).toEqual(before);
    });

    test('keeps a single toc mask across navigations', async ({ page }) => {
        for (let i = 0; i < 2; i++) {
            await pjaxClick(page, page.locator('.column-main a[href="/2024/03/01/hello-world/"]').first());
            await pjaxClick(page, page.locator('.navbar-start a', { hasText: 'Home' }));
        }
        await pjaxClick(page, page.locator('.column-main a[href="/2024/03/01/hello-world/"]').first());
        await expect(page.locator('#toc-mask')).toHaveCount(1);
    });

    test('removes the toc mask on pages without a toc', async ({ page }) => {
        await pjaxClick(page, page.locator('.column-main a[href="/2024/03/01/hello-world/"]').first());
        await expect(page.locator('#toc-mask')).toHaveCount(1);
        await pjaxClick(page, page.locator('.navbar-start a', { hasText: 'Home' }));
        await expect(page.locator('#toc-mask')).toHaveCount(0);
    });

    test('the mobile toc still opens and closes after navigating', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 800 });
        const tocReady = () => expect(page.locator('#toc-mask')).toHaveCount(1);
        const homeReady = () => expect(page.locator('#toc-mask')).toHaveCount(0);
        for (let i = 0; i < 2; i++) {
            await pjaxClick(page, page.locator('.column-main a[href="/2024/03/01/hello-world/"]').first(), tocReady);
            await pjaxClick(page, page.locator('.navbar-logo'), homeReady);
        }
        // PJAX does not reset the document's load state. Delay the new page's main.js to
        // catch a stale networkidle wait that lets the catalogue click precede its binding.
        await page.route('**/js/main.js', async route => {
            await new Promise(resolve => setTimeout(resolve, 250));
            await route.continue();
        });
        await pjaxClick(page, page.locator('.column-main a[href="/2024/03/01/hello-world/"]').first(), tocReady);
        await page.locator('.navbar-main .catalogue').click();
        await expect(page.locator('#toc')).toHaveClass(/is-active/);
        await expect(page.locator('#toc-mask')).toHaveClass(/is-active/);
        await page.locator('#toc-mask').click({ position: { x: 5, y: 5 } });
        await expect(page.locator('#toc')).not.toHaveClass(/is-active/);
        await expect(page.locator('#toc-mask')).not.toHaveClass(/is-active/);
    });

    test('keeps the active toc entry in view after navigating', async ({ page, visit }) => {
        // The long toc post is the oldest one: reach it again through the post navigation.
        await visit('/2023/08/01/long-toc/', { variant: 'pjax' });
        await page.evaluate(() => { window.__noFullReload = true; });
        await pjaxClick(page, page.locator('.article-nav-prev'));
        await pjaxClick(page, page.locator('.article-nav-next'));
        await expect(page).toHaveTitle('Long Table of Contents - Icarus Fixture');
        await page.addStyleTag({ content: '#toc .menu { max-height: 200px; overflow-y: auto; }' });
        await page.locator('#Section-14').evaluate(heading => {
            window.scrollTo({ top: heading.getBoundingClientRect().top + window.scrollY - 10, behavior: 'instant' });
        });
        const entry = page.locator('#toc a[data-href="#Section-14"]');
        await expect(entry).toHaveClass(/is-active/);
        await expect.poll(() => entry.evaluate(el => {
            const box = el.closest('.menu').getBoundingClientRect();
            const rect = el.getBoundingClientRect();
            return Math.round(Math.abs((rect.top + rect.bottom - box.top - box.bottom) / 2));
        })).toBeLessThan(20);
        expect(await page.evaluate(() => window.__noFullReload)).toBe(true);
    });

    // The About page has Bulma columns in its content, like the one of the documentation site.
    test('navigates to and from a page with columns in its content', async ({ page, diagnostics }) => {
        await pjaxClick(page, page.locator('.navbar-start a', { hasText: 'About' }));
        await expect(page).toHaveTitle('About - Icarus Fixture');
        await expect(page.locator('.column-main .content .column')).toHaveCount(2);
        await pjaxClick(page, page.locator('.navbar-start a', { hasText: 'Home' }));
        await expect(page).toHaveTitle('Icarus Fixture');
        expect(await page.evaluate(() => window.__noFullReload)).toBe(true);
        expect(diagnostics.pageErrors).toEqual([]);
    });

    test('copies code once per click after navigating', async ({ page, context }) => {
        await context.grantPermissions(['clipboard-read', 'clipboard-write']);
        for (let i = 0; i < 2; i++) {
            await pjaxClick(page, page.locator('.column-main a[href="/2024/02/20/code-blocks/"]').first());
            await pjaxClick(page, page.locator('.navbar-start a', { hasText: 'Home' }));
        }
        await pjaxClick(page, page.locator('.column-main a[href="/2024/02/20/code-blocks/"]').first());
        await page.evaluate(() => {
            window.__copies = 0;
            document.addEventListener('copy', () => { window.__copies++; });
        });
        await page.locator('figure.highlight .copy').first().click();
        expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('const answer = 42;');
        expect(await page.evaluate(() => window.__copies)).toBe(1);
    });
});

// With `relative_link: true`, the URLs of the pages are relative to each page, and differ between
// pages at different depths: `../css/default.css` on /archives/, `../../../../css/default.css` on
// the posts. PJAX switches the elements of the new page in before it updates the URL of the page.
test.describe('PJAX navigation with relative links', () => {
    const brokenImages = page => page.evaluate(() => Array.from(document.images)
        .filter(img => !img.complete || !img.naturalWidth).map(img => img.src));

    test('keeps the theme stylesheet and loads the resources of pages at other depths', async ({ page, visit, diagnostics }) => {
        await visit('/archives/', { variant: 'pjax-relative-link' });
        await page.evaluate(() => {
            window.__noFullReload = true;
            document.querySelector('link[data-variant][href$="css/default.css"]').__kept = true;
        });
        const steps = [
            ['Hello World - Icarus Fixture', page.locator('.column-main a', { hasText: 'Hello World' }).first()],
            ['Tags - Icarus Fixture', page.locator('.navbar-start a', { hasText: 'Tags' })],
            ['Icarus Fixture', page.locator('.navbar-logo')],
            ['Hello World - Icarus Fixture', page.locator('.column-main a', { hasText: 'Hello World' }).first()]
        ];
        for (const [title, link] of steps) {
            await pjaxClick(page, link);
            await expect(page).toHaveTitle(title);
            await expect.poll(() => brokenImages(page), title).toEqual([]);
            const stylesheets = await page.evaluate(() => Array.from(document.querySelectorAll('link[data-variant][href$="css/default.css"]'))
                .map(link => ({ kept: link.__kept === true, loaded: !!link.sheet })));
            expect(stylesheets, title).toEqual([{ kept: true, loaded: true }]);
        }
        await page.goBack();
        await expect(page).toHaveTitle('Icarus Fixture');
        await page.waitForLoadState('networkidle');
        await expect.poll(() => brokenImages(page)).toEqual([]);
        expect(await page.evaluate(() => document.querySelector('link[data-variant][href$="css/default.css"]').__kept)).toBe(true);

        // The scripts of the new pages ran: the code blocks of a post have their copy buttons.
        await pjaxClick(page, page.locator('.column-main a', { hasText: 'Code Blocks' }).first());
        await expect(page.locator('figure.highlight .copy')).toHaveCount(3);
        expect(await page.evaluate(() => window.__noFullReload)).toBe(true);
        expect(diagnostics.pageErrors).toEqual([]);
        expect(diagnostics.failedRequests).toEqual([]);
    });
});

// Math plugins enabled in the front-matter of some posts are only on those pages, and KaTeX renders
// on the load event of the window, which PJAX does not fire again.
test.describe('PJAX navigation to pages with math plugins', () => {
    const MATHJAX_POST = '/2024/04/06/mathjax/';
    const KATEX_POST = '/2024/04/05/katex-1/';
    const OTHER_KATEX_POST = '/2024/04/04/katex-2/';
    const typeset = page => page.evaluate(() => ({
        mathjax: document.querySelectorAll('.column-main mjx-container').length,
        katex: document.querySelectorAll('.column-main .katex').length,
        source: document.querySelector('.column-main .content').textContent.includes('$$')
    }));

    async function checkKatex(page) {
        const content = page.locator('.column-main .content');
        await expect(content.locator('.katex-display')).toHaveCount(2);
        await expect(content.locator('.katex-error')).toHaveCount(0);
        await expect(content.locator('.katex .mfrac')).toHaveCount(1);
        await expect(content.locator('annotation')).toContainText([
            'a^2 + b^2 = c^2', '\\frac{a}{b}', '\\ce{H2O}', '\\ce{2H2 + O2 -> 2H2O}',
            '\\href{javascript:alert(1)}{unsafe}'
        ]);
        await expect(content.locator('a[href^="javascript:"]')).toHaveCount(0);
        await expect(content.locator('code')).toHaveText('\\(not rendered\\)');
        await expect(content).toContainText('$not math$');
        expect(await page.evaluate(() => window.katex.version)).toBe('0.19.1');
        expect(await content.locator('.katex-display').first().evaluate(el => getComputedStyle(el).display)).toBe('block');
    }

    for (const [name, href, expected] of [
        ['MathJax', MATHJAX_POST, { mathjax: 4, katex: 0, source: false }],
        ['KaTeX', KATEX_POST, { mathjax: 0, katex: 5, source: false }]
    ]) {
        test(`typesets the formulas of a ${name} post, like a full page load`, async ({ page, visit, diagnostics }) => {
            await visit(href, { variant: 'pjax-math' });
            await expect.poll(() => typeset(page)).toEqual(expected);
            if (name === 'KaTeX') await checkKatex(page);

            await visit('/', { variant: 'pjax-math' });
            await page.evaluate(() => { window.__noFullReload = true; });
            await pjaxClick(page, page.locator(`.column-main a[href="${href}"]`).first(),
                () => expect.poll(() => typeset(page)).toEqual(expected));
            if (name === 'KaTeX') await checkKatex(page);
            expect(await page.evaluate(() => window.__noFullReload)).toBe(true);
            expect(diagnostics.pageErrors).toEqual([]);
            expect(diagnostics.failedRequests).toEqual([]);
        });
    }

    test('typesets MathJax after PJAX without waiting for unrelated background requests', async ({ page, visit }) => {
        await visit('/', { variant: 'pjax-math' });
        // Keep a background request open deterministically. MathJax's speech worker from an
        // earlier document can likewise outlive navigation in network-idle bookkeeping.
        let background;
        await page.route('**/__pjax_background', route => { background = route; });
        await page.evaluate(() => { fetch('/__pjax_background'); });
        await expect.poll(() => !!background).toBe(true);
        try {
            await pjaxClick(page, page.locator(`.column-main a[href="${MATHJAX_POST}"]`).first(),
                () => expect.poll(() => typeset(page)).toEqual({ mathjax: 4, katex: 0, source: false }));
            await expect(page.locator('mjx-merror')).toHaveCount(0);
        } finally {
            await background.fulfill({ status: 200, body: '' });
        }
    });

    test('keeps typesetting on the next pages, without loading the plugins again', async ({ page, visit, diagnostics }) => {
        await visit('/', { variant: 'pjax-math' });
        await page.evaluate(() => { window.__noFullReload = true; });
        await pjaxClick(page, page.locator(`.column-main a[href="${KATEX_POST}"]`).first());
        await expect.poll(() => typeset(page)).toEqual({ mathjax: 0, katex: 5, source: false });
        await checkKatex(page);

        await pjaxClick(page, page.locator(`.content a[href="${OTHER_KATEX_POST}"]`));
        await expect.poll(() => typeset(page)).toEqual({ mathjax: 0, katex: 5, source: false });
        await checkKatex(page);
        expect(await page.locator('body > script[src*="katex.min.js"]').count()).toBe(1);
        expect(await page.evaluate(() => window.__noFullReload)).toBe(true);
        expect(diagnostics.pageErrors).toEqual([]);
    });

    test('clears MathJax v4 MathItems and reuses the renderer across history navigation', async ({ page, visit, diagnostics }) => {
        await visit(MATHJAX_POST, { variant: 'pjax-math' });
        await expect.poll(() => typeset(page)).toEqual({ mathjax: 4, katex: 0, source: false });
        expect(await page.evaluate(() => window.MathJax.version)).toBe('4.1.3');
        await expect(page.locator('mjx-merror')).toHaveCount(0);
        await page.evaluate(() => { window.__mathRenderer = window.MathJax; });
        const mathItems = () => page.evaluate(() => Array.from(window.MathJax.startup.document.math).length);
        expect(await mathItems()).toBe(4);
        await pjaxClick(page, page.locator(`.content a[href="${KATEX_POST}"]`));
        await expect.poll(mathItems).toBe(0);
        await page.goBack();
        await expect.poll(() => typeset(page)).toEqual({ mathjax: 4, katex: 0, source: false });
        expect(await mathItems()).toBe(4);
        await page.goForward();
        await expect.poll(mathItems).toBe(0);
        await expect.poll(() => typeset(page)).toEqual({ mathjax: 0, katex: 5, source: false });
        expect(await page.evaluate(() => window.__mathRenderer === window.MathJax)).toBe(true);
        await expect(page.locator('script#MathJax-script')).toHaveCount(1);
        expect(diagnostics.pageErrors).toEqual([]);
        expect(diagnostics.failedRequests).toEqual([]);
        expect(diagnostics.consoleErrors).toEqual([]);
    });
});
