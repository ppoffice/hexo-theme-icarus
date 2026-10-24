// Use the CSS parser already required by Stylus, including support for container
// queries. Keep values, selector lists and all ordering; only adjacent rules with
// exactly the same selector list may be represented as one declaration block.
// eslint-disable-next-line n/no-extraneous-require
const stylusPath = require.resolve('stylus', { paths: [require.resolve('hexo-renderer-stylus')] });
// eslint-disable-next-line n/no-extraneous-require
const { parse } = require(require.resolve('@adobe/css-tools', { paths: [stylusPath] }));

// css-tools strips comment-like text even inside strings. Hide literal contents
// from that pass and restore their exact bytes before comparing any AST fields.
function protectLiterals(css) {
    let prefix = 'css_literal_';
    while (css.includes(prefix)) {
        prefix += '_';
    }
    const literals = [];
    const save = text => prefix + (literals.push(text) - 1);
    function endOf(start, delimiter) {
        for (let i = start; i < css.length; i++) {
            if (css[i] === '\\') {
                i++;
            } else if (css[i] === delimiter) {
                return i;
            } else if (delimiter === ')' && (css[i] === '"' || css[i] === '\'')) {
                i = endOf(i + 1, css[i]);
            }
        }
        throw new SyntaxError('Unterminated CSS literal');
    }
    let protectedCss = '';
    for (let i = 0; i < css.length; i++) {
        if (css[i] === '\\') {
            protectedCss += css.slice(i, i + 2);
            i++;
        } else if (css.startsWith('/*', i)) {
            const end = css.indexOf('*/', i + 2);
            if (end < 0) {
                throw new SyntaxError('Unterminated CSS comment');
            }
            // Remove real comments here as their quotes can also confuse the
            // parser's declaration matcher. Literal contents never enter here.
            i = end + 1;
        } else if (css[i] === '"' || css[i] === '\'') {
            const end = endOf(i + 1, css[i]);
            protectedCss += css[i] + save(css.slice(i + 1, end)) + css[i];
            i = end;
        } else if (css.slice(i, i + 4).toLowerCase() === 'url(' && (i === 0 || !/[\w-]/.test(css[i - 1]))) {
            let start = i + 4;
            while (/\s/.test(css[start] || '')) {
                start++;
            }
            if (css[start] === '"' || css[start] === '\'') {
                // Quoted url() is a function containing a string; comments after
                // that string are ordinary CSS comments, not part of the URL.
                protectedCss += css.slice(i, i + 4);
                i += 3;
                continue;
            }
            // An unquoted URL is also a literal token: /* inside it is URL data,
            // not a CSS comment. Escaped closing parentheses must not end it.
            const end = endOf(i + 4, ')');
            protectedCss += css.slice(i, i + 4) + save(css.slice(i + 4, end)) + ')';
            i = end;
        } else {
            protectedCss += css[i];
        }
    }
    const marker = new RegExp(prefix + '(\\d+)', 'g');
    return {
        css: protectedCss,
        restore(text) {
            return typeof text === 'string' ? text.replace(marker, (match, index) => literals[index]) : text;
        }
    };
}

function normalizeNodes(nodes, restore) {
    const result = [];
    for (const node of nodes) {
        if (node.type === 'comment') {
            continue;
        }
        const normalized = {};
        for (const [key, value] of Object.entries(node)) {
            if (key !== 'position') {
                if (['rules', 'keyframes', 'declarations'].includes(key)) {
                    normalized[key] = normalizeNodes(value, restore);
                } else {
                    normalized[key] = Array.isArray(value) ? value.map(restore) : restore(value);
                }
            }
        }
        const previous = result[result.length - 1];
        if (normalized.type === 'rule' && previous && previous.type === 'rule'
            && JSON.stringify(previous.selectors) === JSON.stringify(normalized.selectors)) {
            previous.declarations.push(...normalized.declarations);
        } else {
            result.push(normalized);
        }
    }
    return result;
}

module.exports = css => {
    const protectedSource = protectLiterals(css);
    return normalizeNodes(parse(protectedSource.css).stylesheet.rules, protectedSource.restore);
};
