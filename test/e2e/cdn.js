/**
 * Offline stand-in for the CDNs the theme loads from.
 *
 * Libraries the theme's own scripts depend on are served from devDependencies pinned to the
 * exact versions referenced in the layouts (checked by test/unit/vendor.test.js), and so are
 * the Font Awesome icons. Every other external request (web fonts, analytics, ...) is answered
 * with an empty body so tests never depend on the network.
 */
const fs = require('fs');
const path = require('path');
const { REPO_ROOT } = require('../support/paths');

// CDN package name -> node_modules directory holding that exact version.
const VENDORED = {
    'highlight.js': 'highlight.js',
    jquery: 'jquery',
    clipboard: 'clipboard',
    'justified-gallery': 'justified-gallery',
    lightgallery: 'lightgallery',
    // Loaded by the math plugins of hexo-component-inferno
    mathjax: 'mathjax',
    '@mathjax/mathjax-newcm-font': '@mathjax/mathjax-newcm-font',
    katex: 'katex'
};

const CONTENT_TYPES = {
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.ttf': 'font/ttf',
    '.woff2': 'font/woff2'
};

// The node_modules directory of Font Awesome, loaded from use.fontawesome.com/releases/v<version>/
// by the iconcdn() helper of hexo-component-inferno.
const ICON_FONT = '@fortawesome/fontawesome-free';

function contentType(file) {
    return CONTENT_TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream';
}

// Serve a file of a vendored package, which must be the requested version.
function fulfillVendored(route, dir, name, version, filename) {
    const vendoredVersion = require(path.join(dir, 'package.json')).version;
    if (vendoredVersion !== version) {
        throw new Error(`The page requested ${name}@${version} but ${path.relative(path.join(REPO_ROOT, 'node_modules'), dir)}@${vendoredVersion} is vendored. Update package.json.`);
    }
    const file = path.join(dir, filename);
    return route.fulfill({ status: 200, contentType: contentType(file), headers: { 'access-control-allow-origin': '*' }, body: fs.readFileSync(file) });
}

function isLocal(url) {
    return url.hostname === '127.0.0.1' || url.hostname === 'localhost';
}

/**
 * Install the CDN routes on a browser context.
 * @returns {{ external: string[] }} URLs answered with an empty stub, for diagnostics.
 */
async function routeExternal(context) {
    const stats = { external: [] };
    await context.route(url => !isLocal(url), async route => {
        const url = new URL(route.request().url());
        const match = url.hostname === 'cdn.jsdelivr.net' && url.pathname.match(/^\/npm\/((?:@[^/]+\/)?[^@/]+)@([^/]+)\/(.+)$/);
        if (match && VENDORED[match[1]]) {
            const [, name, version, filename] = match;
            return fulfillVendored(route, path.join(REPO_ROOT, 'node_modules', VENDORED[name]), name, version, filename);
        }
        const icons = url.hostname === 'use.fontawesome.com' && url.pathname.match(/^\/releases\/v([^/]+)\/(.+)$/);
        if (icons) {
            return fulfillVendored(route, path.join(REPO_ROOT, 'node_modules', ICON_FONT), 'fontawesome', icons[1], icons[2]);
        }
        stats.external.push(url.href);
        return route.fulfill({ status: 200, contentType: contentType(url.pathname), body: '' });
    });
    return stats;
}

module.exports = { VENDORED, ICON_FONT, routeExternal, contentType };
