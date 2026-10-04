/**
 * Builds of the fixture site with alternative configurations (test/fixtures/variants.js).
 */
const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const yaml = require('hexo-component-inferno/lib/util/yaml');
const { getSite } = require('../support/site');
const { knownBug } = require('../support/known-bug');
const { REPO_ROOT } = require('../support/paths');

const strings = lang => yaml.parse(fs.readFileSync(path.join(REPO_ROOT, 'languages', lang + '.yml'), 'utf8'));

describe('fixture site variants', function() {
    this.timeout(180000);

    describe('without a theme configuration file', () => {
        let site;
        before(() => { site = getSite('generated-config'); });

        it('generates _config.icarus.yml and builds with it', () => {
            assert.equal(site.status, 0);
            assert.match(site.output, /Generating theme configuration file/);
            assert.ok(fs.existsSync(path.join(site.dir, '_config.icarus.yml')));
            assert.ok(site.exists('index.html'));
            assert.doesNotMatch(site.output, /failed one or more checks/);
        });
    });

    describe('cyberpunk variant', () => {
        it('uses the cyberpunk stylesheet', () => {
            const $ = getSite('cyberpunk').$('/');
            assert.equal($('link[href="/css/cyberpunk.css"]').length, 1);
            assert.equal($('link[href="/css/default.css"]').length, 0);
        });
    });

    describe('one column', () => {
        it('renders only the main column', () => {
            const $ = getSite('one-column').$('/2024/03/01/hello-world/');
            assert.ok($('body').hasClass('is-1-column'));
            assert.ok($('.column-main').hasClass('is-12'));
            assert.equal($('.column-left, .column-right').length, 0);
            assert.equal($('.navbar-main .catalogue').length, 0, 'no catalogue button without a toc widget');
        });
    });

    describe('toc as the only right-column widget', () => {
        it('shows the toc in the right column on posts with a toc', () => {
            const $ = getSite('toc-only-right').$('/2024/03/01/hello-world/');
            assert.ok($('body').hasClass('is-3-column'));
            assert.equal($('.column-right #toc').length, 1);
        });

        knownBug('does not render an empty right column on pages without a toc', () => {
            const $ = getSite('toc-only-right').$('/');
            assert.ok($('body').hasClass('is-2-column'));
            assert.equal($('.column-right').length, 0, $('.column-right').toString());
        });
    });

    describe('zh-CN', () => {
        let site;
        before(() => { site = getSite('zh-CN'); });

        it('uses the Chinese translations', () => {
            assert.equal(site.$('/')('.article-more').first().text(), strings('zh-CN').article.more);
        });

        it('sets the moment locale for relative dates', () => {
            assert.match(site.$('/')('script:not([src])').text(), /moment\.locale\("zh-cn"\)/);
        });

        knownBug('declares <html lang="zh-CN">', () => {
            assert.equal(site.$('/')('html').attr('lang'), 'zh-CN');
        });
    });

    describe('vi (Vietnamese)', () => {
        it('uses the Vietnamese translations', () => {
            const $ = getSite('vi').$('/');
            assert.equal($('.article-more').first().text(), strings('vi').article.more);
            assert.equal($('html').attr('lang'), 'vi');
        });
    });

    describe('a language without a translation file', () => {
        it('falls back to English', () => {
            const $ = getSite('unsupported-language').$('/');
            assert.equal($('.article-more').first().text(), strings('en').article.more);
            assert.equal($('.navbar-item.search').attr('title'), strings('en').search.search);
        });
    });

    describe('plugins', () => {
        it('loads PJAX when enabled', () => {
            const $ = getSite('pjax').$('/');
            assert.equal($('script[src="/js/pjax.js"]').length, 1);
        });

        it('loads the animation script and hides content until it runs when animejs is enabled', () => {
            const $ = getSite('animejs').$('/');
            assert.equal($('script[src="/js/animation.js"]').length, 1);
            assert.match($('head style').text(), /opacity:\s*0/);
        });
    });
});
