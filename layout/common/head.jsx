const { Component } = require('inferno');
const MetaTags = require('hexo-component-inferno/lib/view/misc/meta');
const OpenGraph = require('hexo-component-inferno/lib/view/misc/open_graph');
const StructuredData = require('hexo-component-inferno/lib/view/misc/structured_data');
const Plugins = require('./plugins');

function getPageTitle(page, siteTitle, helper) {
    let title = page.title;

    if (helper.is_archive()) {
        title = helper._p('common.archive', Infinity);
        if (helper.is_month()) {
            title += ': ' + page.year + '/' + page.month;
        } else if (helper.is_year()) {
            title += ': ' + page.year;
        }
    } else if (helper.is_category()) {
        title = helper._p('common.category', 1) + ': ' + page.category;
    } else if (helper.is_tag()) {
        title = helper._p('common.tag', 1) + ': ' + page.tag;
    } else if (helper.is_categories()) {
        title = helper._p('common.category', Infinity);
    } else if (helper.is_tags()) {
        title = helper._p('common.tag', Infinity);
    }

    return [title, siteTitle].filter(str => typeof str !== 'undefined' && str.trim() !== '').join(' - ');
}

module.exports = class extends Component {
    render() {
        const { env, site, config, helper, page } = this.props;
        const { url_for, cdn, fontcdn, iconcdn, is_post } = helper;
        const {
            url,
            meta_generator = true,
            head = {},
            article,
            highlight,
            variant = 'default'
        } = config;
        const {
            meta = [],
            open_graph = {},
            structured_data = {},
            canonical_url = page.permalink,
            rss,
            favicon
        } = head;

        const language = page.lang || page.language || config.language;
        const fontCssUrl = {
            default: fontcdn('Ubuntu:wght@400;600&family=Source+Code+Pro', 'css2'),
            cyberpunk: fontcdn('Oxanium:wght@300;400;600&family=Roboto+Mono', 'css2')
        };

        let hlTheme, images;
        if (highlight && highlight.enable === false) {
            hlTheme = null;
        } else if (article && article.highlight && article.highlight.theme) {
            hlTheme = article.highlight.theme;
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
            images = [url_for('/img/og_image.png')];
        }

        let adsenseClientId = null;
        if (Array.isArray(config.widgets)) {
            const widget = config.widgets.find(widget => widget.type === 'adsense');
            if (widget) {
                adsenseClientId = widget.client_id;
            }
        }

        let openGraphImages = images;
        if ((typeof open_graph === 'object' && open_graph !== null)
            && ((Array.isArray(open_graph.image) && open_graph.image.length > 0) || typeof open_graph.image === 'string')) {
            openGraphImages = open_graph.image;
        } else if ((Array.isArray(page.photos) && page.photos.length > 0) || typeof page.photos === 'string') {
            openGraphImages = page.photos;
        }

        let structuredImages = images;
        if ((typeof structured_data === 'object' && structured_data !== null)
            && ((Array.isArray(structured_data.image) && structured_data.image.length > 0) || typeof structured_data.image === 'string')) {
            structuredImages = structured_data.image;
        } else if ((Array.isArray(page.photos) && page.photos.length > 0) || typeof page.photos === 'string') {
            structuredImages = page.photos;
        }

        return <head>
            <meta charset="utf-8" />
            {meta_generator ? <meta name="generator" content={`Hexo ${env.version}`} /> : null}
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
            {meta && meta.length ? <MetaTags meta={meta} /> : null}

            <title>{getPageTitle(page, config.title, helper)}</title>

            {typeof open_graph === 'object' && open_graph !== null ? <OpenGraph
                type={open_graph.type || (is_post(page) ? 'article' : 'website')}
                title={open_graph.title || page.title || config.title}
                date={page.date}
                updated={page.updated}
                author={open_graph.author || config.author}
                description={open_graph.description || page.description || page.excerpt || page.content || config.description}
                keywords={page.keywords || (page.tags && page.tags.length ? page.tags : undefined) || config.keywords}
                url={open_graph.url || page.permalink || url}
                images={openGraphImages}
                siteName={open_graph.site_name || config.title}
                language={language}
                twitterId={open_graph.twitter_id}
                twitterCard={open_graph.twitter_card}
                twitterSite={open_graph.twitter_site}
                googlePlus={open_graph.google_plus}
                facebookAdmins={open_graph.fb_admins}
                facebookAppId={open_graph.fb_app_id} /> : null}

            {typeof structured_data === 'object' && structured_data !== null ? <StructuredData
                title={structured_data.title || config.title}
                description={structured_data.description || page.description || page.excerpt || page.content || config.description}
                url={structured_data.url || page.permalink || url}
                author={structured_data.author || config.author}
                date={page.date}
                updated={page.updated}
                images={structuredImages} /> : null}

            {canonical_url ? <link rel="canonical" href={canonical_url} /> : null}
            {rss ? <link rel="alternative" href={url_for(rss)} title={config.title} type="application/atom+xml" /> : null}
            {favicon ? <link rel="icon" href={url_for(favicon)} /> : null}
            <link rel="stylesheet" href={iconcdn()} />
            {hlTheme ? <link rel="stylesheet" href={cdn('highlight.js', '9.12.0', 'styles/' + hlTheme + '.css')} /> : null}
            <link rel="stylesheet" href={fontCssUrl[variant]} />
            <link rel="stylesheet" href={url_for('/css/' + variant + '.css')} />
            <Plugins site={site} config={config} helper={helper} page={page} head={true} />

            {adsenseClientId ? <script data-ad-client={adsenseClientId}
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" async={true}></script> : null}
        </head>;
    }
};
