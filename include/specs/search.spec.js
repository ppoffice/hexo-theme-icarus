const { doc, type, defaultValue, required, requires } = require('../common/utils').descriptors;

module.exports = {
    [type]: 'object',
    [doc]: 'Search plugin settings\nhttps://ppoffice.github.io/hexo-theme-icarus/categories/Plugins/Search',
    type: {
        [type]: 'string',
        [doc]: 'Name of the search plugin',
        [defaultValue]: 'insight'
    },
    cx: {
        [type]: 'string',
        [doc]: 'Google CSE cx value',
        [required]: true,
        [requires]: search => search.type === 'google-cse'
    }
};