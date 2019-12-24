const createPostSchema = require('hexo/lib/models/post');
const createPageSchema = require('hexo/lib/models/page');

module.exports = hexo => {
    const RESERVED_KEYS = {
        post: Object.keys(createPostSchema(hexo).paths),
        page: Object.keys(createPageSchema(hexo).paths)
    };

    function getExtraConfig(source, reservedKeys) {
        const result = {};
        for (const key in source) {
            if (!key.startsWith('_') && !reservedKeys.includes(key) && typeof source[key] !== 'function') {
                result[key] = source[key];
            }
        }
        return result;
    }

    hexo.extend.filter.register('template_locals', locals => {
        // inject helper functions
        locals.helper = {};
        const helpers = hexo.extend.helper.list();
        for (const name in helpers) {
            locals.helper[name] = helpers[name].bind(locals);
        }
        if (typeof locals.__ === 'function') {
            locals.helper.__ = locals.__;
        }
        if (typeof locals._p === 'function') {
            locals.helper._p = locals._p;
        }

        // site config already merged into theme config in hexo/lib/hexo/index.js#Hexo.prototype._generateLocals()
        locals.config = Object.assign({}, Object.getPrototypeOf(locals).theme);
        // merge page configs
        if (locals.page.__post === true) {
            Object.assign(locals.config, getExtraConfig(locals.page, RESERVED_KEYS.page));
        } else if (locals.page.__page === true) {
            Object.assign(locals.config, getExtraConfig(locals.page, RESERVED_KEYS.page));
        }

        return locals;
    });
};
