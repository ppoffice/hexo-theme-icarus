const { test, expect } = require('./fixtures');
const path = require('path');
const { spawnSync } = require('child_process');
const installer = require('hexo-component-inferno/lib/util/gallery');

// Deliberate SDK contract doubles, not empty CDN responses or claims of visual SDK coverage.
const lightSdk = `jQuery.fn.lightGallery = function(options) {
    return this.each(function() {
        const container = this;
        const $container = jQuery(container);
        let instance = $container.data('lightGallery');
        if (!instance) {
            instance = {
                s: Object.assign({ dynamic: false }, options),
                $items: $container.find(options.selector),
                init() { window.__galleryCalls.light.push([container.id, this.s.selector]); },
                destroy() { $container.removeData('lightGallery'); }
            };
            $container.data('lightGallery', instance);
        }
        instance.init();
    });
};`;
const justifiedSdk = `jQuery.fn.justifiedGallery = function(command) {
    return this.each(function() {
        const $gallery = jQuery(this);
        if (command === 'destroy') {
            $gallery.removeData('jg.controller');
            return;
        }
        let controller = $gallery.data('jg.controller');
        if (!controller) {
            controller = { getAllEntries() { return $gallery.children(); } };
            $gallery.data('jg.controller', controller);
        }
        controller.entries = controller.getAllEntries();
        window.__galleryCalls.justified.push(this.id);
    });
};`;
const pages = {};

test.beforeAll(() => {
    // Keep Inferno's Babel JSX compiler outside Playwright's JSX transform hook.
    const result = spawnSync(process.execPath, [path.join(__dirname, '../support/render-gallery.js')], {
        encoding: 'utf8',
        env: { ...process.env, NODE_ENV: 'production', BABEL_DISABLE_CACHE: '1' }
    });
    if (result.status !== 0) {
        throw new Error(result.stderr || 'Could not render Gallery fixtures');
    }
    Object.assign(pages, JSON.parse(result.stdout));
});

async function mount(page, visit, name = 'gallery-on', sdk = true) {
    await page.addInitScript(() => { window.__galleryCalls = { light: [], justified: [] }; });
    for (const [path, html] of Object.entries(pages)) {
        await page.route('**/' + path + '/', route => route.fulfill({ contentType: 'text/html', body: html }));
    }
    await page.route('**/lightgallery-all.min.js', route => route.fulfill({ contentType: 'application/javascript', body: sdk ? lightSdk : '' }));
    await page.route('**/jquery.justifiedGallery.min.js', route => route.fulfill({ contentType: 'application/javascript', body: sdk ? justifiedSdk : '' }));
    await visit('/' + name + '/');
}

async function expectEnhancement(page) {
    await expect(page.locator('#plain').locator('..')).toHaveClass('gallery-item');
    await expect(page.locator('#plain').locator('..')).toHaveAttribute('href', '/img/avatar.png');
    await expect(page.locator('#plain + .caption')).toHaveText('<img src=x onerror=window.__injected=1>');
    await expect(page.locator('.caption img')).toHaveCount(0);
    await expect(page.locator('#empty + .caption')).toHaveCount(0);
    await expect(page.locator('#existing')).toHaveAttribute('href', 'https://example.com/');
    await expect(page.locator('#existing')).not.toHaveClass(/gallery-item/);
    await expect(page.locator('#linked + .caption, #excluded + .caption')).toHaveCount(0);
    await expect(page.locator('a.gallery-item #excluded')).toHaveCount(0);
    expect(await page.evaluate(() => window.__injected)).toBeUndefined();
}

test('enhances images without loading or invoking disabled Gallery SDKs', async ({ page, visit, diagnostics }) => {
    await mount(page, visit, 'gallery-off');
    await expectEnhancement(page);
    await page.addScriptTag({ content: lightSdk + justifiedSdk });
    await page.evaluate(() => window.HexoGallery.init());
    expect(await page.evaluate(() => window.__galleryCalls)).toEqual({ light: [], justified: [] });
    expect(diagnostics.external.some(url => /lightgallery|justifiedGallery/.test(url))).toBe(false);
    expect(diagnostics.pageErrors).toEqual([]);
});

test('initializes enabled SDKs once despite both installers and repeated init', async ({ page, visit, diagnostics }) => {
    await mount(page, visit);
    await expectEnhancement(page);
    await expect(page.locator('#justified > a.gallery-item')).toHaveCount(1);
    const before = await page.locator('#gallery-article').innerHTML();
    await page.addScriptTag({ content: installer });
    await page.evaluate(() => {
        window.HexoGallery.init(document, { lightGallery: true, justifiedGallery: true });
        window.HexoGallery.init(document, { lightGallery: true, justifiedGallery: true });
    });
    expect(await page.locator('#gallery-article').innerHTML()).toBe(before);
    expect(await page.evaluate(() => window.__galleryCalls)).toEqual({ light: [['gallery-article', '.gallery-item']], justified: ['justified'] });
    expect(diagnostics.pageErrors).toEqual([]);
});

