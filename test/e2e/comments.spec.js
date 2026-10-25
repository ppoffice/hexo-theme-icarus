/**
 * Comment providers of hexo-component-inferno with PJAX and the dark appearance, and the Waline
 * page view counter with PJAX.
 *
 * The fixture variant has a post for each provider (test/fixtures/variants.js), which follows
 * the system color scheme, and a light post with Giscus. The client scripts and libraries of the
 * providers and the counter are replaced by the stubs below, which record how they were loaded
 * and initialised.
 */
const { test, expect } = require('./fixtures');

const VARIANT = 'pjax-comments';
const POSTS = ['giscus', 'giscus-light', 'utterances', 'beaudar', 'waline', 'artalk', 'cusdis'];
const postUrl = name => `/2024/05/0${POSTS.indexOf(name) + 1}/comments-${name}/`;

const js = body => ({ status: 200, contentType: 'application/javascript', body });
// Waline is imported as an ES module from the CDN, which needs CORS.
const module_ = body => ({ status: 200, contentType: 'application/javascript', headers: { 'access-control-allow-origin': '*' }, body });

/**
 * Like the clients of Giscus, Utterances and Beaudar, read the options from the attributes of
 * the script itself (document.currentScript) and put a frame into the comment section.
 */
const clientStub = (name, thread, attributes) => `(function () {
    var script = document.currentScript;
    var thread = ${thread};
    var frame = document.createElement('div');
    frame.className = 'stub-frame';
    ${JSON.stringify(attributes)}.forEach(function (name) {
        frame.setAttribute('data-' + name.replace(/^data-/, ''), script.getAttribute(name));
    });
    frame.textContent = '${name} ' + window.location.pathname;
    while (thread.firstChild && thread.firstChild !== script) {
        thread.removeChild(thread.firstChild);
    }
    thread.appendChild(frame);
    window.__loads = window.__loads || {};
    window.__loads['${name}'] = (window.__loads['${name}'] || 0) + 1;
})();`;

const CLIENTS = {
    giscus: {
        url: 'https://giscus.app/client.js',
        // Giscus finds the element with the giscus class, wherever its script is
        stub: clientStub('giscus', 'document.querySelector(\'.giscus\')', ['data-theme', 'data-repo', 'data-mapping']),
        thread: '#giscus-thread',
        theme: 'data-theme',
        themes: { light: 'light', dark: 'dark_dimmed' }
    },
    utterances: {
        url: 'https://utteranc.es/client.js',
        stub: clientStub('utterances', 'script.parentNode', ['theme', 'repo', 'issue-term']),
        thread: '#utterances-thread',
        theme: 'theme',
        themes: { light: 'github-light', dark: 'photon-dark' }
    },
    beaudar: {
        url: 'https://beaudar.lipk.org/client.js',
        stub: clientStub('beaudar', 'script.parentNode', ['theme', 'repo', 'branch', 'issue-term']),
        thread: '#beaudar-thread',
        theme: 'theme',
        themes: { light: 'github-light', dark: 'icy-dark' }
    }
};

const WALINE_STUB = `
export function init(options) {
    var record = { path: options.path, dark: options.dark, serverURL: options.serverURL, destroyed: false };
    window.__waline = window.__waline || [];
    window.__waline.push(record);
    document.querySelector(options.el).textContent = 'Waline ' + options.path;
    return { destroy: function () { record.destroyed = true; } };
}`;

const PAGEVIEW_JS = 'https://cdn.jsdelivr.net/npm/@waline/client@3.3.0/dist/pageview.js';

// Count a view of the path, and show the views of the path of each counter.
const PAGEVIEW_STUB = `
export function pageviewCount(options) {
    window.__pageviews = window.__pageviews || [];
    window.__pageviews.push({ serverURL: options.serverURL, path: options.path });
    document.querySelectorAll('.waline-pageview-count').forEach(function (element) {
        var path = element.getAttribute('data-path') || options.path;
        element.textContent = String(window.__pageviews.filter(function (view) { return view.path === path; }).length);
    });
    return function () {};
}`;

// Like Artalk, use the path of the current URL as the page key without the pageKey option.
const ARTALK_STUB = `
window.__loads = window.__loads || {};
window.__loads.artalk = (window.__loads.artalk || 0) + 1;
window.Artalk = {
    init: function (options) {
        var pageKey = options.pageKey || window.location.pathname;
        var record = { server: options.server, site: options.site, pageKey: pageKey, darkMode: options.darkMode, destroyed: false };
        window.__artalk = window.__artalk || [];
        window.__artalk.push(record);
        document.querySelector(options.el).textContent = 'Artalk ' + pageKey;
        var handlers = {};
        return {
            on: function (name, handler) { handlers[name] = handler; },
            update: function (conf) { record.darkMode = conf.darkMode; },
            destroy: function () { record.destroyed = true; if (handlers.unmounted) handlers.unmounted(); }
        };
    }
};`;

