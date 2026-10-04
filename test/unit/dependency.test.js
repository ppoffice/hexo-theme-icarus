const assert = require('assert').strict;
const path = require('path');
const checkDependencies = require('../../include/dependency');
const packageInfo = require('../../package.json');
const { capture } = require('../support/capture');
const { knownBug } = require('../support/known-bug');
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

    describe('with Hexo 8 installed in the site', () => {
        const hexoPackagePath = require.resolve('hexo/package.json', { paths: [path.join(REPO_ROOT, 'include')] });
        let original;

        beforeEach(() => {
            require(hexoPackagePath);
            original = require.cache[hexoPackagePath].exports;
            require.cache[hexoPackagePath].exports = Object.assign({}, original, { version: '8.1.2' });
        });

        afterEach(() => {
            require.cache[hexoPackagePath].exports = original;
        });

        knownBug('does not abort the build for Hexo 8 (the theme renders fine on Hexo 8)', () => {
            const { exitCode, output } = capture(() => checkDependencies({}));
            assert.equal(exitCode, null, output);
        });
    });
});
