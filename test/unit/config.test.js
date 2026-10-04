const assert = require('assert').strict;
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const yaml = require('hexo-component-inferno/lib/util/yaml');
const { SchemaLoader } = require('hexo-component-inferno/lib/core/schema');
const checkConfig = require('../../include/config');
const { capture, withArgv } = require('../support/capture');
const { REPO_ROOT } = require('../support/paths');

function loadSchema() {
    const schemaDir = path.join(REPO_ROOT, 'include/schema/');
    return SchemaLoader.load(require(path.join(schemaDir, 'config.json')), schemaDir).getSchema('/config.json');
}

/**
 * Create a throwaway Hexo site + theme directory pair.
 * The theme directory links include/ from this repository so schemas and migrations are real.
 */
function createEnv({ siteConfig = { title: 'Test' }, themeSiteConfig, themeDirConfig } = {}) {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'icarus-config-'));
    const baseDir = path.join(root, 'site');
    const themeDir = path.join(root, 'theme');
    fs.mkdirSync(baseDir);
    fs.mkdirSync(themeDir);
    fs.symlinkSync(path.join(REPO_ROOT, 'include'), path.join(themeDir, 'include'), 'junction');
    fs.writeFileSync(path.join(baseDir, '_config.yml'), yaml.stringify(siteConfig));
    if (themeSiteConfig) {
        fs.writeFileSync(path.join(baseDir, '_config.icarus.yml'), typeof themeSiteConfig === 'string' ? themeSiteConfig : yaml.stringify(themeSiteConfig));
    }
    if (themeDirConfig) {
        fs.writeFileSync(path.join(themeDir, '_config.yml'), yaml.stringify(themeDirConfig));
    }
    return {
        root,
        hexo: { base_dir: baseDir, theme_dir: themeDir, config: {} },
        sitePath: name => path.join(baseDir, name),
        themePath: name => path.join(themeDir, name),
        readYaml: file => yaml.parse(fs.readFileSync(file, 'utf8')),
        cleanup: () => fs.rmSync(root, { recursive: true, force: true })
    };
}

function md5(file) {
    return crypto.createHash('md5').update(fs.readFileSync(file)).digest('hex');
}

