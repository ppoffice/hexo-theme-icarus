/** Published Artalk 2.10.0 browser SDK and CSS, with mocked (not live) server responses. */
const fs = require('fs');
const { createElement } = require('inferno-create-element');
const { renderToString } = require('inferno-server');
const Artalk = require('hexo-component-inferno/lib/view/comment/artalk');
const { test, expect } = require('./fixtures');

const POST = '/2024/05/06/comments-artalk/';
const LIGHT = '/2024/05/02/comments-giscus-light/';
const SDK = 'https://cdn.jsdelivr.net/npm/artalk@2.10.0/dist/';

async function mockServer(page) {
    const requests = [];
    const comments = [];
    // The shared comment fixture also has an unrelated pageview counter; keep it offline.
    await page.route('https://cdn.jsdelivr.net/npm/@waline/client@*/dist/pageview.js', route => route.fulfill({
        contentType: 'application/javascript', headers: { 'access-control-allow-origin': '*' },
        body: 'export function pageviewCount() {}'
    }));
    await page.route(`${SDK}**`, route => {
        const file = route.request().url().slice(SDK.length);
        return route.fulfill({ contentType: file.endsWith('.css') ? 'text/css' : 'application/javascript', body: fs.readFileSync(require.resolve(`artalk/dist/${file}`)) });
    });
    await page.route('https://artalk.example.com/api/v2/**', route => {
        const request = route.request();
        const url = new URL(request.url());
        requests.push({ path: url.pathname, query: Object.fromEntries(url.searchParams), method: request.method(), body: request.postDataJSON() });
        let json;
        switch (url.pathname) {
            case '/api/v2/conf':
                json = { version: { version: '2.10.0' }, frontend_conf: { locale: 'en', emoticons: false, imgUpload: false } };
                break;
            case '/api/v2/comments':
                if (request.method() === 'POST') {
                    const input = request.postDataJSON();
                    json = { ...input, id: comments.length + 1, nick: input.name, date: '2026-10-24 12:00:00', content_marked: '', email_encrypted: '', link: '', ua: '', badge_name: '', badge_color: '', is_allow_reply: true, vote_up: 0, vote_down: 0, visible: true };
                    comments.push(json);
                } else {
                    json = { comments, count: comments.length, roots_count: comments.filter(comment => !comment.rid).length, page: { id: 1, key: POST, pv: 1, vote_up: 0, vote_down: 0 } };
                }
                break;
            case '/api/v2/pages/pv': json = { pv: 1 }; break;
            case '/api/v2/conf/auth/providers': json = { anonymous: true, providers: [] }; break;
            case '/api/v2/user/status': json = { is_login: false, is_admin: false }; break;
            case '/api/v2/user': json = { id: 1, name: 'Fixture visitor', email: 'visitor@example.com', is_admin: false }; break;
            case '/api/v2/notifies': json = { notifies: [], count: 0 }; break;
            case '/api/v2/votes/comment/1/up': json = { up: 1, down: 0, is_up: true, is_down: false }; break;
            default: throw new Error(`Unexpected Artalk API request: ${request.method()} ${url.pathname}`);
        }
        return route.fulfill({ json, headers: { 'access-control-allow-origin': '*' } });
    });
    return requests;
}

