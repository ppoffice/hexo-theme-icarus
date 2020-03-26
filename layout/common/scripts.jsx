const { Component, Fragment } = require('inferno');
const Plugins = require('./plugins');

module.exports = class extends Component {
    render() {
        const { site, config, helper, page } = this.props;
        const { url_for, cdn } = helper;
        const { external_link, article } = config;
        const language = page.lang || page.language || config.language || 'en';

        let externalLink;
        if (typeof external_link === 'boolean') {
            externalLink = { enable: external_link, exclude: [] };
        } else {
            externalLink = {
                enable: typeof external_link.enable === 'boolean' ? external_link.enable : true,
                exclude: external_link.exclude || []
            };
        }

        let fold = 'unfolded';
        let clipboard = true;
        if (article && article.highlight) {
            if (typeof article.highlight.clipboard !== 'undefined') {
                clipboard = !!article.highlight.clipboard;
            }
            if (typeof article.highlight.fold === 'string') {
                fold = article.highlight.fold;
            }
        }

        const embeddedConfig = `var IcarusThemeSettings = {
            site: {
                url: '${config.url}',
                external_link: ${JSON.stringify(externalLink)}
            },
            article: {
                highlight: {
                    clipboard: ${clipboard},
                    fold: '${fold}'
                }
            }
        };`;

        return <Fragment>
            <script src={cdn('jquery', '3.3.1', 'dist/jquery.min.js')}></script>
            <script src={cdn('moment', '2.22.2', 'min/moment-with-locales.min.js')}></script>
            <script dangerouslySetInnerHTML={{ __html: `moment.locale("${language}");` }}></script>
            <script dangerouslySetInnerHTML={{ __html: embeddedConfig }}></script>
            {clipboard ? <script src={cdn('clipboard', '2.0.4', 'dist/clipboard.min.js')} defer={true}></script> : null}
            <Plugins site={site} config={config} page={page} helper={helper} head={false} />
            <script src={url_for('/js/main.js')} defer={true}></script>
        </Fragment>;
    }
};
