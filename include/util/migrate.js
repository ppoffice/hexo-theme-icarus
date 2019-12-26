const path = require('path');
const logger = require('hexo-log')();

class Version {
    constructor(version) {
        const ver = version.split('.').map(i => parseInt(i, 10));
        if (ver.length !== 3) {
            throw new Error('Malformed version number ' + version);
        }
        this.major = ver[0];
        this.minor = ver[1];
        this.patch = ver[2];
    }

    toString() {
        return `${this.major}.${this.minor}.${this.patch}`;
    }
}

Version.compare = function(a, b) {
    if (!(a instanceof Version) || !(b instanceof Version)) {
        throw new Error('Cannot compare non-Versions');
    }
    if (a.major !== b.major) {
        return a.major - b.major;
    }
    if (a.minor !== b.minor) {
        return a.minor - b.minor;
    }
    if (a.patch !== b.patch) {
        return a.patch - b.patch;
    }
    return 0;
};

class Migration {

    /**
     * @param {string} version Target version
     * @param {string} head File name of the previous migration
     */
    constructor(version, head) {
        this.version = new Version(version);
        this.head = head;
    }

    doMigrate(config) {
        throw new Error('Not implemented!');
    }

    migrate(config) {
        logger.info(`Updating configurations from ${config.version} to ${this.version.toString()}...`);
        const result = this.doMigrate(config);
        result.version = this.version.toString();
        return result;
    }
}


class Migrator {
    constructor(root) {
        this.versions = [];
        this.migrations = {};

        let head = 'head';
        while (head) {
            const migration = new(require(path.join(root, head)))();
            if (!(migration instanceof Migration)) {
                throw new Error(`Migration ${head} is not a Migration class.`);
            }
            this.versions.push(migration.version);
            this.migrations[migration.version.toString()] = migration;
            head = migration.head;
        }

        this.versions.sort(Version.compare);
    }

    isOudated(version) {
        if (!this.versions.length) {
            return false;
        }
        return Version.compare(new Version(version), this.getLatestVersion()) < 0;
    }

    getLatestVersion() {
        if (!this.versions.length) {
            return null;
        }
        return this.versions[this.versions.length - 1];
    }

    migrate(config, toVersion = null) {
        const fVer = new Version(config.version);
        const tVer = toVersion ? new Version(toVersion) : this.getLatestVersion();
        // find all migrations whose version is larger than fromVer, smaller or equal to toVer
        // and run migrations on the config one by one
        return this.versions.filter(ver => Version.compare(ver, fVer) > 0 && Version.compare(ver, tVer) <= 0)
            .sort(Version.compare)
            .reduce((cfg, ver) => {
                const migration = this.migrations[ver.toString()];
                return migration.migrate(cfg);
            }, config);
    }
}

Migrator.Version = Version;
Migrator.Migration = Migration;

module.exports = Migrator;
