/**
* Meta Helper
* @description Generate meta tags for HTML header
* @example
*     <%- meta(post) %>
*/
function trim (str) {
    return str.trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
}

function split (str, sep) {
    var result = [];
    var matched = null;
    while (matched = sep.exec(str)) {
        result.push(matched[0]);
    }
    return result;
}

hexo.extend.helper.register('meta', function (post) {
    var metas = post.meta || [];
    var output = '';
    var metaDOMArray = metas.map(function (meta) {
        var entities = split(meta, /(?:[^\\;]+|\\.)+/g);
        var entityArray = entities.map(function (entity) {
            var keyValue = split(entity, /(?:[^\\=]+|\\.)+/g);
            if (keyValue.length < 2) {
                return null;
            }
            var key = trim(keyValue[0]);
            var value = trim(keyValue[1]);
            return key + '="' + value + '"';
        }).filter(function (entity) {
            return entity;
        });
        return '<meta ' + entityArray.join(' ') + ' />';
    });
    return metaDOMArray.join('\n');
});