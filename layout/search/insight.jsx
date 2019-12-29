const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('../util/cache');

class Insight extends Component {
    render() {
        const { hint, translation, contentUrl, jsUrl, cssUrl } = this.props;

        const js = `(function (window) {
            var INSIGHT_CONFIG = {
                TRANSLATION: {
                    POSTS: '${translation.posts}',
                    PAGES: '${translation.pages}',
                    CATEGORIES: '${translation.categories}',
                    TAGS: '${translation.tags}',
                    UNTITLED: '${translation.untitled}',
                },
                CONTENT_URL: '${contentUrl}',
            };
            window.INSIGHT_CONFIG = INSIGHT_CONFIG;
        })(window);`;

        return <Fragment>
            <link rel="stylesheet" href={cssUrl} />
            <div class="searchbox ins-search">
                <div class="searchbox-container ins-search-container">
                    <div class="searchbox-input-wrapper">
                        <input type="text" class="searchbox-input ins-search-input" placeholder={hint} />
                        <span class="searchbox-close ins-close ins-selectable"><i class="fa fa-times-circle"></i></span>
                    </div>
                    <div class="searchbox-result-wrapper ins-section-wrapper">
                        <div class="ins-section-container"></div>
                    </div>
                </div>
            </div>
            <script dangerouslySetInnerHTML={{ __html: js }}></script>
            <script src={jsUrl} defer={true}></script>
        </Fragment>;
    }
}

module.exports = cacheComponent(Insight, 'search.insight', props => {
    const { helper } = props;

    return {
        hint: helper.__('search.hint'),
        translation: {
            posts: helper.__('insight.posts'),
            pages: helper.__('insight.pages'),
            categories: helper.__('insight.categories'),
            tags: helper.__('insight.tags'),
            untitled: helper.__('insight.untitled')
        },
        contentUrl: helper.url_for('/content.json'),
        jsUrl: helper.url_for('/js/insight.js'),
        cssUrl: helper.url_for('/css/insight.css')
    };
});
