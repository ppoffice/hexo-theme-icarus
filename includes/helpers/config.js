/**
 * Theme configuration helpers.
 * 
 * @description Test if a configuration is set or fetch its value. If `exclude_page` is set, the helpers will
 *              not look up configurations in the current page's front matter.
 * @example
 *     <%- has_config(config_name, exclude_page) %>
 *     <%- get_config(config_name, default_value, exclude_page) %>
 */
module.exports = function (hexo) {
    function readProperty(object, path) {
        const paths = path.split('.');
        for (let path of paths) {
            if (typeof (object) === 'undefined' || object === null || !object.hasOwnProperty(path)) {
                return null;
            }
            object = object[path];
        }
        return object;
    }

    hexo.extend.helper.register('get_config', function (configName, defaultValue = null, excludePage = false) {
        const value = readProperty(Object.assign({}, this.config, hexo.theme.config,
            !excludePage ? this.page : {}), configName);
        return value == null ? defaultValue : value;
    });

    hexo.extend.helper.register('has_config', function (configName, excludePage = false) {
        const readProperty = hexo.extend.helper.get('get_config').bind(this);
        return readProperty(configName, null, excludePage) != null;
    });

    hexo.extend.helper.register('get_config_from_obj', function (object, configName, defaultValue = null) {
        const value = readProperty(object, configName);
        return value == null ? defaultValue : value;
    });
}