const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const yaml = require('hexo-component-inferno/lib/util/yaml');
const { SchemaLoader } = require('hexo-component-inferno/lib/core/schema');
const { REPO_ROOT, FIXTURE_SITE } = require('../support/paths');

const schemaDir = path.join(REPO_ROOT, 'include/schema/');

function loadSchema() {
    return SchemaLoader.load(require(path.join(schemaDir, 'config.json')), schemaDir).getSchema('/config.json');
}

function listJson(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            return listJson(full);
        }
        return entry.name.endsWith('.json') ? [full] : [];
    });
}

describe('include/schema', () => {
    it('loads every schema file and resolves all references', () => {
        assert.doesNotThrow(loadSchema);
    });

    it('declares a unique $id matching each schema file path', () => {
        const ids = new Set();
        for (const file of listJson(schemaDir)) {
            const schema = JSON.parse(fs.readFileSync(file, 'utf8'));
            const expected = '/' + path.relative(schemaDir, file).split(path.sep).join('/');
            assert.equal(schema.$id, expected, `${file} has $id ${schema.$id}`);
            assert.ok(!ids.has(schema.$id), `duplicate $id ${schema.$id}`);
            ids.add(schema.$id);
        }
    });

    it('produces a default configuration that validates against itself', () => {
        const schema = loadSchema();
        const defaults = yaml.parse(schema.getDefaultValue().toYaml());
        assert.equal(schema.validate(defaults), true);
    });

    it('has a layout view for every widget type and plugin declared in the schema', () => {
        const view = require('hexo-component-inferno/lib/core/view');
        view.init({ theme_dir: REPO_ROOT });
        require('hexo-renderer-inferno/lib/compile');

        const widgetSchema = require(path.join(schemaDir, 'common/widgets.json'));
        const widgetTypes = JSON.stringify(widgetSchema).match(/"\/widget\/([a-z_]+)\.json"/g)
            .map(ref => ref.match(/widget\/([a-z_]+)\.json/)[1]);
        assert.ok(widgetTypes.length > 0);
        for (const type of widgetTypes) {
            assert.doesNotThrow(() => view.require.resolve('widget/' + type), `widget/${type}`);
        }

        const pluginSchema = require(path.join(schemaDir, 'common/plugins.json'));
        for (const name of Object.keys(pluginSchema.properties)) {
            assert.doesNotThrow(() => view.require.resolve('plugin/' + name), `plugin/${name}`);
        }
    });

    describe('navbar.menu', () => {
        const navbar = () => SchemaLoader.load(require(path.join(schemaDir, 'config.json')), schemaDir).getSchema('/common/navbar.json');
        const errors = menu => {
            const result = navbar().validate({ menu });
            return result === true ? [] : result.map(error => error.instancePath);
        };

        it('accepts links and one level of sub-menus, as in the example of #1250', () => {
            const menu = yaml.parse([
                'Home: /',
                'About:',
                '    trademark: /about/trademark/',
                '    enterprise: /about/enterprise/',
                'GitHub: https://github.com/'
            ].join('\n'));
            assert.deepEqual(errors(menu), []);
            assert.deepEqual(errors({ Home: '/', Archives: '/archives' }), []);
            assert.deepEqual(errors(null), []);
        });

        for (const [description, menu] of [
            ['a sub-menu nested in a sub-menu', { About: { Company: { Trademark: '/about/trademark/' } } }],
            ['a sub-menu link that is not a string', { About: { Trademark: 42 } }],
            ['a sub-menu link that is null', { About: { Trademark: null } }],
            ['an empty sub-menu', { About: {} }],
            ['a list of links', { About: ['/about/trademark/'] }],
            ['a menu item that is null', { About: null }]
        ]) {
            it(`rejects ${description}`, () => {
                assert.ok(errors(menu).some(instancePath => instancePath.startsWith('/menu/About')), JSON.stringify(menu));
            });
        }

        it('keeps the generated default menu as plain links', () => {
            const defaults = yaml.parse(loadSchema().getDefaultValue().toYaml());
            assert.deepEqual(defaults.navbar.menu, { Home: '/', Archives: '/archives', Categories: '/categories', Tags: '/tags', About: '/about' });
        });
    });

    describe('appearance', () => {
        const valid = config => loadSchema().validate(Object.assign({ version: '5.1.0' }, config)) === true;

        it('accepts "light", "auto" and "dark", and can be left out', () => {
            for (const appearance of ['light', 'auto', 'dark']) {
                assert.ok(valid({ appearance }), appearance);
            }
            assert.ok(valid({}));
        });

        for (const appearance of ['Dark', 'night', 'system', '', true, null]) {
            it(`rejects ${JSON.stringify(appearance)}`, () => {
                assert.ok(!valid({ appearance }));
            });
        }

        it('accepts a code highlight theme for the dark appearance, or none', () => {
            assert.ok(valid({ article: { highlight: { dark_theme: 'github-dark' } } }));
            assert.ok(valid({ article: { highlight: { dark_theme: null } } }));
            assert.ok(!valid({ article: { highlight: { dark_theme: 42 } } }));
        });

        it('defaults to light, with atom-one-dark for the code blocks, in the generated configuration', () => {
            const defaults = yaml.parse(loadSchema().getDefaultValue().toYaml());
            assert.equal(defaults.appearance, 'light');
            assert.equal(defaults.article.highlight.dark_theme, 'atom-one-dark');
        });
    });

    it('accepts the test fixture theme configuration', () => {
        const cfg = yaml.parse(fs.readFileSync(path.join(FIXTURE_SITE, '_config.icarus.yml'), 'utf8'));
        assert.equal(loadSchema().validate(cfg), true);
    });
});
