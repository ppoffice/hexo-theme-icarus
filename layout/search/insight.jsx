/**
 * Insight search plugin JSX component.
 * @module view/search/insight
 */
const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');

/**
 * Algolia search engine JSX component.
 *
 * @example
 * <Insight
 *     translation={{
 *         hint: '******',
 *         untitled: '******',
 *         posts: '******',
 *         pages: '******',
 *         categories: '******',
 *         tags: '******'
 *     }}
 *     contentUrl="/path/to/content.json"
 *     jsUrl="/path/to/insight.js" />
 */
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
                        <div class="searchbox-pinyin">
                            <label class="checkbox">
                                <input id="search-by-pinyin" type="checkbox" checked="checked"/>
                                <span>&nbsp;拼音检索</span>
                            </label>
                        </div>
                        <a class="searchbox-close" href="javascript:;">&times;</a>
                    </div>
                    <div class="searchbox-body"></div>
                </div>
            </div>
            <script src="/js/imaegoo/pinyin.js" defer={true}></script>
            <script src={jsUrl} defer={true}></script>
            <script dangerouslySetInnerHTML={{ __html: js }}></script>
        </Fragment>;
    }
}

/**
 * Cacheable Insight search plugin JSX component.
 * <p>
 * This class is supposed to be used in combination with the <code>locals</code> hexo filter
 * ({@link module:hexo/filter/locals}).
 *
 * @see module:util/cache.cacheComponent
 * @example
 * <Insight.Cacheable
 *     helper={{
 *         __: function() {...},
 *         cdn: function() {...}
 *     }} />
 */
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
