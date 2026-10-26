const Migration = require('hexo-component-inferno/lib/core/migrate').Migration;

// Options that hexo-component-inferno 5 renames or no longer reads.
const RENAMED_CDN_OVERRIDES = {
    justifiedGallery: 'justified-gallery',
    gitalk: '@aifire/gitalk'
};
const REMOVED_CDN_OVERRIDES = ['pjax', 'outdatedbrowser'];
const REMOVED_GITALK_OPTIONS = ['client_secret', 'flip_move_options'];

function isObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

module.exports = class extends Migration {
    constructor() {
        super('7.0.0', require('./v5_v5.1'));
    }

    upgrade(config) {
        // The theme ignores "blog", which is not an Open Graph type, and the Google+ link.
        const openGraph = isObject(config.head) ? config.head.open_graph : null;
        if (isObject(openGraph)) {
            if (openGraph.type === 'blog') {
                delete openGraph.type;
            }
            delete openGraph.google_plus;
        }

        const overrides = isObject(config.providers) ? config.providers.cdn_overrides : null;
        if (isObject(overrides)) {
            for (const [oldName, newName] of Object.entries(RENAMED_CDN_OVERRIDES)) {
                if (oldName in overrides) {
                    if (!(newName in overrides)) {
                        overrides[newName] = overrides[oldName];
                    }
                    delete overrides[oldName];
                }
            }
            REMOVED_CDN_OVERRIDES.forEach(name => delete overrides[name]);
        }

        // Gitalk 2 keeps the client secret on the proxy.
        if (isObject(config.comment) && config.comment.type === 'gitalk') {
            REMOVED_GITALK_OPTIONS.forEach(name => delete config.comment[name]);
        }

        // The profile widget no longer falls back to the avatar of the theme.
        if (Array.isArray(config.widgets)) {
            for (const widget of config.widgets) {
                if (isObject(widget) && widget.type === 'profile' && !widget.avatar && !widget.gravatar) {
                    widget.avatar = '/img/avatar.png';
                }
            }
        }
        return config;
    }
};
