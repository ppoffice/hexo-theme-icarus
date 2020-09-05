const { Component, Fragment } = require('inferno');
const Plugins = require('./plugins');

module.exports = class extends Component {
    render() {
        const { site, config, helper, page } = this.props;
        const { url_for, cdn } = helper;
        const { article } = config;
        const language = page.lang || page.language || config.language || 'en';

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
            article: {
                highlight: {
                    clipboard: ${clipboard},
                    fold: '${fold}'
                }
            }
        };`;

        let mermaidScript = '';
        let mermaidInit = '';
        if (config.mermaid.enable) {
            mermaidScript = <script src={cdn('mermaid', config.mermaid.version, 'mermaid.min.js')}></script>;
            mermaidInit = `if (window.mermaid) {
                mermaid.initialize({theme: 'forest'});
            }`;
        }

        return <Fragment>
            <script src={cdn('jquery', '3.3.1', 'dist/jquery.min.js')}></script>
            <script src={cdn('moment', '2.22.2', 'min/moment-with-locales.min.js')}></script>
            {mermaidScript}
            <script dangerouslySetInnerHTML={{ __html: `moment.locale("${language}");` }}></script>
            <script dangerouslySetInnerHTML={{ __html: embeddedConfig }}></script>
            <script dangerouslySetInnerHTML={{ __html: mermaidInit }}></script>
            {clipboard ? <script src={cdn('clipboard', '2.0.4', 'dist/clipboard.min.js')} defer={true}></script> : null}
            <Plugins site={site} config={config} page={page} helper={helper} head={false} />
            <script src={url_for('/js/main.js')} defer={true}></script>
        </Fragment>;
    }
};
