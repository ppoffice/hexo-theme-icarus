/** Published Waline 3.16.1 modules/CSS with mock APIs only; never posts to a live server. */
const fs = require('fs');
const path = require('path');
const { createElement } = require('inferno-create-element');
const { renderToString } = require('inferno-server');
const Waline = require('hexo-component-inferno/lib/view/comment/waline');
const { test, expect } = require('./fixtures');

const clientDir = path.dirname(require.resolve('@waline/client/package.json'));
const SDK = 'https://cdn.jsdelivr.net/npm/@waline/client@3.16.1/dist/';
const POST = '/2024/05/05/comments-waline/';
const LIGHT = '/2024/05/02/comments-giscus-light/';

async function mockServer(page) {
    const requests = [];
    const comments = [];
    await page.route('https://cdn.jsdelivr.net/gh/walinejs/emojis/**/info.json', route => route.fulfill({ json: { name: 'Fixture', items: [] } }));
    await page.route(`${SDK}**`, route => {
        const file = route.request().url().slice(SDK.length);
        return route.fulfill({ contentType: file.endsWith('.css') ? 'text/css' : 'application/javascript', body: fs.readFileSync(path.join(clientDir, 'dist', file)) });
    });
    await page.route('https://waline.example.com/api/**', route => {
        const request = route.request();
        const url = new URL(request.url());
        const body = request.postDataJSON();
        requests.push({ path: url.pathname, query: Object.fromEntries(url.searchParams), method: request.method(), body });
        let data;
        if (url.pathname === '/api/article') {
            data = [{ time: 7 }];
        } else if (url.pathname === '/api/comment' && url.searchParams.get('type') === 'count') {
            data = [comments.length];
        } else if (url.pathname === '/api/comment' && request.method() === 'POST') {
            data = { ...body, objectId: comments.length + 1, time: Date.now(), comment: body.comment, orig: body.comment, like: 0, avatar: '', link: '', children: [] };
            comments.push(data);
        } else if (url.pathname === '/api/comment') {
            data = { count: comments.length, totalPages: 1, page: 1, pageSize: 10, data: comments };
        } else {
            throw new Error(`Unexpected Waline API request: ${request.method()} ${url.pathname}`);
        }
        return route.fulfill({ json: { errno: 0, errmsg: '', data }, headers: { 'access-control-allow-origin': '*' } });
    });
    return requests;
}

