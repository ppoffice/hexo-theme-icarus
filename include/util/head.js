/**
 * Highlight stylesheets and their optional media queries, in loading order.
 * @param {Object} config Page configuration
 * @param {string} appearance Normalized appearance from getAppearance
 * @returns {Array<Array<string>>}
 */
function getHighlightThemes(config, appearance) {
    const { highlight, article } = config;
    if (highlight && highlight.enable === false) {
        return [];
    }
    const theme = (article && article.highlight && article.highlight.theme) || 'atom-one-light';
    if (appearance === 'light') {
        return [[theme]];
    }
    const darkTheme = (article && article.highlight && article.highlight.dark_theme) || 'atom-one-dark';
    return appearance === 'dark' ? [[darkTheme]]
        : [[theme, '(prefers-color-scheme: light)'], [darkTheme, '(prefers-color-scheme: dark)']];
}

// Empty strings are explicit overrides; empty arrays are not.
function hasImages(images) {
    return (Array.isArray(images) && images.length > 0) || typeof images === 'string';
}

function getMetadataImages(metadata, photos, images) {
    if (typeof metadata === 'object' && metadata !== null && hasImages(metadata.image)) {
        return metadata.image;
    }
    return hasImages(photos) ? photos : images;
}

/**
 * Resolve each metadata section's images without normalizing explicit overrides.
 * Only cover, thumbnail and the default image pass through urlFor here; metadata
 * components handle URLs for the other sources when rendering.
 * @param {Object} page Page locals
 * @param {Object} config Page configuration
 * @param {Function} urlFor Hexo's bound url_for helper
 * @returns {Object} Open Graph and structured data image values
 */
function getHeadImages(page, config, urlFor) {
    const { article, head = {} } = config;
    const { open_graph: openGraph = {}, structured_data: structuredData = {} } = head;
    let images;
    if (typeof page.og_image === 'string') {
        images = [page.og_image];
    } else if (typeof page.cover === 'string') {
        images = [urlFor(page.cover)];
    } else if (typeof page.thumbnail === 'string') {
        images = [urlFor(page.thumbnail)];
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
        images = [urlFor('/img/og_image.png')];
    }
    return {
        openGraphImages: getMetadataImages(openGraph, page.photos, images),
        structuredImages: getMetadataImages(structuredData, page.photos, images)
    };
}

module.exports = { getHighlightThemes, getHeadImages };