for (const colorScheme of ['light', 'dark']) {
    test(`Artalk published SDK renders, posts, replies, votes and survives PJAX (${colorScheme})`, async ({ page, visit, diagnostics }) => {
        await page.emulateMedia({ colorScheme });
        if (colorScheme === 'dark') await page.setViewportSize({ width: 390, height: 844 });
        const requests = await mockServer(page);
        await visit(POST, { variant: 'pjax-comments' });
        await page.waitForLoadState('networkidle');
        const thread = page.locator('#artalk-thread');
        await expect(thread.locator('.atk-send-btn')).toHaveText('Send');
        expect(await thread.evaluate(el => el.classList.contains('atk-dark-mode'))).toBe(colorScheme === 'dark');
        expect(await thread.evaluate(el => getComputedStyle(el).getPropertyValue('--at-color-main').trim())).not.toBe('');
        expect(requests.some(request => request.path === '/api/v2/comments' && request.query.page_key === POST && request.query.site_name === 'Icarus Fixture')).toBe(true);
        await thread.locator('input[name="name"]').fill('Fixture visitor');
        await thread.locator('input[name="email"]').fill('visitor@example.com');
        await thread.locator('textarea').fill('Published SDK comment');
        await thread.locator('.atk-send-btn').click();
        await expect(thread.locator('#atk-comment-1')).toContainText('Published SDK comment');
        await thread.locator('#atk-comment-1 .atk-actions').getByText('Reply', { exact: true }).click();
        await thread.locator('textarea').fill('Published SDK reply');
        await thread.locator('.atk-send-btn').click();
        await expect(thread.locator('#atk-comment-2')).toContainText('Published SDK reply');
        expect(requests.find(request => request.method === 'POST' && request.path === '/api/v2/comments' && request.body.rid === 1)).toBeTruthy();
        await thread.locator('#atk-comment-1 .atk-actions').getByText('Up (0)', { exact: true }).first().click();
        await expect.poll(() => requests.some(request => request.path === '/api/v2/votes/comment/1/up')).toBe(true);

        await page.evaluate(() => {
            window.__firstArtalk = window.__artalkInstance;
            window.__firstArtalk.on('unmounted', () => { window.__artalkDestroyed = true; });
            document.documentElement.setAttribute('data-appearance', 'dark');
        });
        await expect(thread).toHaveClass(/atk-dark-mode/);
        await page.evaluate(() => document.documentElement.setAttribute('data-appearance', 'light'));
        await expect(thread).not.toHaveClass(/atk-dark-mode/);
        await page.evaluate(() => document.documentElement.setAttribute('data-appearance', 'auto'));
        await page.emulateMedia({ colorScheme: 'dark' });
        await expect(thread).toHaveClass(/atk-dark-mode/);
        await page.emulateMedia({ colorScheme: 'light' });
        await expect(thread).not.toHaveClass(/atk-dark-mode/);
        await page.locator(`.article .content a[href="${LIGHT}"]`).click();
        await expect(page).toHaveURL(new RegExp(LIGHT));
        expect(await page.evaluate(() => window.__artalkDestroyed)).toBe(true);
        await page.goBack();
        await expect(thread.locator('#atk-comment-1')).toContainText('Published SDK comment');
        expect(await page.evaluate(() => !!window.__firstArtalk && window.__firstArtalk !== window.__artalkInstance)).toBe(true);
        await page.goForward();
        await expect(page).toHaveURL(new RegExp(LIGHT));
        expect(await page.evaluate(() => window.__artalkInstance)).toBeNull();
        await page.goBack();
        await expect(thread.locator('#atk-comment-1')).toContainText('Published SDK comment');
        expect(await page.locator(`head script[src="${SDK}Artalk.js"]`).count()).toBe(1);
        expect(diagnostics.pageErrors).toEqual([]);
        expect(diagnostics.consoleErrors).toEqual([]);
    });
}

test('Artalk 2.10 local/remote locale priority and explicit dark mode', async ({ page, visit, diagnostics }) => {
    await mockServer(page);
    await visit(POST, { variant: 'pjax-comments' });
    await page.waitForLoadState('networkidle');
    for (const [locale, preferRemoteConf, expected, send] of [['zh-CN', false, 'zh-CN', '发送'], ['zh-TW', false, 'zh-TW', '發送'], ['auto', false, 'en-US', 'Send'], ['zh-CN', true, 'en', 'Send']]) {
        const html = renderToString(createElement(Artalk.Cacheable, {
            comment: { server: 'https://artalk.example.com', site: 'Icarus Fixture', page_key: '/locale/', locale, prefer_remote_conf: preferRemoteConf, dark_mode: false },
            page: { title: 'Locale fixture' }, helper: { cdn: (name, version, file) => `https://cdn.jsdelivr.net/npm/${name}@${version}/${file}` }
        }));
        await page.evaluate(html => {
            window.__artalkInstance.destroy();
            const container = document.querySelector('#comments .card-content');
            container.innerHTML = html;
            // eslint-disable-next-line no-new-func
            new Function(container.querySelector('script').textContent)();
        }, html);
        await page.waitForLoadState('networkidle');
        await expect.poll(() => page.evaluate(() => window.__artalkInstance.getConf().locale)).toBe(expected);
        await expect(page.locator('#artalk-thread .atk-send-btn')).toHaveText(send);
        await expect(page.locator('#artalk-thread')).not.toHaveClass(/atk-dark-mode/);
    }
    expect(diagnostics.pageErrors).toEqual([]);
});

for (const variant of ['default', 'cyberpunk', 'm3e']) {
    test(`Artalk published CSS and component render within ${variant}`, async ({ page, visit, diagnostics }) => {
        await mockServer(page);
        await visit('/', { variant });
        const html = renderToString(createElement(Artalk, {
            server: 'https://artalk.example.com', site: 'Icarus Fixture', pageKey: POST,
            locale: 'en', jsUrl: `${SDK}Artalk.js`, cssUrl: `${SDK}Artalk.css`
        }));
        await page.evaluate(html => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `<div class="card-content">${html}</div>`;
            document.querySelector('.column-main').prepend(card);
            // Inserted HTML does not execute scripts automatically.
            // eslint-disable-next-line no-new-func
            new Function(card.querySelector('script').textContent)();
        }, html);
        await page.waitForLoadState('networkidle');
        await expect(page.locator('#artalk-thread .atk-send-btn')).toBeVisible();
        const editor = page.locator('#artalk-thread textarea');
        await expect(editor).toBeVisible();
        const box = await editor.boundingBox();
        expect(box.width).toBeGreaterThan(200);
        expect(await page.locator('#artalk-thread').evaluate(el => getComputedStyle(el).getPropertyValue('--at-color-main').trim())).not.toBe('');
        expect(diagnostics.pageErrors).toEqual([]);
        expect(diagnostics.consoleErrors).toEqual([]);
    });
}
