const fs = require('fs');
const path = require('path');
const util = require('util');
const crypto = require('crypto');
const logger = require('hexo-log')();
const packageInfo = require('../package.json');

/**
 * Print welcome message
 */
logger.info(`=======================================
 ██╗ ██████╗ █████╗ ██████╗ ██╗   ██╗███████╗
 ██║██╔════╝██╔══██╗██╔══██╗██║   ██║██╔════╝
 ██║██║     ███████║██████╔╝██║   ██║███████╗
 ██║██║     ██╔══██║██╔══██╗██║   ██║╚════██║
 ██║╚██████╗██║  ██║██║  ██║╚██████╔╝███████║
 ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝
=============================================`);

/**
 * Check if all dependencies are installed
 */
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

logger.info('=== Checking package dependencies ===');
const missingDeps = Object.keys(packageInfo.peerDependencies)
    .map(checkDependency)
    .some(installed => !installed);
if (missingDeps) {
    logger.error('Please install the missing dependencies from the root directory of your Hexo site.');
    /* eslint no-process-exit: "off" */
    process.exit(-1);
}

/**
 * Configuration file checking and migration
 */
if (!process.argv.includes('--icarus-dont-check-config')) {
    const SCHEMA_ROOT = path.join(hexo.theme_dir, 'include/schema/');
    const CONFIG_PATH = path.join(hexo.theme_dir, '_config.yml');

    const yaml = require('../include/util/yaml');
    const { SchemaLoader } = require('../include/util/schema');
    const loader = SchemaLoader.load(require(path.join(SCHEMA_ROOT, 'config.json')), SCHEMA_ROOT);
    const schema = loader.getSchema('/config.json');
    logger.info('=== Checking the configuration file ===');

    // Generate config file if not exist
    if (!process.argv.includes('--icarus-dont-generate-config')) {
        if (!fs.existsSync(CONFIG_PATH)) {
            logger.warn(`${CONFIG_PATH} is not found. We are creating one for you...`);
            logger.info('You may add \'--icarus-dont-generate-config\' to prevent creating the configuration file.');
            const defaultValue = schema.getDefaultValue();
            fs.writeFileSync(CONFIG_PATH, defaultValue.toYaml());
            logger.info(`${CONFIG_PATH} created successfully.`);
        }
    }

    try {
        const cfgStr = fs.readFileSync(CONFIG_PATH);
        let cfg = yaml.parse(cfgStr);
        // Check config version
        if (!process.argv.includes('--icarus-dont-upgrade-config')) {
            const migrator = new(require('../include/util/migrate'))(path.join(hexo.theme_dir, 'include/migration'));
            // Upgrade config
            if (migrator.isOudated(cfg.version)) {
                logger.info(`Your configuration file is outdated (${cfg.version} < ${migrator.getLatestVersion()}). `
                    + 'Trying to upgrade it...');
                // Backup old config
                const hash = crypto.createHash('sha256').update(cfgStr).digest('hex');
                const backupPath = CONFIG_PATH + '.' + hash.substring(0, 16);
                fs.writeFileSync(backupPath, cfgStr);
                logger.info(`Current configurations are written up to ${backupPath}`);
                // Migrate config
                cfg = migrator.migrate(cfg);
                // Save config
                fs.writeFileSync(CONFIG_PATH, yaml.stringify(cfg));
                logger.info(`${CONFIG_PATH} upgraded successfully.`);
                const defaultValue = schema.getDefaultValue();
                fs.writeFileSync(CONFIG_PATH + '.example', defaultValue.toYaml());
                logger.info(`We also created an example at ${CONFIG_PATH + '.example'} for your reference.`);
            }
        }

        // Check config file against schemas
        const result = schema.validate(cfg);
        if (result !== true) {
            logger.warn('Configuration file failed one or more checks.');
            logger.warn('Icarus may still run, but you will encounter excepted results.');
            logger.warn('Here is some information for you to correct the configuration file.');
            logger.warn(util.inspect(result));
        }
    } catch (e) {
        logger.error(e);
        logger.error(`Failed to load the configuration file ${CONFIG_PATH}.`);
        logger.error('Please add \'--icarus-dont-check-config\' to your Hexo command if you');
        logger.error('wish to skip the config file checking.');
        process.exit(-1);
    }
}


/**
 * Register Hexo extensions
 */
logger.info('=== Patching Hexo ===');
/* global hexo */
require('../include/generator/categories')(hexo);
require('../include/generator/category')(hexo);
require('../include/generator/tags')(hexo);
require('../include/generator/insight')(hexo);
require('../include/filter/locals')(hexo);
require('../include/helper/cdn')(hexo);
require('../include/helper/page')(hexo);

/**
 * Remove Hexo filters that could cause OOM
 */
const hooks = [
    'after_render:html',
    'after_post_render'
];
const filters = [
    'hexoMetaGeneratorInject',
    'externalLinkFilter'
];
hooks.forEach(hook => {
    hexo.extend.filter.list()[hook]
        .filter(filter => filters.includes(filter.name))
        .forEach(filter => hexo.extend.filter.unregister(hook, filter));
});
