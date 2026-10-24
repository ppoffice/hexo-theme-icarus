const assert = require('assert').strict;
const fs = require('fs');
const os = require('os');
const path = require('path');
const { createHash } = require('crypto');
const registerStylus = require('../../include/stylus');
const { REPO_ROOT } = require('../support/paths');
const normalizeCss = require('../support/css');

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

function compile(file, filter, source = fs.readFileSync(file, 'utf8'), compress = false) {
    return new Promise((resolve, reject) => {
        const style = stylus(source).set('filename', file).set('compress', compress);
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

    it('imports the native skin chapters in cascade order after the default theme', () => {
        const source = fs.readFileSync(path.join(REPO_ROOT, 'source/css/m3e.styl'), 'utf8');
        assert.match(source, /^@import 'default'/);
        const chapters = ['mixins', 'foundation', 'navigation', 'content', 'widgets', 'page-surfaces',
            'expressive', 'messages', 'tabs', 'archives', 'motion'];
        assert.deepEqual(Array.from(source.matchAll(/^@import '([^']+)'$/gm), match => match[1]),
            ['default', ...chapters.map(chapter => '../../include/style/m3e/' + chapter)]);
        const directory = path.join(REPO_ROOT, 'include/style/m3e');
        assert.deepEqual(fs.readdirSync(directory).sort(), chapters.map(chapter => chapter + '.styl').sort());
        for (const chapter of chapters) {
            const partial = fs.readFileSync(path.join(directory, chapter + '.styl'), 'utf8');
            assert.doesNotMatch(partial, /^\s*@css\b/m, chapter);
        }
        assert.match(fs.readFileSync(path.join(directory, 'foundation.styl'), 'utf8'), /:root\n {4}--m3-h: 285/);
        assert.doesNotMatch(source, /^\s*@css\b/m);
        assert.equal(fs.existsSync(path.join(REPO_ROOT, 'include/style/m3e.styl')), false);
    });

    // Ordered AST fingerprints captured from fab96ef BEFORE nesting/extracting
    // declarations. Only adjacent identical-selector blocks may be joined; values,
    // selector lists, declaration order and at-rule/keyframe contexts remain exact.
    // Exclude the default import so unrelated base-theme changes do not invalidate them.
    for (const [compress, expected] of [
        [false, '2bd3281576266ee3738f3ae5ce296ec698ff16c8d788433350906def4c28c985'],
        [true, 'fbdca05d1bf544159863c842b5cf2f6749dd60fb31eb6b1d10cce980671b40d4']
    ]) {
        it(`preserves the pre-refactor ordered CSS AST when ${compress ? 'compressed' : 'expanded'}`, async () => {
            const file = path.join(REPO_ROOT, 'source/css/m3e.styl');
            const source = fs.readFileSync(file, 'utf8').replace(/^@import 'default'\r?\n/, '');
            const css = await compile(file, null, source, compress);
            assert.equal(createHash('sha256').update(JSON.stringify(normalizeCss(css))).digest('hex'), expected);
        });
    }

    it('reuses private declaration groups without changing values or WebKit/standard mask order', async () => {
        const directory = path.join(REPO_ROOT, 'include/style/m3e');
        const callers = fs.readdirSync(directory).filter(file => file !== 'mixins.styl')
            .map(file => fs.readFileSync(path.join(directory, file), 'utf8')).join('\n');
        for (const mixin of ['m3e-hover-surface', 'm3e-secondary-surface', 'm3e-mask']) {
            assert.ok(callers.match(new RegExp(mixin + '\\(', 'g')).length >= 2, mixin);
        }
        const file = path.join(REPO_ROOT, 'source/css/m3e.styl');
        const css = await compile(file, null, '@import \'../../include/style/m3e/mixins\'\n'
            + '.hover\n    m3e-hover-surface()\n.selected\n    m3e-secondary-surface()\n'
            + '.mask\n    m3e-mask(var(--shape))\n.url-mask\n    m3e-mask(url(\'../img/m3e-flower.svg\'))\n');
        assert.deepEqual(normalizeCss(css), normalizeCss(`
            .hover { background-color: color-mix(in oklab, var(--m3-on-surface) 8%, transparent); color: var(--m3-on-surface); }
            .selected { background-color: var(--m3-secondary-container); color: var(--m3-on-secondary-container); }
            .mask { -webkit-mask: var(--shape) center/contain no-repeat; mask: var(--shape) center/contain no-repeat; }
            .url-mask { -webkit-mask: url("../img/m3e-flower.svg") center/contain no-repeat; mask: url("../img/m3e-flower.svg") center/contain no-repeat; }
        `));
    });

    it('detects comment-like text injected into a real compiled M3E SVG data URI', async () => {
        const css = await compile(path.join(REPO_ROOT, 'source/css/m3e.styl'), stylusFilter());
        const changed = css.replace('data:image/svg+xml,', 'data:image/svg+xml,/*not-svg*/');
        assert.notEqual(changed, css, 'the counterexample must alter an actual data URI');
        assert.notDeepEqual(normalizeCss(css), normalizeCss(changed));
    });

    it('reuses each dark palette for explicit dark and system-dark auto without merging their cascade positions', async () => {
        for (const [chapter, mixin] of [
            ['foundation', 'm3e-dark-tokens'],
            ['expressive', 'm3e-dark-surfaces'],
            ['messages', 'm3e-dark-message-tokens']
        ]) {
            const source = fs.readFileSync(path.join(REPO_ROOT, `include/style/m3e/${chapter}.styl`), 'utf8');
            assert.equal(source.match(new RegExp(mixin + '\\(\\)', 'g')).length, 3, 'one definition and two calls');
            assert.match(source, new RegExp(`@media \\(prefers-color-scheme: dark\\)\\n {4}html\\[data-appearance="auto"\\]\\n {8}${mixin}\\(\\)`));
            assert.match(source, new RegExp(`\\nhtml\\[data-appearance="dark"\\]\\n {4}${mixin}\\(\\)`));
        }
        const file = path.join(REPO_ROOT, 'source/css/m3e.styl');
        const source = fs.readFileSync(file, 'utf8').replace(/^@import 'default'\r?\n/, '');
        const css = await compile(file, null, source);
        const auto = Array.from(css.matchAll(/@media \(prefers-color-scheme: dark\) \{\s*html\[data-appearance="auto"\] \{([^{}]*)\}\s*\}/g), match => match[1].trim());
        const dark = Array.from(css.matchAll(/html\[data-appearance="dark"\] \{([^{}]*)\}/g), match => match[1].trim());
        assert.equal(auto.length, 3);
        assert.deepEqual(auto.map(body => body.replace(/\s+/g, ' ')), dark.map(body => body.replace(/\s+/g, ' ')));
        assert.match(auto[0], /--m3-surface: oklch\(0\.16 0\.012 var\(--m3-h\)\)/);
        assert.match(auto[1], /--m3-card: var\(--m3-surface-container-low\)/);
        assert.match(auto[2], /--m3-info: oklch\(0\.8 0\.09 245\)/);
    });

    it('keeps reduced-motion overrides after every expressive section', async () => {
        const css = await compile(path.join(REPO_ROOT, 'source/css/m3e.styl'), stylusFilter());
        const motion = css.lastIndexOf('@media (prefers-reduced-motion: reduce)');
        assert.ok(motion > css.lastIndexOf('html .timeline .media .categories a:hover'));
        const keyframes = css.indexOf('@-moz-keyframes m3-spin');
        assert.ok(keyframes > motion, 'root keyframes retain their original hoisted position');
        assert.match(css.slice(motion, keyframes), /html \.column-main > \.card,\s*html \.card\.widget \{\s*transition-duration: 0\.01ms !important;/);
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
