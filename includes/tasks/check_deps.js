const logger = require('hexo-log')();

function checkDependency(name) {
    try {
        require.resolve(name);
        return true;
    } catch(e) {
        logger.error(`Package ${name} is not installed.`)
    }
    return false;
}

logger.info('Checking dependencies');
const missingDeps = [
    'js-yaml',
    'moment',
    'cheerio',
    'hexo-util',
    'hexo-log',
    'hexo-pagination',
].map(checkDependency).some(installed => !installed);
if (missingDeps) {
    logger.error('Please install the missing dependencies from the root directory of your Hexo site.');
    process.exit(-1);
}