// Like cusdis.es.js: render #cusdis_thread once loaded, and expose window.renderCusdis.
const CUSDIS_STUB = `
window.__loads = window.__loads || {};
window.__loads.cusdis = (window.__loads.cusdis || 0) + 1;
window.renderCusdis = function (element) {
    element.textContent = 'Cusdis ' + element.getAttribute('data-page-id') + ' ' + element.getAttribute('data-theme') +
        ' ' + (window.CUSDIS_LOCALE || 'en');
    window.__cusdisRenders = (window.__cusdisRenders || 0) + 1;
};
window.renderCusdis(document.getElementById('cusdis_thread'));`;

async function stubComments(page) {
    for (const { url, stub } of Object.values(CLIENTS)) {
        await page.route(url, route => route.fulfill(js(stub)));
    }
    await page.route('https://cdn.jsdelivr.net/npm/@waline/client@3.3.0/dist/waline.js', route => route.fulfill(module_(WALINE_STUB)));
    await page.route(PAGEVIEW_JS, route => route.fulfill(module_(PAGEVIEW_STUB)));
    await page.route('https://cdn.jsdelivr.net/npm/artalk@2.10.0/dist/Artalk.js', route => route.fulfill(js(ARTALK_STUB)));
    await page.route('https://cusdis.com/js/widget/lang/zh-cn.js', route => route.fulfill(js('window.CUSDIS_LOCALE = "zh-cn";')));
    await page.route('https://cusdis.com/js/cusdis.es.js', route => route.fulfill(js(CUSDIS_STUB)));
}

/** Click a link and wait until PJAX has swapped the page in and its scripts have run. */
async function pjaxClick(page, locator) {
    const done = page.evaluate(() => new Promise(resolve => document.addEventListener('pjax:complete', resolve, { once: true })));
    await locator.click();
    await done;
    await page.waitForLoadState('networkidle');
}

/** Follow the link to the post with the given comments in the content of the current post. */
const goTo = (page, name) => pjaxClick(page, page.locator(`.article .content a[href="${postUrl(name)}"]`));

const loads = (page, name) => page.evaluate(name => (window.__loads || {})[name] || 0, name);

test.beforeEach(async ({ page }) => {
    await stubComments(page);
});

test.describe('Giscus, Utterances and Beaudar', () => {
    for (const colorScheme of ['dark', 'light']) {
        test.describe(`with a ${colorScheme} system color scheme`, () => {
            test.use({ colorScheme });

            for (const [name, client] of Object.entries(CLIENTS)) {
                test(`${name} is initialised on every post PJAX switches to, with the theme of the appearance`, async ({ page, visit, diagnostics }) => {
                    const frame = page.locator(`${client.thread} .stub-frame`);
                    // A light page with Giscus, whatever the system color scheme
                    await visit(postUrl('giscus-light'), { variant: VARIANT });
                    await expect(page.locator('#giscus-thread .stub-frame')).toHaveAttribute('data-theme', 'light');
                    await page.evaluate(() => { window.__noFullReload = true; });

                    for (let i = 0; i < 2; i++) {
                        // The client is loaded once on each post
                        const before = await loads(page, name);
                        await goTo(page, name);
                        await expect(page).toHaveTitle(`Comments ${name} - Icarus Fixture`);
                        // The post follows the system color scheme
                        await expect(page.locator('html')).toHaveAttribute('data-appearance', 'auto');
                        await expect(frame).toHaveCount(1);
                        await expect(frame).toHaveText(`${name} ${postUrl(name)}`);
                        await expect(frame).toHaveAttribute(`data-${client.theme.replace(/^data-/, '')}`, client.themes[colorScheme]);
                        await expect(frame).toHaveAttribute('data-repo', 'fixture-owner/fixture-comments');
                        expect(await loads(page, name)).toBe(before + 1);

                        await goTo(page, 'giscus-light');
                        await expect(page.locator('html')).not.toHaveAttribute('data-appearance', /./);
                        await expect(page.locator('#giscus-thread .stub-frame')).toHaveAttribute('data-theme', 'light');
                    }

                    expect(await page.evaluate(() => window.__noFullReload)).toBe(true);
                    expect(diagnostics.pageErrors).toEqual([]);
                });
            }
        });
    }

    test('add their client script to the comments, or to <head> for Giscus, with the configured options', async ({ page, visit }) => {
        await visit(postUrl('beaudar'), { variant: VARIANT });
        const beaudar = page.locator(`#beaudar-thread script[src="${CLIENTS.beaudar.url}"]`);
        await expect(beaudar).toHaveCount(1);
        expect(await beaudar.evaluate(script => script.async)).toBe(true);
        await expect(beaudar).toHaveAttribute('branch', 'main');
        await expect(beaudar).toHaveAttribute('issue-term', 'title');
        await expect(beaudar).toHaveAttribute('crossorigin', 'anonymous');

        await visit(postUrl('giscus'), { variant: VARIANT });
        const giscus = page.locator(`head script[src="${CLIENTS.giscus.url}"]`);
        await expect(giscus).toHaveCount(1);
        await expect(giscus).toHaveAttribute('data-category-id', 'fixture-category-id');
        await expect(giscus).toHaveAttribute('data-mapping', 'pathname');
    });
});

