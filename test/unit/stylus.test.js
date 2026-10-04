const assert = require('assert').strict;
const fs = require('fs');
const os = require('os');
const path = require('path');
const registerStylus = require('../../include/stylus');
const { REPO_ROOT } = require('../support/paths');

// eslint-disable-next-line node/no-extraneous-require
const stylus = require(require.resolve('stylus', { paths: [require.resolve('hexo-renderer-stylus')] }));

function stylusFilter() {
    let filter = null;
    registerStylus({ extend: { filter: { register: (type, fn) => { if (type === 'stylus:renderer') filter = fn; } } } });
    return filter;
}

/** Copy the theme stylesheets to a directory with no node_modules above it, like a pnpm store. */
function isolatedTheme() {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'icarus-stylus-'));
    const theme = path.join(root, 'store', 'hexo-theme-icarus');
    for (const dir of ['include/style', 'source/css', 'source/img']) {
        fs.cpSync(path.join(REPO_ROOT, dir), path.join(theme, dir), { recursive: true });
    }
    return { root, theme };
}

function compile(file, filter) {
    return new Promise((resolve, reject) => {
        const style = stylus(fs.readFileSync(file, 'utf8')).set('filename', file);
        if (filter) {
            style.use(filter);
        }
        style.render((err, css) => {
            if (err) {
                reject(err);
            } else {
                resolve(css);
            }
        });
    });
}

describe('include/stylus (locating bulma-stylus)', function() {
    this.timeout(60000);
    let env;

    beforeEach(() => { env = isolatedTheme(); });
    afterEach(() => fs.rmSync(env.root, { recursive: true, force: true }));

    it('cannot compile with only the relative fallback path when node_modules is elsewhere', async () => {
        await assert.rejects(compile(path.join(env.theme, 'source/css/default.styl')), /bulma-stylus/);
    });

    ['default', 'cyberpunk'].forEach(variant => {
        it(`compiles the ${variant} stylesheet wherever bulma-stylus is installed`, async () => {
            const css = await compile(path.join(env.theme, `source/css/${variant}.styl`), stylusFilter());
            assert.match(css, /\.navbar-main/);
            assert.match(css, /\.column-main/);
        });
    });
});
