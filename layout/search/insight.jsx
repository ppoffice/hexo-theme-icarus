const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');

class Insight extends Component {
    render() {
        const { translation, contentUrl, jsUrl } = this.props;

        const js = `document.addEventListener('DOMContentLoaded', function () {
            loadInsight(${JSON.stringify({ contentUrl })}, ${JSON.stringify(translation)});
        });`;

        return <Fragment>
            <div class="searchbox">
                <div class="searchbox-container">
                    <div class="searchbox-header">
                        <div class="searchbox-input-container">
                            <input type="text" class="searchbox-input" placeholder={translation.hint}/>
                        </div>
                        <a class="searchbox-close" href="javascript:;">&times;</a>
                    </div>
                    <div class="searchbox-body"></div>
                </div>
            </div>
            <script src={jsUrl} defer={true}></script>
            <script dangerouslySetInnerHTML={{ __html: js }}></script>
        </Fragment>;
    }
}

Insight.Cacheable = cacheComponent(Insight, 'search.insight', props => {
    const { helper } = props;

    return {
        translation: {
            hint: helper.__('search.hint'),
            untitled: helper.__('search.untitled'),
            posts: helper._p('common.post', Infinity),
            pages: helper._p('common.page', Infinity),
            categories: helper._p('common.category', Infinity),
            tags: helper._p('common.tag', Infinity)
        },
        contentUrl: helper.url_for('/content.json'),
        jsUrl: helper.url_for('/js/insight.js')
    };
});

module.exports = Insight;
