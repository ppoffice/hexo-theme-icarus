'use strict';

const { Component } = require('inferno');
const MetaTags = require('../misc/meta');
const OpenGraph = require('../misc/open_graph');
const Plugins = require('./plugins');

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
                language={page.lang || page.language || config.language}
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
