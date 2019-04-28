const { doc, type, defaultValue, required, requires, format } = require('../common/utils').descriptors;

function commonSettings(position) {
    return {
        [type]: 'object',
        [doc]: position + ' sidebar settings',
        sticky: {
            [type]: 'boolean',
            [doc]: 'Whether the ' + position + ' sidebar is sticky when page scrolls\nhttps://ppoffice.github.io/hexo-theme-icarus/Configuration/Theme/make-a-sidebar-sticky-when-page-scrolls/',
            [defaultValue]: false
        }
    }
}

module.exports = {
    [type]: 'object',
    [doc]: 'Sidebar settings.\nPlease be noted that a sidebar is only visible when it has at least one widget',
    left: commonSettings('left'),
    right: commonSettings('right')
}