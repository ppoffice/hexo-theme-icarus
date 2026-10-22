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

        it('accepts a dark logo, or none', () => {
            assert.ok(valid({ logo_dark: '/img/logo-night.svg' }));
            assert.ok(valid({ logo_dark: null }));
            assert.ok(!valid({ logo_dark: { text: 'Text' } }));
        });

        it('defaults to light, with atom-one-dark for the code blocks and no dark logo, in the generated configuration', () => {
            const defaults = yaml.parse(loadSchema().getDefaultValue().toYaml());
            assert.equal(defaults.appearance, 'light');
            assert.equal(defaults.article.highlight.dark_theme, 'atom-one-dark');
            assert.ok('logo_dark' in defaults);
            assert.equal(defaults.logo_dark, null);
        });

        it('ships a dark version of the default logo', () => {
            const logo = fs.readFileSync(path.join(REPO_ROOT, 'source', require(path.join(schemaDir, 'config.json')).properties.logo.default), 'utf8');
            const darkLogo = fs.readFileSync(path.join(REPO_ROOT, 'source/img/logo-dark.svg'), 'utf8');
            // Only the color of the wordmark differs
            assert.equal(darkLogo.replace('fill="#eceef1"', 'fill="#333"'), logo);
        });
    });

    describe('comment', () => {
        let schema;

        before(() => { schema = loadSchema(); });

        const valid = comment => schema.validate({ version: '5.1.0', comment }) === true;

        it('accepts Artalk, Cusdis and Beaudar with their required options', () => {
            assert.ok(valid({ type: 'artalk', server: 'https://artalk.example.com' }));
            assert.ok(valid({ type: 'artalk', server: 'https://artalk.example.com', site: 'Blog', locale: 'auto', dark_mode: 'auto' }));
            assert.ok(valid({ type: 'artalk', server: 'https://artalk.example.com', dark_mode: false }));
            assert.ok(valid({ type: 'cusdis', app_id: 'fixture' }));
            assert.ok(valid({ type: 'cusdis', app_id: 'fixture', host: 'https://cusdis.example.com', theme: 'auto', lang: 'zh-cn' }));
            assert.ok(valid({ type: 'beaudar', repo: 'user/repo', issue_term: 'pathname' }));
            assert.ok(valid({ type: 'beaudar', repo: 'user/repo', issue_number: 1, branch: 'main', label: 'comment', theme: 'github-light', dark_theme: 'icy-dark' }));
        });

        for (const [description, comment] of [
            ['Artalk without a server', { type: 'artalk', site: 'Blog' }],
            ['Artalk with a dark mode that is a number', { type: 'artalk', server: 'https://artalk.example.com', dark_mode: 1 }],
            ['Cusdis without an app ID', { type: 'cusdis', host: 'https://cusdis.com' }],
            ['Cusdis with an unknown theme', { type: 'cusdis', app_id: 'fixture', theme: 'blue' }],
            ['Beaudar without a repository', { type: 'beaudar', issue_term: 'pathname' }],
            ['Beaudar without an issue term or number', { type: 'beaudar', repo: 'user/repo' }],
            ['Beaudar with an issue number that is not an integer', { type: 'beaudar', repo: 'user/repo', issue_number: 'one' }],
            ['an unknown comment type', { type: 'no-such-comment' }]
        ]) {
            it(`rejects ${description}`, () => {
                assert.ok(!valid(comment), JSON.stringify(comment));
            });
        }

        it('accepts a theme for dark pages for Giscus and Utterances', () => {
            const giscus = { type: 'giscus', repo: 'user/repo', repoId: 'R', category: 'C', categoryId: 'C', mapping: 'pathname' };
            assert.ok(valid({ ...giscus, theme: 'light', darkTheme: 'dark_dimmed' }));
            assert.ok(!valid({ ...giscus, darkTheme: 42 }));
            const utterances = { type: 'utterances', repo: 'user/repo', issue_term: 'pathname' };
            assert.ok(valid({ ...utterances, theme: 'github-light', dark_theme: 'photon-dark' }));
            assert.ok(!valid({ ...utterances, dark_theme: 'no-such-theme' }));
        });

        it('keeps Disqus as the comment plugin of the generated configuration', () => {
            const defaults = yaml.parse(schema.getDefaultValue().toYaml());
            assert.deepEqual(defaults.comment, { type: 'disqus', shortname: '' });
        });
    });

    it('accepts the test fixture theme configuration', () => {
        const cfg = yaml.parse(fs.readFileSync(path.join(FIXTURE_SITE, '_config.icarus.yml'), 'utf8'));
        assert.equal(loadSchema().validate(cfg), true);
    });
});
