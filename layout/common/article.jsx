const moment = require('moment');
const { Component, Fragment } = require('inferno');
const { toMomentLocale } = require('hexo/lib/plugins/helper/date');
const Share = require('./share');
const Donates = require('./donates');
const Comment = require('./comment');
const Related = require('./related');
const Webmention = require('../comment/webmention')
const WebmentionTimeline = require('../comment/webmention-timeline')
const ArticleLicensing = require('hexo-component-inferno/lib/view/misc/article_licensing');

/**
 * Get the word count of text.
 */
function getWordCount(content) {
    if (typeof content === 'undefined') {
        return 0;
    }
    content = content.replace(/<\/?[a-z][^>]*>/gi, '');
    content = content.trim();
    return content ? (content.match(/[\u00ff-\uffff]|[a-zA-Z]+/g) || []).length : 0;
}

module.exports = class extends Component {
    render() {
        const { config, helper, page, index } = this.props;
        const { article, plugins } = config;
        const { url_for, date, date_xml, __, _p } = helper;

        const indexLaunguage = toMomentLocale(config.language || 'en');
        const language = toMomentLocale(page.lang || page.language || config.language || 'en');
        const cover = page.cover ? url_for(page.cover) : null;
        const updateTime = article && article.update_time !== undefined ? article.update_time : true;
        const isUpdated = page.updated && !moment(page.date).isSame(moment(page.updated));
        const shouldShowUpdated = page.updated && ((updateTime === 'auto' && isUpdated) || updateTime === true);

        return <Fragment>
            {/* Main content */}
            <div class="card">
                {/* Thumbnail */}
                {cover ? <div class="card-image">
                    {index ? <a href={url_for(page.link || page.path)} class="image is-7by3">
                        <img class="fill" src={cover} alt={page.title || cover} />
                    </a> : <span class="image is-7by3">
                        <img class="fill" src={cover} alt={page.title || cover} />
                    </span>}
                </div> : null}
                <article class={`card-content h-entry article${'direction' in page ? ' ' + page.direction : ''}`} role="article">
                    {/* Metadata */}
                    {page.layout !== 'page' ? <div class="article-meta is-size-7 is-uppercase level is-mobile">
                        <div class="level-left">
                            {/* Creation Date */}
                            {page.date && <span class="level-item" dangerouslySetInnerHTML={{
                                __html: _p('article.created_at', `<time class="dt-published" dateTime="${date_xml(page.date)}" title="${new Date(page.date).toLocaleString()}">${date(page.date)}</time>`)
                            }}></span>}
                            {/* Last Update Date */}
                            {shouldShowUpdated && <span class="level-item" dangerouslySetInnerHTML={{
                                __html: _p('article.updated_at', `<time dateTime="${date_xml(page.updated)}" title="${new Date(page.updated).toLocaleString()}">${date(page.updated)}</time>`)
                            }}></span>}
                            {/* author */}
                            {config.author ? <a class="level-item" href="/about"> {config.author} </a> : null}
                            {/* Categories */}
                            {page.categories && page.categories.length ? <span class="level-item">
                                {(() => {
                                    const categories = [];
                                    page.categories.forEach((category, i) => {
                                        categories.push(<a class="link-muted" href={url_for(category.path)}>{category.name}</a>);
                                        if (i < page.categories.length - 1) {
                                            categories.push(<span>&nbsp;/&nbsp;</span>);
                                        }
                                    });
                                    return categories;
                                })()}
                            </span> : null}
                            {/* Read time */}
                            {article && article.readtime && article.readtime === true ? <span class="level-item">
                                {(() => {
                                    const words = getWordCount(page._content);
                                    const time = moment.duration((words / 150.0) * 60, 'seconds');
                                    return `${_p('article.read_time', time.locale(index ? indexLaunguage : language).humanize())} (${_p('article.word_count', words)})`;
                                })()}
                            </span> : null}
                            {/* Visitor counter */}
                            {!index && plugins && plugins.busuanzi === true ? <span class="level-item" id="busuanzi_container_page_pv" dangerouslySetInnerHTML={{
                                __html: _p('plugin.visit_count', '<span id="busuanzi_value_page_pv">0</span>')
                            }}></span> : null}
                        </div>
                    </div> : null}
                    {/* Title */}
                    {page.title !== '' && index ? <p class="title is-3 is-size-4-mobile"><a class="link-muted" href={url_for(page.link || page.path)}>{page.title}</a></p> : null}
                    {page.title !== '' && !index ? <h1 class="p-name title is-3 is-size-4-mobile">{page.title}</h1> : null}
                    {/* Content/Excerpt */}
                    <div class="content  e-content" dangerouslySetInnerHTML={{ __html: index && page.excerpt ? page.excerpt : page.content }}></div>
                    {/* Licensing block */}
                    {!index && article && article.licenses && Object.keys(article.licenses)
                        ? <ArticleLicensing.Cacheable page={page} config={config} helper={helper} /> : null}
                    {/* Tags */}
                    <hr style="height:1px;margin:1rem 0"/>
                    <div className="level is-mobile is-flex">
                    {page.tags && page.tags.length ? <div class="article-tags is-size-7 is-uppercase">
                        <i class="fas fa-tags has-text-grey"></i>&nbsp;
                        {page.tags.map((tag, index) => {
                            return <a class="link-muted p-category" rel="tag" href={url_for(tag.path)}>{tag.name}{index !== page.tags.length-1? ', ':''}</a>;
                        })}
                    </div> : null}
                    {/* "Read more" button */}
                    {index && page.excerpt ? <a class="article-more button is-small is-size-7" href={`${url_for(page.link || page.path)}#more`}><i class="fas fa-book-reader has-text-grey"></i>&nbsp;&nbsp;{__('article.more')}</a> : null}
                    </div>
                    {/* Share button */}
                    {!index ? <Share config={config} page={page} helper={helper} /> : null}
                </article>
            </div>
            {/* Donate button */}
            {/* {!index ? <Donates config={config} helper={helper} /> : null} */}
            {/* Related Post*/}
            {!index ? <Related config={config} page={page} helper={helper}/> :null}
            {/* Post navigation */}
            {!index && (page.prev || page.next) ? <nav class="post-navigation mt-4 level is-mobile">
                {page.prev ? <div class="level-start">
                    <a class={`article-nav-prev level level-item${!page.prev ? ' is-hidden-mobile' : ''} link-muted`} href={url_for(page.prev.path)}>
                        <i class="level-item fas fa-chevron-left"></i>
                        <span class="level-item">{page.prev.title}</span>
                    </a>
                </div> : null}
                {page.next ? <div class="level-end">
                    <a class={`article-nav-next level level-item${!page.next ? ' is-hidden-mobile' : ''} link-muted`} href={url_for(page.next.path)}>
                        <span class="level-item">{page.next.title}</span>
                        <i class="level-item fas fa-chevron-right"></i>
                    </a>
                </div> : null}
            </nav> : null}
            {/* Comment */}
            {!index ? <Comment config={config} page={page} helper={helper} /> : null}
            {/* Webmention */}
            {!index ? <Webmention config={config} page={page} helper={helper}/> :null}
            {!index ? <WebmentionTimeline config={config} page={page} helper={helper}/> :null}
        </Fragment>;
    }
};