describe('include/config (theme configuration check, generation and migration)', () => {
    let env;

    afterEach(() => env && env.cleanup());

    describe('generation', () => {
        it('generates _config.icarus.yml from the schema when no theme config exists', () => {
            env = createEnv();
            const { exitCode, output } = capture(() => checkConfig(env.hexo));
            assert.equal(exitCode, null, output);
            const generated = env.sitePath('_config.icarus.yml');
            assert.ok(fs.existsSync(generated), 'config file should be generated');
            const cfg = env.readYaml(generated);
            assert.equal(cfg.version, '5.1.0');
            assert.equal(loadSchema().validate(cfg), true, 'generated config must pass schema validation');
            assert.doesNotMatch(output, /failed one or more checks/);
        });

        it('does not generate a config file with --icarus-dont-generate-config', () => {
            env = createEnv();
            const { exitCode } = withArgv(['--icarus-dont-generate-config'], () => capture(() => checkConfig(env.hexo)));
            assert.equal(exitCode, null);
            assert.equal(fs.existsSync(env.sitePath('_config.icarus.yml')), false);
        });

        it('skips all checks with --icarus-dont-check-config', () => {
            env = createEnv();
            const { output } = withArgv(['--icarus-dont-check-config'], () => capture(() => checkConfig(env.hexo)));
            assert.equal(fs.existsSync(env.sitePath('_config.icarus.yml')), false);
            assert.doesNotMatch(output, /Checking theme configurations/);
        });
    });

    describe('validation', () => {
        it('accepts a valid, up-to-date configuration silently', () => {
            env = createEnv({ themeSiteConfig: { version: '5.1.0', variant: 'default' } });
            const before = fs.readFileSync(env.sitePath('_config.icarus.yml'), 'utf8');
            const { exitCode, output } = capture(() => checkConfig(env.hexo));
            assert.equal(exitCode, null);
            assert.doesNotMatch(output, /failed one or more checks/);
            assert.equal(fs.readFileSync(env.sitePath('_config.icarus.yml'), 'utf8'), before, 'file must not be rewritten');
        });

        it('warns (without exiting) when the configuration violates the schema', () => {
            env = createEnv({ themeSiteConfig: { version: '5.1.0', variant: 'no-such-variant' } });
            const { exitCode, output } = capture(() => checkConfig(env.hexo));
            assert.equal(exitCode, null);
            assert.match(output, /failed one or more checks/);
        });

        it('validates the theme-directory and site configurations deep-merged, like Hexo', () => {
            env = createEnv({
                themeDirConfig: { version: '5.1.0', comment: { type: 'disqus', shortname: 'fixture' } },
                themeSiteConfig: { comment: { type: 'disqus' } }
            });
            const { exitCode, output } = capture(() => checkConfig(env.hexo));
            assert.equal(exitCode, null);
            assert.doesNotMatch(output, /failed one or more checks/, output);
        });

        it('also merges theme_config from the site _config.yml', () => {
            env = createEnv({
                siteConfig: { title: 'Test', theme_config: { comment: { shortname: 'fixture' } } },
                themeSiteConfig: { version: '5.1.0', comment: { type: 'disqus' } }
            });
            env.hexo.config.theme_config = { comment: { shortname: 'fixture' } };
            const { output } = capture(() => checkConfig(env.hexo));
            assert.doesNotMatch(output, /failed one or more checks/, output);
        });

        it('accepts an empty theme configuration file', () => {
            env = createEnv({ themeDirConfig: { version: '5.1.0' }, themeSiteConfig: '' });
            const { exitCode, output } = capture(() => checkConfig(env.hexo));
            assert.equal(exitCode, null, output);
            assert.doesNotMatch(output, /failed one or more checks/, output);
        });

        it('warns when theme settings are placed in the site _config.yml as theme_config', () => {
            env = createEnv({ siteConfig: { title: 'Test', theme_config: { variant: 'cyberpunk' } }, themeSiteConfig: { version: '5.1.0' } });
            const { output } = capture(() => checkConfig(env.hexo));
            assert.match(output, /"theme_config" found in/);
        });

        it('exits with an error when the theme config is not valid YAML', () => {
            env = createEnv({ themeSiteConfig: 'version: 5.1.0\nvariant: [unclosed\n' });
            const { exitCode, output } = capture(() => checkConfig(env.hexo));
            assert.equal(exitCode, -1);
            assert.match(output, /Theme configuration checking failed/);
        });
    });

    describe('upgrade', () => {
        const outdated = {
            version: '5.0.0',
            comment: { type: 'waline', serverURL: 'https://example.com', visitor: true, math: 'mathjax' }
        };

        it('backs up, migrates and rewrites an outdated configuration', () => {
            env = createEnv({ themeSiteConfig: outdated });
            const original = env.sitePath('_config.icarus.yml');
            const backup = original + '.' + md5(original);
            const originalContent = fs.readFileSync(original, 'utf8');

            const { exitCode, output } = capture(() => checkConfig(env.hexo));
            assert.equal(exitCode, null, output);

            assert.ok(fs.existsSync(backup), 'backup named after the md5 of the old file should exist');
            assert.equal(fs.readFileSync(backup, 'utf8'), originalContent);

            const migrated = env.readYaml(original);
            assert.equal(migrated.version, '5.1.0');
            assert.equal(migrated.comment.pageview, true);
            assert.equal(migrated.comment.tex_renderer, 'mathjax');
            assert.equal('visitor' in migrated.comment, false);
            assert.ok(fs.existsSync(original + '.example'), 'an example config should be generated');
        });

        it('upgrades a 3.x configuration through every intermediate migration', () => {
            env = createEnv({ themeSiteConfig: { version: '3.0.0', article: { thumbnail: true, readtime: true } } });
            const { exitCode, output } = capture(() => checkConfig(env.hexo));
            assert.equal(exitCode, null, output);
            const migrated = env.readYaml(env.sitePath('_config.icarus.yml'));
            assert.equal(migrated.version, '5.1.0');
            assert.deepEqual(migrated.article, { readtime: true });
        });

        it('leaves an outdated configuration untouched with --icarus-dont-upgrade-config', () => {
            env = createEnv({ themeSiteConfig: outdated });
            const before = fs.readFileSync(env.sitePath('_config.icarus.yml'), 'utf8');
            withArgv(['--icarus-dont-upgrade-config'], () => capture(() => checkConfig(env.hexo)));
            assert.equal(fs.readFileSync(env.sitePath('_config.icarus.yml'), 'utf8'), before);
        });

        it('does not try to migrate a configuration without a version', () => {
            env = createEnv({ themeSiteConfig: { variant: 'default' } });
            const { exitCode, output } = capture(() => checkConfig(env.hexo));
            assert.equal(exitCode, null);
            assert.doesNotMatch(output, /outdated/);
            assert.match(output, /failed one or more checks/, 'version is required by the schema');
        });

        it('keeps nested settings from the theme-directory _config.yml when upgrading both files', () => {
            env = createEnv({
                themeDirConfig: { version: '5.0.0', article: { highlight: { theme: 'monokai' }, readtime: true } },
                themeSiteConfig: { version: '5.0.0', article: { readtime: false } }
            });
            capture(() => checkConfig(env.hexo));
            const migrated = env.readYaml(env.sitePath('_config.icarus.yml'));
            assert.equal(migrated.article.readtime, false);
            // Both source files were moved to backups, so anything not written here is lost.
            assert.deepEqual(migrated.article.highlight, { theme: 'monokai' });
        });
    });
});
