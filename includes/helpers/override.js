/**
 * Helper functions that override Hexo built-in helpers.
 *
 * @example
*     <%- _list_archives() %>
*     <%- _list_categories() %>
*     <%- _list_tags() %>
*     <%- _toc(content) %>
*     <%- _js(url, defer, async) %>
*     <%- _css(url) %>
*     <%- _partial(url) %>
 */
const cheerio = require('cheerio');
const { existsSync } = require('fs');
const { relative, dirname, join, extname } = require('path');
const { LRUMap } = require('../utils/lru');

const __archives = [];
const __categories = [];
const __tags = [];

const __fragmentCache = new LRUMap(20);

module.exports = function (hexo) {
    hexo.extend.helper.register('_list_archives', function () {
        if (__archives.length) {
            return __archives;
        }
        const $ = cheerio.load(this.list_archives(), { decodeEntities: false });
        $('.archive-list-item').each(function () {
            __archives.push({
                url: $(this).find('.archive-list-link').attr('href'),
                name: $(this).find('.archive-list-link').text(),
                count: $(this).find('.archive-list-count').text()
            });
        });
        return __archives;
    });

    hexo.extend.helper.register('_list_categories', function () {
        if (__categories.length) {
            return __categories;
        }
        const $ = cheerio.load(this.list_categories({ depth: 2 }), { decodeEntities: false });
        function traverse(root) {
            const categories = [];
            root.find('> .category-list-item').each(function () {
                const category = {
                    url: $(this).find('> .category-list-link').attr('href'),
                    name: $(this).find('> .category-list-link').text(),
                    count: $(this).find('> .category-list-count').text()
                };
                if ($(this).find('> .category-list-child').length) {
                    category['children'] = traverse($(this).find('> .category-list-child'));
                }
                categories.push(category);
            });
            return categories;
        }
        __categories.push(...traverse($('.category-list')));
        return __categories;
    });

    hexo.extend.helper.register('_list_tags', function () {
        if (__tags.length) {
            return __tags;
        }
        const $ = cheerio.load(this.list_tags(), { decodeEntities: false });
        $('.tag-list-item').each(function () {
            __tags.push({
                url: $(this).find('.tag-list-link').attr('href'),
                name: $(this).find('.tag-list-link').text(),
                count: $(this).find('.tag-list-count').text()
            });
        });
        return __tags;
    });

    /**
     * Export a tree of headings of an article
     * {
     *    "1": {
     *        "id": "How-to-enable-table-of-content-for-a-post",
     *        "index": "1"
     *    },
     *    "2": {
     *        "1": {
     *            "1": {
     *                "id": "Third-level-title",
     *                "index": "2.1.1"
     *            },
     *            "id": "Second-level-title",
     *            "index": "2.1"
     *        },
     *        "2": {
     *            "id": "Another-second-level-title",
     *            "index": "2.2"
     *        },
     *        "id": "First-level-title",
     *        "index": "2"
     *    }
     * }
     */
    hexo.extend.helper.register('_toc', (content) => {
        const $ = cheerio.load(content, { decodeEntities: false });
        const toc = {};
        const levels = [0, 0, 0];
        // Get top 3 headings that are present in the content
        const tags = [1, 2, 3, 4, 5, 6].map(i => 'h' + i).filter(h => $(h).length > 0).slice(0, 3);
        if (tags.length === 0) {
            return toc;
        }
        $(tags.join(',')).each(function () {
            const level = tags.indexOf(this.name);
            const id = $(this).attr('id');
            const text = $(this).text();

            for (let i = 0; i < levels.length; i++) {
                if (i > level) {
                    levels[i] = 0;
                } else if (i < level) {
                    if (levels[i] === 0) {
                        // if headings start with a lower level heading, set the former heading index to 1
                        // e.g. h3, h2, h1, h2, h3 => 1.1.1, 1.2, 2, 2.1, 2.1.1
                        levels[i] = 1;
                    }
                } else {
                    levels[i] += 1;
                }
            }
            let node = toc;
            for (let i of levels.slice(0, level + 1)) {
                if (!node.hasOwnProperty(i)) {
                    node[i] = {};
                }
                node = node[i];
            }
            node.id = id;
            node.text = text;
            node.index = levels.slice(0, level + 1).join('.');
        });
        return toc;
    });

    hexo.extend.helper.register('_js', function (url, defer = false, async = false) {
        const urlFor = hexo.extend.helper.get('url_for').bind(this);
        if (!url.endsWith('.js') && !url.includes('?')) {
            url += '.js';
        }
        return `<script src="${urlFor(url)}"${async ? ' async' : ''}${defer ? ' defer' : ''}></script>`;
    });

    hexo.extend.helper.register('_css', function (url) {
        const urlFor = hexo.extend.helper.get('url_for').bind(this);
        if (!url.endsWith('.css') && !url.includes('?')) {
            url += '.css';
        }
        return `<link rel="stylesheet" href="${urlFor(url)}">`;
    });

    hexo.extend.helper.register('_partial', function (name, locals, options = {}) {
        const { md5, partial, view_dir, page } = this;
        const currentView = this.filename.substring(view_dir.length);
        let _locals = Object.assign({}, locals, { layout: false });

        let { path } = hexo.theme.getView(join(dirname(currentView), name)) || hexo.theme.getView(name);
        path = join(view_dir, path.substring(0, path.length - extname(path).length) + '.locals.js');

        if (!existsSync(path)) {
            // fallback to default partial
            return partial(name, locals, options);
        }

        _locals = require(path)(this, _locals);
        if (_locals === null) {
            // partial should be empty
            return '';
        }

        if (_locals === false) {
            // do not cache this fragment
            return partial(name, locals, options);
        }

        const language = page.lang || page.language;
        const fragment = relative(view_dir, path.substring(0, path.length - '.locals.js'.length));
        const cacheId = [fragment, language, md5(JSON.stringify(_locals))].join('-');

        if (!__fragmentCache.has(cacheId)) {
            __fragmentCache.set(cacheId, partial(name, _locals, { cache: false, only: options.only || false }));
        }
        return __fragmentCache.get(cacheId);
    });
}