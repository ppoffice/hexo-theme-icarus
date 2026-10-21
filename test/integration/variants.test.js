/**
 * Builds of the fixture site with alternative configurations (test/fixtures/variants.js).
 */
const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const yaml = require('hexo-component-inferno/lib/util/yaml');
const { getSite } = require('../support/site');
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

    describe('appearance', () => {
        const highlightThemes = $ => $('link[href*="highlight.js"]').map((i, el) => [[el.attribs.href.match(/styles\/(.+)\.css$/)[1], el.attribs.media || null]]).get();

        for (const [variant, colorScheme, themes, darkCss] of [
            ['appearance-auto', 'light dark', [['atom-one-light', '(prefers-color-scheme: light)'], ['atom-one-dark', '(prefers-color-scheme: dark)']], /@media \(prefers-color-scheme: dark\) \{\s*html \{\s*color-scheme: dark;/],
            ['appearance-dark', 'dark', [['atom-one-dark', null]], /\nhtml \{\s*color-scheme: dark;/]
        ]) {
            describe(variant, () => {
                let site;

                before(() => { site = getSite(variant); });

                it('builds without errors or configuration warnings', () => {
                    assert.equal(site.status, 0);
                    assert.doesNotMatch(site.output, /^ERROR/m, site.output);
                    assert.doesNotMatch(site.output, /failed one or more checks/, site.output);
                });

                it('declares the color schemes and loads the matching code highlight themes on every page', () => {
                    for (const file of site.htmlFiles()) {
                        const $ = site.$(file);
                        assert.equal($('meta[name="color-scheme"]').attr('content'), colorScheme, file);
                        assert.deepEqual(highlightThemes($), themes, file);
                    }
                });

                it('compiles the dark colors into the default stylesheet', () => {
                    const css = site.read('css/default.css');
                    assert.match(css, darkCss);
                    assert.ok(css.length < getSite('default').read('css/default.css').length * 1.1, 'the dark colors only add a small layer');
                });
            });
        }

        it('changes nothing for "light", the default', () => {
            const $ = getSite('default').$('/');
            assert.equal($('meta[name="color-scheme"]').length, 0);
            assert.deepEqual(highlightThemes($), [['atom-one-light', null]]);
            assert.doesNotMatch(getSite('default').read('css/default.css'), /color-scheme/);
        });

        it('is ignored by the cyberpunk variant', () => {
            const site = getSite('cyberpunk-appearance-dark');
            const cyberpunk = getSite('cyberpunk');
            assert.doesNotMatch(site.output, /failed one or more checks/, site.output);
            assert.equal(site.read('css/cyberpunk.css'), cyberpunk.read('css/cyberpunk.css'));
            const strip = html => html.replace(/<meta property="article:tag" content="[^"]*">/g, '');
            for (const file of ['index.html', '2023/07/01/typography/index.html']) {
                assert.equal(strip(site.read(file)), strip(cyberpunk.read(file)), file);
            }
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

    describe('widgets: null', () => {
        const assertOneColumn = $ => {
            assert.ok($('body').hasClass('is-1-column'), $('body').attr('class'));
            assert.ok($('.column-main').hasClass('is-12'));
            assert.equal($('.column-left, .column-right').length, 0);
        };

        it('disables the widgets of the theme directory _config.yml without a configuration warning', () => {
            const site = getSite('no-widgets-over-theme-dir');
            assert.doesNotMatch(site.output, /failed one or more checks/, site.output);
            assertOneColumn(site.$('/'));
            assertOneColumn(site.$('/2024/03/01/hello-world/'));
        });

        it('disables all widgets on posts when set in _config.post.yml', () => {
            const site = getSite('no-widgets-on-posts');
            assert.doesNotMatch(site.output, /failed one or more checks/, site.output);
            assertOneColumn(site.$('/2024/03/01/hello-world/'));
            assert.ok(site.$('/')('body').hasClass('is-3-column'), 'other layouts keep their widgets');
        });
    });

    describe('toc as the only right-column widget', () => {
        it('shows the toc in the right column on posts with a toc', () => {
            const $ = getSite('toc-only-right').$('/2024/03/01/hello-world/');
            assert.ok($('body').hasClass('is-3-column'));
            assert.equal($('.column-right #toc').length, 1);
        });

        it('does not render an empty right column on pages without a toc', () => {
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

        it('localizes server-rendered dates', () => {
            const $ = site.$('/archives/2024/03/');
            assert.equal($('.column-main h3.tag').first().text(), '三月 2024');
        });

        it('declares <html lang="zh-CN">', () => {
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

    describe('with every plugin enabled', () => {
        let site;

        before(() => { site = getSite('all-plugins'); });

        it('builds without errors or configuration warnings', () => {
            assert.equal(site.status, 0);
            assert.doesNotMatch(site.output, /^ERROR/m, site.output);
            assert.doesNotMatch(site.output, /failed one or more checks|Icarus cannot load/, site.output);
        });

        it('includes the markup of every plugin on a post page', () => {
            const html = site.read('2024/03/01/hello-world/index.html');
            for (const [plugin, marker] of [
                ['animejs', '/js/animation.js'],
                ['back_to_top', 'id="back-to-top"'],
                ['baidu_analytics', 'hm.baidu.com'],
                ['bing_webmaster', 'msvalidate.01'],
                ['busuanzi', 'busuanzi'],
                ['cnzz', 'cnzz.com'],
                ['cookie_consent', 'cookieconsent'],
                ['gallery', 'lightgallery'],
                ['google_analytics', 'G-FIXTURE'],
                ['hotjar', 'hotjar'],
                ['katex', 'katex'],
                ['mathjax', 'mathjax'],
                ['outdated_browser', 'outdated'],
                ['pjax', '/js/pjax.js'],
                ['progressbar', 'pace'],
                ['statcounter', 'statcounter'],
                ['twitter_conversion_tracking', 'twq']
            ]) {
                assert.ok(html.toLowerCase().includes(marker.toLowerCase()), `${plugin}: "${marker}" not found`);
            }
        });

        it('keeps every page a valid document with one <title>', () => {
            for (const file of site.htmlFiles()) {
                const $ = site.$(file);
                assert.equal($('title').length, 1, file);
                assert.equal($('head').length, 1, file);
            }
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
