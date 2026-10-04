/**
 * Offline stand-in for the CDNs the theme loads from.
 *
 * Libraries the theme's own scripts depend on are served from devDependencies pinned to the
 * exact versions referenced in the layouts (checked by test/unit/vendor.test.js). Every other
 * external request (web fonts, icon fonts, analytics, highlight.js themes, ...) is answered
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
    pjax: 'pjax'
};

const CONTENT_TYPES = {
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.woff2': 'font/woff2'
};

// Icon fonts are not downloaded; give icons a size so icon-only buttons stay clickable.
const ICON_FONT_STUB = '.fa,.fas,.far,.fab{display:inline-block;width:1em;height:1em}';

function contentType(file) {
    return CONTENT_TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream';
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
            const dir = path.join(REPO_ROOT, 'node_modules', VENDORED[name]);
            const vendoredVersion = require(path.join(dir, 'package.json')).version;
            if (vendoredVersion !== version) {
                throw new Error(`The page requested ${name}@${version} but ${VENDORED[name]}@${vendoredVersion} is vendored. Update package.json.`);
            }
            const file = path.join(dir, filename);
            // Like jsDelivr/unpkg: CORS is required for <script crossorigin integrity=...>.
            return route.fulfill({
                status: 200,
                contentType: contentType(file),
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: fs.readFileSync(file)
            });
        }
        stats.external.push(url.href);
        const body = url.hostname === 'use.fontawesome.com' ? ICON_FONT_STUB : '';
        return route.fulfill({ status: 200, contentType: contentType(url.pathname), body });
    });
    return stats;
}

module.exports = { VENDORED, routeExternal, contentType };