test('retries late SDK scripts using the latest page flags, not an earlier enabled request', async ({ page, visit, diagnostics }) => {
    await mount(page, visit, 'gallery-on', false);
    await expectEnhancement(page);
    expect(await page.evaluate(() => window.__galleryCalls.light.length)).toBe(0);
    await page.evaluate(() => { window.IcarusThemeSettings.gallery = false; });
    await page.addScriptTag({ url: '/js/main.js' });
    await page.addScriptTag({ content: lightSdk + justifiedSdk });
    expect(await page.evaluate(() => window.__galleryCalls)).toEqual({ light: [], justified: [] });
    await page.evaluate(() => window.HexoGallery.init(document, { lightGallery: true, justifiedGallery: true }));
    expect(await page.evaluate(() => window.__galleryCalls)).toEqual({ light: [['gallery-article', '.gallery-item']], justified: ['justified'] });
    expect(diagnostics.pageErrors).toEqual([]);
});

test('keeps shared runtime state across PJAX on/off/on without stale flags or duplicate bindings', async ({ page, visit, diagnostics }) => {
    await mount(page, visit);
    await page.evaluate(() => { window.__noFullReload = true; });
    for (const [name, enabled, count] of [['gallery-off', false, 1], ['gallery-next', true, 2]]) {
        await page.locator(`.gallery-nav[href="/${name}/"]`).click();
        await expect(page).toHaveTitle(name + ' - Icarus Fixture');
        await expect.poll(() => page.evaluate(() => window.IcarusThemeSettings.gallery)).toBe(enabled);
        await page.waitForLoadState('networkidle');
        await expectEnhancement(page);
        expect(await page.evaluate(() => window.__noFullReload)).toBe(true);
        expect(await page.evaluate(() => window.__galleryCalls.light.length)).toBe(count);
        expect(await page.evaluate(() => window.__galleryCalls.justified.length)).toBe(count);
    }
    expect(diagnostics.pageErrors).toEqual([]);
});

test('disables pending SDK initialization before queued main scripts can run on the off page', async ({ page, visit, diagnostics }) => {
    await mount(page, visit, 'gallery-off');
    await page.evaluate(() => { window.__noFullReload = true; window.__mainRuns = 0; });
    await page.route('**/js/main.js', async route => {
        const response = await route.fetch();
        await route.fulfill({ response, body: await response.text() + '\nwindow.__mainRuns++;' });
    });
    let release;
    const gate = new Promise(resolve => { release = resolve; });
    const requested = [];
    for (const [file, source] of [['lightgallery-all.min.js', lightSdk], ['jquery.justifiedGallery.min.js', justifiedSdk]]) {
        await page.route('**/' + file, async route => {
            requested.push(file);
            await gate;
            await route.fulfill({ contentType: 'application/javascript', body: source });
        });
    }
    try {
        await page.locator('.gallery-nav[href="/gallery-on/"]').click();
        await expect(page).toHaveTitle('gallery-on - Icarus Fixture');
        await expect.poll(() => requested.length).toBe(2);
        await expect.poll(() => page.evaluate(() => window.IcarusThemeSettings.gallery)).toBe(true);
        expect(await page.evaluate(() => window.__mainRuns)).toBe(0);

        // Navigate again while both SDK responses are held. Do not wait for main,
        // window load or networkidle: they are precisely what the SDK queue delays.
        await page.locator('.gallery-nav[href="/gallery-off/"]').click();
        await expect(page).toHaveTitle('gallery-off - Icarus Fixture');
        await expect.poll(() => page.evaluate(() => window.IcarusThemeSettings.gallery)).toBe(false);
        expect(await page.evaluate(() => window.__mainRuns)).toBe(0);
    } finally {
        release();
    }
    await expect.poll(() => page.evaluate(() => window.__mainRuns)).toBe(2);
    expect(await page.evaluate(() => window.__noFullReload)).toBe(true);
    expect(await page.evaluate(() => window.__galleryCalls)).toEqual({ light: [], justified: [] });
    expect(await page.evaluate(() => !!window.jQuery('#gallery-article').data('lightGallery'))).toBe(false);
    expect(await page.evaluate(() => !!window.jQuery('#justified').data('jg.controller'))).toBe(false);
    await expectEnhancement(page);

    // The SDKs are now available: a subsequent enabled page may initialize once.
    await page.locator('.gallery-nav[href="/gallery-next/"]').click();
    await expect(page).toHaveTitle('gallery-next - Icarus Fixture');
    await expect.poll(() => page.evaluate(() => window.__galleryCalls.light.length)).toBe(1);
    expect(await page.evaluate(() => window.__galleryCalls.justified.length)).toBe(1);
    expect(requested).toHaveLength(2);
    expect(diagnostics.pageErrors).toEqual([]);
});
