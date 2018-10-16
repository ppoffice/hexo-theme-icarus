const fs = require('fs');
const path = require('path');
const logger = require('hexo-log')();

const conf = path.join(__dirname, '../..', '_config.yml');

logger.info('Checking if the configuration file exists');
if (!fs.existsSync(conf)) {
    logger.warn(`${conf} is not found. Please create one from the template _config.yml.example.`)
}