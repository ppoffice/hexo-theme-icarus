const moment = require('moment');
const { Component, Fragment } = require('inferno');
const Share = require('./share');
const Donates = require('./donates');
const Comment = require('./comment');

/**
 * Get the word count of text.
 */
function getWordCount(content) {
    content = content.replace(/<\/?[a-z][^>]*>/gi, '');
    content = content.trim();
    return content ? (content.match(/[\u00ff-\uffff]|[a-zA-Z]+/g) || []).length : 0;
}

module.exports = class extends Component {
    render() {
        const { config, helper, page, index } = this.props;
        const { article, plugins } = config;
        const { has_thumbnail, get_thumbnail, url_for, date, date_xml, __, _p } = helper;

        const language = page.lang || page.language || config.language || 'en';

        return <Fragment>
            {/* Main content */}
            <div class="card">
                {/* Thumbnail */}
                {has_thumbnail(page) ? <div class="card-image">
                    {index ? <a href={url_for(page.link || page.path)} class="image is-7by1">
                        <img class="thumbnail" src={get_thumbnail(page)} alt={page.title || get_thumbnail(page)} />
                    </a> : <span class="image is-7by1">
                        <img class="thumbnail" src={get_thumbnail(page)} alt={page.title || get_thumbnail(page)} />
                    </span>}
                </div> : null}
                {/* Metadata */}
                <div class={`card-content article${'direction' in page ? ' ' + page.direction : ''}`} role="article">
                    {page.layout !== 'page' ? <div class="level article-meta is-size-7 is-uppercase is-mobile is-overflow-x-auto">
                        <div class="level-left">
                            {/* Date */}
                            <time class="level-item has-text-grey" dateTime={date_xml(page.date)}>{date(page.date)}</time>
                            {/* Categories */}
                            {page.categories && page.categories.length ? <div class="level-item">
                                {(() => {
                                    const categories = [];
                                    page.categories.forEach((category, i) => {
                                        categories.push(<a class="has-link-grey" href={category.url}>{category.name}</a>);
                                        if (i < page.categories.length - 1) {
                                            categories.push(' / ');
                                        }
                                    });
                                    return categories;
                                })()}
                            </div> : null}
                            {/* Read time */}
                            {article && article.readtime && article.readtime === true ? <span class="level-item has-text-grey">
                                {(() => {
                                    const words = getWordCount(page._content);
                                    const time = moment.duration((words / 150.0) * 60, 'seconds');
                                    return `${time.locale(language).humanize()} ${__('article.read')} (${__('article.about')} ${words} ${__('article.words')})`;
                                })()}
                            </span> : null}
                            {/* Visitor counter */}
                            {plugins && plugins.busuanzi === true ? <span class="level-item has-text-grey" id="busuanzi_container_page_pv"
                                dangerouslySetInnerHTML={{
                                    __html: '<i class="far fa-eye"></i>' + _p('plugin.visit', '&nbsp;&nbsp;<span id="busuanzi_value_page_pv">0</span>')
                                }}></span> : null}
                        </div>
                    </div> : null}
                    {/* Title */}
                    <h1 class="title is-size-3 is-size-4-mobile has-text-weight-normal">
                        {index ? <a class="has-link-black-ter" href={url_for(page.link || page.path)}>{page.title}</a> : page.title}
                    </h1>
                    {/* Content/Excerpt */}
                    <div class="content" dangerouslySetInnerHTML={{ __html: index && page.excerpt ? page.excerpt : page.content }}></div>
                    {/* Tags */}
                    {!index && page.tags && page.tags.length ? <div class="level is-size-7 is-uppercase">
                        <div class="level-start">
                            <div class="level-item">
                                <span class="is-size-6 has-text-grey has-mr-7">#</span>
                                {page.tags.map(tag => {
                                    return <a class="has-link-grey has-mr-6" rel="tag" href={url_for(tag.path)}>{tag.name}</a>;
                                })}
                            </div>
                        </div>
                    </div> : null}
                    {/* "Read more" button */}
                    {index && page.excerpt ? <div class="level is-mobile">
                        <div class="level-start">
                            <div class="level-item">
                                <a class="button is-size-7 is-light" href={`${url_for(page.path)}#more`}>{__('article.more')}</a>
                            </div>
                        </div>
                    </div> : null}
                    {/* Share button */}
                    {!index ? <Share config={config} page={page} helper={helper} /> : null}
                </div>
            </div>
            {/* Donate button */}
            {!index ? <Donates config={config} helper={helper} /> : null}
            {/* Post navigation */}
            {!index && (page.prev || page.next) ? <div class="card card-transparent">
                <div class="level post-navigation is-flex-wrap is-mobile">
                    {page.prev ? <div class="level-start">
                        <a class={`level level-item has-link-grey${!page.prev ? ' is-hidden-mobile' : ''} article-nav-prev`} href={url_for(page.prev.path)}>
                            <i class="level-item fas fa-chevron-left"></i>
                            <span class="level-item">{page.prev.title}</span>
                        </a>
                    </div> : null}
                    {page.next ? <div class="level-end">
                        <a class={`level level-item has-link-grey${!page.next ? ' is-hidden-mobile' : ''} article-nav-next`} href={url_for(page.next.path)}>
                            <span class="level-item">{page.next.title}</span>
                            <i class="level-item fas fa-chevron-right"></i>
                        </a>
                    </div> : null}
                </div>
            </div> : null}
            {/* Comment */}
            {!index ? <Comment config={config} page={page} helper={helper} /> : null}
        </Fragment>;
    }
};
