const APPEARANCES = ['light', 'auto', 'dark'];

// The logo shipped with the theme (the schema default) and its version for dark backgrounds
const DEFAULT_LOGO = require('../schema/config.json').properties.logo.default;
const DEFAULT_DARK_LOGO = '/img/logo-dark.svg';

/**
 * The `appearance` setting of the theme configuration: "light" (the default, also for values
 * that are not valid), "auto" (follow the color scheme of the system) or "dark".
 *
 * @param {Object} config Theme configuration
 * @returns {string}
 */
function getAppearance(config) {
    const appearance = config && config.appearance;
    return APPEARANCES.includes(appearance) ? appearance : 'light';
}

/**
 * The logo image to show when the default variant looks dark: `logo_dark`, or the theme's dark
 * logo while `logo` is the theme's logo. Null when the logo does not change: light appearance,
 * cyberpunk variant, text logo, or a logo of the site without `logo_dark`.
 *
 * @param {Object} config Theme configuration
 * @returns {string|null} Path or URL of the dark logo
 */
function getDarkLogo(config) {
    const { variant = 'default', logo, logo_dark: logoDark } = config || {};
    if (variant !== 'default' || getAppearance(config) === 'light' || typeof logo !== 'string' || !logo) {
        return null;
    }
    if (typeof logoDark === 'string' && logoDark) {
        return logoDark;
    }
    return logo === DEFAULT_LOGO ? DEFAULT_DARK_LOGO : null;
}

module.exports = { getAppearance, getDarkLogo };
