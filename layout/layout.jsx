const { Component } = require('inferno');
const classname = require('hexo-component-inferno/lib/util/classname');
const { getAppearance } = require('../include/util/appearance');
const Head = require('./common/head');
const Navbar = require('./common/navbar');
const Widgets = require('./common/widgets');
const Footer = require('./common/footer');
const Scripts = require('./common/scripts');
const Search = require('./common/search');
const OutdatedBrowser = require('./plugin/outdated_browser');

/**
 * BCP 47 language tag for <html lang>, keeping the region (zh-CN, pt-BR).
 */
function getLanguageTag(language) {
    const lang = Array.isArray(language) ? language[0] : language;
    return typeof lang === 'string' ? lang.replace(/_/g, '-') : '';
}

module.exports = class extends Component {
    render() {
        const { site, config, page, helper, body } = this.props;

        const language = page.lang || page.language || config.language;
        const columnCount = Widgets.getColumnCount(config.widgets, config, page);
        // Selects the dark colors of css/default.css (include/style/dark.styl)
        const appearance = getAppearance(config);

        return <html lang={getLanguageTag(language)} data-appearance-mode={appearance} data-appearance={appearance === 'light' ? null : appearance}>
            <Head site={site} config={config} helper={helper} page={page} />
            <body class={`is-${columnCount}-column`}>
                <div id="browser-notice" data-pjax>
                    {config.plugins && config.plugins.outdated_browser
                        ? <OutdatedBrowser site={site} config={config} page={page} helper={helper} plugin={config.plugins.outdated_browser} head={false} />
                        : null}
                </div>
                <Navbar config={config} helper={helper} page={page} />
                <section class="section">
                    <div class="container">
                        <div class="columns">
                            <div class={classname({
                                column: true,
                                'order-2': true,
                                'column-main': true,
                                'is-12': columnCount === 1,
                                'is-8-tablet is-8-desktop is-8-widescreen': columnCount === 2,
                                'is-8-tablet is-8-desktop is-6-widescreen': columnCount === 3
                            })} dangerouslySetInnerHTML={{ __html: body }}></div>
                            <Widgets site={site} config={config} helper={helper} page={page} position={'left'} />
                            <Widgets site={site} config={config} helper={helper} page={page} position={'right'} />
                        </div>
                    </div>
                </section>
                <Footer config={config} helper={helper} />
                <Scripts site={site} config={config} helper={helper} page={page} />
                <Search config={config} helper={helper} />
            </body>
        </html>;
    }
};
