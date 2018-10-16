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
    // 'moment',
    // 'lodash',
    // 'cheerio',
    // 'js-yaml',
    // 'highlight.js',
    // 'hexo-util',
    'hexo-log',
    'hexo-generator-archive',
    'hexo-generator-category',
    'hexo-generator-index',
    'hexo-generator-tag',
    'hexo-renderer-ejs',
    'hexo-renderer-marked',
    'hexo-renderer-stylus',
].map(checkDependency).some(installed => !installed);
if (missingDeps) {
    logger.error('Please install the missing dependencies from the root directory of your Hexo site.');
    process.exit(-1);
}
