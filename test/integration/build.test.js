/**
 * Whole-site checks on a real Hexo build of the fixture site (test/fixtures/site).
 */
const assert = require('assert').strict;
const { getSite } = require('../support/site');
const { knownBug } = require('../support/known-bug');

describe('fixture site build (default variant)', function() {
    this.timeout(120000);
    let site;

    before(() => {
        site = getSite('default');
    });

    it('exits successfully without errors or configuration warnings', () => {
        assert.equal(site.status, 0);
        assert.doesNotMatch(site.output, /^ERROR/m, site.output);
        assert.doesNotMatch(site.output, /failed one or more checks/, site.output);
        assert.doesNotMatch(site.output, /Icarus cannot load/, site.output);
    });

    it('generates every page type', () => {
        for (const file of [
            'index.html', 'page/2/index.html', 'page/3/index.html',
            'archives/index.html', 'archives/2024/index.html', 'archives/2024/03/index.html', 'archives/2023/index.html',
            'categories/index.html', 'categories/Guides/index.html', 'categories/Guides/Hexo/index.html', 'categories/Media/index.html',
            'tags/index.html', 'tags/hexo/index.html', 'tags/testing/index.html',
            'about/index.html',
            '2024/03/01/hello-world/index.html', '2024/02/20/code-blocks/index.html'
        ]) {
            assert.ok(site.exists(file), `${file} was not generated`);
        }
    });

    it('generates theme assets', () => {
        for (const file of [
            'css/default.css', 'css/cyberpunk.css',
            'js/main.js', 'js/column.js', 'js/back_to_top.js', 'js/animation.js', 'js/pjax.js', 'js/toc.js', 'js/insight.js',
            'img/logo.svg', 'img/favicon.svg', 'img/avatar.png', 'img/og_image.png',
            'manifest.json', 'content.json'
        ]) {
            assert.ok(site.exists(file), `${file} was not generated`);
        }
    });

    it('compiles the stylesheets', () => {
        for (const file of ['css/default.css', 'css/cyberpunk.css']) {
            const css = site.read(file);
            assert.ok(css.length > 10000, `${file} looks empty`);
            assert.match(css, /\.navbar-main/);
            assert.match(css, /\.column-main/);
        }
    });

    it('only emits the variant stylesheets (no css/style.css or partials)', () => {
        assert.deepEqual(site.files('.css'), ['css/cyberpunk.css', 'css/default.css']);
    });

    it('writes a valid web app manifest', () => {
        const manifest = JSON.parse(site.read('manifest.json'));
        assert.equal(manifest.name, 'Icarus Fixture');
    });

    it('indexes all posts and pages for the insight search', () => {
        const index = JSON.parse(site.read('content.json'));
        const titles = [...index.posts, ...index.pages].map(item => item.title);
        for (const title of ['Hello World', 'Code Blocks', 'About', '字数统计']) {
            assert.ok(titles.includes(title), `${title} missing from content.json`);
        }
    });

    describe('every HTML page', () => {
        it('is a complete HTML document with one <title> and a language', () => {
            for (const file of site.htmlFiles()) {
                const html = site.read(file);
                assert.match(html, /^<!doctype html>/i, file);
                const $ = site.$(file);
                assert.equal($('title').length, 1, file);
                assert.ok($('title').text().trim(), `${file} has an empty title`);
                assert.ok($('html').attr('lang'), `${file} has no lang`);
            }
        });

        it('contains no leaked "undefined", "NaN" or "[object Object]" values', () => {
            for (const file of site.htmlFiles()) {
                const html = site.read(file);
                for (const pattern of [/>\s*undefined\s*</, /="undefined"/, /\bNaN\b/, /\[object Object\]/]) {
                    assert.doesNotMatch(html, pattern, file);
                }
            }
        });

        it('has no duplicate element ids', () => {
            site.htmlFiles().forEach(file => {
                const seen = new Set();
                site.$(file)('[id]').each((i, el) => {
                    const id = el.attribs.id;
                    assert.ok(!seen.has(id), `${file}: duplicate id "${id}"`);
                    seen.add(id);
                });
            });
        });

        function brokenLocalLinks(selector) {
            const broken = [];
            site.htmlFiles().forEach(file => {
                site.$(file)(selector).each((i, el) => {
                    const url = el.attribs.href || el.attribs.src;
                    if (url.startsWith('/') && !url.startsWith('//') && !site.exists(site.fileOf(url))) {
                        broken.push(`${file} -> ${url}`);
                    }
                });
            });
            return broken;
        }

        it('only links to local files that exist', () => {
            // Hidden paginator placeholders are covered by the known bug below.
            assert.deepEqual(brokenLocalLinks('a[href]:not(.is-invisible a), link[href], script[src], img[src]'), []);
        });

        // The paginator component lives in hexo-component-inferno (lib/view/misc/paginator).
        knownBug('does not emit paginator links to pages that do not exist (/page/0/, /page/N+1/)', () => {
            assert.deepEqual(brokenLocalLinks('.pagination a[href]'), []);
        });

        it('opens external links in a new tab with rel="noopener"', () => {
            site.htmlFiles().forEach(file => {
                site.$(file)('a[target="_blank"]').each((i, el) => {
                    assert.match(el.attribs.rel || '', /noopener/, `${file}: ${el.attribs.href}`);
                });
            });
        });

        it('has exactly one <h1> on post and page views', () => {
            for (const file of site.htmlFiles().filter(f => /^\d{4}\/|^about\//.test(f))) {
                assert.equal(site.$(file)('h1').length, 1, file);
            }
        });
    });
});
