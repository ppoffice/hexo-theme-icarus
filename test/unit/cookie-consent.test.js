const assert = require('assert').strict;
const { render, fixtureConfig } = require('../support/render');

describe('CookieConsent tracking integration boundary', () => {
    const tracking = {
        baidu_analytics: { tracking_id: 'baidu' },
        busuanzi: true,
        cnzz: { id: 'cnzz', web_id: 'site' },
        google_analytics: { tracking_id: 'G-TEST' },
        hotjar: { site_id: 'hotjar' },
        matomo: { url: 'https://matomo.example/', site_id: '1' },
        statcounter: { project: 'project', security: 'secret' },
        twitter_conversion_tracking: { pixel_id: 'pixel' },
        umami: { website_id: 'website' },
        waline_pageview: { server_url: 'https://waline.example/' }
    };

    async function plugins(type, head) {
        return render('common/plugins', {
            config: { ...fixtureConfig(), plugins: { ...tracking, cookie_consent: type ? { type } : false } },
            head
        });
    }

    for (const type of ['opt-in', 'opt-out']) {
        it(`gates all ten trackers and removes active noscript pixels in ${type}`, async () => {
            const results = await Promise.all([plugins(type, true), plugins(type, false)]);
            const gated = [];
            for (const { $ } of results) {
                assert.equal($('script[src], noscript img, iframe').length, 0);
                $('script').each((i, script) => {
                    const match = $(script).text().match(/hexoComponentConsent\.register\("([^"]+)"/);
                    if (match) gated.push(match[1]);
                });
            }
            assert.deepEqual(gated.sort(), Object.keys(tracking).sort());
        });
    }

    for (const type of [null, 'info']) {
        it(`preserves legacy loading when consent is ${type || 'disabled'}`, async () => {
            const { $ } = await plugins(type, true);
            assert.ok($('script[src*="googletagmanager"]').length);
            assert.ok($('script[src*="umami"]').length);
            assert.ok($('script[src*="busuanzi"]').length);
            assert.ok(!$('script').text().includes('hexoComponentConsent.register'));
        });
    }

    it('does not mistake necessary library assets or verification tags for tracking integrations', async () => {
        const config = { ...fixtureConfig(), plugins: {
            cookie_consent: { type: 'opt-in' }, bing_webmaster: { tracking_id: 'verification' }, katex: true
        } };
        const { $ } = await render('common/plugins', {
            config,
            head: true
        });
        assert.equal($('meta[name="msvalidate.01"]').length, 1);
        assert.equal($('link[href*="cookieconsent"]').length, 1);
        assert.ok(!$('script').text().includes('hexoComponentConsent.register'));
        const footer = await render('common/plugins', { config, head: false });
        assert.equal(footer.$('script[src*="katex"]').length, 3);
        assert.ok(!footer.$('script').text().includes('hexoComponentConsent.register'));
    });
});
