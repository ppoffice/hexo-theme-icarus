const path = require('path');

/**
 * Tell the stylesheets where the installed bulma-stylus package is, wherever the package manager
 * put it (npm, yarn, pnpm, workspaces), instead of assuming that it sits in the node_modules
 * folder four levels above include/style/ (see bulma-stylus-root in include/style/base.styl).
 *
 * @param {Object} hexo Hexo instance
 */
module.exports = hexo => {
    const bulmaStylusRoot = path.join(path.dirname(require.resolve('bulma-stylus/package.json')), 'stylus');
    hexo.extend.filter.register('stylus:renderer', style => {
        style.define('bulma-stylus-root', bulmaStylusRoot);
    });
};
