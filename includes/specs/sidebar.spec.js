const { doc, type, defaultValue, required, requires, format } = require('../common/utils').descriptors;

module.exports = {
    [type]: 'object',
    [doc]: 'Sidebar settings.\nPlease be noted that a sidebar is only visible when it has at least one widget',
    left: {
        [type]: 'object',
        [doc]: 'left sidebar settings',
        sticky: {
            [type]: 'boolean',
            [doc]: 'Whether the left sidebar is sticky when page scrolls\nhttps://ppoffice.github.io/hexo-theme-icarus/Configuration/Theme/make-a-sidebar-sticky-when-page-scrolls/',
            [defaultValue]: false
        },
        sticky_page_only: {
            [type]: 'boolean',
            [doc]: 'Sticky only in pages, not posts',
            [defaultValue]: false
        },
        hide_in_post: {
            [type]: 'boolean',
            [doc]: 'Hide the left sidebar in posts (not pages)',
            [defaultValue]: false
        },
        shadow_right: {
            [type]: 'boolean',
            [doc]: 'When the viewport size is not wide enough, move right sidebar to the bottom of left.\nIf false, right sidebar will simply be hidden.',
            [defaultValue]: true
        },
    },
    right: {
        [type]: 'object',
        [doc]: 'right sidebar settings',
        sticky: {
            [type]: 'boolean',
            [doc]: 'Whether the right sidebar is sticky when page scrolls\nhttps://ppoffice.github.io/hexo-theme-icarus/Configuration/Theme/make-a-sidebar-sticky-when-page-scrolls/',
            [defaultValue]: false
        },
        sticky_page_only: {
            [type]: 'boolean',
            [doc]: 'Sticky only in pages, not posts',
            [defaultValue]: false
        },
        hide_in_post: {
            [type]: 'boolean',
            [doc]: 'Hide the right sidebar in posts (not pages)',
            [defaultValue]: false
        }
    }
};