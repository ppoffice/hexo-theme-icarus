'use strict';

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
            <div className="card">
                {/* Thumbnail */}
                {has_thumbnail(page) ? <div className="card-image">
                    {index ? <a href={url_for(page.link || page.path || page.permalink)} className="image is-7by1">
                        <img className="thumbnail" src={get_thumbnail(page)} alt={page.title || get_thumbnail(page)} />
                    </a> : <span className="image is-7by1">
                        <img className="thumbnail" src={get_thumbnail(page)} alt={page.title || get_thumbnail(page)} />
                    </span>}
                </div> : null}
                {/* Metadata */}
                <div className={`card-content article${Object.prototype.hasOwnProperty.call(page, 'direction') ? ' ' + page.direction : ''}`}>
                    {page.layout !== 'page' ? <div className="level article-meta is-size-7 is-uppercase is-mobile is-overflow-x-auto">
                        <div className="level-left">
                            {/* Date */}
                            <time className="level-item has-text-grey" datetime={date_xml(page.date)}>{date(page.date)}</time>
                            {/* Categories */}
                            {page.categories && page.categories.length ? <div className="level-item">
                                {(() => {
                                    const categories = [];
                                    page.categories.forEach((category, i) => {
                                        categories.push(<a className="has-link-grey" href={category.url}>{category.name}</a>);
                                        if (i < page.categories.length - 1) {
                                            categories.push('/');
                                        }
                                    });
                                    return categories;
                                })()}
                            </div> : null}
                            {/* Read time */}
                            {article && article.readtime && article.readtime === true ? <span className="level-item has-text-grey">
                                {(() => {
                                    const words = getWordCount(page._content);
                                    const time = moment.duration((words / 150.0) * 60, 'seconds');
                                    return `${time.locale(language).humanize()} ${__('article.read')} (${__('article.about')} ${words} ${__('article.words')})`;
                                })()}
                            </span> : null}
                            {/* Visitor counter */}
                            {plugins && plugins.busuanzi === true ? <span className="level-item has-text-grey" id="busuanzi_container_page_pv"
                                dangerouslySetInnerHTML={{
                                    __html: _p('plugin.visit', '<i className="far fa-eye"></i><span id="busuanzi_value_page_pv">0</span>')
                                }}></span> : null}
                        </div>
                    </div> : null}
                    {/* Title */}
                    <h1 className="title is-size-3 is-size-4-mobile has-text-weight-normal">
                        {index ? <a className="has-link-black-ter" href={url_for(page.link || page.path)}>{page.title}</a> : page.title}
                    </h1>
                    {/* Content/Excerpt */}
                    <div className="content">
                        {index && page.excerpt ? page.excerpt : page.content}
                    </div>
                    {/* Tags */}
                    {!index && Array.isArray(page.tags) && page.tags.length ? <div className="level is-size-7 is-uppercase">
                        <div className="level-start">
                            <div className="level-item">
                                <span className="is-size-6 has-text-grey has-mr-7">#</span>
                                {page.tags.map(tag => {
                                    return <a href="has-link-grey" rel="tag" href={url_for(tag.path)}>{tag.name}</a>;
                                })}
                            </div>
                        </div>
                    </div> : null}
                    {/* "Read more" button */}
                    {index && page.excerpt ? <div className="level is-mobile">
                        <div className="level-start">
                            <div className="level-item">
                                <a className="button is-size-7 is-light" href={`${url_for(page.path)}#more`}>{__('article.more')}</a>
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
            {!index && (page.prev || page.next) ? <div className="card card-transparent">
                <div className="level post-navigation is-flex-wrap is-mobile">
                    {page.prev ? <div className="level-start">
                        <a className={`level level-item has-link-grey${!page.prev ? ' is-hidden-mobile' : ''} article-nav-prev`} href={url_for(page.prev.path)}>
                            <i className="level-item fas fa-chevron-left"></i>
                            <span className="level-item">{page.prev.title}</span>
                        </a>
                    </div> : null}
                    {page.next ? <div className="level-end">
                        <a className={`level level-item has-link-grey${!page.next ? ' is-hidden-mobile' : ''} article-nav-next`} href={url_for(page.next.path)}>
                            <span className="level-item">{page.next.title}</span>
                            <i className="level-item fas fa-chevron-right"></i>
                        </a>
                    </div> : null}
                </div>
            </div> : null}
            {/* Comment */}
            {!index ? <Comment config={config} page={page} helper={helper} /> : null}
        </Fragment>;
    }
};
