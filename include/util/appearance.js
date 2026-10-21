const APPEARANCES = ['light', 'auto', 'dark'];

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

module.exports = { getAppearance };
