const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const logger = require('hexo-log')();
const Schema = require('js-yaml/lib/js-yaml/schema');
const Type = require('js-yaml/lib/js-yaml/type');

const rootSpec = require('../specs/_config.yml');
const { projectName, is } = require('../specs/common');
const { type, required, condition, defaultValue, description } = require('../specs/common').descriptor;

const UNDEFINED = Symbol('undefined');
const CONFIG_PATH = path.join(__dirname, '../..', '_config.yml');
const YAML_SCHEMA = new Schema({
    include: [
        require('js-yaml/lib/js-yaml/schema/default_full')
    ],
    implicit: [
        new Type('tag:yaml.org,2002:null', {
            kind: 'scalar',
            resolve(data) {
                if (data === null) {
                    return true;
                }
                const max = data.length;
                return (max === 1 && data === '~') ||
                    (max === 4 && (data === 'null' || data === 'Null' || data === 'NULL'));
            },
            construct: () => null,
            predicate: object => object === null,
            represent: {
                empty: function () { return ''; }
            },
            defaultStyle: 'empty'
        })
    ]
});

function toPlainObject(object, depth) {
    if (object === null || (!is.object(object) && !is.array(object))) {
        return object;
    }
    if (depth <= 0) {
        return is.array(object) ? '[Array]' : '[Object]';
    }
    if (is.array(object)) {
        const result = [];
        for (let child of object) {
            result.push(toPlainObject(child, depth - 1));
        }
        return result;
    }
    const result = {};
    for (let key in object) {
        result[key] = toPlainObject(object[key], depth - 1);
    }
    for (let key of Object.getOwnPropertySymbols(object)) {
        result[key.toString()] = toPlainObject(object[key], depth - 1);
    }
    return result;
}

function isValidSpec(spec) {
    if (!spec.hasOwnProperty(type)) {
        return false;
    }
    return true;
}

function checkPrecondition(spec, parameter) {
    if (!spec.hasOwnProperty(condition)) {
        return true;
    }
    try {
        if (spec[condition](parameter) === true) {
            return true;
        }
    } catch (e) { }
    return false;
}

function createDefaultConfig(spec, parentConfig = null) {
    if (!isValidSpec(spec)) {
        return UNDEFINED;
    }
    if (!checkPrecondition(spec, parentConfig)) {
        return UNDEFINED;
    }
    if (spec.hasOwnProperty(defaultValue)) {
        return spec[defaultValue];
    }
    const types = is.array(spec[type]) ? spec[type] : [spec[type]];
    if (types.includes('object')) {
        let defaults = UNDEFINED;
        for (let key in spec) {
            if (typeof (key) === 'symbol' || key === '*') {
                continue;
            }
            const value = createDefaultConfig(spec[key], defaults);
            if (value !== UNDEFINED) {
                if (defaults === UNDEFINED) {
                    defaults = {};
                }
                if (spec[key].hasOwnProperty(description)) {
                    defaults['#' + key] = spec[key][description];
                }
                defaults[key] = value;
            }
        }
        return defaults;
    } else if (types.includes('array') && spec.hasOwnProperty('*')) {
        return [createDefaultConfig(spec['*'], {})];
    }
    return UNDEFINED;
}

