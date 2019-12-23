'use strict';

const { Component } = require('inferno');
const MetaTags = require('../misc/meta');
const OpenGraph = require('../misc/open_graph');
const Plugins = require('./plugins');

function isArchivePage(page) {
    return !!page.archive;
}

function isCategoriesPage(page) {
    return !!page.__categories;
}

function isTagsPage(page) {
    return !!page.__tags;
}

function isMonthPage(page, year, month) {
    if (!isArchivePage(page)) {
        return false;
    }
    if (year) {
        if (month) {
            return page.year === year && page.month === month;
        }
        return page.month === year;
    }
    return page.year && page.month;
}

function isYearPage(page, year) {
    if (!isArchivePage(page)) {
        return false;
    }
    if (year) {
        return page.year === year;
    }
    return !!page.year;
}

function isCategoryPage(page, category) {
    if (category) {
        return page.category === category;
    }
    return !!page.category;
}

function isTagPage(page, tag) {
    if (tag) {
        return page.tag === tag;
    }
    return !!page.tag;
}

function getPageTitle(page, siteTitle, _p) {
    let title = page.title;

    if (isArchivePage(page)) {
        title = _p('common.archive', Infinity);
        if (isMonthPage()) {
            title += ': ' + page.year + '/' + page.month;
        } else if (isYearPage(page)) {
            title += ': ' + page.year;
        }
    } else if (isCategoryPage()) {
        title = _p('common.category', 1) + ': ' + page.category;
    } else if (isTagPage()) {
        title = _p('common.tag', 1) + ': ' + page.tag;
    } else if (isCategoriesPage(page)) {
        title = _p('common.category', Infinity);
    } else if (isTagsPage(page)) {
        title = _p('common.tag', Infinity);
    }

    return [title, siteTitle].filter(str => typeof (str) !== 'undefined' && str.trim() !== '').join(' - ');
}

module.exports = class extends Component {
    render() {
        const { env, site, config, helper, page } = this.props;
        const { is_post, url_for, cdn, iconcdn, fontcdn } = helper;
        const {
            url,
            meta_generator = true,
            meta = [],
            open_graph,
            canonical_url,
            rss,
            favicon,
            article,
            highlight
        } = config;

        const language = page.lang || page.language || config.language;

        let hlTheme, images;
        if (highlight && highlight.enable === false) {
            hlTheme = null;
        } else if (article && article.highlight && article.hightlight.theme) {
            hlTheme = article.hightlight.theme;
        } else {
            hlTheme = 'atom-one-light';
        }

        if (typeof page.og_image === 'string') {
            images = [page.og_image];
        } else if (helper.has_thumbnail(page)) {
            images = [helper.get_thumbnail(page)];
        } else if (article && typeof article.og_image === 'string') {
            images = [article.og_image];
        } else if (page.content && page.content.includes('<img')) {
            let img;
            images = [];
            const imgPattern = /<img [^>]*src=['"]([^'"]+)([^>]*>)/gi;
            while ((img = imgPattern.exec(page.content)) !== null) {
                images.push(img[1]);
            }
        } else {
            images = [url_for('/images/og_image.png')];
        }

        return <head>
            <meta charset="utf-8" />
            {meta_generator ? <meta name="generator" content={`Hexo ${env.version}`} /> : null}
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
            <MetaTags meta={meta} />

            <title>{getPageTitle(page, config.title, _p)}</title>

            {open_graph ? <OpenGraph
                type={is_post() ? 'article' : 'website'}
                title={page.title || config.title}
                date={page.date}
                updated={page.updated}
                author={config.author}
                description={page.description || page.excerpt || page.content || config.description}
                keywords={page.keywords || (page.tags && page.tags.length ? page.tags : undefined) || config.keywords}
                url={url}
                images={page.photos || images}
                siteName={config.title}
                language={language}
                twitterId={open_graph.twitter}
                googlePlus={open_graph.google_plus}
                facebookAdmins={open_graph.fb_admins}
                facebookAppId={open_graph.fb_app_id} /> : null}

            {canonical_url ? <link rel="canonical" href={canonical_url} /> : null}
            {rss ? <link rel="alternative" href={url_for(rss)} title={config.title} type="application/atom+xml" /> : null}
            {favicon ? <link rel="icon" href={url_for(favicon)} /> : null}
            <link rel="stylesheet" href={cdn('bulma', '0.7.2', 'css/bulma.css')} />
            <link rel="stylesheet" href={iconcdn()} />
            <link rel="stylesheet" href={fontcdn('Ubuntu:400,600|Source+Code+Pro')} />
            {hlTheme ? <link rel="stylesheet" href={cdn('highlight.js', '9.12.0', 'styles/' + hlTheme + '.css')} /> : null}
            <Plugins site={site} config={config} helper={helper} page={page} head={true} />
            <link rel="stylesheet" href={url_for('/css/style')} />
        </head>;
    }
};
