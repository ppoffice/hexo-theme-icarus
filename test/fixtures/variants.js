/**
 * Fixture site variants. Each entry is merged on top of test/fixtures/site:
 *   site:  overrides for the Hexo _config.yml
 *   theme: overrides for _config.icarus.yml (arrays replace, objects merge);
 *          `false` removes the file so the theme generates its default configuration
 *   files: extra files to write, keyed by path relative to the site root
 */
module.exports = {
    // The base fixture as-is.
    'default': {},

    // No theme configuration at all: the theme must generate one and build with it.
    'generated-config': {
        theme: false
    },

    'cyberpunk': {
        theme: { variant: 'cyberpunk' }
    },

    'pjax': {
        theme: { plugins: { pjax: true } }
    },

    'animejs': {
        theme: { plugins: { animejs: true } }
    },

    'zh-CN': {
        site: { language: 'zh-CN' }
    },

    'vi': {
        site: { language: 'vi' }
    },

    // The table of contents is the only widget of the right column.
    'toc-only-right': {
        theme: {
            widgets: [
                { position: 'left', type: 'profile', author: 'Fixture Author' },
                { position: 'right', type: 'toc', index: true, collapsed: false, depth: 3 }
            ]
        }
    },

    'one-column': {
        theme: { widgets: [] }
    }
};
