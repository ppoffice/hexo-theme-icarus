const assert = require('assert').strict;
const { getHighlightThemes, getHeadImages } = require('../../include/util/head');

describe('include/util/head', () => {
    describe('getHighlightThemes', () => {
        it('returns the default themes in light, dark and auto loading order', () => {
            assert.deepEqual(getHighlightThemes({}, 'light'), [['atom-one-light']]);
            assert.deepEqual(getHighlightThemes({}, 'dark'), [['atom-one-dark']]);
            assert.deepEqual(getHighlightThemes({}, 'auto'), [
                ['atom-one-light', '(prefers-color-scheme: light)'],
                ['atom-one-dark', '(prefers-color-scheme: dark)']
            ]);
        });

        it('uses custom themes independently for each appearance', () => {
            const config = { article: { highlight: { theme: 'github', dark_theme: 'github-dark' } } };
            assert.deepEqual(getHighlightThemes(config, 'light'), [['github']]);
            assert.deepEqual(getHighlightThemes(config, 'dark'), [['github-dark']]);
            assert.deepEqual(getHighlightThemes(config, 'auto'), [
                ['github', '(prefers-color-scheme: light)'],
                ['github-dark', '(prefers-color-scheme: dark)']
            ]);
            assert.deepEqual(getHighlightThemes({ article: { highlight: { dark_theme: 'github-dark' } } }, 'light'), [['atom-one-light']]);
            assert.deepEqual(getHighlightThemes({ article: { highlight: { theme: 'github' } } }, 'dark'), [['atom-one-dark']]);
        });

        it('defaults falsy themes and absent article/highlight sections', () => {
            for (const value of [undefined, null, false, '']) {
                for (const config of [{ article: value }, { article: { highlight: value } },
                    { article: { highlight: { theme: value, dark_theme: value } } }]) {
                    assert.deepEqual(getHighlightThemes(config, 'light'), [['atom-one-light']]);
                    assert.deepEqual(getHighlightThemes(config, 'dark'), [['atom-one-dark']]);
                }
            }
        });

        it('disables all themes only for highlight.enable exactly false', () => {
            for (const appearance of ['light', 'dark', 'auto']) {
                assert.deepEqual(getHighlightThemes({ highlight: { enable: false }, article: { highlight: { theme: 'github' } } }, appearance), []);
            }
            for (const value of [undefined, null, false, { enable: 0 }, { enable: null }, { enable: 'false' }]) {
                assert.deepEqual(getHighlightThemes({ highlight: value }, 'light'), [['atom-one-light']]);
            }
        });
    });

    describe('getHeadImages', () => {
        const urlFor = path => 'resolved:' + path;
        const baseImages = (page, config = {}) => getHeadImages(page, config, urlFor);
        const both = images => ({ openGraphImages: images, structuredImages: images });

        for (const [name, page, article, expected] of [
            ['page.og_image before all other sources', { og_image: '/og.png', cover: '/cover.png', thumbnail: '/thumb.png', content: '<img src="/content.png">' }, { og_image: '/article.png' }, ['/og.png']],
            ['cover before thumbnail and article', { og_image: null, cover: '/cover.png', thumbnail: '/thumb.png' }, { og_image: '/article.png' }, ['resolved:/cover.png']],
            ['thumbnail before article', { cover: [], thumbnail: '/thumb.png' }, { og_image: '/article.png' }, ['resolved:/thumb.png']],
            ['article before content', { content: '<img src="/content.png">' }, { og_image: '/article.png' }, ['/article.png']],
            ['content in document order without URL conversion', { content: '<img src="/one.png"><img alt="two" src=\'https://example.com/two.png\'>' }, null, ['/one.png', 'https://example.com/two.png']],
            ['the default when no source is a string', { og_image: [], cover: false, thumbnail: 42 }, { og_image: [] }, ['resolved:/img/og_image.png']],
            ['an empty page.og_image string', { og_image: '', cover: '/cover.png' }, null, ['']],
            ['an empty cover string', { cover: '', thumbnail: '/thumb.png' }, null, ['resolved:']],
            ['an empty thumbnail string', { thumbnail: '' }, { og_image: '/article.png' }, ['resolved:']],
            ['an empty article.og_image string', { content: '<img src="/content.png">' }, { og_image: '' }, ['']]
        ]) {
            it(`selects ${name}`, () => {
                assert.deepEqual(baseImages(page, { article }), both(expected));
            });
        }

        it('keeps the existing content detection and regex boundaries, including no-match results', () => {
            for (const content of ['<img src=no-quotes.png>', '<img src="">', '<img\nsrc="/newline.png">', '<img-not-an-image>']) {
                assert.deepEqual(baseImages({ content }), both([]), content);
            }
            for (const content of ['', null, '<IMG src="/uppercase.png">', '<p>No images</p>']) {
                assert.deepEqual(baseImages({ content }), both(['resolved:/img/og_image.png']), String(content));
            }
            assert.deepEqual(baseImages({ content: '<img src="/one.png"><IMG SRC="/two.png">' }), both(['/one.png', '/two.png']));
            assert.deepEqual(baseImages({ content: '<img src="/repeat.png"><img src="/repeat.png">' }), both(['/repeat.png', '/repeat.png']));
        });

        it('applies explicit overrides independently, before page.photos and the base images', () => {
            const page = { og_image: '/base.png', photos: ['/photo.png'] };
            assert.deepEqual(baseImages(page, { head: {
                open_graph: { image: '/og.png' }, structured_data: { image: ['/structured.png', '/second.png'] }
            } }), { openGraphImages: '/og.png', structuredImages: ['/structured.png', '/second.png'] });
            assert.deepEqual(baseImages(page, { head: { open_graph: { image: '/og.png' } } }), {
                openGraphImages: '/og.png', structuredImages: ['/photo.png']
            });
            assert.deepEqual(baseImages(page, { head: { structured_data: { image: '/structured.png' } } }), {
                openGraphImages: ['/photo.png'], structuredImages: '/structured.png'
            });
        });

        it('retains string and nonempty array overrides, including empty strings and array contents', () => {
            for (const image of ['', '/relative.png', ['one.png', 'two.png'], [null, false, '']]) {
                assert.deepEqual(baseImages({ photos: '/photo.png' }, { head: {
                    open_graph: { image }, structured_data: { image }
                } }), both(image));
            }
        });

        it('ignores empty arrays and non-string non-array overrides', () => {
            for (const image of [undefined, null, [], false, true, 0, { src: '/ignored.png' }]) {
                assert.deepEqual(baseImages({ photos: '/photo.png' }, { head: {
                    open_graph: { image }, structured_data: { image }
                } }), both('/photo.png'));
            }
        });

        it('ignores non-object metadata settings without changing photo fallback', () => {
            const callable = () => {};
            callable.image = '/ignored.png';
            for (const metadata of [undefined, null, false, true, 'disabled', callable]) {
                assert.deepEqual(baseImages({ photos: ['/photo.png'] }, { head: {
                    open_graph: metadata, structured_data: metadata
                } }), both(['/photo.png']));
            }
        });

        it('preserves photos strings and nonempty arrays but falls back for other values', () => {
            for (const photos of ['', '/photo.png', ['/one.png', '/two.png'], [null]]) {
                assert.deepEqual(baseImages({ og_image: '/base.png', photos }), both(photos));
            }
            for (const photos of [undefined, null, [], false, 0, {}]) {
                assert.deepEqual(baseImages({ og_image: '/base.png', photos }), both(['/base.png']));
            }
        });

        it('only invokes urlFor for cover, thumbnail and the default, even with overrides', () => {
            for (const [page, article, calls] of [
                [{ og_image: '/og.png' }, {}, []],
                [{ cover: '/cover.png' }, {}, ['/cover.png']],
                [{ thumbnail: '/thumb.png' }, {}, ['/thumb.png']],
                [{}, { og_image: '/article.png' }, []],
                [{ content: '<img src="/content.png">' }, {}, []],
                [{}, {}, ['/img/og_image.png']]
            ]) {
                const resolved = [];
                const result = getHeadImages(page, { article, head: {
                    open_graph: { image: '/og-override.png' }, structured_data: { image: '/structured-override.png' }
                } }, path => { resolved.push(path); return urlFor(path); });
                assert.deepEqual(resolved, calls);
                assert.deepEqual(result, { openGraphImages: '/og-override.png', structuredImages: '/structured-override.png' });
            }
        });

        it('does not mutate input objects or copy explicit arrays', () => {
            const photos = Object.freeze(['/photo.png']);
            const image = Object.freeze(['/og.png']);
            const page = Object.freeze({ cover: '/cover.png', photos });
            const config = Object.freeze({ head: Object.freeze({ open_graph: Object.freeze({ image }) }) });
            const result = baseImages(page, config);
            assert.equal(result.openGraphImages, image);
            assert.equal(result.structuredImages, photos);
            assert.deepEqual(page, { cover: '/cover.png', photos: ['/photo.png'] });
            assert.deepEqual(config, { head: { open_graph: { image: ['/og.png'] } } });
        });
    });
});
