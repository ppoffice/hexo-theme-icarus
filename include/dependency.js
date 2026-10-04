/* eslint n/no-process-exit: "off" */
const semver = require('semver');
const createLogger = require('hexo-log');
const packageInfo = require('../package.json');
const { yellow, red, green } = require('./util/console');

const logger = createLogger.default();

module.exports = hexo => {
    function checkDependency(name, reqVer) {
        try {
            require.resolve(name);
            const version = require(name + '/package.json').version;
            if (!semver.satisfies(version, reqVer)) {
                logger.error(`Package ${yellow(name)}'s version (${yellow(version)}) does not satisfy the required version (${red(reqVer)}).`);
                return false;
            }
            return true;
        } catch (e) {
            logger.error(`Package ${yellow(name)} is not installed.`);
        }
        return false;
    }

    if (process.argv.includes('--icarus-dont-check-deps')) {
        return;
    }

    logger.info('=== Checking package dependencies ===');
    const dependencies = Object.assign({}, packageInfo.dependencies);

    // Quote specs such as "hexo@^7.1.1 || ^8.0.0" so the printed commands can be pasted into a shell.
    function installSpec(name) {
        const spec = `${name}@${dependencies[name]}`;
        return /[\s|<>]/.test(spec) ? `"${spec}"` : spec;
    }

    const missingDeps = Object.keys(dependencies)
        .filter(name => !checkDependency(name, dependencies[name]));
    if (missingDeps && missingDeps.length) {
        logger.error('Please install the missing dependencies in your Hexo site root directory:');
        logger.error(green('npm install --save ' + missingDeps.map(installSpec).join(' ')));
        logger.error('or:');
        logger.error(green('yarn add ' + missingDeps.map(installSpec).join(' ')));
        logger.info('To skip the dependency check, use "--icarus-dont-check-deps".');
        process.exit(-1);
    }
};
