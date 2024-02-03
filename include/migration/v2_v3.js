const createLogger = require('hexo-log');
const deepmerge = require('deepmerge');
const Migration = require('hexo-component-inferno/lib/core/migrate').Migration;

const logger = createLogger.default();

module.exports = class extends Migration {
    constructor() {
        super('3.0.0', null);
    }

    upgrade(config) {
        const result = deepmerge({}, config);
        result.head = {
            favicon: config.favicon || null,
            canonical_url: config.canonical_url || null,
            open_graph: config.open_graph || null,
            meta: config.meta || null,
            rss: config.rss || null
        };
        delete result.favicon;
        delete result.canonical_url;
        delete result.open_graph;
        delete result.meta;
        delete result.rss;

        if (result.logo === '/images/logo.svg') {
            result.logo = result.logo.replace(/^\/images/, '/img');
        }

        if (result.head.favicon === '/img/favicon.svg') {
            result.head.favicon = result.head.favicon.replace(/^\/images/, '/img');
        }

        if (result.search && Object.prototype.hasOwnProperty.call(result.search, 'type')) {
            switch (result.search.type) {
                case 'google-cse':
                    result.search.type = 'google_cse';
                    break;
            }
        }

        if (result.comment && Object.prototype.hasOwnProperty.call(result.comment, 'type')) {
            switch (result.comment.type) {
                case 'changyan':
                    result.comment.app_id = config.comment.appid;
                    delete result.comment.appid;
                    break;
            }
        }

        if (Array.isArray(result.donate) && result.donate.length) {
            result.donates = result.donate;
            delete result.donate;
        }

        if (Array.isArray(result.widgets) && result.widgets.length) {
            for (const widget of result.widgets) {
                if (Object.prototype.hasOwnProperty.call(widget, 'type')) {
                    switch (widget.type) {
                        case 'archive':
                            widget.type = 'archives';
                            break;
                        case 'category':
                            widget.type = 'categories';
                            break;
                        case 'tag':
                            widget.type = 'tags';
                            break;
                        case 'tagcloud':
                            logger.warn('The tagcloud widget has been removed from Icarus in version 3.0.0.');
                            logger.warn('Please remove it from your configuration file.');
                            break;
                    }
                }
            }
        }

        if (result.plugins && typeof result.plugins === 'object') {
            for (const name in result.plugins) {
                switch (name) {
                    case 'outdated-browser':
                        result.plugins.outdated_browser = result.plugins[name];
                        delete result.plugins[name];
                        break;
                    case 'back-to-top':
                        result.plugins.back_to_top = result.plugins[name];
                        delete result.plugins[name];
                        break;
                    case 'baidu-analytics':
                        result.plugins.baidu_analytics = result.plugins[name];
                        delete result.plugins[name];
                        break;
                    case 'google-analytics':
                        result.plugins.google_analytics = result.plugins[name];
                        delete result.plugins[name];
                        break;
                }
            }
        }

        return result;
    }
};
