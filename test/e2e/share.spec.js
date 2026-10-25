const { test, expect, colorsOf } = require('./fixtures');
const path = require('path');
const { spawnSync } = require('child_process');

const pages = {};
const sdkUrls = {
    addtoany: 'https://static.addtoany.com/menu/page.js',
    sharethis: 'https://platform-api.sharethis.com/js/sharethis.js*'
};

// Contract doubles, not visual SDK coverage: first load scans automatically;
// re-evaluating the external script does NOT scan newly replaced containers.
// Only the SDK's public init_all/load API can enhance subsequent PJAX pages.
const sdkCommon = `
    function enhance(container, provider, urlAttribute, titleAttribute, settings) {
        if (!container.isConnected) return;
        var metadata = {
            provider: provider,
            url: settings && settings.url || container.getAttribute(urlAttribute),
            title: settings && settings.title || container.getAttribute(titleAttribute)
        };
        window.__shareCalls.scans.push(metadata);
        var buttons = provider === 'addtoany' ? container.querySelectorAll('a') : [];
        if (provider === 'sharethis' && !container.querySelector('a')) {
            var link = document.createElement('a');
            link.className = 'st-btn';
            container.appendChild(link);
            buttons = [link];
        }
        Array.from(buttons).forEach(function(button) {
            if (button.dataset.sdkBound) return;
            button.dataset.sdkBound = 'true';
            button.href = '/#network';
            button.textContent = provider + ' network';
            var icon = document.createElement('span');
            icon.className = 'fixture-share-icon';
            button.appendChild(icon);
            button.addEventListener('click', function(event) {
                event.preventDefault();
                window.__shareCalls.clicks.push(metadata);
            });
        });
    }
`;
const addToAnySdk = `(function() {
    if (window.a2a) return;
    ${sdkCommon}
    window.a2a = { init_all: function() {
        document.querySelectorAll('.a2a_kit').forEach(function(container) {
            enhance(container, 'addtoany', 'data-a2a-url', 'data-a2a-title');
        });
    } };
    window.a2a.init_all();
})();`;
const shareThisSdk = `(function() {
    if (window.__sharethis__) return;
    ${sdkCommon}
    var sdk = window.__sharethis__ = { load: function(product, config) {
        if (product !== 'inline-share-buttons' || !config) throw new Error('ShareThis is not ready');
        document.querySelectorAll('.sharethis-inline-share-buttons').forEach(function(container) {
            enhance(container, 'sharethis', 'data-url', 'data-title', config);
        });
    } };
    // Account settings become available asynchronously, after the script load event.
    setTimeout(function() {
        sdk.config = { 'inline-share-buttons': { enabled: true, networks: ['facebook'] } };
        sdk.load('inline-share-buttons', sdk.config['inline-share-buttons']);
    }, 50);
})();`;

test.beforeAll(() => {
    const result = spawnSync(process.execPath, [path.join(__dirname, '../support/render-share.js')], {
        encoding: 'utf8',
        env: { ...process.env, NODE_ENV: 'production', BABEL_DISABLE_CACHE: '1' }
    });
    if (result.status !== 0) throw new Error(result.stderr || 'Could not render share fixtures');
    Object.assign(pages, JSON.parse(result.stdout));
});

async function mount(page, visit, name = 'share-addtoany', delayedProvider = null) {
    await page.addInitScript(() => {
        window.__shareCalls = { scans: [], clicks: [], native: [], pjax: 0 };
        // Observe the actual third-party selector without depending on the
        // theme's runtime API. Dynamic SDK links must be excluded too, even
        // when they were inserted after Pjax initially parsed the document.
        let pjax;
        Object.defineProperty(window, 'Pjax', {
            configurable: true,
            get: () => pjax,
            set: value => {
                pjax = new Proxy(value, {
                    construct(target, args, newTarget) {
                        window.__sharePjaxElements = args[0].elements;
                        return Reflect.construct(target, args, newTarget);
                    }
                });
            }
        });
        Object.defineProperty(navigator, 'share', {
            configurable: true,
            writable: true,
            value: async data => { window.__shareCalls.native.push(data); }
        });
        document.addEventListener('pjax:send', () => { window.__shareCalls.pjax++; });
    });
    for (const [name, html] of Object.entries(pages)) {
        await page.route('**/' + name + '/', route => route.fulfill({ contentType: 'text/html', body: html }));
    }
    const requests = { addtoany: 0, sharethis: 0 };
    let release;
    const gate = new Promise(resolve => { release = resolve; });
    for (const [provider, source] of [['addtoany', addToAnySdk], ['sharethis', shareThisSdk]]) {
        await page.route(sdkUrls[provider], async route => {
            requests[provider]++;
            if (provider === delayedProvider) await gate;
            await route.fulfill({ contentType: 'application/javascript', body: source });
        });
    }
    await visit('/' + name + '/');
    await page.evaluate(() => { window.__shareDocument = 'same-document'; });
    return { requests, release };
}

