const moment = require('moment');
const { escapeHTML, unescapeHTML } = require('hexo-util');
const { Component, Fragment } = require('inferno');
const { toMomentLocale } = require('hexo/dist/plugins/helper/date');
const Share = require('./share');
const Donates = require('./donates');
const Comment = require('./comment');
const ArticleLicensing = require('hexo-component-inferno/lib/view/misc/article_licensing');

// Scripts written without spaces between words: every character counts as a word.
const CJK = '\\p{Script=Han}\\p{Script=Hiragana}\\p{Script=Katakana}';
const WORD_PATTERN = new RegExp(`[${CJK}]|(?:(?![${CJK}])[\\p{L}\\p{M}\\p{N}])+(?:['\u2019](?:(?![${CJK}])[\\p{L}\\p{M}\\p{N}])+)*`, 'gu');
const LETTER_PATTERN = /\p{L}/u;

/**
 * Get the number of words in rendered HTML: CJK characters count one each, other words are
 * runs of letters, marks and digits that contain at least one letter. Markup, code line
 * numbers, scripts, styles, comments and punctuation are not counted.
 */
function getWordCount(html) {
    if (typeof html !== 'string' || !html) {
        return 0;
    }
    const text = unescapeHTML(html
        .replace(/<!--[\s\S]*?-->/g, ' ')
        .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, ' ')
        .replace(/<td class="gutter">[\s\S]*?<\/td>/gi, ' ')
        .replace(/<[^>]+>/g, ' '))
        .replace(/&[#\w]+;/g, ' ');
    return (text.match(WORD_PATTERN) || []).filter(word => LETTER_PATTERN.test(word)).length;
}

/**
 * The server of the waline_pageview plugin, which only counts and shows the page views with one:
 * its server_url, or the one of the Waline comments.
 */
function getWalinePageviewServer(config) {
    const { plugins, comment } = config;
    const plugin = plugins ? plugins.waline_pageview : null;
    if (!plugin) {
        return null;
    }
    if (typeof plugin === 'object' && plugin.server_url) {
        return plugin.server_url;
    }
    return comment && comment.type === 'waline' && comment.server_url ? comment.server_url : null;
}

/**
 * The outdated notice of a post: its last update (or creation) date, the number of days after
 * which it counts as outdated, and whether it already does at build time. Readers' browsers
 * compute it again (source/js/main.js), as the site is not rebuilt while the post gets older.
 */
function getOutdatedNotice(article, page, index) {
    const notice = article ? article.outdated_notice : null;
    if (index || page.layout === 'page' || page.outdated_notice === false || !notice || notice.enable !== true) {
        return null;
    }
    const lastUpdated = moment(page.updated || page.date);
    if (!lastUpdated.isValid()) {
        return null;
    }
    const days = Number.isInteger(notice.days) && notice.days > 0 ? notice.days : 365;
    return { lastUpdated, days, outdated: moment().diff(lastUpdated, 'days') >= days };
}

module.exports = class extends Component {
    render() {
        const { config, helper, page, index } = this.props;
        const { article, plugins } = config;
        const { url_for, date, date_xml, __, _p } = helper;
        // Full date and time in the site's format, language and time zone (helper.full_date cannot
        // be used here: it calls this.date(), which is not available in the bound context).
        const fullDateFormat = `${config.date_format || 'YYYY-MM-DD'} ${config.time_format || 'HH:mm:ss'}`;

        const defaultLanguage = Array.isArray(config.language) && config.language.length ? config.language[0] : config.language;

        const indexLanguage = toMomentLocale(defaultLanguage || 'en');
        const language = toMomentLocale(page.lang || page.language || defaultLanguage || 'en');
        const cover = page.cover ? url_for(page.cover) : null;
        const updateTime = article && article.update_time !== undefined ? article.update_time : true;
        const isUpdated = page.updated && !moment(page.date).isSame(moment(page.updated));
        const shouldShowUpdated = page.updated && ((updateTime === 'auto' && isUpdated) || updateTime === true);
        const outdatedNotice = getOutdatedNotice(article, page, index);

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
                <article class={`card-content article${'direction' in page ? ' ' + page.direction : ''}`} role="article">
                    {/* Metadata */}
                    {page.layout !== 'page' ? <div class="article-meta is-size-7 is-uppercase level is-mobile">
                        <div class="level-left">
                            {/* PIN Icon */}
                            {page.top ? <i class="fas fa-thumbtack level-item" title="Pinned"></i> : null}
                            {/* Creation Date */}
                            {page.date && <span class="level-item" dangerouslySetInnerHTML={{
                                __html: _p('article.created_at', `<time dateTime="${date_xml(page.date)}" title="${escapeHTML(date(page.date, fullDateFormat))}">${date(page.date)}</time>`)
                            }}></span>}
                            {/* Last Update Date */}
                            {shouldShowUpdated && <span class="level-item" dangerouslySetInnerHTML={{
                                __html: _p('article.updated_at', `<time dateTime="${date_xml(page.updated)}" title="${escapeHTML(date(page.updated, fullDateFormat))}">${date(page.updated)}</time>`)
                            }}></span>}
                            {/* author */}
                            {page.author ? <span class="level-item"> {page.author} </span> : null}
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
                            {article && article.readtime === true ? <span class="level-item">
                                {(() => {
                                    const words = getWordCount(page.encrypt ? page.origin : page.content);
                                    const time = moment.duration((words / 150.0) * 60, 'seconds');
                                    return `${_p('article.read_time', time.locale(index ? indexLanguage : language).humanize())} (${_p('article.word_count', words)})`;
                                })()}
                            </span> : null}
                            {/* Visitor counter */}
                            {!index && plugins && plugins.busuanzi === true ? <span class="level-item" id="busuanzi_container_page_pv" dangerouslySetInnerHTML={{
                                __html: _p('plugin.visit_count', '<span id="busuanzi_value_page_pv">0</span>')
                            }}></span> : null}
                            {/* Waline page view counter, which fills the element with the views of the page at
                                its data-path: the path of the URL that the plugin counts, like the Waline comments */}
                            {!index && getWalinePageviewServer(config) ? <span class="level-item" dangerouslySetInnerHTML={{
                                __html: _p('plugin.visit_count', `<span class="waline-pageview-count" data-path="${escapeHTML(url_for(page.path))}">0</span>`)
                            }}></span> : null}
                        </div>
                    </div> : null}
                    {/* Title */}
                    {page.title !== '' && index ? <p class="title is-3 is-size-4-mobile"><a class="link-muted" href={url_for(page.link || page.path)}>{page.title}</a></p> : null}
                    {page.title !== '' && !index ? <h1 class="title is-3 is-size-4-mobile">{page.title}</h1> : null}
                    {/* Outdated notice, shown from the build if the post is already outdated then, or once
                        it is in the browser of the reader. Without JavaScript, it gives the date. */}
                    {outdatedNotice ? <div class="message message-immersive is-warning article-outdated" role="note"
                        data-outdated-days={outdatedNotice.days} hidden={!outdatedNotice.outdated}>
                        <div class="message-body">
                            <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
                            <span class="article-outdated-text" data-template={_p('article.outdated_ago', '%s')} dangerouslySetInnerHTML={{
                                __html: _p('article.outdated_on', `<time dateTime="${date_xml(outdatedNotice.lastUpdated)}" title="${escapeHTML(date(outdatedNotice.lastUpdated, fullDateFormat))}">${date(outdatedNotice.lastUpdated)}</time>`)
                            }}></span>
                        </div>
                    </div> : null}
                    {/* Content/Excerpt */}
                    <div class="content" dangerouslySetInnerHTML={{ __html: index && page.excerpt ? page.excerpt : page.content }}></div>
                    {/* Licensing block */}
                    {!index && article && article.licenses && Object.keys(article.licenses)
                        ? <ArticleLicensing.Cacheable page={page} config={config} helper={helper} /> : null}
                    {/* Tags */}
                    {!index && page.tags && page.tags.length ? <div class="article-tags is-size-7 mb-4">
                        <span class="mr-2">#</span>
                        {page.tags.map(tag => {
                            return <a class="link-muted mr-2" rel="tag" href={url_for(tag.path)}>{tag.name}</a>;
                        })}
                    </div> : null}
                    {/* "Read more" button */}
                    {index && page.excerpt ? <a class="article-more button is-small is-size-7" href={`${url_for(page.link || page.path)}#more`}>{__('article.more')}</a> : null}
                    {/* Share button */}
                    {!index ? <Share config={config} page={page} helper={helper} /> : null}
                </article>
            </div>
            {/* Donate button */}
            {!index ? <Donates config={config} helper={helper} /> : null}
            {/* Post navigation */}
            {!index && (page.prev || page.next) ? <nav class="post-navigation mt-4 level is-mobile">
                {page.prev ? <div class="level-start">
                    <a class="article-nav-prev level level-item link-muted" href={url_for(page.prev.path)}>
                        <i class="level-item fas fa-chevron-left" aria-hidden="true"></i>
                        <span class="level-item">{page.prev.title}</span>
                    </a>
                </div> : null}
                {page.next ? <div class="level-end">
                    <a class="article-nav-next level level-item link-muted" href={url_for(page.next.path)}>
                        <span class="level-item">{page.next.title}</span>
                        <i class="level-item fas fa-chevron-right" aria-hidden="true"></i>
                    </a>
                </div> : null}
            </nav> : null}
            {/* Comment */}
            {!index ? <Comment config={config} page={page} helper={helper} /> : null}
        </Fragment>;
    }
};
