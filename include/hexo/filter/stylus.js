/**
 * Add resolved variables to the theme config for stylus.
 */
module.exports = function (hexo) {
    hexo.extend.filter.register('template_locals', locals => {
        const fontcdn = hexo.extend.helper.get('fontcdn').bind(hexo);
        hexo.theme.config['@fontface'] = {
            default: fontcdn('Ubuntu:wght@400;600&family=Source+Code+Pro', 'css2'),
            cyberpunk: fontcdn('Oxanium:wght@300;400;600&family=Roboto+Mono', 'css2')
        };
        return locals;
    });
};
