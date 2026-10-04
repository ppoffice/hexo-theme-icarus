const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const yaml = require('hexo-component-inferno/lib/util/yaml');
// eslint-disable-next-line node/no-extraneous-require
const I18n = require(require.resolve('hexo-i18n', { paths: [require.resolve('hexo')] }));
const { applyDefaultLanguage } = require('../../include/i18n');
const { REPO_ROOT } = require('../support/paths');

const languageDir = path.join(REPO_ROOT, 'languages');
const files = fs.readdirSync(languageDir).filter(file => file.endsWith('.yml'));

function flatten(obj, prefix = '') {
    return Object.entries(obj).reduce((acc, [key, value]) => {
        if (value && typeof value === 'object') {
            Object.assign(acc, flatten(value, prefix + key + '.'));
        } else {
            acc[prefix + key] = value;
        }
        return acc;
    }, {});
}

function load(file) {
    return flatten(yaml.parse(fs.readFileSync(path.join(languageDir, file), 'utf8')));
}

function placeholders(str) {
    return (String(str).match(/%[sd]/g) || []).sort();
}

describe('languages/', () => {
    const english = load('en.yml');

    it('contains the English base file', () => {
        assert.ok(files.includes('en.yml'));
    });

    for (const file of files) {
        describe(file, () => {
            it('is valid YAML', () => {
                assert.doesNotThrow(() => load(file));
            });

            it('has exactly the same keys as en.yml', () => {
                const keys = Object.keys(load(file));
                const missing = Object.keys(english).filter(key => !keys.includes(key));
                const extra = keys.filter(key => !(key in english));
                assert.deepEqual({ missing, extra }, { missing: [], extra: [] });
            });

            it('keeps the printf placeholders of en.yml', () => {
                const strings = load(file);
                for (const [key, value] of Object.entries(english)) {
                    if (key in strings) {
                        assert.deepEqual(placeholders(strings[key]), placeholders(value), `${file}: ${key}`);
                    }
                }
            });
        });
    }

    /**
     * Mirrors hexo/dist/plugins/filter/template_locals/i18n.js: the lookup order is
     * [page language, ...config languages, 'default', ...every loaded language file],
     * and the loaded files come in whatever order Hexo happened to process them.
     */
    function translate(siteLanguage, key, fileOrder, themeDir = REPO_ROOT) {
        const i18n = new I18n({ languages: [siteLanguage, 'default'] });
        for (const file of fileOrder) {
            i18n.set(path.basename(file, '.yml'), yaml.parse(fs.readFileSync(path.join(languageDir, file), 'utf8')));
        }
        applyDefaultLanguage(i18n, themeDir);
        const languages = [...new Set([siteLanguage, siteLanguage, 'default', ...i18n.list()])];
        return i18n.__(languages)(key);
    }

    it('uses the configured language when a translation exists', () => {
        assert.equal(translate('zh-CN', 'article.more', files), '阅读更多');
        assert.equal(translate('en', 'article.more', [...files].reverse()), 'Read more');
    });

    it('falls back to English for a language without translation, whatever the file load order', () => {
        for (const order of [files, [...files].reverse()]) {
            assert.equal(translate('nl', 'article.more', order), 'Read more');
            assert.equal(translate('pt', 'article.comments', order), 'Comments');
        }
    });

    describe('include/i18n applyDefaultLanguage', () => {
        const os = require('os');

        it('does not override a languages/default.yml shipped with the theme', () => {
            const themeDir = fs.mkdtempSync(path.join(os.tmpdir(), 'icarus-i18n-'));
            fs.mkdirSync(path.join(themeDir, 'languages'));
            fs.writeFileSync(path.join(themeDir, 'languages', 'default.yml'), 'article:\n    more: Custom\n');
            const i18n = new I18n({ languages: ['nl', 'default'] });
            i18n.set('default', { article: { more: 'Custom' } });
            i18n.set('en', load('en.yml'));
            applyDefaultLanguage(i18n, themeDir);
            assert.equal(i18n.__(['nl', 'default', 'en'])('article.more'), 'Custom');
            fs.rmSync(themeDir, { recursive: true, force: true });
        });

        it('does nothing when English is not loaded', () => {
            const i18n = new I18n({ languages: ['nl', 'default'] });
            applyDefaultLanguage(i18n, REPO_ROOT);
            assert.deepEqual(i18n.list(), []);
        });
    });

    it('names files with the language codes Hexo users configure (vi for Vietnamese)', () => {
        assert.ok(files.includes('vi.yml'), 'Vietnamese is "vi" in ISO 639-1; "vn" is a country code');
    });

    it('keeps vn.yml as an identical alias of vi.yml for existing sites', () => {
        assert.deepEqual(load('vn.yml'), load('vi.yml'));
    });

    it('translates language: vi into Vietnamese', () => {
        assert.equal(translate('vi', 'article.more', files), 'Đọc thêm');
    });
});
