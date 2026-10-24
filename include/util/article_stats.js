const moment = require('moment');
const { unescapeHTML } = require('hexo-util');
// Retain Hexo's locale aliases and invalid-value behavior rather than normalizing independently.
const { toMomentLocale } = require('hexo/dist/plugins/helper/date');

// Scripts written without spaces between words: every character counts as a word.
const CJK = '\\p{Script=Han}\\p{Script=Hiragana}\\p{Script=Katakana}';
const WORD_PATTERN = new RegExp(`[${CJK}]|(?:(?![${CJK}])[\\p{L}\\p{M}\\p{N}])+(?:['\u2019](?:(?![${CJK}])[\\p{L}\\p{M}\\p{N}])+)*`, 'gu');
const LETTER_PATTERN = /\p{L}/u;

/**
 * Count rendered HTML words: CJK characters count individually, other runs must
 * contain a letter. Keep the existing markup, entity and code-gutter filtering.
 * @param {*} html Rendered content
 * @returns {number}
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
 * Resolve both locales eagerly, as the article template did even with readtime off.
 * @param {*} siteLanguage Site language or language array
 * @param {*} pageLanguage The page's lang || language value
 * @returns {Object} Index and article Moment locales
 */
function getArticleLanguages(siteLanguage, pageLanguage) {
    const defaultLanguage = Array.isArray(siteLanguage) && siteLanguage.length ? siteLanguage[0] : siteLanguage;
    const indexLanguage = toMomentLocale(defaultLanguage || 'en');
    const language = toMomentLocale(pageLanguage || defaultLanguage || 'en');
    return { indexLanguage, language };
}

/**
 * Compute the existing 150-wpm estimate and Moment's localized humanized duration.
 * @param {*} html Selected content (the original content for encrypted posts)
 * @param {string} language Moment locale
 * @returns {Object} Word count and humanized reading time
 */
function getReadingStats(html, language) {
    const words = getWordCount(html);
    const time = moment.duration((words / 150.0) * 60, 'seconds');
    return { words, readingTime: time.locale(language).humanize() };
}

module.exports = { getWordCount, getArticleLanguages, getReadingStats };
