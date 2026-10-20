const assert = require('assert').strict;
const { Migrator } = require('hexo-component-inferno/lib/core/migrate');
const head = require('../../include/migration/head');
const V2toV3 = require('../../include/migration/v2_v3');
const V3toV4 = require('../../include/migration/v3_v4');
const V4toV5 = require('../../include/migration/v4_v5');
const V5toV51 = require('../../include/migration/v5_v5.1');
const schemaConfig = require('../../include/schema/config.json');
const { capture } = require('../support/capture');

describe('include/migration', () => {
    it('targets the same latest version as the schema default', () => {
        const migrator = new Migrator(head);
        assert.equal(migrator.getLatestVersion(), schemaConfig.properties.version.default);
    });

    it('treats older versions as outdated and the latest as current', () => {
        const migrator = new Migrator(head);
        assert.ok(migrator.isOudated('5.0.0'));
        assert.ok(migrator.isOudated('4.4.0'));
        assert.ok(!migrator.isOudated('5.1.0'));
    });

    it('chains every migration so old configurations are fully upgraded', () => {
        const migrator = new Migrator(head);
        assert.deepEqual(migrator.versions, ['3.0.0', '4.0.0', '5.0.0', '5.1.0']);
    });

    it('links each migration to its predecessor', () => {
        assert.equal(new V5toV51().head, V4toV5);
        assert.equal(new V4toV5().head, V3toV4);
        assert.equal(new V3toV4().head, V2toV3);
        assert.equal(new V2toV3().head, null);
    });

    for (const [from, expected] of [
        ['2.0.0', ['3.0.0', '4.0.0', '5.0.0', '5.1.0']],
        ['3.0.0', ['4.0.0', '5.0.0', '5.1.0']],
        ['4.4.0', ['5.0.0', '5.1.0']],
        ['5.0.0', ['5.1.0']],
        ['5.1.0', []]
    ]) {
        it(`runs exactly the migrations newer than ${from}`, () => {
            const ran = [];
            capture(() => new Migrator(head).migrate({ version: from }, null, (fromVersion, toVersion) => ran.push(toVersion)));
            assert.deepEqual(ran, expected);
        });
    }

    it('upgrading a 3.x configuration applies the 3.x -> 4.0 migration', () => {
        const migrated = new Migrator(head).migrate({ version: '3.0.0', article: { thumbnail: true, readtime: true } });
        assert.equal(migrated.version, '5.1.0');
        assert.equal('thumbnail' in migrated.article, false);
    });

    it('upgrades a 2.x configuration all the way to the latest version', () => {
        const migrated = capture(() => new Migrator(head).migrate({
            version: '2.0.0',
            favicon: '/images/favicon.svg',
            rss: '/atom.xml',
            article: { thumbnail: true },
            comment: { type: 'waline', visitor: true },
            widgets: [{ position: 'left', type: 'archive' }]
        })).result;
        assert.equal(migrated.version, '5.1.0');
        assert.equal(migrated.head.favicon, '/img/favicon.svg');
        assert.equal(migrated.head.rss, '/atom.xml');
        assert.equal('favicon' in migrated, false);
        assert.equal('thumbnail' in migrated.article, false);
        assert.equal(migrated.comment.pageview, true);
        assert.equal(migrated.widgets[0].type, 'archives');
    });

    describe('v5 -> v5.1 (Waline v2 option names)', () => {
        const migrate = config => new V5toV51().migrate(config);

        it('renames the Waline v1 options', () => {
            const result = migrate({
                version: '5.0.0',
                comment: { type: 'waline', visitor: true, uploadImage: false, highlight: true, math: 'katex' }
            });
            assert.equal(result.version, '5.1.0');
            assert.deepEqual(result.comment, {
                type: 'waline',
                pageview: true,
                image_uploader: false,
                highlighter: true,
                tex_renderer: 'katex'
            });
        });

        it('does not overwrite options that already use the new name', () => {
            const result = migrate({ version: '5.0.0', comment: { type: 'waline', visitor: true, pageview: false } });
            assert.equal(result.comment.pageview, false);
            assert.equal('visitor' in result.comment, false);
        });

        it('leaves other comment providers untouched', () => {
            const result = migrate({ version: '5.0.0', comment: { type: 'disqus', highlight: true } });
            assert.deepEqual(result.comment, { type: 'disqus', highlight: true });
        });

        it('handles a configuration without comment settings', () => {
            assert.equal(migrate({ version: '5.0.0' }).version, '5.1.0');
        });
    });

    describe('v4 -> v5', () => {
        it('only bumps the version', () => {
            assert.deepEqual(new V4toV5().migrate({ version: '4.0.0', variant: 'default' }), { version: '5.0.0', variant: 'default' });
        });
    });

    describe('v3 -> v4', () => {
        it('removes article.thumbnail', () => {
            const result = new V3toV4().migrate({ version: '3.0.0', article: { thumbnail: true, readtime: true } });
            assert.deepEqual(result, { version: '4.0.0', article: { readtime: true } });
        });
    });

    describe('v2 -> v3', () => {
        const migrate = config => capture(() => new V2toV3().migrate(config)).result;

        it('moves head-related settings under `head`', () => {
            const result = migrate({
                version: '2.0.0',
                favicon: '/favicon.png',
                canonical_url: 'https://example.com',
                open_graph: { twitter_id: 'me' },
                meta: ['a=b'],
                rss: '/atom.xml'
            });
            assert.deepEqual(result.head, {
                favicon: '/favicon.png',
                canonical_url: 'https://example.com',
                open_graph: { twitter_id: 'me' },
                meta: ['a=b'],
                rss: '/atom.xml'
            });
            for (const key of ['favicon', 'canonical_url', 'open_graph', 'meta', 'rss']) {
                assert.equal(key in result, false, `${key} should be removed from the top level`);
            }
        });

        it('rewrites the default logo path from /images to /img', () => {
            assert.equal(migrate({ version: '2.0.0', logo: '/images/logo.svg' }).logo, '/img/logo.svg');
        });

        it('leaves custom logo and favicon paths alone', () => {
            const result = migrate({ version: '2.0.0', logo: '/images/mine.png', favicon: '/images/mine.ico' });
            assert.equal(result.logo, '/images/mine.png');
            assert.equal(result.head.favicon, '/images/mine.ico');
        });

        it('rewrites the default favicon path from /images to /img', () => {
            assert.equal(migrate({ version: '2.0.0', favicon: '/images/favicon.svg' }).head.favicon, '/img/favicon.svg');
        });

        it('renames renamed search, comment, donate, widget and plugin settings', () => {
            const result = migrate({
                version: '2.0.0',
                search: { type: 'google-cse' },
                comment: { type: 'changyan', appid: 'abc' },
                donate: [{ type: 'paypal' }],
                widgets: [{ type: 'archive' }, { type: 'category' }, { type: 'tag' }],
                plugins: { 'outdated-browser': true, 'back-to-top': true, 'baidu-analytics': { tracking_id: 1 }, 'google-analytics': { tracking_id: 2 } }
            });
            assert.equal(result.search.type, 'google_cse');
            assert.deepEqual(result.comment, { type: 'changyan', app_id: 'abc' });
            assert.deepEqual(result.donates, [{ type: 'paypal' }]);
            assert.equal('donate' in result, false);
            assert.deepEqual(result.widgets.map(w => w.type), ['archives', 'categories', 'tags']);
            assert.deepEqual(result.plugins, {
                outdated_browser: true,
                back_to_top: true,
                baidu_analytics: { tracking_id: 1 },
                google_analytics: { tracking_id: 2 }
            });
        });

        it('warns about the removed tagcloud widget', () => {
            const { output } = capture(() => new V2toV3().migrate({ version: '2.0.0', widgets: [{ type: 'tagcloud' }] }));
            assert.match(output, /tagcloud widget has been removed/);
        });
    });
});
