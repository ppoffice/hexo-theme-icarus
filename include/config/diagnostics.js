const util = require('util');
const { yellow } = require('../util/console');

// Return warnings in display order without logging, touching files or changing the configuration.
function diagnoseThemeConfig(cfg, schema) {
    const warnings = [];
    const validation = schema.validate(cfg);
    if (validation !== true) {
        warnings.push('Theme configurations failed one or more checks.',
            'Icarus may still run, but you will encounter unexpected results.',
            'Here is some information for you to correct the configuration file.',
            util.inspect(validation));
    }

    if (cfg.comment && cfg.comment.type === 'valine') {
        // The component's deprecation warning covers alternatives and the LeanCloud shutdown.
        const leaked = cfg.comment.record_ip === true ? 'email and IP addresses' : 'email addresses';
        warnings.push(`Valine exposes commenters' ${leaked} to anyone with the site's public LeanCloud keys. See ${yellow('https://github.com/ppoffice/hexo-theme-icarus/issues/788')}.`);
    }

    const walinePageview = cfg.plugins && typeof cfg.plugins === 'object' ? cfg.plugins.waline_pageview : null;
    if (walinePageview) {
        const waline = cfg.comment && cfg.comment.type === 'waline' ? cfg.comment : null;
        if (waline && waline.pageview) {
            warnings.push('Both the waline_pageview plugin and the pageview option of the Waline comments count page views, so each view is counted twice.',
                `Please set ${yellow('comment.pageview')} to false, or disable ${yellow('plugins.waline_pageview')}.`);
        }
        if (!(typeof walinePageview === 'object' && walinePageview.server_url) && !(waline && waline.server_url)) {
            warnings.push('The waline_pageview plugin is enabled, but has no Waline server to count the page views.',
                `Please set ${yellow('plugins.waline_pageview.server_url')}, or the ${yellow('server_url')} of the Waline comments.`);
        }
    }

    // Configurations generated before component 4.2.0 have type: blog, which the theme ignores.
    const openGraph = cfg.head && typeof cfg.head === 'object' ? cfg.head.open_graph : null;
    if (openGraph && typeof openGraph === 'object' && openGraph.type === 'blog') {
        warnings.push(`${yellow('head.open_graph.type')} is "blog", which is not an Open Graph type and is ignored. Please remove it.`);
    }
    return warnings;
}

function diagnoseSiteConfig(rootCfg, siteCfgFile) {
    return rootCfg.theme_config ? [
        `"theme_config" found in ${yellow(siteCfgFile)}.`,
        `Please remove theme configurations from ${yellow(siteCfgFile)}.`
    ] : [];
}

module.exports = { diagnoseThemeConfig, diagnoseSiteConfig };
