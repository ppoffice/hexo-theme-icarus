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

    ['default', 'cyberpunk', 'm3e'].forEach(variant => {
        it(`compiles the ${variant} stylesheet wherever bulma-stylus is installed`, async () => {
            const css = await compile(path.join(env.theme, `source/css/${variant}.styl`), stylusFilter());
            assert.match(css, /\.navbar-main/);
            assert.match(css, /\.column-main/);
        });
    });
});

describe('source/css (native m3e Stylus)', function() {
    this.timeout(60000);

    it('keeps the skin in its entry stylesheet without raw CSS blocks or the old include', () => {
        const source = fs.readFileSync(path.join(REPO_ROOT, 'source/css/m3e.styl'), 'utf8');
        assert.match(source, /^@import 'default'/);
        assert.match(source, /:root\n {4}--m3-h: 285/);
        assert.doesNotMatch(source, /^\s*@css\b/m);
        assert.doesNotMatch(source, /include\/style\/m3e/);
        assert.equal(fs.existsSync(path.join(REPO_ROOT, 'include/style/m3e.styl')), false);
    });

    it('preserves modern CSS math, alpha colors, container queries and selector lists', async () => {
        const css = await compile(path.join(REPO_ROOT, 'source/css/m3e.styl'), stylusFilter());
        assert.match(css, /max-width: min\(280px, 65vw\)/);
        assert.match(css, /font-size: clamp\(2\.2rem, 1\.5rem \+ 1\.9vw, 3\.1rem\)/);
        assert.match(css, /--m3-shadow: oklch\(0\.25 0\.03 var\(--m3-h\) \/ 0\.16\)/);
        assert.match(css, /@container m3e-subscribe \(max-width: 240px\)/);
        const normalized = css.replace(/\s+/g, ' ');
        for (const selector of ['.navbar-start > a.navbar-item', '.navbar-link', '.navbar-end .navbar-item', '.navbar-toggle']) {
            assert.ok(normalized.includes(`html .navbar-main ${selector}:is(:hover, :focus-visible)`), selector);
        }
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

describe('source/css (sticky navbar)', function() {
    this.timeout(60000);

    ['default', 'cyberpunk'].forEach(variant => {
        it(`makes the ${variant} navbar sticky at all widths, or on mobile screens only`, async () => {
            const css = await compile(path.join(REPO_ROOT, `source/css/${variant}.styl`), stylusFilter());
            const sticky = selector => new RegExp(`\\.navbar-main\\[data-sticky="${selector}"\\] \\{\\s*position: -webkit-sticky;\\s*position: sticky;\\s*top: 0;`);
            const mobile = css.match(/@media screen and \(max-width: 768px\) \{(?:[^{}]*\{[^{}]*\})*\s*\}/g) || [];
            assert.ok(mobile.some(block => sticky('mobile').test(block)), 'the mobile-only navbar sticks inside the mobile media query');
            assert.doesNotMatch(mobile.reduce((rest, block) => rest.replace(block, ''), css), sticky('mobile'),
                'the mobile-only navbar does not stick on wider screens');
            assert.match(mobile.reduce((rest, block) => rest.replace(block, ''), css), sticky('all'));
            // The anchors scroll below it, until source/js/main.js measures it: one row, or two below the navbar breakpoint.
            assert.match(css, /:root \{\s*--navbar-height: 4\.25rem;/);
            assert.match(css, /@media screen and \(max-width: 1087px\) \{\s*:root \{\s*--navbar-height: 8\.25rem;/);
            assert.match(css, /\.navbar-main\[data-sticky="all"\] ~ \* \[id\] \{\s*scroll-margin-top: calc\(var\(--navbar-height\) \+ 1em\) !important;/);
            // Not a scroll padding of the page, which would scroll the page to the focused elements of the navbar.
            assert.doesNotMatch(css, /scroll-padding/);
        });
    });
});

describe('source/css (appearance)', function() {
    this.timeout(120000);
    const defaultStyl = path.join(REPO_ROOT, 'source/css/default.styl');
    let css, light;

    before(async () => {
        css = await compile(defaultStyl, stylusFilter());
        // The stylesheet without the dark colors
        light = await compile(defaultStyl, stylusFilter(), '@import \'_style\'\n');
    });

    /** The style rules of a stylesheet: { media: [conditions], selectors: [...], body }. */
    function rules(text, media = []) {
        const result = [];
        let index = 0;
        while (index < text.length) {
            const open = text.indexOf('{', index);
            if (open < 0) {
                break;
            }
            const prelude = text.slice(index, open).trim();
            let depth = 1;
            let end = open + 1;
            while (depth > 0) {
                if (text[end] === '{') {
                    depth++;
                } else if (text[end] === '}') {
                    depth--;
                }
                end++;
            }
            const body = text.slice(open + 1, end - 1);
            if (prelude.startsWith('@media')) {
                result.push(...rules(body, media.concat(prelude)));
            } else {
                result.push({ media, selectors: prelude.split(',').map(selector => selector.trim()), body });
            }
            index = end;
        }
        return result;
    }

    // The page background of the dark colors (include/style/dark.styl)
    const darkBackground = /background-color: #17181c/;

    it('starts with the light stylesheet, unchanged', () => {
        assert.ok(css.startsWith(light.trimEnd()));
        assert.doesNotMatch(light, /data-appearance|color-scheme/);
    });

    it('only applies the dark colors to pages with a dark appearance, or an "auto" one in a dark system color scheme', () => {
        const darkRules = rules(css.slice(light.trimEnd().length))
            // The layout of the logo that switches to the dark one (layout/misc/logo.jsx)
            .filter(rule => rule.selectors.join() !== '.navbar-logo picture,.footer-logo picture');
        assert.ok(darkRules.length > 100);
        for (const rule of darkRules) {
            const auto = rule.media.some(media => media.includes('(prefers-color-scheme: dark)'));
            const appearance = auto ? 'auto' : 'dark';
            for (const selector of rule.selectors) {
                // Inside :where(), so that the rules are exactly as specific as the light ones
                assert.ok(selector.startsWith(`html:where([data-appearance="${appearance}"])`)
                    || selector.startsWith(`:where(html[data-appearance="${appearance}"]) `), `${rule.media.join(' ')} ${selector}`);
            }
        }
        const byAppearance = appearance => darkRules.filter(rule => rule.selectors[0].includes(`"${appearance}"`));
        // Both have the same rules, with nested media queries keeping their own conditions
        assert.equal(byAppearance('auto').length, byAppearance('dark').length);
        for (const appearance of ['auto', 'dark']) {
            assert.ok(byAppearance(appearance).some(rule => darkBackground.test(rule.body)), appearance);
            assert.ok(byAppearance(appearance).some(rule => rule.selectors[0].endsWith(' .widget.card#toc')
                && rule.media.some(media => media.includes('(max-width: 768px)'))), `${appearance}: mobile toc`);
        }
    });

    it('does not depend on the appearance setting', async () => {
        assert.equal(await compile(defaultStyl, stylusFilter({ appearance: 'dark' })), css);
    });

    it('leaves the cyberpunk stylesheet without dark colors', async () => {
        const cyberpunk = await compile(path.join(REPO_ROOT, 'source/css/cyberpunk.styl'), stylusFilter({ variant: 'cyberpunk', appearance: 'dark' }));
        assert.doesNotMatch(cyberpunk, /data-appearance|#17181c/);
    });
});
