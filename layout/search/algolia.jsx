const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');

class Algolia extends Component {
    render() {
        const {
            translation,
            applicationId,
            apiKey,
            indexName,
            jsUrl,
            algoliaSearchUrl,
            instantSearchUrl
        } = this.props;

        if (!applicationId || !apiKey || !indexName) {
            return <div class="notification is-danger">
                It seems that you forget to set the <code>applicationId</code>, <code>apiKey</code>,
                or <code>indexName</code> for the Aloglia.
                Please set it in <code>_config.yml</code>.
            </div>;
        }

        const js = `document.addEventListener('DOMContentLoaded', function () {
            loadAlgolia(${JSON.stringify({ applicationId, apiKey, indexName })}, ${JSON.stringify(translation)});
        });`;

        return <Fragment>
            <div class="searchbox">
                <div class="searchbox-container">
                    <div class="searchbox-header">
                        <div class="searchbox-input-container" id="algolia-input">
                        </div>
                        <div class="is-flex" id="algolia-poweredby"
                            style="margin:0 .5em 0 1em;align-items:center;line-height:0"></div>
                        <a class="searchbox-close" href="javascript:;">&times;</a>
                    </div>
                    <div class="searchbox-body"></div>
                    <div class="searchbox-footer"></div>
                </div>
            </div>
            <script src={algoliaSearchUrl} crossorigin="anonymous" defer={true}></script>
            <script src={instantSearchUrl} crossorigin="anonymous" defer={true}></script>
            <script src={jsUrl} defer={true}></script>
            <script dangerouslySetInnerHTML={{ __html: js }}></script>
        </Fragment>;
    }
}

Algolia.Cacheable = cacheComponent(Algolia, 'search.algolia', props => {
    const { config, helper } = props;
    const { algolia } = config;

    return {
        translation: {
            hint: helper.__('search.hint'),
            no_result: helper.__('search.no_result'),
            untitled: helper.__('search.untitled'),
            empty_preview: helper.__('search.empty_preview')
        },
        applicationId: algolia ? algolia.applicationID : null,
        apiKey: algolia ? algolia.apiKey : null,
        indexName: algolia ? algolia.indexName : null,
        algoliaSearchUrl: helper.cdn('algoliasearch', '4.0.3', 'dist/algoliasearch-lite.umd.js'),
        instantSearchUrl: helper.cdn('instantsearch.js', '4.3.1', 'dist/instantsearch.production.min.js'),
        jsUrl: helper.url_for('/js/algolia.js')
    };
});

module.exports = Algolia;