for (const colorScheme of ['light', 'dark']) {
    test(`Waline published SDK renders, mock-posts and survives PJAX (${colorScheme})`, async ({ page, visit, diagnostics }) => {
        await page.emulateMedia({ colorScheme });
        if (colorScheme === 'dark') await page.setViewportSize({ width: 390, height: 844 });
        const requests = await mockServer(page);
        await visit(POST, { variant: 'pjax-comments' });
        await page.waitForLoadState('networkidle');
        const thread = page.locator('#waline-thread');
        await expect(thread.locator('.wl-editor')).toBeVisible();
        await expect(page.locator('.article-meta .waline-pageview-count')).toHaveText('7');
        expect(requests.filter(request => request.path === '/api/article' && request.method === 'POST')).toHaveLength(1);
        expect(requests.some(request => request.path === '/api/comment' && request.query.path === POST)).toBe(true);
        await thread.locator('input[name="nick"]').fill('Fixture visitor');
        await thread.locator('input[name="mail"]').fill('visitor@example.com');
        await thread.locator('.wl-editor').fill('Published SDK mock comment');
        await thread.locator('.wl-btn.primary').click();
        // The editor's hidden preview also has .wl-content; assert on the posted card.
        const postedComment = thread.locator('.wl-cards .wl-card .wl-content');
        await expect(postedComment).toHaveCount(1);
        await expect(postedComment).toBeVisible();
        await expect(postedComment).toContainText('Published SDK mock comment');
        await expect.poll(() => requests.some(request => request.method === 'POST' && request.path === '/api/comment')).toBe(true);
        expect(requests.find(request => request.method === 'POST' && request.path === '/api/comment').body.url).toBe(POST);
        const background = () => thread.locator('.wl-panel').evaluate(el => getComputedStyle(el).backgroundColor);
        await page.evaluate(() => document.documentElement.setAttribute('data-appearance', 'light'));
        const light = await background();
        await page.evaluate(() => document.documentElement.setAttribute('data-appearance', 'dark'));
        await expect.poll(background).not.toBe(light);
        expect(requests.filter(request => request.path === '/api/article' && request.method === 'POST')).toHaveLength(1);
        await page.evaluate(() => {
            window.__firstWaline = window.__walineInstance;
            const destroy = window.__firstWaline.destroy;
            window.__firstWaline.destroy = function() { window.__walineDestroyed = true; destroy(); };
        });
        await page.locator(`.article .content a[href="${LIGHT}"]`).click();
        await expect(page).toHaveURL(new RegExp(LIGHT));
        expect(await page.evaluate(() => window.__walineDestroyed)).toBe(true);
        await page.goBack();
        await expect(thread.locator('.wl-editor')).toBeVisible();
        expect(await page.evaluate(() => window.__firstWaline !== window.__walineInstance)).toBe(true);
        await page.goForward();
        await expect(page).toHaveURL(new RegExp(LIGHT));
        // History changes the URL before PJAX finishes replacing and cleaning up the page.
        await expect.poll(() => page.evaluate(() => window.__walineInstance)).toBeNull();
        expect(diagnostics.pageErrors).toEqual([]);
        expect(diagnostics.consoleErrors).toEqual([]);
    });
}

for (const variant of ['default', 'cyberpunk', 'm3e']) {
    test(`Waline published CSS, locale, fixed path and counters in ${variant}`, async ({ page, visit, diagnostics }) => {
        const requests = await mockServer(page);
        await visit('/', { variant });
        const html = renderToString(createElement(Waline.Cacheable, {
            comment: { server_url: 'https://waline.example.com', path: '/fixed/', lang: 'zh-CN', copyright: false, emoji: false, image_uploader: true, highlighter: true, tex_renderer: true, search: true, comment: '.waline-comment-count', pageview: '.waline-pageview-count' },
            config: {}, page: {}, helper: { cdn: (name, version, file) => `https://cdn.jsdelivr.net/npm/${name}@${version}/${file}` }
        }));
        await page.evaluate(html => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `<div class="card-content">${html}<span class="waline-comment-count" data-path="/fixed/"></span><span class="waline-pageview-count" data-path="/fixed/"></span></div>`;
            document.querySelector('.column-main').prepend(card);
            // eslint-disable-next-line no-new-func
            new Function(card.querySelector('script').textContent)();
        }, html);
        await page.waitForLoadState('networkidle');
        await expect(page.locator('#waline-thread .wl-btn.primary')).toHaveText('提交');
        await expect(page.locator('.waline-comment-count')).toHaveText('0');
        await expect(page.locator('.waline-pageview-count')).toHaveText('7');
        await expect(page.locator('#waline-thread .wl-power')).toHaveCount(0);
        const editor = page.locator('#waline-thread .wl-editor');
        await expect(editor).toBeVisible();
        expect((await editor.boundingBox()).width).toBeGreaterThan(200);
        expect(requests.some(request => request.query.path === '/fixed/' && request.query.lang === 'zh-CN')).toBe(true);
        await page.evaluate(() => document.documentElement.setAttribute('data-appearance', 'dark'));
        await page.waitForLoadState('networkidle');
        expect(requests.filter(request => request.path === '/api/article' && request.method === 'POST')).toHaveLength(1);
        expect(requests.filter(request => request.path === '/api/comment' && !request.query.type).every(request => request.query.path === '/fixed/')).toBe(true);
        expect(diagnostics.pageErrors).toEqual([]);
        expect(diagnostics.consoleErrors).toEqual([]);
    });
}
