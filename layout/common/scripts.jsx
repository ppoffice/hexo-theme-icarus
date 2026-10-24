const { Component, Fragment } = require('inferno');
const Plugins = require('./plugins');
const gallery = require('hexo-component-inferno/lib/util/gallery');

module.exports = class extends Component {
    render() {
        const { site, config, helper, page } = this.props;
        const { url_for, cdn, __ } = helper;
        const { article } = config;

        let fold = 'unfolded';
        let foldPreview = 0;
        let clipboard = true;
        if (article && article.highlight) {
            if (typeof article.highlight.clipboard !== 'undefined') {
                clipboard = !!article.highlight.clipboard;
            }
            if (typeof article.highlight.fold === 'string') {
                fold = article.highlight.fold;
            }
            if (Number.isInteger(article.highlight.fold_preview) && article.highlight.fold_preview > 0) {
                foldPreview = article.highlight.fold_preview;
            }
        }

        const settings = {
            gallery: !!(config.plugins && config.plugins.gallery),
            article: {
                highlight: {
                    clipboard,
                    fold,
                    fold_preview: foldPreview
                }
            },
            i18n: {
                copy: __('article.copy'),
                copied: __('article.copied')
            }
        };
        // Escape "<" so that no configured or translated string can close the <script> element.
        // On PJAX, main.js may be queued behind SDKs from an earlier page. Update
        // the runtime immediately, before their load callbacks can use stale flags.
        // During the initial parse, leave content enhancement and layout to main.js.
        const embeddedConfig = `var IcarusThemeSettings = ${JSON.stringify(settings).replace(/</g, '\\u003c')};
if (document.readyState !== 'loading') {
    window.HexoGallery.init(document, {
        lightGallery: IcarusThemeSettings.gallery,
        justifiedGallery: IcarusThemeSettings.gallery
    });
}`;

        return <Fragment>
            <script src={cdn('jquery', '3.7.1', 'dist/jquery.min.js')}></script>
            {clipboard && <script src={cdn('clipboard', '2.0.11', 'dist/clipboard.min.js')} defer></script>}
            <script dangerouslySetInnerHTML={{ __html: gallery }}></script>
            <script data-pjax dangerouslySetInnerHTML={{ __html: embeddedConfig }}></script>
            <script data-pjax src={url_for('/js/column.js')}></script>
            <script src={url_for('/js/navbar.js')} defer></script>
            <script src={url_for('/js/github-calendar.js')} defer></script>
            {config.plugins && config.plugins.pjax && <Fragment>
                <script src={url_for('/js/pjax-page.js')}></script>
                <script src={url_for('/js/pjax-prefetch.js')}></script>
            </Fragment>}
            <Plugins site={site} config={config} page={page} helper={helper} head={false} />
            <script data-pjax src={url_for('/js/main.js')} defer></script>
        </Fragment>;
    }
};
