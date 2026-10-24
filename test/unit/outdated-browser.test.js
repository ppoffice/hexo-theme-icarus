const assert = require('assert').strict;
const vm = require('vm');
const { render, fixtureConfig } = require('../support/render');

describe('plugins.outdated_browser (theme CSS requirements)', () => {
    async function plugin(variant, enabled = true, head = false, appearance = 'light') {
        return render(head ? 'common/head' : 'layout', {
            config: fixtureConfig({ variant, appearance, widgets: [], search: { type: null }, plugins: { outdated_browser: enabled } }),
            site: { posts: { length: 0 }, categories: [], tags: [] },
            body: ''
        });
    }

    it('keeps the boolean toggle and does not emit third-party browser SDK assets', async () => {
        const disabled = await plugin('default', false);
        assert.equal(disabled.$('#outdated').length, 0);
        const head = await plugin('default', true, true);
        assert.equal(head.$('#outdated').length, 0);
        const enabled = await plugin('default');
        assert.equal(enabled.$('#outdated').length, 1);
        assert.equal(enabled.$('body').children().first().attr('id'), 'browser-notice');
        assert.equal(enabled.$('body > #browser-notice > #outdated').length, 1);
        assert.equal(enabled.$('[src*="outdatedbrowser"], [href*="outdatedbrowser"]').length, 0);
        const footer = await render('common/plugins', {
            config: fixtureConfig({ plugins: { outdated_browser: true } }), head: false
        });
        assert.equal(footer.$('#outdated').length, 0);
    });

    for (const variant of ['default', 'cyberpunk', 'm3e']) {
        it(`passes ${variant}'s necessary capabilities to the inline check`, async () => {
            const { $ } = await plugin(variant);
            const notice = { style: {} };
            const button = {};
            const calls = [];
            vm.runInNewContext($('script').filter((i, el) => $(el).text().includes('function checkBrowser')).text(), {
                document: { getElementById: id => {
                    return id === 'outdated' ? notice : button;
                } },
                window: { CSS: { supports: (property, value) => {
                    calls.push([property, value]);
                    return true;
                } } }
            });
            assert.equal(notice.style.display, 'none');
            const expected = [['display', 'flex'], ['object-fit', 'cover'], ['color', 'var(--hexo-component-probe)']];
            if (variant === 'm3e') expected.push(['color', 'oklch(0.5 0.17 285)'], ['color', 'color-mix(in oklab, black, white)']);
            assert.deepEqual(calls, expected);
            assert.equal(typeof button.onclick, 'function');
        });
    }

    for (const appearance of ['auto', 'dark']) {
        it(`checks :where() for ${appearance} color selectors`, async () => {
            const { $ } = await plugin('default', true, false, appearance);
            const notice = { style: {} };
            vm.runInNewContext($('script').filter((i, el) => $(el).text().includes('function checkBrowser')).text(), {
                document: { getElementById: id => {
                    return id === 'outdated' ? notice : {};
                } },
                window: { CSS: { supports: property => !property.startsWith('selector(') } }
            });
            assert.equal(notice.style.display, 'block');
        });
    }
});
