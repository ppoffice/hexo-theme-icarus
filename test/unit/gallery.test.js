const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const installer = require('hexo-component-inferno/lib/util/gallery');
const { render, fixtureConfig } = require('../support/render');

describe('shared Gallery integration', () => {
    it('installs the library runtime even when Gallery SDKs are disabled', async () => {
        const { $ } = await render('common/scripts');
        const scripts = $('script');
        const runtime = scripts.filter((i, el) => $(el).html() === installer);
        assert.equal(runtime.length, 1);
        assert.equal(runtime.attr('data-pjax'), undefined);
        assert.equal($('script[src*="lightgallery"], script[type="module"]').length, 0);
        const index = selector => scripts.index($(selector));
        assert.ok(index('script[src*="jquery"]') < scripts.index(runtime));
        const settings = scripts.filter((i, el) => /^var IcarusThemeSettings = /.test($(el).html()));
        assert.ok(scripts.index(runtime) < scripts.index(settings), 'install before the configuration can synchronize options');
        assert.ok(scripts.index(runtime) < index('script[src="/js/main.js"]'));
        assert.notEqual($('script[src="/js/main.js"]').attr('defer'), undefined);
        assert.notEqual($('script[src="/js/main.js"]').attr('data-pjax'), undefined);
        assert.ok(index('script[src="/js/github-calendar.js"]') < index('script[src="/js/main.js"]'));
    });

    it('serializes Gallery enablement with the plugin resolver truthiness semantics', async () => {
        for (const gallery of [false, null, 0, '', true, {}, [], 'enabled', 1]) {
            const { $ } = await render('common/scripts', { config: fixtureConfig({ plugins: { gallery } }) });
            const settings = $('script').filter((i, el) => /^var IcarusThemeSettings = /.test($(el).html()));
            assert.notEqual(settings.attr('data-pjax'), undefined, 'current-page flags must run again after PJAX');
            assert.equal(JSON.parse(settings.html().split('\n')[0].replace(/^var IcarusThemeSettings = /, '').replace(/;$/, '')).gallery, !!gallery);
            const lightGallery = $('script[src*="lightgallery.min.js"]');
            assert.equal(lightGallery.length, gallery ? 1 : 0);
            if (gallery) {
                assert.match(lightGallery.attr('src'), /lightgallery@3\.0\.0\/lightgallery\.min\.js$/);
                const justified = $('script[type="module"]');
                assert.match(justified.html(), /justified-gallery@4\.0\.2\/dist\/justified-gallery\.js/);
                assert.match(justified.html(), /import \{ JustifiedGallery \}/);
                assert.equal(justified.attr('data-pjax'), undefined);
                for (const script of [lightGallery]) {
                    assert.notEqual(script.attr('defer'), undefined);
                    assert.equal(script.attr('data-pjax'), undefined);
                }
                const initializer = $('script').filter((i, el) => $(el).html().startsWith(installer + '\n'));
                assert.equal(initializer.length, 1);
                assert.equal(initializer.attr('data-pjax'), undefined);
            }
        }
    });

    it('keeps the PJAX matching-node count constant across Gallery enablement', async () => {
        const counts = [];
        for (const gallery of [false, true]) {
            const { $ } = await render('common/scripts', { config: fixtureConfig({ plugins: { pjax: true, gallery } }) });
            counts.push($('[data-pjax]:not(link)').length);
        }
        assert.equal(counts[0], counts[1]);
    });

    it('synchronizes PJAX options before main or SDK completion but skips initial-parse enhancement', async () => {
        for (const gallery of [false, true]) {
            const { $ } = await render('common/scripts', { config: fixtureConfig({ plugins: { gallery } }) });
            const source = $('script').filter((i, el) => /^var IcarusThemeSettings = /.test($(el).html())).html();
            for (const readyState of ['loading', 'complete']) {
                const calls = [];
                const document = { readyState };
                const context = { document, IcarusThemeSettings: { gallery: !gallery }, window: {
                    HexoGallery: { init(root, options) {
                        assert.equal(root, document);
                        assert.equal(options.lightGallery, gallery);
                        assert.equal(options.justifiedGallery, gallery);
                        calls.push('sync');
                    } }
                } };
                vm.runInNewContext(source, context);
                assert.equal(context.IcarusThemeSettings.gallery, gallery);
                assert.deepEqual(calls, readyState === 'loading' ? [] : ['sync']);
            }
        }
    });

    it('delegates each page to the shared API after calendar init and before navbar refresh', () => {
        const source = fs.readFileSync(path.join(__dirname, '../../source/js/main.js'), 'utf8');
        for (const gallery of [true, false, undefined]) {
            const calls = [];
            const document = { documentElement: { lang: 'en' }, querySelectorAll: () => [] };
            const jQuery = () => ({ length: 0, each() { return this; }, wrap() { return this; }, remove() { return this; } });
            // SDKs may still be loaded from a previous page; only the current flags control them.
            jQuery.fn = { lightGallery: () => assert.fail('theme must delegate'), justifiedGallery: () => assert.fail('theme must delegate') };
            vm.runInNewContext(source, { jQuery, document, window: {
                IcarusThemeSettings: { gallery },
                HexoGithubCalendar: { init: () => calls.push('calendar') },
                HexoGallery: { init(root, options) {
                    assert.equal(root, document);
                    assert.equal(options.lightGallery, !!gallery);
                    assert.equal(options.justifiedGallery, !!gallery);
                    calls.push('gallery');
                } },
                IcarusNavbar: { refresh: () => calls.push('refresh') }
            } });
            assert.deepEqual(calls, ['calendar', 'gallery', 'refresh']);
        }
    });
});
