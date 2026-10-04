const assert = require('assert').strict;
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { sri, HASHES } = require('../../include/util/sri');
const { VENDORED } = require('../e2e/cdn');
const { render, fixtureConfig, makePage } = require('../support/render');
const { REPO_ROOT } = require('../support/paths');

function hashOf(file) {
    return 'sha384-' + crypto.createHash('sha384').update(fs.readFileSync(file)).digest('base64');
}

describe('include/util/sri (Subresource Integrity)', () => {
    for (const [key, hash] of Object.entries(HASHES)) {
        it(`matches the npm file ${key}`, () => {
            const [, name, version, filename] = key.match(/^((?:@[^/]+\/)?[^@]+)@([^/]+)\/(.+)$/);
            assert.ok(VENDORED[name], `${name} must be vendored so its hash can be checked`);
            const dir = path.join(REPO_ROOT, 'node_modules', VENDORED[name]);
            assert.equal(require(path.join(dir, 'package.json')).version, version, `vendored ${name} is not ${version}`);
            assert.equal(hashOf(path.join(dir, filename)), hash);
        });
    }

    it('adds integrity and crossorigin for jsDelivr (the default) and unpkg', () => {
        const [key, hash] = Object.entries(HASHES)[0];
        const [, name, version, filename] = key.match(/^((?:@[^/]+\/)?[^@]+)@([^/]+)\/(.+)$/);
        for (const providers of [undefined, { cdn: 'jsdelivr' }, { cdn: 'unpkg' }]) {
            assert.deepEqual(sri({ providers }, name, version, filename), { integrity: hash, crossorigin: 'anonymous' });
        }
    });

    it('adds nothing for cdnjs, custom CDN templates or unknown files', () => {
        assert.deepEqual(sri({ providers: { cdn: 'cdnjs' } }, 'jquery', '3.7.1', 'dist/jquery.min.js'), {});
        assert.deepEqual(sri({ providers: { cdn: 'https://cdn.example.com/${package}@${version}/${filename}' } }, 'jquery', '3.7.1', 'dist/jquery.min.js'), {});
        assert.deepEqual(sri({}, 'jquery', '0.0.1', 'dist/jquery.min.js'), {});
    });

    describe('in the rendered pages', () => {
        const renderScripts = providers => render('common/scripts', {
            config: fixtureConfig({ providers, plugins: { pjax: true } }),
            page: makePage(),
            site: {}
        });

        it('every vendored library script loaded from jsDelivr has an integrity hash', async () => {
            const { $ } = await renderScripts({ cdn: 'jsdelivr' });
            const scripts = $('script[src^="https://cdn.jsdelivr.net/npm/"]').filter((i, el) => {
                const name = el.attribs.src.match(/\/npm\/((?:@[^/]+\/)?[^@/]+)@/)[1];
                return name in VENDORED;
            });
            assert.ok(scripts.length >= 3, scripts.length);
            scripts.each((i, el) => {
                assert.match(el.attribs.integrity || '', /^sha384-/, el.attribs.src);
                assert.equal(el.attribs.crossorigin, 'anonymous', el.attribs.src);
            });
        });

        it('has no integrity attributes with cdnjs', async () => {
            const { $ } = await renderScripts({ cdn: 'cdnjs' });
            assert.equal($('script[integrity]').length, 0);
        });
    });
});
