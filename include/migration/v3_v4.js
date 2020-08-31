const Migration = require('hexo-component-inferno/lib/core/migrate').Migration;

module.exports = class extends Migration {
    constructor() {
        super('4.0.0', null);
    }

    upgrade(config) {
        if (typeof config.article === 'object') {
            delete config.article.thumbnail;
        }
        return config;
    }
};
