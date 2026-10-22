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

    describe('providers.cdn_overrides', () => {
        let schema;

        before(() => { schema = loadSchema(); });

        const valid = cdn_overrides => schema.validate({ version: '5.1.0', providers: { cdn: 'jsdelivr', cdn_overrides } }) === true;

        it('accepts CDN provider names and URL templates by package name, or nothing', () => {
            assert.ok(valid({ 'jquery': 'unpkg', 'highlight.js': '[cdnjs]https://cdn.example.com/${package}/${version}/${filename}', '@waline/client': 'https://example.com/waline.js' }));
            assert.ok(valid({}));
            assert.ok(valid(null));
            assert.ok(schema.validate({ version: '5.1.0', providers: { cdn: 'jsdelivr' } }) === true);
        });

        for (const [description, value] of [
            ['a provider name for every package', 'unpkg'],
            ['a list', ['jquery', 'unpkg']],
            ['an empty provider', { jquery: '' }],
            ['a provider that is not a string', { jquery: 42 }],
            ['nested packages', { jquery: { cdn: 'unpkg' } }]
        ]) {
            it(`rejects ${description}`, () => {
                assert.ok(!valid(value), JSON.stringify(value));
            });
        }

        it('is an empty mapping in the generated configuration, documented with examples', () => {
            const yamlText = schema.getDefaultValue().toYaml();
            assert.deepEqual(yaml.parse(yamlText).providers.cdn_overrides, {});
            assert.match(yamlText, /# +jquery: unpkg\n/);
            assert.match(yamlText, /# +clipboard: https:\/\/example\.com\/js\/clipboard\.min\.js\n\s*cdn_overrides: \{\}\n/);
        });
    });

    describe('plugins.waline_pageview', () => {
        let schema;

        before(() => { schema = loadSchema(); });

        const valid = waline_pageview => schema.validate({ version: '5.1.0', plugins: { waline_pageview } }) === true;

        it('accepts true, false, or the URL of a server', () => {
            for (const value of [true, false, {}, { server_url: 'https://waline.example.com' }, { server_url: null }]) {
                assert.ok(valid(value), JSON.stringify(value));
            }
        });

        for (const value of ['https://waline.example.com', 1, { server_url: 42 }, ['https://waline.example.com']]) {
            it(`rejects ${JSON.stringify(value)}`, () => {
                assert.ok(!valid(value));
            });
        }

        it('is disabled in the generated configuration, which warns against the pageview option of Waline', () => {
            const yamlText = schema.getDefaultValue().toYaml();
            assert.equal(yaml.parse(yamlText).plugins.waline_pageview, false);
            assert.match(yamlText, /# Waline page view counter.*Do not also enable the pageview option of the Waline comments.*\n(\s*#.*\n)*\s*waline_pageview: false\n/);
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

    describe('archives and categories widgets', () => {
        let schema;

        before(() => { schema = loadSchema(); });

        const valid = widget => schema.validate({ version: '5.1.0', widgets: [{ position: 'left', ...widget }] }) === true;

        it('accepts the options of hexo-component-inferno 4.2.0, or none of them, as in the generated configuration', () => {
            for (const widget of [
                { type: 'archives' },
                { type: 'archives', amount: null, group_by: null, order: null, format: null, show_count: true },
                { type: 'archives', amount: 3, group_by: 'yearly', order: 1, format: 'YYYY', show_count: false },
                { type: 'categories' },
                { type: 'categories', amount: null, order_by: null, order: null, depth: null, show_current: null, show_count: true },
                { type: 'categories', amount: 1, order_by: 'length', order: -1, depth: 1, show_current: true, show_count: false },
                { type: 'recent_posts', limit: 3 }
            ]) {
                assert.ok(valid(widget), JSON.stringify(widget));
            }
        });

        for (const widget of [
            { type: 'archives', group_by: 'weekly' },
            { type: 'archives', order: 0 },
            { type: 'categories', order: 'desc' }
        ]) {
            it(`rejects ${JSON.stringify(widget)}`, () => {
                assert.ok(!valid(widget));
            });
        }

        // hexo-component-inferno 4.2.0 makes these options nullable, but leaves null out of their enums,
        // so the empty values of the generated configuration fail the check. The theme has copies of the
        // two schemas with null in the enums until hexo-component-inferno accepts it.
        for (const name of ['archives', 'categories']) {
            it(`overrides the ${name} schema of hexo-component-inferno only to accept null in its enums`, () => {
                const original = require(`hexo-component-inferno/lib/schema/widget/${name}.json`);
                const override = require(path.join(schemaDir, `widget/${name}.json`));
                const enums = Object.values(original.properties).filter(property => Array.isArray(property.enum));
                assert.ok(enums.some(property => property.nullable && !property.enum.includes(null)),
                    `hexo-component-inferno accepts null in the enums of the ${name} widget now. Remove include/schema/widget/${name}.json.`);
                const expected = JSON.parse(JSON.stringify(original));
                for (const property of Object.values(expected.properties)) {
                    if (property.nullable && Array.isArray(property.enum) && !property.enum.includes(null)) {
                        property.enum.push(null);
                    }
                }
                assert.deepEqual(override, expected, `Update include/schema/widget/${name}.json to the schema of hexo-component-inferno.`);
            });
        }
    });

    it('accepts the test fixture theme configuration', () => {
        const cfg = yaml.parse(fs.readFileSync(path.join(FIXTURE_SITE, '_config.icarus.yml'), 'utf8'));
        assert.equal(loadSchema().validate(cfg), true);
    });
});
