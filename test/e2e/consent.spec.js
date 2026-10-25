const path = require('path');
const { spawnSync } = require('child_process');
const { test, expect } = require('./fixtures');

const fixtures = {};

test.beforeAll(() => {
    const result = spawnSync(process.execPath, [path.join(__dirname, '../support/render-consent.js')], {
        encoding: 'utf8',
        env: { ...process.env, NODE_ENV: 'production', BABEL_DISABLE_CACHE: '1' }
    });
    if (result.status !== 0) {
        throw new Error(result.stderr || 'Could not render consent fixtures');
    }
    Object.assign(fixtures, JSON.parse(result.stdout));
});

for (const type of ['opt-in', 'opt-out', 'info']) {
    test(`tracking consent ${type} survives PJAX and denial reloads without tracking`, async ({ page, visit, diagnostics }) => {
        const { head, footer } = fixtures[type];
        let trackers = 0;
        await page.route('https://analytics.example/consent.js', route => {
            trackers++;
            return route.fulfill({ contentType: 'application/javascript', body: 'window.__consentTrackerRuns = (window.__consentTrackerRuns || 0) + 1;' });
        });
        // Keep the vendor UI offline; exercise the generated callbacks and the actual
        // theme/component consent controller, including its persisted reload boundary.
        await page.route('**/cookieconsent@*/build/cookieconsent.min.js', route => route.fulfill({
            contentType: 'application/javascript',
            body: `window.cookieconsent = { initialise(options, ready) {
                window.__consentOptions = options;
                ready({ open() {}, setStatus(status) {
                    document.cookie = 'cookieconsent_status=' + status + '; Path=/; SameSite=Lax';
                    if (options.onStatusChange) options.onStatusChange(status);
                } });
            } };`
        }));
        await page.route('http://127.0.0.1:*/**', async route => {
            if (route.request().resourceType() !== 'document' && route.request().resourceType() !== 'xhr') return route.fallback();
            const response = await route.fetch();
            if (!(response.headers()['content-type'] || '').includes('text/html')) return route.fulfill({ response });
            const body = (await response.text()).replace('</head>', head + '</head>').replace('</body>', footer + '</body>');
            return route.fulfill({ response, body });
        });
        await visit('/', { variant: 'pjax' });
        await page.waitForLoadState('networkidle');
        if (type === 'info') {
            expect(trackers).toBe(1);
            expect(await page.evaluate(() => window.hexoComponentConsent)).toBeUndefined();
        } else {
            expect(trackers).toBe(type === 'opt-out' ? 1 : 0);
            await page.evaluate(() => window.hexoComponentCookieConsentPopup.setStatus('allow'));
            await expect.poll(() => trackers).toBe(1);
        }
        await page.locator('.navbar-start a', { hasText: 'Archives' }).first().evaluate(el => el.click());
        await expect(page).toHaveTitle('Archives - Icarus Fixture');
        await page.waitForLoadState('networkidle');
        expect(trackers).toBe(1);
        expect(await page.evaluate(() => window.__consentTrackerRuns)).toBe(1);
        if (type !== 'info') {
            const reloaded = page.waitForEvent('load');
            await page.evaluate(() => window.hexoComponentConsent.revoke());
            await reloaded;
            await page.waitForLoadState('networkidle');
            expect(await page.evaluate(() => window.hexoComponentConsent.allowed())).toBe(false);
            expect(trackers).toBe(1);
            expect(await page.evaluate(() => window.__consentTrackerRuns)).toBeUndefined();
        }
        expect(diagnostics.pageErrors).toEqual([]);
    });
}