function dumpConfig(config, path) {
    const configYaml = yaml.safeDump(config, {
        indent: 4,
        lineWidth: 1024,
        schema: YAML_SCHEMA
    }).replace(/^(\s*)\'#.*?\':\s*\'*(.*?)\'*$/mg, '$1# $2');
    fs.writeFileSync(path, configYaml);
}

function validateConfigVersion(config, spec) {
    function getMajorVersion(version) {
        try {
            return parseInt(version.split('.')[0]);
        } catch (e) {
            logger.error(`Configuration version number ${version} is malformed.`);
        }
        return null;
    }
    if (!config.hasOwnProperty('version')) {
        logger.error('Failed to get the version number of the configuration file.');
        logger.warn('You are probably using a previous version of confiugration.');
        logger.warn(`Please be noted that it may not work in the newer versions of ${projectName}.`);
        return false;
    }
    const specMajorVersion = getMajorVersion(spec.version[defaultValue]);
    const configMajorVersion = getMajorVersion(config.version);
    if (configMajorVersion === null || specMajorVersion === null) {
        return false;
    }
    if (configMajorVersion < specMajorVersion) {
        logger.warn('You are using a previous version of confiugration.');
        logger.warn(`Please be noted that it may not work in the newer versions of ${projectName}.`);
        return false;
    }
    if (configMajorVersion > specMajorVersion) {
        logger.warn('You are probably using a more recent version of confiugration.');
        logger.warn(`Please be noted that it may not work in the previous versions of ${projectName}.`);
        return false;
    }
    return true;
}

function validateConfigType(config, specTypes) {
    specTypes = is.array(specTypes) ? specTypes : [specTypes];
    for (let specType of specTypes) {
        if (is[specType](config)) {
            return specType;
        }
    }
    logger.error(`Config ${toPlainObject(config, 2)} do not match types ${specTypes}`);
    return null;
}

const INVALID_SPEC = Symbol();
const MISSING_REQUIRED = Symbol();
const INVALID_TYPE = Symbol();

function validateConfigAndWarn(config, spec, parentConfig, configPath = []) {
    const result = validateConfig(config, spec, parentConfig, configPath);
    if (result !== true) {
        const pathString = configPath.join('.');
        const specTypes = is.array(spec[type]) ? spec[type] : [spec[type]];
        switch(result) {
            case INVALID_SPEC:
                logger.error(`Invalid specification! The specification '${pathString}' does not have a [type] field:`);
                logger.error('The specification of this configuration is:');
                logger.error(JSON.stringify(toPlainObject(spec, 2), null, 4));
                break;
            case MISSING_REQUIRED:
                logger.error(`Configuration '${pathString}' in required by the specification but is missing from the configuration!`);
                logger.error('The specification of this configuration is:');
                logger.error(JSON.stringify(toPlainObject(spec, 2), null, 4));
                break;
            case INVALID_TYPE:
                logger.error(`Type mismatch! Configuration '${pathString}' is not the '${specTypes.join(' or ')}' type.`);
                logger.error('The configuration value is:');
                logger.error(JSON.stringify(toPlainObject(config, 2), null, 4));
                logger.error('The specification of this configuration is:');
                logger.error(JSON.stringify(toPlainObject(spec, 2), null, 4));
                break;
        }
    }
    return result;
}

function validateConfig(config, spec, parentConfig = null, configPath = []) {
    if (!isValidSpec(spec)) {
        return INVALID_SPEC;
    }
    if (!checkPrecondition(spec, parentConfig)) {
        return true;
    }
    if (typeof(config) === 'undefined' || config === null) {
        if (spec[required] === true) {
            return MISSING_REQUIRED;
        }
        return true;
    }
    const configType = validateConfigType(config, spec[type]);
    if (configType === null) {
        return INVALID_TYPE;
    }
    if (configType === 'array' && spec.hasOwnProperty('*')) {
        for (let i = 0; i < config.length; i++) {
            if (!validateConfigAndWarn(config[i], spec['*'], config, configPath.concat(`[${i}]`))) {
                return false;
            }
        }
    } else if (configType === 'object') {
        for (let key in spec) {
            if (key === '*') {
                for (let configKey in config) {
                    if (!validateConfigAndWarn(config[configKey], spec['*'], config, configPath.concat(configKey))) {
                        return false;
                    }
                }
            } else {
                if (!validateConfigAndWarn(config[key], spec[key], config, configPath.concat(key))) {
                    return false;
                }
            }
        }
    }
    return true;
}

logger.info('Checking if the configuration file exists...');

if (!fs.existsSync(CONFIG_PATH)) {
    const relativePath = path.relative(process.cwd(), CONFIG_PATH);
    logger.warn(`${relativePath} is not found. We are creating one for you...`);
    dumpConfig(createDefaultConfig(rootSpec), CONFIG_PATH);
    logger.info(`${relativePath} is created. Please restart Hexo to apply changes.`);
    process.exit(0);
}

logger.info('Validating the configuration file...');
const config = yaml.safeLoad(fs.readFileSync(CONFIG_PATH));
if (!validateConfigVersion(config, rootSpec)) {
    logger.info(`To let ${projectName} create a fresh configuration file for you, please delete or rename the following file:`);
    logger.info(CONFIG_PATH);
} else {
    validateConfigAndWarn(config, rootSpec);
}
