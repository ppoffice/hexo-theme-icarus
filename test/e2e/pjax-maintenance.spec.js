const { test, expect } = require('./fixtures');

async function navigate(page, href) {
    const done = page.evaluate(() => new Promise(resolve => document.addEventListener('pjax:complete', resolve, { once: true })));
    // Avoid Playwright scrolling the departure page to a navigation link first.
    await page.locator(`a[href="${href}"]`).first().evaluate(el => el.click());
    await done;
    await page.waitForLoadState('networkidle');
}

async function traverse(page, direction) {
    const done = page.evaluate(() => new Promise(resolve => document.addEventListener('pjax:complete', resolve, { once: true })));
    await page.evaluate(direction => window.history[direction](), direction);
    await done;
    await page.waitForLoadState('networkidle');
}

test.describe('maintained local PJAX engine', () => {
    test('captures departing scroll before a deferred scroll event on history traversal', async ({ page, visit }) => {
        await visit('/', { variant: 'pjax' });
        await page.locator('a[href="/2024/02/20/code-blocks/"]').first().evaluate(el => el.setAttribute('href', '/2023/08/01/long-toc/'));
        await navigate(page, '/2023/08/01/long-toc/');
        const back = page.evaluate(() => new Promise(resolve => document.addEventListener('pjax:complete', resolve, { once: true })));
        await page.evaluate(() => {
            document.documentElement.style.overflowAnchor = 'none';
            // Model a browser that has not delivered its queued scroll event yet.
            window.__holdScroll = event => event.stopImmediatePropagation();
            window.addEventListener('scroll', window.__holdScroll, true);
            window.scrollTo(0, 860);
            window.history.back();
        });
        await back;
        await page.waitForLoadState('networkidle');
        await page.evaluate(() => window.removeEventListener('scroll', window.__holdScroll, true));
        await traverse(page, 'forward');
        await expect(page).toHaveTitle('Long Table of Contents - Icarus Fixture');
        await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(860);
    });

    test('loads locally, preserving independent back and forward scroll positions', async ({ page, visit, diagnostics }) => {
        await visit('/', { variant: 'pjax' });
        await expect(page.locator('script[src="/js/pjax-core.js"]')).toHaveCount(1);
        await page.evaluate(() => {
            window.__noFullReload = true;
            // Measure explicit history positions, not automatic layout anchoring
            // when deferred scripts add captions or code controls after the swap.
            document.documentElement.style.overflowAnchor = 'none';
            window.scrollTo(0, 420);
        });
        await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(420);
        await page.locator('a[href="/2024/02/20/code-blocks/"]').first().evaluate(el => el.setAttribute('href', '/2023/08/01/long-toc/'));
        await navigate(page, '/2023/08/01/long-toc/');
        await page.evaluate(() => window.scrollTo(0, 860));
        await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(860);
        for (let i = 0; i < 2; i++) {
            await traverse(page, 'back');
            await expect(page).toHaveTitle('Icarus Fixture');
            await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(420);
            await traverse(page, 'forward');
            await expect(page).toHaveTitle('Long Table of Contents - Icarus Fixture');
            await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(860);
        }
        expect(await page.evaluate(() => window.__noFullReload)).toBe(true);
        expect(diagnostics.pageErrors).toEqual([]);
    });

    test('refreshes cached history scroll when leaving through a normal link', async ({ page, visit, diagnostics }) => {
        await visit('/', { variant: 'pjax' });
        await page.evaluate(() => { document.documentElement.style.overflowAnchor = 'none'; });
        await page.locator('a[href="/2024/02/20/code-blocks/"]').first().evaluate(el => el.setAttribute('href', '/2023/08/01/long-toc/'));
        await navigate(page, '/2023/08/01/long-toc/');
        await page.evaluate(() => window.scrollTo(0, 860));
        await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(860);
        await traverse(page, 'back');
        await traverse(page, 'forward');
        await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(860);
        await page.evaluate(() => window.scrollTo(0, 420));
        await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(420);
        await navigate(page, '/');
        await traverse(page, 'back');
        await expect(page).toHaveTitle('Long Table of Contents - Icarus Fixture');
        await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(420);
        expect(diagnostics.pageErrors).toEqual([]);
    });

    test('synchronizes and removes metadata without executing head scripts', async ({ page, visit, diagnostics }) => {
        await visit('/', { variant: 'pjax' });
        const href = '/2024/03/01/hello-world/';
        await page.route(`**${href}`, async route => {
            const response = await route.fetch();
            const body = (await response.text()).replace(/<html[^>]*>/, '<html lang="ar" dir="rtl">')
                .replace('</head>', '<meta name="robots" content="noindex"><link rel="alternate" hreflang="ar" href="https://example.com/ar/">'
                    + '<script type="application/ld+json">{"@type":"Article","name":"PJAX metadata"}</script>'
                    + '<script>window.__unexpectedHeadRun = true;</script></head>');
            await route.fulfill({ response, body });
        });
        await navigate(page, href);
        await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
        await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
        await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/hello-world\/$/);
        await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Hello World');
        expect(await page.locator('script[type="application/ld+json"]').evaluateAll(scripts => scripts.some(script => script.textContent.includes('PJAX metadata')))).toBe(true);
        expect(await page.evaluate(() => window.__unexpectedHeadRun)).toBeUndefined();
        await navigate(page, '/');
        await expect(page.locator('html')).toHaveAttribute('lang', 'en');
        expect(await page.locator('html').getAttribute('dir')).toBeNull();
        await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
        await expect(page.locator('link[hreflang="ar"]')).toHaveCount(0);
        await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);
        expect(await page.locator('script[type="application/ld+json"]').textContent()).toContain('Icarus Fixture');
        await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Icarus Fixture');
        expect(diagnostics.pageErrors).toEqual([]);
    });

    test('destroys component instances before their old DOM is detached', async ({ page, visit }) => {
        await visit('/', { variant: 'pjax' });
        await page.evaluate(() => {
            window.__teardown = [];
            const article = document.querySelector('.article');
            window.__artalkInstance = { destroy() { window.__teardown.push(['artalk', article.isConnected]); } };
            window.__walineInstance = { destroy() { window.__teardown.push(['waline', article.isConnected]); } };
            const destroy = window.HexoGallery.destroy;
            window.HexoGallery.destroy = function(root) {
                window.__teardown.push(['gallery', article.isConnected, root === document]);
                destroy(root);
                window.HexoGallery.destroy = destroy;
            };
            const gallery = document.createElement('div');
            gallery.className = 'justified-gallery';
            article.appendChild(gallery);
            window.jQuery(gallery).data('jg.controller', {});
            window.jQuery.fn.justifiedGallery = function(command) { window.__teardown.push(['justified', gallery.isConnected, command]); };
            document.addEventListener('icarus:page:before-replace', () => window.__teardown.push(['event', article.isConnected]), { once: true });
        });
        await navigate(page, '/archives/');
        expect(await page.evaluate(() => window.__teardown)).toEqual([
            ['artalk', true], ['waline', true], ['gallery', true, true], ['justified', true, 'destroy'], ['event', true]
        ]);
        expect(await page.evaluate(() => [window.__artalkInstance, window.__walineInstance])).toEqual([null, null]);
        await navigate(page, '/');
        expect(await page.evaluate(() => window.__teardown)).toHaveLength(5);
    });

    test('tolerates malformed hash escapes', async ({ page, visit, diagnostics }) => {
        await visit('/', { variant: 'pjax' });
        await page.locator('a[href="/2024/03/01/hello-world/"]').first().evaluate(el => { el.setAttribute('href', el.getAttribute('href') + '#%zz'); });
        await navigate(page, '/2024/03/01/hello-world/#%zz');
        await expect(page).toHaveTitle('Hello World - Icarus Fixture');
        await navigate(page, '/');
        await expect(page).toHaveTitle('Icarus Fixture');
        expect(diagnostics.pageErrors).toEqual([]);
    });

    test('switches variant resources without reloading', async ({ page, visit, diagnostics }) => {
        await visit('/', { variant: 'variant-per-page' });
        await page.evaluate(() => { window.__noFullReload = true; });
        const themeStyles = () => page.locator('link[data-variant]').evaluateAll(links => links.map(link => link.getAttribute('href')));
        const initial = await themeStyles();
        expect(initial).toContain('/css/default.css');
        await navigate(page, '/2024/04/03/cyberpunk-variant/');
        const cyberpunk = await themeStyles();
        expect(cyberpunk).toContain('/css/cyberpunk.css');
        expect(cyberpunk).not.toContain('/css/default.css');
        await navigate(page, '/2024/03/01/hello-world/');
        expect(await themeStyles()).toEqual(initial);
        expect(await page.evaluate(() => window.__noFullReload)).toBe(true);
        expect(diagnostics.pageErrors).toEqual([]);
    });
});
