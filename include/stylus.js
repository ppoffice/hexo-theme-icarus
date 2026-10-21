const path = require('path');
const { getAppearance } = require('./util/appearance');

/**
 * Give the stylesheets what they need from outside of include/style/:
 * - bulma-stylus-root: where the installed bulma-stylus package is, wherever the package manager
 *   put it (npm, yarn, pnpm, workspaces), instead of assuming that it sits in the node_modules
 *   folder four levels above include/style/ (see bulma-stylus-root in include/style/base.styl).
 * - icarus-appearance: the `appearance` setting, which decides whether source/css/default.styl
 *   emits the dark colors of include/style/dark.styl, and how.
 *
 * @param {Object} hexo Hexo instance
 */
module.exports = hexo => {
    const bulmaStylusRoot = path.join(path.dirname(require.resolve('bulma-stylus/package.json')), 'stylus');
    hexo.extend.filter.register('stylus:renderer', style => {
        style.define('bulma-stylus-root', bulmaStylusRoot);
        // Read when the stylesheets are rendered, once Hexo has merged _config.icarus.yml in.
        style.define('icarus-appearance', getAppearance(hexo.theme && hexo.theme.config));
    });
};