async function expectPage(page, name) {
    await expect(page).toHaveTitle(name + ' - Icarus Fixture');
    await expect(page).toHaveURL(new RegExp('/' + name + '/$'));
    expect(await page.evaluate(() => window.__shareDocument)).toBe('same-document');
}

async function navigate(page, name) {
    await page.locator(`.share-nav[href="/${name}/"]`).click();
    await expectPage(page, name);
}

async function expectSdk(page, provider, name) {
    const addtoany = provider === 'addtoany';
    const container = page.locator(addtoany ? '#fixture-share > .a2a_kit, #fixture-share .a2a_kit' : '.sharethis-inline-share-buttons').first();
    await expect(container).toHaveAttribute(addtoany ? 'data-a2a-url' : 'data-url', 'https://example.com/' + name + '/');
    await expect(container).toHaveAttribute(addtoany ? 'data-a2a-title' : 'data-title', name);
    await expect(container.locator('.fixture-share-icon')).toHaveCount(addtoany ? 6 : 1);
    const metadata = { provider, url: 'https://example.com/' + name + '/', title: name };
    await expect.poll(() => page.evaluate(() => window.__shareCalls.scans)).toContainEqual(metadata);

    // SDK-owned local links must not be treated as navigation by PJAX. Test both
    // the provider containers (.a2a_kit / .sharethis-inline-share-buttons) and
    // the native component's fallback kit via the same public DOM selectors.
    const before = await page.evaluate(() => ({ clicks: window.__shareCalls.clicks.length, pjax: window.__shareCalls.pjax }));
    expect(await container.locator('a').first().evaluate(link => link.matches(window.__sharePjaxElements))).toBe(false);
    await container.locator('a').first().click();
    await expect.poll(() => page.evaluate(() => window.__shareCalls.clicks.length)).toBe(before.clicks + 1);
    expect(await page.evaluate(() => window.__shareCalls.clicks[window.__shareCalls.clicks.length - 1])).toEqual(metadata);
    expect(await page.evaluate(() => window.__shareCalls.pjax)).toBe(before.pjax);
    await expectPage(page, name);
}

async function expectNative(page) {
    const button = page.locator('#fixture-share [data-share-native] button, #fixture-share button').first();
    await expect(button).toBeVisible();
    const before = await page.evaluate(() => window.__shareCalls.native.length);
    const expected = await page.locator('#fixture-share [data-share-provider="web_share"]').evaluate(container => ({
        title: container.dataset.title || document.title, url: container.dataset.url || location.href
    }));
    const links = page.locator('#fixture-share [data-share-network]');
    await expect(links).toHaveCount(5);
    for (const link of await links.all()) {
        const data = await link.evaluate(element => ({ href: element.href, network: element.dataset.shareNetwork,
            pjax: element.matches(window.__sharePjaxElements) }));
        expect(new URL(data.href).searchParams.get(data.network === 'facebook' ? 'u' : 'url')).toBe(expected.url);
        expect(data.pjax).toBe(false);
    }
    await button.click();
    await expect.poll(() => page.evaluate(() => window.__shareCalls.native.length)).toBe(before + 1);
    expect(await page.evaluate(() => window.__shareCalls.native[window.__shareCalls.native.length - 1])).toEqual(expected);
}

test('restores SDK buttons and current metadata across providers, canonical URLs and history', async ({ page, visit, diagnostics }) => {
    const { requests } = await mount(page, visit);
    await expectSdk(page, 'addtoany', 'share-addtoany');
    await navigate(page, 'share-web');
    await expectNative(page);
    await navigate(page, 'share-this');
    await expectSdk(page, 'sharethis', 'share-this');
    await navigate(page, 'share-addtoany');
    await expectSdk(page, 'addtoany', 'share-addtoany');
    await navigate(page, 'share-next');
    await expectSdk(page, 'addtoany', 'share-next');

    for (const [name, provider] of [['share-addtoany', 'addtoany'], ['share-this', 'sharethis'], ['share-web', null]]) {
        await page.goBack();
        await expectPage(page, name);
        if (provider) await expectSdk(page, provider, name);
        else await expectNative(page);
    }
    await page.goForward();
    await expectPage(page, 'share-this');
    await expectSdk(page, 'sharethis', 'share-this');
    expect(requests).toEqual({ addtoany: 1, sharethis: 1 });
    expect(diagnostics.pageErrors).toEqual([]);
});

