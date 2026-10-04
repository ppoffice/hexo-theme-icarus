const assert = require('assert').strict;
const path = require('path');
const checkDependencies = require('../../include/dependency');
const packageInfo = require('../../package.json');
const { capture } = require('../support/capture');
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

    it('quotes version ranges containing spaces in the printed install commands', () => {
        packageInfo.dependencies['icarus-test-missing-package'] = '^1.0.0 || ^2.0.0';
        const { output } = capture(() => checkDependencies({}));
        assert.match(output, /npm install --save "icarus-test-missing-package@\^1\.0\.0 \|\| \^2\.0\.0"/);
        assert.match(output, /yarn add "icarus-test-missing-package@\^1\.0\.0 \|\| \^2\.0\.0"/);
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
});
