/**
 * CDN static file resolvers.
 *
 * @example
 *     <%- cdn(package, version, filename) %>
 *     <%- fontcdn(fontName) %>
 *     <%- iconcdn() %>
 */
const cdn_providers = {
    cdnjs: 'https://cdnjs.cloudflare.com/ajax/libs/${ package }/${ version }/${ filename }',
    jsdelivr: 'https://cdn.jsdelivr.net/npm/${ package }@${ version }/${ filename }',
    jsdelivr_github: 'https://cdn.jsdelivr.net/gh/user/${ package }@${ version }/${ filename }',
    unpkg: 'https://unpkg.com/${ package }@${ version }/${ filename }'
};

const font_providers = {
    google: 'https://fonts.googleapis.com/css?family=${ fontname }'
};

const icon_providers = {
    fontawesome: 'https://use.fontawesome.com/releases/v5.4.1/css/all.css',
    material: 'https://fonts.googleapis.com/icon?family=Material+Icons'
};

module.exports = function (hexo) {
    hexo.extend.helper.register('cdn', function (package, version, filename) {
        let provider = hexo.extend.helper.get('get_config').bind(this)('providers.cdn');
        if (provider !== null && cdn_providers.hasOwnProperty(provider)) {
            provider = cdn_providers[provider];
        }
        return provider.replace(/\${\s*package\s*}/gi, package)
            .replace(/\${\s*version\s*}/gi, version)
            .replace(/\${\s*filename\s*}/gi, filename);
    });

    hexo.extend.helper.register('fontcdn', function (fontName) {
        let provider = hexo.extend.helper.get('get_config').bind(this)('providers.fontcdn');
        if (provider !== null && font_providers.hasOwnProperty(provider)) {
            provider = font_providers[provider];
        }
        return provider.replace(/\${\s*fontname\s*}/gi, fontName);
    });

    hexo.extend.helper.register('iconcdn', function (provider = null) {
        if (provider !== null && icon_providers.hasOwnProperty(provider)) {
            provider = icon_providers[provider];
        } else {
            provider = hexo.extend.helper.get('get_config').bind(this)('providers.iconcdn');
            if (provider !== null && icon_providers.hasOwnProperty(provider)) {
                provider = icon_providers[provider];
            }
        }
        return provider;
    });
}