test('platform buttons wrap on mobile and remain available without system sharing', async ({ page, visit }) => {
    await page.setViewportSize({ width: 320, height: 740 });
    const { requests } = await mount(page, visit, 'share-web');
    await page.evaluate(() => { navigator.share = undefined; });
    await navigate(page, 'share-none');
    await navigate(page, 'share-web');
    await expect(page.locator('#fixture-share [data-share-native] button')).toBeDisabled();
    for (const link of await page.locator('#fixture-share [data-share-network]').all()) {
        await expect(link).toBeVisible();
        const bounds = await link.boundingBox();
        expect(bounds.x).toBeGreaterThanOrEqual(0);
        expect(bounds.x + bounds.width).toBeLessThanOrEqual(320);
    }
    expect(requests.addtoany).toBe(0);
    expect(requests.sharethis).toBe(0);
});

for (const name of ['share-web', 'share-web-dark', 'share-web-cyberpunk', 'share-web-m3e']) {
    test(`brand colors retain the variant's standard button geometry (${name})`, async ({ page, visit }) => {
        await mount(page, visit, name);
        const actual = await page.locator('#fixture-share .button').evaluateAll(buttons => buttons.map(button => {
            const style = getComputedStyle(button);
            return { background: style.backgroundColor, height: button.getBoundingClientRect().height,
                radius: style.borderRadius, clip: style.clipPath, font: style.fontSize, weight: style.fontWeight };
        }));
        const native = actual[actual.length - 1];
        expect(actual.slice(0, 5).map(button => button.background)).toEqual([
            'rgb(0, 0, 0)', 'rgb(8, 102, 255)', 'rgb(230, 22, 45)', 'rgb(38, 165, 228)', 'rgb(10, 102, 194)'
        ]);
        for (const button of actual.slice(0, 5)) {
            expect(button.height).toBeCloseTo(native.height, 1);
            expect(button.radius).toBe(native.radius);
            expect(button.clip).toBe(native.clip);
            expect(button.font).toBe(native.font);
            expect(button.weight).toBe(native.weight);
        }
        await expect(page.locator('#fixture-share [data-share-network="telegram"]')).toHaveCSS('color', 'rgb(255, 255, 255)');
        const colors = await colorsOf(page, '#fixture-share [data-share-network]:not([data-share-network="telegram"])');
        expect(colors.every(color => color.contrast >= 4.5)).toBe(true);
    });
}

test('native share failure does not load a third-party fallback', async ({ page, visit, diagnostics }) => {
    const { requests } = await mount(page, visit, 'share-web');
    await page.evaluate(() => {
        navigator.share = async () => { throw new Error('Device sharing unavailable'); };
    });
    await page.locator('#fixture-share button').click();
    await expect(page.locator('#fixture-share [role="status"]')).toBeVisible();
    await expect(page.locator('#fixture-share .a2a_kit, #fixture-share [data-share-fallback]')).toHaveCount(0);
    await expect(page.locator('#fixture-share button')).toBeEnabled();
    expect(requests.addtoany).toBe(0);
    await navigate(page, 'share-next');
    await expectSdk(page, 'addtoany', 'share-next');
    expect(requests.addtoany).toBe(1);
    expect(diagnostics.pageErrors).toEqual([]);
});

for (const [provider, name] of [['addtoany', 'share-addtoany'], ['sharethis', 'share-this']]) {
    test(`ignores a departed container when the first ${provider} SDK arrives late`, async ({ page, visit, diagnostics }) => {
        const { requests, release } = await mount(page, visit, 'share-none', provider);
        try {
            await navigate(page, name);
            await expect.poll(() => requests[provider]).toBe(1);
            await page.evaluate(() => { window.__departedShare = document.querySelector('#fixture-share'); });
            await navigate(page, 'share-none');
        } finally {
            release();
        }
        await page.waitForLoadState('networkidle');
        expect(await page.evaluate(() => window.__departedShare.isConnected)).toBe(false);
        expect(await page.evaluate(() => window.__departedShare.querySelectorAll('.fixture-share-icon').length)).toBe(0);
        expect(await page.evaluate(() => window.__shareCalls.scans)).toEqual([]);
        await navigate(page, name);
        await expectSdk(page, provider, name);
        await navigate(page, 'share-none');
        await page.goBack();
        await expectPage(page, name);
        await expectSdk(page, provider, name);
        expect(requests[provider]).toBe(1);
        expect(diagnostics.pageErrors).toEqual([]);
    });
}
