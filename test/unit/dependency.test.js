const assert = require('assert').strict;
const Module = require('module');
const path = require('path');
const checkDependencies = require('../../include/dependency');
const packageInfo = require('../../package.json');
const { capture, withArgv } = require('../support/capture');
const { REPO_ROOT } = require('../support/paths');

describe('include/dependency (package dependency check)', () => {
    const originalDependencies = Object.assign({}, packageInfo.dependencies);

    afterEach(() => {
        packageInfo.dependencies = Object.assign({}, originalDependencies);
    });

    it('passes when every dependency is installed with a satisfying version', () => {
        const { exitCode, output } = capture(() => checkDependencies({}));
        assert.equal(exitCode, null, output);
        assert.doesNotMatch(output, /ERROR/);
    });

    it('exits and prints install commands when a dependency is missing', () => {
        packageInfo.dependencies['icarus-test-missing-package'] = '^1.0.0';
        const { exitCode, output } = capture(() => checkDependencies({}));
        assert.equal(exitCode, -1);
        assert.match(output, /icarus-test-missing-package.*is not installed/);
        assert.match(output, /npm install --save icarus-test-missing-package@\^1\.0\.0/);
        assert.match(output, /yarn add icarus-test-missing-package@\^1\.0\.0/);
    });

    it('exits when an installed dependency does not satisfy the required range', () => {
        packageInfo.dependencies.semver = '^0.0.1';
        const { exitCode, output } = capture(() => checkDependencies({}));
        assert.equal(exitCode, -1);
        assert.match(output, /semver.*does not satisfy the required version/);
    });

    it('mentions how to skip the check when it fails', () => {
        packageInfo.dependencies['icarus-test-missing-package'] = '^1.0.0';
        const { output } = capture(() => checkDependencies({}));
        assert.match(output, /--icarus-dont-check-deps/);
    });

    it('can be skipped with --icarus-dont-check-deps', () => {
        packageInfo.dependencies['icarus-test-missing-package'] = '^1.0.0';
        const { exitCode, output } = withArgv(['--icarus-dont-check-deps'], () => capture(() => checkDependencies({})));
        assert.equal(exitCode, null);
        assert.doesNotMatch(output, /Checking package dependencies/);
    });

    it('quotes version ranges containing spaces in the printed install commands', () => {
        packageInfo.dependencies['icarus-test-missing-package'] = '^1.0.0 || ^2.0.0';
        const { output } = capture(() => checkDependencies({}));
        assert.match(output, /npm install --save "icarus-test-missing-package@\^1\.0\.0 \|\| \^2\.0\.0"/);
        assert.match(output, /yarn add "icarus-test-missing-package@\^1\.0\.0 \|\| \^2\.0\.0"/);
    });

    describe('when semver itself is not installed (#1340)', () => {
        const dependencyPath = require.resolve('../../include/dependency');
        const isSemver = request => request === 'semver' || request.startsWith('semver/');
        const semverSpec = `semver@${originalDependencies.semver}`;
        let originalLoad, originalResolve, originalModule;

        // Load a fresh copy of the module so that it also has to require semver from scratch.
        const checkFreshDependencies = hexo => {
            delete require.cache[dependencyPath];
            return require(dependencyPath)(hexo);
        };

        // Make every require('semver...') and require.resolve('semver...') fail as on a fresh
        // Hexo site, which does not depend on semver. Both hooks are needed: require() can
        // return an already loaded module without resolving it again.
        beforeEach(() => {
            originalModule = require.cache[dependencyPath];
            originalLoad = Module._load;
            originalResolve = Module._resolveFilename;
            const notFound = request => Object.assign(new Error(`Cannot find module '${request}'`), { code: 'MODULE_NOT_FOUND' });
            Module._load = function(request, ...args) {
                if (isSemver(request)) {
                    throw notFound(request);
                }
                return originalLoad.call(this, request, ...args);
            };
            Module._resolveFilename = function(request, ...args) {
                if (isSemver(request)) {
                    throw notFound(request);
                }
                return originalResolve.call(this, request, ...args);
            };
        });

        afterEach(() => {
            Module._load = originalLoad;
            Module._resolveFilename = originalResolve;
            require.cache[dependencyPath] = originalModule;
        });

        it('reports semver as missing instead of crashing', () => {
            const { error, exitCode, output } = capture(() => checkFreshDependencies({}));
            assert.equal(exitCode, -1, error && error.stack);
            assert.match(output, /semver.*is not installed/);
            assert.ok(output.includes(`npm install --save ${semverSpec}`), output);
            assert.ok(output.includes(`yarn add ${semverSpec}`), output);
        });

        it('does not report the other installed dependencies', () => {
            const { output } = capture(() => checkFreshDependencies({}));
            const reported = output.split('\n').filter(line => /is not installed|does not satisfy/.test(line));
            assert.equal(reported.length, 1, output);
            assert.match(reported[0], /semver/);
        });

        it('still reports other missing dependencies alongside semver', () => {
            packageInfo.dependencies['icarus-test-missing-package'] = '^1.0.0';
            const { output } = capture(() => checkFreshDependencies({}));
            assert.match(output, /npm install --save .*icarus-test-missing-package@\^1\.0\.0/);
            assert.ok(output.includes(` ${semverSpec}`), output);
        });

        it('skips version checks it cannot perform', () => {
            packageInfo.dependencies.hexo = '^0.0.1';
            const { output } = capture(() => checkFreshDependencies({}));
            assert.match(output, /semver.*is not installed/);
            assert.doesNotMatch(output, /does not satisfy the required version/);
        });

        it('can still be skipped with --icarus-dont-check-deps', () => {
            const { error, output } = withArgv(['--icarus-dont-check-deps'], () => capture(() => checkFreshDependencies({})));
            assert.equal(error, null, output);
            assert.doesNotMatch(output, /ERROR/);
        });
    });

    describe('installed Hexo version', () => {
        const hexoPackagePath = require.resolve('hexo/package.json', { paths: [path.join(REPO_ROOT, 'include')] });
        let original;

        beforeEach(() => {
            require(hexoPackagePath);
            original = require.cache[hexoPackagePath].exports;
        });

        afterEach(() => {
            require.cache[hexoPackagePath].exports = original;
        });

        const withHexo = version => {
            require.cache[hexoPackagePath].exports = Object.assign({}, original, { version });
            return capture(() => checkDependencies({}));
        };

        for (const version of ['7.1.1', '7.3.0', '8.0.0', '8.1.2']) {
            it(`accepts Hexo ${version}`, () => {
                const { exitCode, output } = withHexo(version);
                assert.equal(exitCode, null, output);
            });
        }

        for (const version of ['6.3.0', '7.0.0', '9.0.0']) {
            it(`rejects Hexo ${version}`, () => {
                assert.equal(withHexo(version).exitCode, -1);
            });
        }
    });

    describe('installed hexo-component-inferno version', () => {
        const packagePath = require.resolve('hexo-component-inferno/package.json', { paths: [path.join(REPO_ROOT, 'include')] });
        let original;

        beforeEach(() => {
            require(packagePath);
            original = require.cache[packagePath].exports;
        });

        afterEach(() => {
            require.cache[packagePath].exports = original;
        });

        const withComponent = version => {
            require.cache[packagePath].exports = Object.assign({}, original, { version });
            return capture(() => checkDependencies({}));
        };

        it('accepts 4.2.2 and later 4.x', () => {
            for (const version of ['4.2.2', '4.3.1']) {
                const { exitCode, output } = withComponent(version);
                assert.equal(exitCode, null, output);
            }
        });

        // A site upgrading the theme with its old node_modules still has 3.x installed.
        it('rejects 3.x with the version it requires and the command to install it', () => {
            const { exitCode, output } = withComponent('3.1.2');
            assert.equal(exitCode, -1);
            assert.match(output, /hexo-component-inferno.*\(.*3\.1\.2.*\) does not satisfy the required version \(.*\^4\.2\.2.*\)/);
            assert.match(output, /npm install --save hexo-component-inferno@\^4\.2\.2/);
            assert.match(output, /yarn add hexo-component-inferno@\^4\.2\.2/);
        });

        // 4.0.0 has no Artalk, Beaudar or Cusdis comments, waline_pageview plugin or cdn_overrides,
        // 4.1.0 still writes the invalid og:type "blog" into the generated configuration, 4.2.0
        // rejects the empty widget options of the generated configuration, and 4.2.1 does not load
        // the post thumbnails lazily.
        it('rejects 4.0.0, 4.1.0, 4.2.0 and 4.2.1', () => {
            for (const version of ['4.0.0', '4.1.0', '4.2.0', '4.2.1']) {
                const { exitCode, output } = withComponent(version);
                assert.equal(exitCode, -1);
                const escaped = version.replace(/\./g, '\\.');
                assert.match(output, new RegExp(`\\(.*${escaped}.*\\) does not satisfy the required version \\(.*\\^4\\.2\\.2.*\\)`));
            }
        });
    });
});
