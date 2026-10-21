const APPEARANCES = ['light', 'auto', 'dark'];

// The logo shipped with the theme (the schema default) and its version for dark backgrounds
const DEFAULT_LOGO = require('../schema/config.json').properties.logo.default;
const DEFAULT_DARK_LOGO = '/img/logo-dark.svg';

/**
 * The appearance of a page, from the `appearance` setting of its configuration (the theme
 * configuration, overridden by layout configuration files and the front-matter): "light" (the
 * default, also for values that are not valid), "auto" (follow the color scheme of the system)
 * or "dark". Always "light" for the cyberpunk variant, which has its own dark colors.
 *
 * @param {Object} config Configuration of the page
 * @returns {string}
 */
function getAppearance(config) {
    const { variant = 'default', appearance } = config || {};
    return variant === 'default' && APPEARANCES.includes(appearance) ? appearance : 'light';
}

/**
 * The logo image to show when the default variant looks dark: `logo_dark`, or the theme's dark
 * logo while `logo` is the theme's logo. Null when the logo does not change: light appearance,
 * cyberpunk variant, text logo, or a logo of the site without `logo_dark`.
 *
 * @param {Object} config Configuration of the page
 * @returns {string|null} Path or URL of the dark logo
 */
function getDarkLogo(config) {
    const { logo, logo_dark: logoDark } = config || {};
    if (getAppearance(config) === 'light' || typeof logo !== 'string' || !logo) {
        return null;
    }
    if (typeof logoDark === 'string' && logoDark) {
        return logoDark;
    }
    return logo === DEFAULT_LOGO ? DEFAULT_DARK_LOGO : null;
}

module.exports = { getAppearance, getDarkLogo };
