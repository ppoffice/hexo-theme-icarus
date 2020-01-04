const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

module.exports = hexo => {
    const RESERVED_KEYS = {
        post: Object.keys(require('hexo/lib/models/post')(hexo).paths),
        page: Object.keys(require('hexo/lib/models/page')(hexo).paths)
    };

    function getThemeConfig(extension) {
        if (fs.existsSync(path.join(hexo.theme_dir, '_config' + extension + '.yml'))) {
            return yaml.safeLoad(fs.readFileSync(path.join(hexo.theme_dir, '_config' + extension + '.yml')));
        }
        return null;
    }

    const ALTERNATIVE_CONFIG = {
        post: getThemeConfig('.post'),
        page: getThemeConfig('.page')
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

        const page = locals.page;
        if (page) {
            if ((page.layout !== 'page' || page.layout !== 'post') && ALTERNATIVE_CONFIG[page.layout]) {
                // load alternative config if exists
                locals.config = Object.assign({}, Object.getPrototypeOf(locals).theme || locals.theme, ALTERNATIVE_CONFIG[page.layout]);
            } else {
                // site config already merged into theme config in hexo/lib/hexo/index.js#Hexo.prototype._generateLocals()
                locals.config = Object.assign({}, Object.getPrototypeOf(locals).theme || locals.theme);
            }
            // merge page configs
            if (page.__post === true) {
                Object.assign(locals.config, getExtraConfig(page, RESERVED_KEYS.page));
            } else if (page.__page === true) {
                Object.assign(locals.config, getExtraConfig(page, RESERVED_KEYS.page));
            }
        }

        return locals;
    });
};
