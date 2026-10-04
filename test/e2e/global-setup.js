/**
 * Build the fixture site variants used by the browser tests and serve each one on its own
 * local port. Their URLs are handed to the test workers through ICARUS_E2E_SITES.
 */
const fs = require('fs');
const http = require('http');
const path = require('path');
const { buildSite } = require('../support/site');
const { contentType } = require('./cdn');

const VARIANTS = ['default', 'pjax', 'animejs', 'zh-CN'];

function serve(root) {
    const server = http.createServer((req, res) => {
        const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
        let file = path.join(root, pathname);
        if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
            if (!pathname.endsWith('/')) {
                // Like GitHub Pages and `hexo server`: /archives -> /archives/
                res.writeHead(301, { Location: pathname + '/' });
                res.end();
                return;
            }
            file = path.join(file, 'index.html');
        }
        if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not found');
            return;
        }
        res.writeHead(200, { 'Content-Type': contentType(file) });
        fs.createReadStream(file).pipe(res);
    });
    return new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve(server)));
}

module.exports = async function globalSetup() {
    const servers = [];
    const urls = {};
    for (const name of VARIANTS) {
        const site = buildSite(name);
        const server = await serve(site.publicDir);
        servers.push(server);
        urls[name] = `http://127.0.0.1:${server.address().port}`;
    }
    process.env.ICARUS_E2E_SITES = JSON.stringify(urls);
    return async () => {
        await Promise.all(servers.map(server => new Promise(resolve => server.close(resolve))));
    };
};
