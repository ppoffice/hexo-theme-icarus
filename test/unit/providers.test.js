/**
 * Every comment, share, donate and search provider declared in the configuration schema must
 * render through the theme's layouts with a minimal configuration (the schema defaults, with
 * placeholder values for empty strings).
 */
const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const yaml = require('hexo-component-inferno/lib/util/yaml');
const { SchemaLoader } = require('hexo-component-inferno/lib/core/schema');
const { render, fixtureConfig, makePage } = require('../support/render');
const { capture } = require('../support/capture');
const { REPO_ROOT } = require('../support/paths');

const schemaDir = path.join(REPO_ROOT, 'include/schema/');
const loader = SchemaLoader.load(require(path.join(schemaDir, 'config.json')), schemaDir);
const upstreamSchemaDir = path.join(path.dirname(require.resolve('hexo-component-inferno/package.json')), 'lib/schema');

function providers(kind) {
    return fs.readdirSync(path.join(upstreamSchemaDir, kind))
        .filter(file => file.endsWith('.json'))
        .map(file => path.basename(file, '.json'));
}

/** Schema defaults for a provider, with placeholders for required values left empty. */
function minimalConfig(kind, type) {
    let defaults;
    try {
        defaults = yaml.parse(loader.getSchema(`/${kind}/${type}.json`).getDefaultValue().toYaml()) || {};
    } catch (e) {
        // Some schemas cannot produce defaults (e.g. anyOf without a type): use the required keys.
        const schema = require(path.join(upstreamSchemaDir, kind, type + '.json'));
        defaults = Object.fromEntries((schema.required || []).map(key => [key, '']));
    }
    const fill = value => {
        if (value === '' || value === null) {
            return 'https://example.com/fixture';
        }
        if (Array.isArray(value)) {
            return value.map(fill);
        }
        if (value && typeof value === 'object') {
            return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, fill(v)]));
        }
        return value;
    };
    return Object.assign(fill(defaults), { type });
}

async function renderProvider(layout, props) {
    let result;
    const { output } = capture(() => {
        result = render(layout, props);
    });
    const rendered = await result;
    return { $: rendered.$, html: rendered.html, output };
}

describe('comment, share, donate and search providers', () => {
    const page = makePage({ __post: true, layout: 'post' });

    it('are all declared in the schema', () => {
        for (const kind of ['comment', 'share', 'donate', 'search']) {
            const schema = JSON.stringify(require(path.join(schemaDir, `common/${kind === 'donate' ? 'donates' : kind}.json`)));
            for (const type of providers(kind)) {
                assert.ok(schema.includes(`/${kind}/${type}.json`), `${kind}/${type} missing from the schema`);
            }
        }
    });

    describe('comment', () => {
        for (const type of providers('comment')) {
            it(type, async () => {
                const comment = minimalConfig('comment', type);
                assert.equal(loader.getSchema(`/comment/${type}.json`).validate(comment), true, 'fixture config must be valid');
                const { $, output } = await renderProvider('common/comment', { config: fixtureConfig({ comment }), page });
                assert.doesNotMatch(output, /cannot load/i);
                assert.equal($('#comments').length, 1);
                assert.ok($('#comments .card-content').children().length > 1, `${type} rendered nothing`);
            });
        }
    });

    describe('share', () => {
        for (const type of providers('share')) {
            it(type, async () => {
                const share = minimalConfig('share', type);
                const { html, output } = await renderProvider('common/share', { config: fixtureConfig({ share }), page });
                assert.doesNotMatch(output, /cannot load/i);
                assert.ok(html.replace(/<!--!-->/g, '').trim().length > 0, `${type} rendered nothing`);
            });
        }
    });

    describe('donate', () => {
        for (const type of providers('donate')) {
            it(type, async () => {
                const donates = [minimalConfig('donate', type)];
                const { $, output } = await renderProvider('common/donates', { config: fixtureConfig({ donates }), page });
                assert.doesNotMatch(output, /cannot load/i);
                assert.ok($('.buttons').children().length >= 1, `${type} rendered no button`);
            });
        }
    });

    describe('search', () => {
        for (const type of providers('search')) {
            it(type, async () => {
                const search = minimalConfig('search', type);
                // Algolia reads its credentials from the site configuration (hexo-algolia).
                const algolia = { applicationID: 'fixture', apiKey: 'fixture', indexName: 'fixture' };
                const { $, output } = await renderProvider('common/search', { config: fixtureConfig({ search, algolia }), page });
                assert.doesNotMatch(output, /cannot load/i);
                assert.equal($('.searchbox').length, 1, `${type} rendered no search box`);
            });
        }
    });
});
