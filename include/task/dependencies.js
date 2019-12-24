const logger = require('hexo-log')();
const packageInfo = require('../../package.json');

// FIXME: will not check against package version
function checkDependency(name) {
    try {
        require.resolve(name);
        return true;
    } catch (e) {
        logger.error(`Package ${name} is not installed.`);
    }
    return false;
}

logger.info('Checking if required dependencies are installed...');
const missingDeps = Object.keys(packageInfo.peerDependencies)
    .map(checkDependency)
    .some(installed => !installed);
if (missingDeps) {
    logger.error('Please install the missing dependencies from the root directory of your Hexo site.');
    /* eslint no-process-exit: "off" */
    process.exit(-1);
}