test.describe('Waline', () => {
    test.use({ colorScheme: 'dark' });

    test('is initialised again on the post PJAX switches back to, after destroying the previous instance', async ({ page, visit, diagnostics }) => {
        const instances = () => page.evaluate(() => window.__waline || []);
        await visit(postUrl('waline'), { variant: VARIANT });
        await expect(page.locator('#waline-thread')).toHaveText(`Waline ${postUrl('waline')}`);
        // On a page that follows the system color scheme, Waline does too
        expect(await instances()).toEqual([{ path: postUrl('waline'), dark: 'auto', serverURL: 'https://waline.example.com', destroyed: false }]);
        await page.evaluate(() => { window.__noFullReload = true; });

        await goTo(page, 'giscus-light');
        await goTo(page, 'waline');
        await expect(page.locator('#waline-thread')).toHaveText(`Waline ${postUrl('waline')}`);
        expect((await instances()).map(instance => instance.destroyed)).toEqual([true, false]);
        expect(await page.evaluate(() => window.__noFullReload)).toBe(true);
        expect(diagnostics.pageErrors).toEqual([]);
    });
});

test.describe('Artalk', () => {
    test.use({ colorScheme: 'dark' });

    // PJAX runs the scripts of the new page before changing the URL, and the library is already
    // loaded the second time, so Artalk would be initialised with the path of the previous page.
    test('is initialised again on the post PJAX switches back to, for that post, without loading the library again', async ({ page, visit, diagnostics }) => {
        const instances = () => page.evaluate(() => window.__artalk || []);
        await visit(postUrl('artalk'), { variant: VARIANT });
        await expect(page.locator('#artalk-thread')).toHaveText(`Artalk ${postUrl('artalk')}`);
        expect(await instances()).toEqual([{ server: 'https://artalk.example.com', site: 'Icarus Fixture', pageKey: postUrl('artalk'), darkMode: 'auto', destroyed: false }]);
        await expect(page.locator('#comments link[rel="stylesheet"]')).toHaveAttribute('media', 'all');
        await page.evaluate(() => { window.__noFullReload = true; });

        await goTo(page, 'giscus-light');
        await goTo(page, 'artalk');
        await expect(page.locator('#artalk-thread')).toHaveText(`Artalk ${postUrl('artalk')}`);
        expect((await instances()).map(instance => instance.destroyed)).toEqual([true, false]);
        expect(await loads(page, 'artalk')).toBe(1);
        expect(await page.evaluate(() => window.__noFullReload)).toBe(true);
        expect(diagnostics.pageErrors).toEqual([]);
    });
});

test.describe('Cusdis', () => {
    test('is rendered again on the post PJAX switches back to, without loading the library again', async ({ page, visit, diagnostics }) => {
        const thread = page.locator('#cusdis_thread');
        await visit(postUrl('cusdis'), { variant: VARIANT });
        // The theme follows the appearance of the page, and the language script is loaded first
        await expect(thread).toHaveText(`Cusdis ${postUrl('cusdis')} auto zh-cn`);
        await page.evaluate(() => { window.__noFullReload = true; });

        await goTo(page, 'giscus-light');
        await goTo(page, 'cusdis');
        await expect(thread).toHaveText(`Cusdis ${postUrl('cusdis')} auto zh-cn`);
        expect(await page.evaluate(() => [window.__loads.cusdis, window.__cusdisRenders, window.__noFullReload])).toEqual([1, 2, true]);
        expect(diagnostics.pageErrors).toEqual([]);
    });
});

test.describe('Waline page view counter', () => {
    test('counts a view of the first page and of each page PJAX switches to, and shows the views of posts', async ({ page, visit, diagnostics }) => {
        const counter = page.locator('.article-meta .waline-pageview-count');
        const views = () => page.evaluate(() => (window.__pageviews || []).map(view => view.path));
        await visit(postUrl('giscus-light'), { variant: VARIANT });
        await expect(counter).toHaveText('1');
        await expect(counter).toHaveAttribute('data-path', postUrl('giscus-light'));
        expect(await page.evaluate(() => window.__pageviews[0].serverURL)).toBe('https://waline.example.com');
        await page.evaluate(() => { window.__noFullReload = true; });

        await goTo(page, 'utterances');
        await expect(counter).toHaveAttribute('data-path', postUrl('utterances'));
        await expect(counter).toHaveText('1');
        await goTo(page, 'giscus-light');
        await expect(counter).toHaveText('2');
        await pjaxClick(page, page.locator('.navbar-start a', { hasText: 'Home' }));
        await expect(page.locator('.waline-pageview-count')).toHaveCount(0);

        expect(await views()).toEqual([postUrl('giscus-light'), postUrl('utterances'), postUrl('giscus-light'), '/']);
        expect(await page.evaluate(() => window.__noFullReload)).toBe(true);
        expect(diagnostics.pageErrors).toEqual([]);
    });
});
