/* eslint no-process-exit: "off" */
const semver = require('semver');
const logger = require('hexo-log')();
const packageInfo = require('../package.json');
const { yellow, red, green } = require('./util/console');

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

    logger.info('=== Checking package dependencies ===');
    const missingDeps = Object.keys(packageInfo.peerDependencies)
        .filter(name => !checkDependency(name, packageInfo.peerDependencies[name]));
    if (missingDeps && missingDeps.length) {
        logger.error('Please install the missing dependencies your Hexo site root directory:');
        logger.error(green('npm install --save ' + missingDeps.map(name => `${name}@${packageInfo.peerDependencies[name]}`).join(' ')));
        logger.error('or:');
        logger.error(green('yarn add ' + missingDeps.map(name => `${name}@${packageInfo.peerDependencies[name]}`).join(' ')));
        process.exit(-1);
    }
};
