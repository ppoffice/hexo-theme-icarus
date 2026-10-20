/**
 * Fixture site builder shared by the integration (mocha) and e2e (Playwright) suites.
 *
 * A "variant" (see test/fixtures/variants.js) describes how the base fixture site under
 * test/fixtures/site is modified: site config overrides, theme config overrides, extra posts.
 * Each variant is materialised under test/.tmp/sites/<variant> and generated with Hexo
 * in a child process, using this repository as the theme.
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const cheerio = require('cheerio');
const deepmerge = require('deepmerge');
const yaml = require('hexo-component-inferno/lib/util/yaml');
const variants = require('../fixtures/variants');
const { REPO_ROOT, TMP_DIR, FIXTURE_SITE } = require('./paths');

// Theme entries linked into <site>/themes/icarus. Linking entries one by one (instead of
// linking the whole repository) keeps Hexo from walking node_modules/ and test/.
const THEME_ENTRIES = ['include', 'languages', 'layout', 'scripts', 'source', 'package.json'];

const overwriteArrays = (target, source) => source;

function merge(base, override) {
    return deepmerge(base || {}, override || {}, { arrayMerge: overwriteArrays });
}

function readYaml(file) {
    return yaml.parse(fs.readFileSync(file, 'utf8'));
}

function symlink(target, link) {
    const type = fs.statSync(target).isDirectory() ? 'junction' : 'file';
    fs.symlinkSync(target, link, type);
}

function prepareSite(name) {
    const variant = variants[name];
    if (!variant) {
        throw new Error(`Unknown fixture variant "${name}". Known: ${Object.keys(variants).join(', ')}`);
    }
    const dir = path.join(TMP_DIR, 'sites', name);
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
    fs.cpSync(FIXTURE_SITE, dir, { recursive: true });

    const siteConfig = merge(readYaml(path.join(FIXTURE_SITE, '_config.yml')), variant.site);
    fs.writeFileSync(path.join(dir, '_config.yml'), yaml.stringify(siteConfig));

    const themeConfigPath = path.join(dir, '_config.icarus.yml');
    if (variant.theme === false) {
        // Let the theme generate its default configuration file.
        fs.rmSync(themeConfigPath, { force: true });
    } else {
        const themeConfig = merge(readYaml(themeConfigPath), variant.theme);
        fs.writeFileSync(themeConfigPath, yaml.stringify(themeConfig));
    }

    for (const [file, content] of Object.entries(variant.files || {})) {
        const target = path.join(dir, file);
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.writeFileSync(target, content);
    }

    symlink(path.join(REPO_ROOT, 'node_modules'), path.join(dir, 'node_modules'));
    const themeDir = path.join(dir, 'themes', 'icarus');
    fs.mkdirSync(themeDir, { recursive: true });
    for (const entry of THEME_ENTRIES) {
        symlink(path.join(REPO_ROOT, entry), path.join(themeDir, entry));
    }
    return dir;
}

class Site {
    constructor(name, dir, result) {
        this.name = name;
        this.dir = dir;
        this.publicDir = path.join(dir, 'public');
        this.status = result.status;
        this.output = `${result.stdout || ''}${result.stderr || ''}`;
        this._dom = {};
    }

    path(rel) {
        return path.join(this.publicDir, rel);
    }

    exists(rel) {
        return fs.existsSync(this.path(rel));
    }

    read(rel) {
        return fs.readFileSync(this.path(rel), 'utf8');
    }

    /** Map a URL path such as /2024/01/01/foo/ to the generated file. */
    fileOf(urlPath) {
        const clean = decodeURI(urlPath.split('#')[0].split('?')[0]).replace(/^\//, '');
        if (clean === '' || clean.endsWith('/')) {
            return clean + 'index.html';
        }
        if (!path.extname(clean) && fs.existsSync(this.path(clean + '/index.html'))) {
            return clean + '/index.html';
        }
        return clean;
    }

    /** cheerio document of a generated page, by file path or URL path. */
    $(relOrUrl) {
        const rel = relOrUrl.startsWith('/') ? this.fileOf(relOrUrl) : relOrUrl;
        if (!this._dom[rel]) {
            this._dom[rel] = cheerio.load(this.read(rel));
        }
        return this._dom[rel];
    }

    files(ext) {
        const result = [];
        const walk = dir => {
            for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
                const full = path.join(dir, entry.name);
                if (entry.isDirectory()) {
                    walk(full);
                } else if (!ext || entry.name.endsWith(ext)) {
                    result.push(path.relative(this.publicDir, full).split(path.sep).join('/'));
                }
            }
        };
        if (fs.existsSync(this.publicDir)) {
            walk(this.publicDir);
        }
        return result.sort();
    }

    htmlFiles() {
        return this.files('.html');
    }
}

/**
 * Generate a fixture variant and return a Site handle.
 * @param {string} name Variant name from test/fixtures/variants.js
 * @param {Object} [options]
 * @param {string[]} [options.args] Extra argv passed to the build (e.g. theme flags).
 * @param {boolean} [options.allowFailure] Do not throw when the build exits non-zero.
 */
function buildSite(name, options = {}) {
    const dir = prepareSite(name);
    const args = [path.join(__dirname, 'build-site.js'), dir].concat(options.args || []);
    const result = spawnSync(process.execPath, args, {
        cwd: dir,
        encoding: 'utf8',
        env: Object.assign({}, process.env, { NODE_ENV: 'production', FORCE_COLOR: '0', NO_COLOR: '1' })
    });
    const site = new Site(name, dir, result);
    if (site.status !== 0 && !options.allowFailure) {
        throw new Error(`Building fixture site "${name}" failed with exit code ${site.status}:\n${site.output}`);
    }
    return site;
}

const memo = {};

/** Build a variant once per process and reuse it. */
function getSite(name) {
    if (!memo[name]) {
        memo[name] = buildSite(name);
    }
    return memo[name];
}

module.exports = { buildSite, getSite, prepareSite, Site, THEME_ENTRIES };
