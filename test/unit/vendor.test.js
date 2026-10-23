/**
 * The e2e suite serves CDN libraries (jQuery, moment, ...) from devDependencies instead of
 * the network. This guards that the vendored copies are exactly the versions the theme
 * references, so the browser tests exercise the same code real sites load.
 */
const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const { VENDORED, ICON_FONT } = require('../e2e/cdn');
const { REPO_ROOT } = require('../support/paths');

function layoutFiles(dir = path.join(REPO_ROOT, 'layout'), extension = '.jsx') {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            return layoutFiles(full, extension);
        }
        return entry.name.endsWith(extension) ? [full] : [];
    });
}

// The plugin views of hexo-component-inferno, such as MathJax and KaTeX, which the layouts render
const pluginViews = path.join(path.dirname(require.resolve('hexo-component-inferno/package.json')), 'lib/view/plugin');

describe('vendored CDN libraries used by the browser tests', () => {
    const references = [];
    for (const file of layoutFiles().concat(layoutFiles(pluginViews, '.js'))) {
        const source = fs.readFileSync(file, 'utf8');
        for (const match of source.matchAll(/cdn\('([^']+)',\s*'([^']+)',\s*([^)]*)\)/g)) {
            // The file name is only known when it is a plain string literal.
            const filename = /^'[^']+'$/.test(match[3].trim()) ? match[3].trim().slice(1, -1) : null;
            references.push({ file: path.relative(REPO_ROOT, file), name: match[1], version: match[2], filename });
        }
    }

    it('finds CDN references in the layouts', () => {
        assert.ok(references.length > 0);
    });

    it('serves the default code highlight themes from the referenced highlight.js version', () => {
        const schema = require('../../include/schema/common/article.json');
        for (const key of ['theme', 'dark_theme']) {
            const theme = schema.properties.highlight.properties[key].default;
            assert.ok(fs.existsSync(path.join(REPO_ROOT, 'node_modules', VENDORED['highlight.js'], 'styles', theme + '.css')), theme);
        }
    });

    it('serves Font Awesome at the version of the default icon CDN', () => {
        const helper = fs.readFileSync(require.resolve('hexo-component-inferno/lib/hexo/helper/cdn'), 'utf8');
        const match = helper.match(/fontawesome: 'https:\/\/use\.fontawesome\.com\/releases\/v([^/]+)\/(css\/all\.css)'/);
        assert.ok(match, 'the default icon CDN of hexo-component-inferno is no longer Font Awesome');
        const dir = path.join(REPO_ROOT, 'node_modules', ICON_FONT);
        assert.equal(require(path.join(dir, 'package.json')).version, match[1], `update the "${ICON_FONT}" devDependency`);
        assert.ok(fs.existsSync(path.join(dir, match[2])));
    });

    for (const name of Object.keys(VENDORED)) {
        it(`vendors ${name} at the version referenced by the layouts`, () => {
            const refs = references.filter(ref => ref.name === name);
            assert.ok(refs.length > 0, `${name} is no longer referenced; drop it from test/e2e/cdn.js and package.json`);
            const pkg = require(path.join(REPO_ROOT, 'node_modules', VENDORED[name], 'package.json'));
            for (const ref of refs) {
                assert.equal(pkg.version, ref.version, `${ref.file} loads ${name}@${ref.version}; update the "${VENDORED[name]}" devDependency`);
                if (ref.filename) {
                    assert.ok(fs.existsSync(path.join(REPO_ROOT, 'node_modules', VENDORED[name], ref.filename)), `${ref.filename} missing in ${VENDORED[name]}`);
                }
            }
        });
    }
});
