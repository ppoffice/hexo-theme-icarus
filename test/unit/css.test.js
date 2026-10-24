const assert = require('assert').strict;
const normalizeCss = require('../support/css');

describe('ordered CSS comparison', () => {
    it('only joins consecutive blocks with identical selector lists', () => {
        assert.deepEqual(normalizeCss('a,b { color: red } a,b { background: blue }'),
            normalizeCss('a,b { color: red; background: blue }'));
        assert.notDeepEqual(normalizeCss('a { color: red } b { color: blue } a { background: blue }'),
            normalizeCss('a { color: red; background: blue } b { color: blue }'));
        assert.notDeepEqual(normalizeCss('a,b { color: red }'), normalizeCss('b,a { color: red }'));
    });

    it('retains declaration order, duplicate declarations, values and selector specificity', () => {
        const css = 'html .card:hover { background: red; background-color: blue; background: green !important }';
        for (const changed of [
            'html .card:hover { background-color: blue; background: red; background: green !important }',
            'html .card:hover { background-color: blue; background: green !important }',
            'html .card:hover { background: red; background-color: blue; background: green }',
            'html .card :hover { background: red; background-color: blue; background: green !important }'
        ]) {
            assert.notDeepEqual(normalizeCss(css), normalizeCss(changed));
        }
    });

    it('retains at-rule context and order, keyframes, container queries and data URLs', () => {
        const css = '@supports (animation-timeline: scroll()) { @media (prefers-color-scheme: dark) {'
            + '@container form (max-width: 240px) { a { mask: url("data:image/svg+xml,a{b}"); color: oklch(.5 .1 285) } } } }'
            + '@keyframes spin { from { opacity: 0 } to { opacity: 1 } }';
        for (const changed of [
            css.replace('240px', '241px'),
            css.replace('dark', 'light'),
            css.replace('a{b}', 'a{c}'),
            css.replace('oklch(.5 .1 285)', 'oklch(.6 .1 285)'),
            css.replace('from { opacity: 0 } to { opacity: 1 }', 'to { opacity: 1 } from { opacity: 0 }')
        ]) {
            assert.notDeepEqual(normalizeCss(css), normalizeCss(changed));
        }
    });

    it('ignores actual CSS comments outside literals, including quotes inside comments', () => {
        assert.deepEqual(normalizeCss('/* outside " \' */ a { color: /* "unterminated quote */ red; content: "hello" /* outside */ }'),
            normalizeCss('a { color: red; content: "hello" }'));
        assert.deepEqual(normalizeCss('a { mask: url( "literal/*inside*/"/*outside*/); content: \'hello\'/*outside*/ }'),
            normalizeCss('a { mask: url( "literal/*inside*/"); content: \'hello\' }'));
    });

    it('preserves comment-like text and escapes inside single- and double-quoted strings', () => {
        for (const literal of [
            '"hello/*red*/world"',
            '\'hello/*red*/world\'',
            String.raw`"hello\"/*red*/world"`,
            String.raw`'hello\'/*red*/world'`,
            String.raw`"hello\\/*red*/world"`
        ]) {
            const css = `a { content: ${literal} }`;
            assert.equal(normalizeCss(css)[0].declarations[0].value, literal);
            assert.notDeepEqual(normalizeCss(css), normalizeCss(css.replace('/*red*/', '/*blue*/')));
            assert.notDeepEqual(normalizeCss(css), normalizeCss(css.replace('/*red*/', '')));
        }
    });

    it('preserves URL literal bytes, including unquoted URLs and escaped quotes or closing parentheses', () => {
        for (const literal of [
            'url("data:image/svg+xml,/*red*/<svg/>")',
            'url(\'data:image/svg+xml,/*red*/<svg/>\')',
            'url(data:image/svg+xml,/*red*/svg)',
            String.raw`url(data:image/svg+xml,escaped\)/*red*/svg)`,
            String.raw`URL("data:image/svg+xml,escaped\")/*red*/svg")`
        ]) {
            const css = `a { --mask: ${literal}; mask: var(--mask) !important }`;
            const declarations = normalizeCss(css)[0].declarations;
            assert.equal(declarations[0].value, literal);
            assert.equal(declarations[1].value, 'var(--mask) !important');
            assert.notDeepEqual(normalizeCss(css), normalizeCss(css.replace('/*red*/', '/*blue*/')));
        }
    });

    it('restores quoted selectors and at-rule parameters and never replaces existing marker-like text', () => {
        const css = '@supports (font-family: "hello/*red*/world") { a[data-label=\'hello/*red*/world\'] {'
            + '--marker: css_literal_0; content: "css_literal__0/*red*/"; content: "fallback" !important } }';
        assert.notDeepEqual(normalizeCss(css), normalizeCss(css.replaceAll('/*red*/', '/*blue*/')));
        const context = normalizeCss(css)[0];
        assert.equal(context.supports, '(font-family: "hello/*red*/world")');
        assert.deepEqual(context.rules[0].selectors, ['a[data-label=\'hello/*red*/world\']']);
        assert.deepEqual(context.rules[0].declarations.map(({ property, value }) => [property, value]), [
            ['--marker', 'css_literal_0'], ['content', '"css_literal__0/*red*/"'], ['content', '"fallback" !important']
        ]);
    });
});
