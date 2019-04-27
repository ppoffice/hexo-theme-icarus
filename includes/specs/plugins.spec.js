const { doc, type, defaultValue } = require('../common/utils').descriptors;

module.exports = {
    [type]: 'object',
    [doc]: 'Other plugin settings',
    animejs: {
        [type]: 'boolean',
        [doc]: 'Enable page animations',
        [defaultValue]: true
    },
    gallery: {
        [type]: 'boolean',
        [doc]: 'Enable the lightGallery and Justified Gallery plugins\nhttps://ppoffice.github.io/hexo-theme-icarus/Plugins/General/gallery-plugin/',
        [defaultValue]: true
    },
    'outdated-browser': {
        [type]: 'boolean',
        [doc]: 'Enable the Outdated Browser plugin\nhttp://outdatedbrowser.com/',
        [defaultValue]: true
    },
    mathjax: {
        [type]: 'boolean',
        [doc]: 'Enable the MathJax plugin\nhttps://ppoffice.github.io/hexo-theme-icarus/Plugins/General/mathjax-plugin/',
        [defaultValue]: true
    },
    'back-to-top': {
        [type]: 'boolean',
        [doc]: 'Show the back to top button on mobile devices',
        [defaultValue]: true
    },
    'google-analytics': {
        [type]: ['boolean', 'object'],
        [doc]: 'Google Analytics plugin settings\nhttps://ppoffice.github.io/hexo-theme-icarus/Plugins/General/site-analytics-plugin/#Google-Analytics',
        tracking_id: {
            [type]: 'string',
            [doc]: 'Google Analytics tracking id',
            [defaultValue]: null
        }
    },
    'baidu-analytics': {
        [type]: ['boolean', 'object'],
        [doc]: 'Baidu Analytics plugin settings\nhttps://ppoffice.github.io/hexo-theme-icarus/Plugins/General/site-analytics-plugin/#Baidu-Analytics',
        tracking_id: {
            [type]: 'string',
            [doc]: 'Baidu Analytics tracking id',
            [defaultValue]: null
        }
    },
    hotjar: {
        [type]: ['boolean', 'object'],
        [doc]: 'Hotjar user feedback plugin\nhttps://ppoffice.github.io/hexo-theme-icarus/Plugins/General/site-analytics-plugin/#Hotjar',
        site_id: {
            [type]: ['string', 'number'],
            [doc]: 'Hotjar site id',
            [defaultValue]: null
        }
    },
    progressbar: {
        [type]: 'boolean',
        [doc]: 'Show a loading progress bar at top of the page',
        [defaultValue]: true
    },
    clipboard: {
        [type]: 'boolean',
        [doc]: 'Show the copy button in the highlighted code area',
        [defaultValue]: true
    },
    busuanzi: {
        [type]: 'boolean',
        [doc]: 'BuSuanZi site/page view counter\nhttps://busuanzi.ibruce.info',
        [defaultValue]: false
    }
};