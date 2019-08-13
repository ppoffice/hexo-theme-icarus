const { doc, type, defaultValue } = require('../common/utils').descriptors;

module.exports = {
    [type]: 'object',
    [doc]: 'Article display settings',
    highlight: {
        [type]: 'object',
        [doc]: 'Code highlight settings',
        theme: {
            [type]: 'string',
            [doc]: 'Code highlight themes\nhttps://github.com/highlightjs/highlight.js/tree/master/src/styles',
            [defaultValue]: 'atom-one-light'
        },
        clipboard: {
            [type]: 'boolean',
            [doc]: 'Show code copying button',
            [defaultValue]: true
        },
        fold: {
            [type]: 'string',
            [doc]: 'Default folding status of the code blocks. Can be "", "folded", "unfolded"',
            [defaultValue]: 'unfolded'
        }
    },
    thumbnail: {
        [type]: 'boolean',
        [doc]: 'Whether to show article thumbnail images',
        [defaultValue]: true
    },
    readtime: {
        [type]: 'boolean',
        [doc]: 'Whether to show estimate article reading time',
        [defaultValue]: true
    }
};