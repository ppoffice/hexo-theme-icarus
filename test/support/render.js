/**
 * Render theme JSX components in-process for fast unit tests.
 *
 * Components receive the same kinds of props Hexo gives them: a merged `config`
 * (site config + theme config), the `page`, and a `helper` object whose functions are
 * Hexo's real helpers (plus the theme's own helpers) bound to a { config, page } context.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const cheerio = require('cheerio');
const deepmerge = require('deepmerge');
const Hexo = require('hexo');
const { createElement } = require('inferno-create-element');
const { renderToStaticMarkup } = require('inferno-server');
const yaml = require('hexo-component-inferno/lib/util/yaml');
const view = require('hexo-component-inferno/lib/core/view');
const { REPO_ROOT, FIXTURE_SITE } = require('./paths');

// Registers @babel/register for .jsx files exactly the way Hexo does when rendering.
require('hexo-renderer-inferno/lib/compile');

// Use the hexo-i18n instance that ships with the installed Hexo, so translations resolve exactly as in a build.
// eslint-disable-next-line node/no-extraneous-require
const I18n = require(require.resolve('hexo-i18n', { paths: [require.resolve('hexo')] }));

view.init({ theme_dir: REPO_ROOT });

let hexoPromise = null;

function getHexo() {
    if (!hexoPromise) {
        hexoPromise = (async () => {
            const baseDir = fs.mkdtempSync(path.join(os.tmpdir(), 'icarus-render-'));
            const hexo = new Hexo(baseDir, { silent: true });
            await hexo.init();
            require('hexo-component-inferno/lib/hexo/helper/cdn')(hexo);
            require('hexo-component-inferno/lib/hexo/helper/page')(hexo);
            return hexo;
        })();
    }
    return hexoPromise;
}

const overwriteArrays = (target, source) => source;

function merge(...objects) {
    return deepmerge.all(objects.map(o => o || {}), { arrayMerge: overwriteArrays });
}

/** Site config merged with the fixture theme config, the way the theme sees `config`. */
function fixtureConfig(overrides) {
    const site = yaml.parse(fs.readFileSync(path.join(FIXTURE_SITE, '_config.yml'), 'utf8'));
    const theme = yaml.parse(fs.readFileSync(path.join(FIXTURE_SITE, '_config.icarus.yml'), 'utf8'));
    return merge(site, theme, overrides);
}

const languageCache = {};

function loadLanguage(lang) {
    if (!(lang in languageCache)) {
        const file = path.join(REPO_ROOT, 'languages', lang + '.yml');
        languageCache[lang] = fs.existsSync(file) ? yaml.parse(fs.readFileSync(file, 'utf8')) : null;
    }
    return languageCache[lang];
}

function createI18n(lang) {
    const i18n = new I18n({ languages: [lang, 'en'] });
    i18n.set('en', loadLanguage('en'));
    if (lang !== 'en' && loadLanguage(lang)) {
        i18n.set(lang, loadLanguage(lang));
    }
    return { __: i18n.__(lang), _p: i18n._p(lang) };
}

/**
 * Build the `helper` prop for a page.
 * @param {Object} config Merged config
 * @param {Object} page Page locals
 */
async function createHelper(config, page) {
    const hexo = await getHexo();
    const ctx = { config, page, url: config.url, theme: config };
    const helper = {};
    const helpers = hexo.extend.helper.list();
    for (const name of Object.keys(helpers)) {
        helper[name] = helpers[name].bind(ctx);
    }
    // Like Hexo's template locals, helpers can call each other through `this`.
    Object.assign(ctx, helper);
    const lang = page.lang || page.language || (Array.isArray(config.language) ? config.language[0] : config.language) || 'en';
    Object.assign(helper, createI18n(lang));
    return helper;
}

/** A minimal page object; pass overrides for the fields a test cares about. */
function makePage(overrides = {}) {
    return Object.assign({
        layout: 'post',
        path: 'test/page/',
        permalink: 'http://localhost:4000/test/page/',
        title: 'Test Page',
        content: '<p>Test content</p>',
        _content: 'Test content',
        categories: [],
        tags: []
    }, overrides);
}

/**
 * Render a component (module path relative to layout/, or a component) to a cheerio document.
 * @returns {Promise<{ $: CheerioAPI, html: string, helper: Object }>}
 */
async function render(component, { config = fixtureConfig(), page = makePage(), helper = null, ...props } = {}) {
    const Component = typeof component === 'string' ? require(path.join(REPO_ROOT, 'layout', component)) : component;
    const resolvedHelper = helper || await createHelper(config, page);
    const html = renderToStaticMarkup(createElement(Component, Object.assign({ config, page, helper: resolvedHelper }, props)));
    return { $: cheerio.load(html), html, helper: resolvedHelper };
}

module.exports = { render, createHelper, fixtureConfig, makePage, merge, getHexo };
