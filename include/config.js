/* eslint n/no-process-exit: "off" */
const fs = require('fs');
const path = require('path');
const util = require('util');
const crypto = require('crypto');
const createLogger = require('hexo-log');
const { deepMerge } = require('hexo-util');
const yaml = require('hexo-component-inferno/lib/util/yaml');
const { Migrator } = require('hexo-component-inferno/lib/core/migrate');
const { SchemaLoader } = require('hexo-component-inferno/lib/core/schema');
const { yellow } = require('./util/console');

const logger = createLogger.default();

function loadThemeConfig(hexo, cfgPaths) {
    // Merge the configuration files the same way Hexo does when rendering, so that what is
    // validated and migrated here is exactly the configuration the theme will receive.
    const configs = cfgPaths.map(cfgPath => yaml.parse(fs.readFileSync(cfgPath)));
    return configs.concat(hexo.config.theme_config)
        .filter(cfg => cfg && typeof cfg === 'object')
        .reduce((result, cfg) => deepMerge(result, cfg), {});
}

function generateThemeConfigFile(schema, cfgPath) {
    const defaultValue = schema.getDefaultValue();
    fs.writeFileSync(cfgPath, defaultValue.toYaml());
}

function hashConfigFile(cfgPath) {
    const content = fs.readFileSync(cfgPath);
    return crypto.createHash('md5').update(content).digest('hex');
}

function checkConfig(hexo) {
    if (!process.argv.includes('--icarus-dont-check-config')) {
        logger.info('=== Checking theme configurations ===');

        const siteCfgFile = path.join(hexo.base_dir, '_config.yml');
        const themeSiteCfg = path.join(hexo.base_dir, '_config.icarus.yml');
        const themeDirCfg = path.join(hexo.theme_dir, '_config.yml');
        const themeCfgPaths = [themeDirCfg, themeSiteCfg].filter(cfgPath => fs.existsSync(cfgPath));
        const themeSiteCfgExample = themeSiteCfg + '.example';

        const schemaDir = path.join(hexo.theme_dir, 'include/schema/');
        const loader = SchemaLoader.load(require(path.join(schemaDir, 'config.json')), schemaDir);
        const schema = loader.getSchema('/config.json');

        if (!process.argv.includes('--icarus-dont-generate-config')) {
            if (!themeCfgPaths.length) {
                logger.warn('None of the following configuration files is found:');
                logger.warn(`- ${yellow(themeSiteCfg)}`);
                logger.warn(`- ${yellow(themeDirCfg)}`);
                logger.info('Generating theme configuration file...');
                generateThemeConfigFile(schema, themeSiteCfg);
                themeCfgPaths.push(themeSiteCfg);
                logger.info(`${yellow(themeSiteCfg)} created successfully.`);
                logger.info('To skip configuration generation, use "--icarus-dont-generate-config".');
            }
        }

        let cfg = loadThemeConfig(hexo, themeCfgPaths);

        if (!process.argv.includes('--icarus-dont-upgrade-config')) {
            const migrator = new Migrator(require(path.join(hexo.theme_dir, 'include/migration/head')));
            if (cfg.version && migrator.isOudated(cfg.version)) {
                logger.warn(`Your theme configuration is outdated (${cfg.version} < ${migrator.getLatestVersion()}).`);
                logger.info('To skip the configuration upgrade, use "--icarus-dont-upgrade-config".');

                logger.info('Backing up theme configuration files...');
                for (const cfgPath of themeCfgPaths) {
                    const backupPath = cfgPath + '.' + hashConfigFile(cfgPath);
                    const relCfgPath = path.relative(hexo.base_dir, cfgPath);
                    const relBackupPath = path.relative(hexo.base_dir, backupPath);
                    fs.renameSync(cfgPath, backupPath);
                    logger.info(`${yellow(relCfgPath)} => ${yellow(relBackupPath)}`);
                }

                logger.info('Upgrading theme configurations...');
                cfg = migrator.migrate(cfg);
                fs.writeFileSync(themeSiteCfg, yaml.stringify(cfg));
                logger.info(`Theme configurations are written to ${yellow(themeSiteCfg)}.`);

                generateThemeConfigFile(schema, themeSiteCfgExample);
                logger.info(`An example configuration is at ${yellow(themeSiteCfgExample)}.`);
            }
        }

        const validation = schema.validate(cfg);
        if (validation !== true) {
            logger.warn('Theme configurations failed one or more checks.');
            logger.warn('Icarus may still run, but you will encounter unexpected results.');
            logger.warn('Here is some information for you to correct the configuration file.');
            logger.warn(util.inspect(validation));
        }

        if (cfg.comment && cfg.comment.type === 'valine') {
            // IP addresses are only stored when record_ip is on, which is off by default
            const leaked = cfg.comment.record_ip === true ? 'email and IP addresses' : 'email addresses';
            logger.warn(`Valine exposes commenters' ${leaked} to anyone with the site's public LeanCloud keys.`);
            logger.warn(`Consider another comment plugin, such as Waline, Twikoo or giscus. See ${yellow('https://github.com/ppoffice/hexo-theme-icarus/issues/788')}.`);
        }

        const walinePageview = cfg.plugins && typeof cfg.plugins === 'object' ? cfg.plugins.waline_pageview : null;
        if (walinePageview) {
            const waline = cfg.comment && cfg.comment.type === 'waline' ? cfg.comment : null;
            if (waline && waline.pageview) {
                logger.warn('Both the waline_pageview plugin and the pageview option of the Waline comments count page views, so each view is counted twice.');
                logger.warn(`Please set ${yellow('comment.pageview')} to false, or disable ${yellow('plugins.waline_pageview')}.`);
            }
            if (!(typeof walinePageview === 'object' && walinePageview.server_url) && !(waline && waline.server_url)) {
                logger.warn('The waline_pageview plugin is enabled, but has no Waline server to count the page views.');
                logger.warn(`Please set ${yellow('plugins.waline_pageview.server_url')}, or the ${yellow('server_url')} of the Waline comments.`);
            }
        }

        // Configurations generated before hexo-component-inferno 4.2.0 have type: blog, which the theme ignores
        const openGraph = cfg.head && typeof cfg.head === 'object' ? cfg.head.open_graph : null;
        if (openGraph && typeof openGraph === 'object' && openGraph.type === 'blog') {
            logger.warn(`${yellow('head.open_graph.type')} is "blog", which is not an Open Graph type and is ignored. Please remove it.`);
        }

        const rootCfg = yaml.parse(fs.readFileSync(siteCfgFile));
        if (rootCfg.theme_config) {
            logger.warn(`"theme_config" found in ${yellow(siteCfgFile)}.`);
            logger.warn(`Please remove theme configurations from ${yellow(siteCfgFile)}.`);
        }
    }
}

module.exports = hexo => {
    try {
        checkConfig(hexo);
    } catch (e) {
        logger.error(e);
        logger.error('Theme configuration checking failed.');
        logger.info('You may use \'--icarus-dont-check-config\' to skip configuration checking.');
        process.exit(-1);
    }
};
