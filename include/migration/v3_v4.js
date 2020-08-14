const Migration = require('hexo-component-inferno/lib/core/migrate').Migration;

module.exports = class extends Migration {
    constructor() {
        super('4.0.0', null);
    }

    upgrade(config) {
        return config;
    }
};
