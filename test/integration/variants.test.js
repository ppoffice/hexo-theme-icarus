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

        it('lists the analytics plugins without enabling them', () => {
            const config = yaml.parse(fs.readFileSync(path.join(site.dir, '_config.icarus.yml'), 'utf8'));
            assert.deepEqual(config.plugins.umami, { website_id: null, script_url: 'https://cloud.umami.is/script.js', domains: null });
            assert.deepEqual(config.plugins.matomo, { url: null, site_id: null, disable_cookies: false });
            assert.deepEqual(config.plugins.google_analytics, { tracking_id: null });
            const html = site.read('index.html');
            for (const marker of ['umami', 'matomo', 'googletagmanager']) {
                assert.ok(!html.includes(marker), `${marker} found in index.html`);
            }
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

        const logos = $ => ['.navbar-logo', '.footer-logo'].map(selector => $(selector).html());
        const picture = (dark, light) => `<picture><source srcset="${dark}" media="(prefers-color-scheme: dark)"><img src="${light}" alt="Icarus Fixture" height="28"></picture>`;
        const img = src => `<img src="${src}" alt="Icarus Fixture" height="28">`;

        it('switches the navbar and footer logos to their dark version', () => {
            assert.deepEqual(logos(getSite('appearance-auto').$('/')), Array(2).fill(picture('/img/logo-dark.svg', '/img/logo.svg')));
            assert.deepEqual(logos(getSite('appearance-dark').$('/')), Array(2).fill(img('/img/logo-dark.svg')));
            assert.deepEqual(logos(getSite('appearance-auto-custom-logo').$('/')), Array(2).fill(picture('/img/og_image.png', '/img/avatar.png')));
            assert.deepEqual(logos(getSite('default').$('/')), Array(2).fill(img('/img/logo.svg')));
            assert.ok(getSite('appearance-auto').exists('img/logo-dark.svg'));
        });

        const appearanceOf = $ => ({
            attribute: $('html').attr('data-appearance') || null,
            colorScheme: $('meta[name="color-scheme"]').attr('content') || null,
            themes: highlightThemes($)
        });
        const LIGHT = { attribute: null, colorScheme: null, themes: [['atom-one-light', null]] };
        const AUTO = { attribute: 'auto', colorScheme: 'light dark', themes: [['atom-one-light', '(prefers-color-scheme: light)'], ['atom-one-dark', '(prefers-color-scheme: dark)']] };
        const DARK = { attribute: 'dark', colorScheme: 'dark', themes: [['atom-one-dark', null]] };

        for (const [variant, expected] of [['appearance-auto', AUTO], ['appearance-dark', DARK]]) {
            describe(variant, () => {
                let site;

                before(() => { site = getSite(variant); });

                it('builds without errors or configuration warnings', () => {
                    assert.equal(site.status, 0);
                    assert.doesNotMatch(site.output, /^ERROR/m, site.output);
                    assert.doesNotMatch(site.output, /failed one or more checks/, site.output);
                });

                it('marks every page with the appearance, its color schemes and code highlight themes', () => {
                    for (const file of site.htmlFiles()) {
                        assert.deepEqual(appearanceOf(site.$(file)), expected, file);
                    }
                });

                it('uses the same stylesheet as a light site, which has the dark colors of every appearance', () => {
                    const css = site.read('css/default.css');
                    assert.equal(css, getSite('default').read('css/default.css'));
                    assert.match(css, /@media \(prefers-color-scheme: dark\) \{\s*html:where\(\[data-appearance="auto"\]\) \{\s*color-scheme: dark;/);
                    assert.match(css, /\nhtml:where\(\[data-appearance="dark"\]\) \{\s*color-scheme: dark;/);
                });
            });
        }

        it('changes no page for "light", the default', () => {
            for (const file of getSite('default').htmlFiles()) {
                assert.deepEqual(appearanceOf(getSite('default').$(file)), LIGHT, file);
            }
        });

        describe('per page', () => {
            it('follows the front-matter of the page', () => {
                const site = getSite('appearance-per-page');
                assert.doesNotMatch(site.output, /failed one or more checks/, site.output);
                assert.deepEqual(appearanceOf(site.$('/2024/04/02/dark-appearance/')), DARK);
                assert.deepEqual(logos(site.$('/2024/04/02/dark-appearance/')), Array(2).fill(img('/img/logo-dark.svg')));
                assert.deepEqual(appearanceOf(site.$('/2024/04/01/auto-appearance/')), AUTO);
                assert.deepEqual(logos(site.$('/2024/04/01/auto-appearance/')), Array(2).fill(picture('/img/logo-dark.svg', '/img/logo.svg')));
                // The other pages, including the index listing those posts, stay light
                for (const file of site.htmlFiles().filter(file => !file.includes('-appearance/'))) {
                    assert.deepEqual(appearanceOf(site.$(file)), LIGHT, file);
                }
            });

            it('follows a layout configuration file (_config.post.yml) on posts only', () => {
                const site = getSite('appearance-posts-auto');
                assert.doesNotMatch(site.output, /failed one or more checks/, site.output);
                for (const file of ['2024/03/01/hello-world/index.html', '2023/07/01/typography/index.html']) {
                    assert.deepEqual(appearanceOf(site.$(file)), AUTO, file);
                }
                for (const file of ['index.html', 'about/index.html', 'archives/index.html', 'tags/index.html']) {
                    assert.deepEqual(appearanceOf(site.$(file)), LIGHT, file);
                }
            });
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
                ['matomo', 'matomo.example.com/'],
                ['outdated_browser', 'outdated'],
                ['pjax', '/js/pjax.js'],
                ['progressbar', 'pace'],
                ['statcounter', 'statcounter'],
                ['twitter_conversion_tracking', 'twq'],
                ['umami', 'data-website-id="fixture-umami"']
            ]) {
                assert.ok(html.toLowerCase().includes(marker.toLowerCase()), `${plugin}: "${marker}" not found`);
            }
        });

        it('loads Umami in <head> with its default script URL and the configured domains', () => {
            const $ = site.$('/2024/03/01/hello-world/');
            const script = $('head script[data-website-id]');
            assert.equal(script.length, 1);
            assert.deepEqual({ ...script.attr() }, {
                'src': 'https://cloud.umami.is/script.js',
                'data-website-id': 'fixture-umami',
                'data-domains': 'example.com',
                'defer': ''
            });
        });

        it('loads Matomo in <head> for the configured server and site, without cookies, and tracks PJAX navigations', () => {
            const $ = site.$('/2024/03/01/hello-world/');
            const code = $('head script').filter((i, el) => $(el).html().includes('_paq')).map((i, el) => $(el).html()).get();
            assert.equal(code.length, 1);
            assert.ok(code[0].includes('var u = "https://matomo.example.com/";'), code[0]);
            assert.ok(code[0].includes('_paq.push([\'setSiteId\', "7"]);'), code[0]);
            assert.ok(code[0].includes('_paq.push([\'disableCookies\']);'), code[0]);
            assert.ok(code[0].includes('pjax:complete'), code[0]);
        });

        it('keeps every page a valid document with one <title>', () => {
            for (const file of site.htmlFiles()) {
                const $ = site.$(file);
                assert.equal($('title').length, 1, file);
                assert.equal($('head').length, 1, file);
            }
        });
    });

    describe('comment providers', () => {
        let site;
        const comments = name => site.$(`/2024/05/0${['giscus', 'giscus-light', 'utterances', 'beaudar', 'waline', 'artalk', 'cusdis'].indexOf(name) + 1}/comments-${name}/`)('#comments .card-content');
        const script = $comments => $comments.find('script').html();

        before(() => { site = getSite('pjax-comments'); });

        it('build from the theme configuration and the front-matter without warnings', () => {
            assert.equal(site.status, 0);
            assert.doesNotMatch(site.output, /^ERROR/m, site.output);
            assert.doesNotMatch(site.output, /failed one or more checks|Icarus cannot load/, site.output);
        });

        it('renders Artalk with its library and stylesheet, for the configured server and site', () => {
            const $comments = comments('artalk');
            assert.equal($comments.find('#artalk-thread').length, 1);
            assert.equal($comments.find('link[rel="stylesheet"]').attr('href'), 'https://cdn.jsdelivr.net/npm/artalk@2.9.1/dist/Artalk.css');
            const code = script($comments);
            assert.ok(code.includes('"https://cdn.jsdelivr.net/npm/artalk@2.9.1/dist/Artalk.js"'), code);
            assert.match(code, /Artalk\.init\(\{\s*el: '#artalk-thread',\s*server: "https:\/\/artalk\.example\.com",\s*site: "Icarus Fixture",/);
            // The previous instance is destroyed when PJAX runs the script again
            assert.ok(code.includes('window.__artalkInstance.destroy()'), code);
        });

        it('renders Cusdis with the page and the language of the configuration', () => {
            const $comments = comments('cusdis');
            assert.deepEqual({ ...$comments.find('#cusdis_thread').attr() }, {
                'id': 'cusdis_thread',
                'data-host': 'https://cusdis.com',
                'data-app-id': 'fixture-app-id',
                'data-page-id': '/2024/05/07/comments-cusdis/',
                'data-page-url': 'http://localhost:4000/2024/05/07/comments-cusdis/',
                'data-page-title': 'Comments cusdis'
            });
            const code = script($comments);
            assert.ok(code.includes('["https://cusdis.com/js/widget/lang/zh-cn.js","https://cusdis.com/js/cusdis.es.js"]'), code);
            assert.ok(code.includes('window.renderCusdis(element)'), code);
        });

        it('renders Beaudar, Utterances and Giscus as scripts that add their client to the page', () => {
            for (const [name, client, element, attrs] of [
                ['beaudar', 'https://beaudar.lipk.org/client.js', '#beaudar-thread', '{"repo":"fixture-owner/fixture-comments","branch":"main","issue-term":"title","crossorigin":"anonymous"}'],
                ['utterances', 'https://utteranc.es/client.js', '#utterances-thread', '{"repo":"fixture-owner/fixture-comments","issue-term":"pathname","crossorigin":"anonymous"}'],
                // Giscus puts its iframe into .giscus, wherever its script is
                ['giscus', 'https://giscus.app/client.js', 'head', '"data-repo":"fixture-owner/fixture-comments","data-repo-id":"fixture-repo-id","data-category-id":"fixture-category-id"']
            ]) {
                const $comments = comments(name);
                const code = script($comments);
                assert.equal($comments.find('script[src]').length, 0, `${name}: the client is added by the inline script`);
                assert.equal($comments.find(name === 'giscus' ? '.giscus#giscus-thread' : element).length, 1, name);
                assert.ok(code.includes(`script.src = "${client}";`), code);
                assert.ok(code.includes(`document.querySelector(${JSON.stringify(element)})`), code);
                assert.ok(code.includes(attrs), code);
            }
        });

        it('chooses the theme of Giscus, Utterances and Beaudar for dark pages in the browser', () => {
            // isDark() of hexo-component-inferno: data-appearance="dark", or "auto" with a dark system color scheme
            const isDark = /\(function \(appearance\) \{\s*return appearance === 'dark' \|\| \(appearance === 'auto' && [^}]+\}\)\(document\.documentElement\.getAttribute\('data-appearance'\)\)/.source;
            for (const [name, attribute, dark, light] of [
                ['giscus', 'data-theme', 'dark_dimmed', 'light'],
                ['utterances', 'theme', 'photon-dark', 'github-light'],
                ['beaudar', 'theme', 'icy-dark', 'github-light']
            ]) {
                assert.match(script(comments(name)), new RegExp(`attrs\\["${attribute}"\\] = ${isDark} \\? "${dark}" : "${light}";`), name);
            }
        });

        it('initialises Waline with a classic script, which PJAX runs again, following the appearance', () => {
            const $comments = comments('waline');
            const $script = $comments.find('script');
            assert.equal($script.attr('type'), undefined);
            const code = $script.html();
            assert.match(code, /^import\("https:\/\/cdn\.jsdelivr\.net\/npm\/@waline\/client@3\.3\.0\/dist\/waline\.js"\)\.then\(/);
            assert.ok(code.includes('window.__walineInstance.destroy()'), code);
            assert.ok(code.includes('path: window.location.pathname,'), code);
            assert.match(code, /dark: \(function \(appearance\) \{[^}]+\}\)\(document\.documentElement\.getAttribute\('data-appearance'\)\) === 'auto' \? 'auto' : 'html\[data-appearance="dark"\]',/);
        });

        it('keeps the comments of the theme configuration on posts without comment front-matter', () => {
            assert.equal(site.$('/2024/03/01/hello-world/')('#comments .giscus#giscus-thread').length, 1);
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
