const { doc, type, defaultValue, required, requires } = require('../common/utils').descriptors;

module.exports = {
    [type]: 'object',
    [doc]: 'Other plugin settings',
    gallery: {
        [type]: 'boolean',
        [doc]: 'Enable the lightGallery and Justified Gallery plugins',
        [defaultValue]: true
    },
    'outdated-browser': {
        [type]: 'boolean',
        [doc]: 'Enable the Outdated Browser plugin',
        [defaultValue]: true
    },
    animejs: {
        [type]: 'boolean',
        [doc]: 'Enable page animations',
        [defaultValue]: true
    },
    mathjax: {
        [type]: 'boolean',
        [doc]: 'Enable the MathJax plugin',
        [defaultValue]: true
    },
    'google-analytics': {
        [type]: ['boolean', 'object'],
        [doc]: 'Google Analytics plugin settings (http://ppoffice.github.io/hexo-theme-icarus/2018/01/01/plugin/Analytics/#Google-Analytics)',
        tracking_id: {
            [type]: 'string',
            [doc]: 'Google Analytics tracking id',
            [defaultValue]: null
        }
    },
    'baidu-analytics': {
        [type]: ['boolean', 'object'],
        [doc]: 'Baidu Analytics plugin settings (http://ppoffice.github.io/hexo-theme-icarus/2018/01/01/plugin/Analytics/#Baidu-Analytics)',
        tracking_id: {
            [type]: 'string',
            [doc]: 'Baidu Analytics tracking id',
            [defaultValue]: null
        }
    }
};