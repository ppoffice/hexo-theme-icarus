const { test, expect } = require('./fixtures');
const gallery = require('hexo-component-inferno/lib/util/gallery');

// Chromium's headless default hides scrollbars. Exercise the classic, width-taking fallback.
test.use({ launchOptions: { ignoreDefaultArgs: ['--hide-scrollbars'], args: ['--disable-features=OverlayScrollbar'] } });

function pageHtml(content) {
    return `<!doctype html><html lang="en"><head><title>Navbar layout</title><style>
        html { overflow-y: auto; }
        html::-webkit-scrollbar { width: 15px; }
        body { margin: 0; }
        .navbar-main { position: sticky; top: 0; height: 60px; background: white; }
        .navbar-container, .navbar-menu { display: flex; width: 100%; height: 60px; }
        .navbar-start { flex: 0 0 890px; }
        .navbar-toggle { display: none; }
        .is-collapsed .navbar-toggle { display: block; }
        .is-collapsed .navbar-start { display: none; }
        .caption, figure.highlight figcaption { height: 700px; margin: 0; }
    </style></head><body>
        <nav class="navbar-main"><div class="navbar-container"><div class="navbar-menu">
            <button class="navbar-toggle" aria-expanded="false">Menu</button>
            <div class="navbar-start"><a href="/navbar-layout-target/">Target</a></div><div class="navbar-end"></div>
        </div></div></nav>
        <section class="section"><div class="container"><div class="columns">${content}</div></div></section>
        <script src="https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js"></script>
        <script>var IcarusThemeSettings = {article:{highlight:{clipboard:false,fold:'folded'}}};</script>
        <script>${gallery}</script>
        <script src="/js/navbar.js" defer></script>
        <script src="/js/pjax-page.js"></script><script src="/js/pjax-prefetch.js"></script>
        <script src="/js/pjax-core.js"></script><script src="/js/pjax.js"></script>
        <script data-pjax src="/js/main.js" defer></script>
    </body></html>`;
}

for (const [layout, content, caption] of [
    ['image caption', '<article class="article"><div class="content"><img alt="Caption" width="10" height="10" src="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\'/%3E"></div></article>', '.caption'],
    ['code caption', '<figure class="highlight"><table><tr><td class="code"><pre><span class="line">const answer = 42;</span></pre></td></tr></table></figure>', 'figure.highlight figcaption']
]) {
    test(`refits after ${layout} adds a scrollbar without ResizeObserver`, async ({ page, visit, diagnostics }) => {
        await page.setViewportSize({ width: 900, height: 600 });
        await page.addInitScript(() => { window.ResizeObserver = undefined; });
        await page.route('**/navbar-layout-start/', route => route.fulfill({ contentType: 'text/html', body: pageHtml('Start') }));
        await page.route('**/navbar-layout-target/', route => route.fulfill({ contentType: 'text/html', body: pageHtml(content) }));
        await visit('/navbar-layout-start/', { variant: 'pjax' });
        let intercept;
        const requested = new Promise(resolve => { intercept = resolve; });
        await page.route('**/js/main.js', route => intercept(route));
        await page.evaluate(() => {
            window.__noFullReload = true;
            window.__navbarCalls = { init: 0, destroy: 0, refresh: 0 };
            for (const name of Object.keys(window.__navbarCalls)) {
                const operation = window.IcarusNavbar[name];
                window.IcarusNavbar[name] = () => { window.__navbarCalls[name]++; return operation(); };
            }
        });
        const complete = page.evaluate(() => new Promise(resolve => document.addEventListener('pjax:complete', resolve, { once: true })));
        await page.locator('.navbar-start a').click();
        await complete;
        const route = await requested;
        try {
            expect(await page.evaluate(() => {
                window.__resizeHandler = window.jQuery._data(window, 'events').resize.find(handler => handler.namespace === 'icarus-navbar').handler;
                return document.documentElement.clientWidth;
            })).toBe(900);
            await expect(page.locator('.navbar-main')).not.toHaveClass(/is-collapsed/);
            await expect(page.locator(caption)).toHaveCount(0);
        } finally {
            const response = await route.fetch();
            const source = await response.text();
            await route.fulfill({ response, body: source + '\nwindow.__mainApplied = true;' });
        }
        // Wait only for this script to execute, not networkidle or a synthetic window resize.
        await expect.poll(() => page.evaluate(() => window.__mainApplied)).toBe(true);
        await expect(page.locator(caption)).toHaveCount(1);
        expect(await page.evaluate(() => document.documentElement.clientWidth)).toBe(885);
        await expect(page.locator('.navbar-main')).toHaveClass(/is-collapsed/);
        expect(await page.evaluate(() => ({
            calls: window.__navbarCalls,
            sameHandler: window.__resizeHandler === window.jQuery._data(window, 'events').resize.find(handler => handler.namespace === 'icarus-navbar').handler,
            noObserver: typeof window.ResizeObserver === 'undefined',
            noReload: window.__noFullReload
        }))).toEqual({ calls: { init: 1, destroy: 1, refresh: 1 }, sameHandler: true, noObserver: true, noReload: true });
        expect(diagnostics.pageErrors).toEqual([]);
    });
}
