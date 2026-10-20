const Migration = require('hexo-component-inferno/lib/core/migrate').Migration;

module.exports = class extends Migration {
    constructor() {
        super('5.0.0', require('./v3_v4'));
    }

    upgrade(config) {
        return config;
    }
};
