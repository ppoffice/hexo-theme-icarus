const fs = require('fs');
const path = require('path');

/**
 * Hexo looks translations up in this order: the page language, the configured languages,
 * 'default', then every loaded language file in whatever order Hexo processed them.
 * Icarus ships no languages/default.yml, so a site whose language has no translation file
 * got the text of a random language (often German). Use English as the default instead,
 * unless the theme provides its own languages/default.yml.
 *
 * @param {Object} i18n Hexo theme i18n instance (hexo.theme.i18n)
 * @param {string} themeDir Theme directory
 */
function applyDefaultLanguage(i18n, themeDir) {
    if (fs.existsSync(path.join(themeDir, 'languages', 'default.yml'))) {
        return;
    }
    const english = i18n.get('en');
    if (Object.keys(english).length) {
        i18n.set('default', english);
    }
}

module.exports = hexo => {
    hexo.extend.filter.register('before_generate', () => {
        applyDefaultLanguage(hexo.theme.i18n, hexo.theme_dir);
    });
};

module.exports.applyDefaultLanguage = applyDefaultLanguage;
