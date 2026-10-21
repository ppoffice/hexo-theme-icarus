const assert = require('assert').strict;
const fs = require('fs');
const os = require('os');
const path = require('path');
const registerStylus = require('../../include/stylus');
const { REPO_ROOT } = require('../support/paths');

// eslint-disable-next-line n/no-extraneous-require
const stylus = require(require.resolve('stylus', { paths: [require.resolve('hexo-renderer-stylus')] }));

function stylusFilter(themeConfig = {}) {
    let filter = null;
    registerStylus({ theme: { config: themeConfig }, extend: { filter: { register: (type, fn) => { if (type === 'stylus:renderer') filter = fn; } } } });
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

function compile(file, filter, source = fs.readFileSync(file, 'utf8')) {
    return new Promise((resolve, reject) => {
        const style = stylus(source).set('filename', file);
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

describe('source/css (code block copy button)', function() {
    this.timeout(60000);

    ['default', 'cyberpunk'].forEach(variant => {
        it(`only reveals the ${variant} copy buttons on hover or focus where hovering is possible`, async () => {
            const css = await compile(path.join(REPO_ROOT, `source/css/${variant}.styl`), stylusFilter());
            const hide = /figure\.highlight:not\(:hover\):not\(:focus-within\) \.copy:not\(\.is-copied\) \{\s*opacity: 0;/;
            const media = css.match(/@media \(hover: hover\) and \(pointer: fine\) \{(?:[^{}]*\{[^{}]*\})*\s*\}/g) || [];
            assert.ok(media.some(block => hide.test(block)), 'the copy button is hidden inside a hover-capable media query');
            assert.doesNotMatch(media.reduce((rest, block) => rest.replace(block, ''), css), hide,
                'touch screens without hover keep the copy button visible');
        });
    });
});

describe('source/css (appearance)', function() {
    this.timeout(120000);
    const defaultStyl = path.join(REPO_ROOT, 'source/css/default.styl');
    const css = {};

    before(async () => {
        for (const appearance of ['light', 'auto', 'dark']) {
            css[appearance] = await compile(defaultStyl, stylusFilter({ appearance }));
        }
    });

    /** The CSS outside of @media (prefers-color-scheme: dark) blocks, and those blocks. */
    function splitDarkMedia(text) {
        const blocks = [];
        let rest = '';
        let index = 0;
        const pattern = /@media[^{]*prefers-color-scheme: dark[^{]*\{/g;
        let match;
        while ((match = pattern.exec(text)) !== null) {
            let depth = 1;
            let end = pattern.lastIndex;
            while (depth > 0) {
                if (text[end] === '{') {
                    depth++;
                } else if (text[end] === '}') {
                    depth--;
                }
                end++;
            }
            rest += text.slice(index, match.index);
            blocks.push(text.slice(match.index, end));
            index = end;
            pattern.lastIndex = end;
        }
        return { rest: rest + text.slice(index), blocks };
    }

    // The page background of the dark colors (include/style/dark.styl)
    const darkBackground = /background-color: #17181c/;

    it('emits no dark colors for "light", the default, or an unknown value', async () => {
        // The stylesheet without the dark layer at all
        const withoutDark = await compile(defaultStyl, stylusFilter(), '@import \'_style\'\n');
        assert.equal(css.light, withoutDark);
        assert.equal(await compile(defaultStyl, stylusFilter()), withoutDark);
        assert.equal(await compile(defaultStyl, stylusFilter({ appearance: 'night' })), withoutDark);
        assert.doesNotMatch(css.light, /prefers-color-scheme|color-scheme/);
    });

    it('only emits the dark colors inside a prefers-color-scheme: dark media query for "auto"', () => {
        assert.ok(css.auto.startsWith(css.light), 'the light stylesheet comes first, unchanged');
        const { rest, blocks } = splitDarkMedia(css.auto);
        assert.equal(rest.trimEnd(), css.light.trimEnd());
        assert.ok(blocks.some(block => darkBackground.test(block)));
        // Nested media queries (e.g. the table of contents overlay on mobile) keep both conditions.
        assert.ok(blocks.some(block => /prefers-color-scheme: dark\) and \(max-width: 768px\)[^{]*\{\s*\.widget\.card#toc/.test(block)), 'mobile toc');
    });

    it('emits the dark colors unconditionally for "dark"', () => {
        assert.ok(css.dark.startsWith(css.light));
        const darkLayer = css.dark.slice(css.light.length);
        assert.doesNotMatch(darkLayer, /prefers-color-scheme/);
        assert.match(darkLayer, /^html \{\s*color-scheme: dark;\s*background-color: #17181c;/m);
        // The same colors as "auto", without the media query
        const count = (text, color) => text.split(color).length - 1;
        for (const color of ['#17181c', '#1f2026', '#d4d6db', '#6ea0f0']) {
            assert.ok(count(darkLayer, color) > 0, color);
            assert.equal(count(darkLayer, color), count(css.auto, color), color);
        }
    });

    it('leaves the cyberpunk stylesheet unchanged, whatever the appearance', async () => {
        const file = path.join(REPO_ROOT, 'source/css/cyberpunk.styl');
        const light = await compile(file, stylusFilter({ variant: 'cyberpunk' }));
        for (const appearance of ['auto', 'dark']) {
            assert.equal(await compile(file, stylusFilter({ variant: 'cyberpunk', appearance })), light, appearance);
        }
    });
});
