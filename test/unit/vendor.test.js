/**
 * The e2e suite serves CDN libraries (jQuery, moment, ...) from devDependencies instead of
 * the network. This guards that the vendored copies are exactly the versions the theme
 * references, so the browser tests exercise the same code real sites load.
 */
const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const { VENDORED } = require('../e2e/cdn');
const { REPO_ROOT } = require('../support/paths');

function layoutFiles(dir = path.join(REPO_ROOT, 'layout')) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            return layoutFiles(full);
        }
        return entry.name.endsWith('.jsx') ? [full] : [];
    });
}

describe('vendored CDN libraries used by the browser tests', () => {
    const references = [];
    for (const file of layoutFiles()) {
        const source = fs.readFileSync(file, 'utf8');
        for (const match of source.matchAll(/cdn\('([^']+)',\s*'([^']+)',\s*'([^']+)'\)/g)) {
            references.push({ file: path.relative(REPO_ROOT, file), name: match[1], version: match[2], filename: match[3] });
        }
    }

    it('finds CDN references in the layouts', () => {
        assert.ok(references.length > 0);
    });

    for (const name of Object.keys(VENDORED)) {
        it(`vendors ${name} at the version referenced by the layouts`, () => {
            const refs = references.filter(ref => ref.name === name);
            assert.ok(refs.length > 0, `${name} is no longer referenced; drop it from test/e2e/cdn.js and package.json`);
            const pkg = require(path.join(REPO_ROOT, 'node_modules', VENDORED[name], 'package.json'));
            for (const ref of refs) {
                assert.equal(pkg.version, ref.version, `${ref.file} loads ${name}@${ref.version}; update the "${VENDORED[name]}" devDependency`);
                assert.ok(fs.existsSync(path.join(REPO_ROOT, 'node_modules', VENDORED[name], ref.filename)), `${ref.filename} missing in ${VENDORED[name]}`);
            }
        });
    }
});
