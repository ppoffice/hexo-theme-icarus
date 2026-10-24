const assert = require('assert').strict;
const moment = require('moment');
const { getWordCount, getArticleLanguages, getReadingStats } = require('../../include/util/article_stats');

describe('include/util/article_stats', () => {
    describe('getWordCount', () => {
        it('returns zero for empty and non-string content', () => {
            for (const html of [undefined, null, false, true, 0, 42, {}, [], '']) {
                assert.equal(getWordCount(html), 0);
            }
        });

        for (const [name, html, expected] of [
            ['Chinese characters', '天地玄黄宇宙洪荒', 8],
            ['Japanese kana and kanji', '日本語のテキスト', 8],
            ['astral Han and kana', '𠀀カタカナひらがな', 9],
            ['Korean words rather than characters', '안녕하세요 세계', 2],
            ['Cyrillic', 'один два три четыре пять', 5],
            ['Greek', 'καλημέρα κόσμε', 2],
            ['Vietnamese', 'Tiếng Việt rất đẹp', 4],
            ['combining marks only with letters', 'e\u0301 \u0301 café', 2],
            ['digits in words but not numbers alone', 'a1 2b 3 ٤٥٦ １２３', 2],
            ['straight and curly apostrophes', 'don\'t it’s rock’n’roll', 3],
            ['mixed scripts', '使用Hexo写博客', 6],
            ['comments as separators', 'one<!-- hidden words -->two', 2],
            ['complete scripts and styles', '<SCRIPT type="text/plain">hidden words</SCRIPT><style>hidden words</style>visible', 1],
            ['the original unclosed-script boundary', '<script>unclosed payload', 2],
            ['the exact double-quoted gutter class', '<TD CLASS="GUTTER">hidden words</TD>visible', 1],
            ['single-quoted gutter text left by the original filter', '<td class=\'gutter\'>kept words</td>', 2],
            ['additional gutter classes left by the original filter', '<td class="gutter extra">kept words</td>', 2],
            ['text rather than markup or attribute values', '<a href="some words">actual text</a>', 2],
            ['unescaped basic entities', 'Tom &amp; Jerry&nbsp;&mdash;&nbsp;cartoon', 3],
            ['entities not decoded by unescapeHTML', '<p>&unknown; &amp;copy; &#65; &#x4f60; &#49;</p>', 0],
            ['the original unknown-entity filter boundary', '&unknown-name; &你好;', 4]
        ]) {
            it(`preserves ${name}`, () => {
                assert.equal(getWordCount(html), expected);
            });
        }

        it('does not retain global-regexp state across calls', () => {
            for (let i = 0; i < 3; i++) {
                assert.equal(getWordCount('one 二'), 2);
                assert.equal(getWordCount('123'), 0);
                assert.equal(getWordCount('three four 五'), 3);
            }
        });
    });

    describe('getArticleLanguages', () => {
        it('keeps the first site language separate from the page language', () => {
            assert.deepEqual(getArticleLanguages(['zh_CN', 'ru'], 'ja_JP'), { indexLanguage: 'zh-cn', language: 'ja-jp' });
            assert.deepEqual(getArticleLanguages('en', 'ru'), { indexLanguage: 'en', language: 'ru' });
        });

        it('preserves falsy fallbacks and Hexo locale aliases without filtering arrays', () => {
            for (const language of [undefined, null, false, '', 'default', [null], [false, 'ja'], ['', 'ru']]) {
                assert.deepEqual(getArticleLanguages(language, null), { indexLanguage: 'en', language: 'en' });
            }
            assert.deepEqual(getArticleLanguages('zh_CN', false), { indexLanguage: 'zh-cn', language: 'zh-cn' });
            assert.deepEqual(getArticleLanguages('default', 'default'), { indexLanguage: 'en', language: 'en' });
            assert.deepEqual(getArticleLanguages('zh_Hans_CN', 'xx_UNKNOWN'), { indexLanguage: 'zh-hans_cn', language: 'xx-unknown' });
        });

        it('retains eager errors for empty arrays and truthy non-string language values', () => {
            for (const siteLanguage of [[], [[]], {}, true, 42]) {
                assert.throws(() => getArticleLanguages(siteLanguage, 'en'), /toLowerCase/);
            }
            assert.throws(() => getArticleLanguages('en', []), /toLowerCase/);
            assert.throws(() => getArticleLanguages('en', 42), /toLowerCase/);
        });
    });

    describe('getReadingStats', () => {
        const words = count => '<p>' + 'word '.repeat(count) + '</p>';

        it('keeps the 150-wpm arithmetic and Moment humanization thresholds', () => {
            for (const [count, readingTime] of [[0, 'a few seconds'], [1, 'a few seconds'],
                [111, 'a few seconds'], [112, 'a minute'], [150, 'a minute'], [224, 'a minute'], [225, '2 minutes'], [300, '2 minutes']]) {
                assert.deepEqual(getReadingStats(words(count), 'en'), { words: count, readingTime });
            }
        });

        it('localizes the duration without changing the global Moment locale', () => {
            const previous = moment.locale();
            try {
                moment.locale('en');
                for (const language of ['zh-cn', 'ja', 'ko', 'ru', 'vi', 'de', 'en']) {
                    assert.deepEqual(getReadingStats(words(300), language), {
                        words: 300, readingTime: moment.duration(120, 'seconds').locale(language).humanize()
                    });
                    assert.equal(moment.locale(), 'en');
                }
                moment.locale('ru');
                assert.equal(getReadingStats(words(300), 'unknown-article-locale').readingTime,
                    moment.duration(120, 'seconds').locale('ru').humanize());
            } finally {
                moment.locale(previous);
            }
        });
    });
});
