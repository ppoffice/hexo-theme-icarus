/**
 * Builds of the fixture site with alternative configurations (test/fixtures/variants.js).
 */
const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
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

        it('keeps the theme avatar after reloading the library-generated configuration', () => {
            const config = yaml.parse(fs.readFileSync(path.join(site.dir, '_config.icarus.yml'), 'utf8'));
            assert.equal(config.widgets.find(widget => widget.type === 'profile').avatar, null);
            // Hexo loads configuration before the first-run file is generated.
            const result = spawnSync(process.execPath, [path.resolve(__dirname, '../support/build-site.js'), site.dir], {
                cwd: site.dir, encoding: 'utf8'
            });
            assert.equal(result.status, 0, result.stdout + result.stderr);
            assert.equal(site.$('/')('.widget[data-type="profile"] img.avatar').attr('src'), '/img/avatar.png');
            assert.ok(site.exists('img/avatar.png'));
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

    describe('m3e variant', () => {
        let site;

        before(() => { site = getSite('m3e'); });

        it('builds a standalone stylesheet with the base theme before the skin', () => {
            assert.equal(site.status, 0, site.output);
            assert.doesNotMatch(site.output, /failed one or more checks|^ERROR/m);
            const $ = site.$('/');
            assert.equal($('link[data-variant][href="/css/m3e.css"]').length, 1);
            assert.equal($('link[href="/css/default.css"]').length, 0);
            const css = site.read('css/m3e.css');
            assert.ok(css.indexOf('.navbar') < css.indexOf('--m3-h: 285'));
            assert.match(css, /--m3-primary: oklch\(0\.5 0\.17 var\(--m3-h\)\)/);
            assert.match(css, /--m3-spring-fast: linear\(/);
            assert.match(css, /@supports \(animation-timeline: scroll\(\)\)/);
            assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
            assert.doesNotMatch(css, /@import|@css|html:not\(\[data-appearance\]\)/);
            assert.doesNotMatch(getSite('default').read('css/default.css'), /--m3-/);
            assert.doesNotMatch(getSite('cyberpunk').read('css/cyberpunk.css'), /--m3-/);
        });

        it('honours site and front-matter appearances and their logos', () => {
            const $ = site.$('/');
            assert.equal($('html').attr('data-appearance'), 'auto');
            assert.equal($('.navbar-logo source').attr('media'), '(prefers-color-scheme: dark)');
            for (const appearance of ['light', 'dark']) {
                const post = site.$(`/2024/05/0${appearance === 'light' ? 1 : 2}/m3e-${appearance}/`);
                assert.equal(post('html').attr('data-appearance') || 'light', appearance);
                assert.equal(post('.navbar-logo img').attr('src'), `/img/logo${appearance === 'dark' ? '-dark' : ''}.svg`);
                assert.equal(post('link[href="/css/m3e.css"]').length, 1);
            }
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

    describe('widgets with an amount', () => {
        // The last entry of each widget, which links to the page of all entries when some are not shown
        const more = ($, type) => {
            const $widget = $(`.widget[data-type="${type}"]`);
            const $link = $widget.find(type === 'tags' ? '.control:last-child a' : '.menu-list > li:last-child > a');
            return { href: $link.attr('href'), text: $link.text().trim(), icon: $link.find('i.fa-chevron-right').length };
        };
        const entries = ($, type) => $(`.widget[data-type="${type}"] ${type === 'tags' ? '.control' : '.menu-list > li'}`).length;

        for (const [variant, lang] of [['widget-amount', 'en'], ['widget-amount-zh-CN', 'zh-CN']]) {
            it(`show that many entries and a link to the others, in ${lang}`, () => {
                const site = getSite(variant);
                assert.doesNotMatch(site.output, /failed one or more checks/, site.output);
                const text = strings(lang).widget.more;
                assert.equal(text, { 'en': 'More', 'zh-CN': '更多' }[lang]);
                for (const file of ['index.html', '2024/03/01/hello-world/index.html']) {
                    const $ = site.$(file);
                    assert.equal(entries($, 'archives'), 3 + 1, file);
                    assert.deepEqual(more($, 'archives'), { href: '/archives/', text, icon: 1 }, file);
                    assert.equal(entries($, 'categories'), 1 + 1, file);
                    assert.deepEqual(more($, 'categories'), { href: '/categories/', text, icon: 1 }, file);
                    assert.equal(entries($, 'tags'), 3 + 1, file);
                    assert.deepEqual(more($, 'tags'), { href: '/tags/', text, icon: 1 }, file);
                }
            });
        }

        it('show every entry, without a link to the others, without an amount', () => {
            const $ = getSite('default').$('/');
            for (const type of ['archives', 'categories', 'tags']) {
                assert.equal($(`.widget[data-type="${type}"] i.fa-chevron-right`).length, 0, type);
            }
            assert.equal(entries($, 'archives'), 9);
            assert.equal(entries($, 'categories'), 2);
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
                ['umami', 'data-website-id="fixture-umami"'],
                ['waline_pageview', 'class="waline-pageview-count"']
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

    describe('Waline page view counter', () => {
        let site;
        const PAGEVIEW_JS = 'https://cdn.jsdelivr.net/npm/@waline/client@3.3.0/dist/pageview.js';
        const scripts = $ => $('script').filter((i, el) => $(el).html().includes(PAGEVIEW_JS)).map((i, el) => $(el).html()).get();

        before(() => { site = getSite('waline-pageview'); });

        it('builds without errors or configuration warnings', () => {
            assert.equal(site.status, 0);
            assert.doesNotMatch(site.output, /^ERROR/m, site.output);
            assert.doesNotMatch(site.output, /failed one or more checks|waline_pageview|Icarus cannot load/, site.output);
        });

        it('shows the views of a post in its metadata, and counts them with the server of the Waline comments', () => {
            const $ = site.$('/2024/03/01/hello-world/');
            const $counter = $('.article-meta .waline-pageview-count');
            assert.equal($counter.length, 1);
            assert.equal($counter.attr('data-path'), '/2024/03/01/hello-world/');
            assert.equal($counter.parent().text(), `0${strings('en').plugin.visit_count.replace('%s', '').replace('&nbsp;', '\u00a0')}`);
            const code = scripts($);
            assert.equal(code.length, 1);
            assert.ok(code[0].includes('serverURL: "https://waline.example.com",'), code[0]);
            assert.ok(code[0].includes('path: window.location.pathname,'), code[0]);
            // Counts the pages PJAX switches to too
            assert.ok(code[0].includes('document.addEventListener(\'pjax:complete\', count);'), code[0]);
        });

        it('counts the views of the other pages without showing them', () => {
            const $ = site.$('/');
            assert.equal($('.waline-pageview-count').length, 0);
            assert.equal(scripts($).length, 1);
        });

        it('changes nothing on a site without it', () => {
            const html = getSite('default').read('2024/03/01/hello-world/index.html');
            assert.ok(!html.includes('waline'), 'waline found in the default site');
        });
    });

    describe('Valine comments', () => {
        let site;
        const lines = pattern => site.output.split('\n').filter(line => pattern.test(line));

        before(() => { site = getSite('comment-valine'); });

        it('render on posts', () => {
            assert.equal(site.status, 0);
            assert.doesNotMatch(site.output, /^ERROR/m, site.output);
            assert.doesNotMatch(site.output, /failed one or more checks|Icarus cannot load/, site.output);
            assert.equal(site.$('/2024/03/01/hello-world/')('#valine-thread').length, 1);
        });

        // The theme warns that Valine exposes the email addresses of the commenters, and
        // hexo-component-inferno that it is deprecated, with the comment plugins to use instead.
        it('warn once about privacy and once that Valine is deprecated, without repeating each other', () => {
            const privacy = lines(/Valine exposes commenters' email addresses/);
            const deprecated = lines(/comment\.valine is deprecated/);
            assert.equal(privacy.length, 1, site.output);
            assert.equal(deprecated.length, 1, site.output);
            assert.match(privacy[0], /issues\/788/);
            assert.doesNotMatch(privacy[0], /Waline|Twikoo|2027/);
            assert.match(deprecated[0], /LeanCloud, where Valine stores the comments, shuts down on January 12, 2027\. Use Waline, Twikoo/);
        });
    });

    describe('providers.cdn_overrides', () => {
        it('loads the listed packages from their own provider or URL, and the others from the cdn provider', () => {
            const site = getSite('cdn-overrides');
            assert.equal(site.status, 0);
            assert.doesNotMatch(site.output, /failed one or more checks/, site.output);
            const $ = site.$('/2024/02/20/code-blocks/');
            const sources = $('script[src^="http"]').map((i, el) => el.attribs.src).get();
            assert.deepEqual(sources, [
                'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js',
                'https://static.example.com/js/clipboard.min.js'
            ]);
            assert.equal($('script[src="/js/pjax-core.js"]').length, 1);
            assert.deepEqual($('link[href*="highlight.js"]').map((i, el) => el.attribs.href).get(), ['https://unpkg.com/highlight.js@11.11.1/styles/atom-one-light.css']);
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
            assert.equal($comments.find('link[rel="stylesheet"]').attr('href'), 'https://cdn.jsdelivr.net/npm/artalk@2.10.0/dist/Artalk.css');
            const code = script($comments);
            assert.ok(code.includes('"https://cdn.jsdelivr.net/npm/artalk@2.10.0/dist/Artalk.js"'), code);
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
