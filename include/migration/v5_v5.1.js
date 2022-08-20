const Migration = require('hexo-component-inferno/lib/core/migrate').Migration;

module.exports = class extends Migration {
    constructor() {
        super('5.1.0', null);
    }

    upgrade(config) {
        // Upgrade Waline configurations from v1 to v2.
        const comment = config.comment || {};
        const renamedOptions = {
            'visitor': 'pageview',
            'uploadImage': 'image_uploader',
            'highlight': 'highlighter',
            'math': 'tex_renderer'
        };
        if (comment.type === 'waline') {
            for (const option in renamedOptions) {
                if (typeof comment[option] !== 'undefined') {
                    if (typeof comment[renamedOptions[option]] === 'undefined') {
                        comment[renamedOptions[option]] = comment[option];
                    }
                    delete comment[option];
                }
            }
        }
        return config;
    }
};
