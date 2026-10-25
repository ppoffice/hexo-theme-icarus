const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { moment } = require('hexo/dist/plugins/helper/date');
const generateArchives = require('hexo-generator-archive/lib/generator');
const { render, createHelper, fixtureConfig, getHexo } = require('../support/render');

describe('date dependency compatibility boundary', () => {
    for (const [timezone, instant, year, month, label] of [
        ['Asia/Shanghai', '2023-12-31T23:30:00Z', 2024, 1, '2024-01-01 07:30 +08:00'],
        ['America/Los_Angeles', '2024-03-01T01:00:00Z', 2024, 2, '2024-02-29 17:00 -08:00'],
        ['America/New_York', '2024-03-10T07:30:00Z', 2024, 3, '2024-03-10 03:30 -04:00']
    ]) {
        it(`keeps generator routes, archive labels and machine dates aligned in ${timezone}`, async () => {
            const hexo = await getHexo();
            const config = fixtureConfig({ timezone, language: 'en', date_format: 'YYYY-MM-DD HH:mm Z',
                archive_generator: { yearly: true, monthly: true, per_page: 10, order_by: '-date' } });
            // Hexo hands generators timezone-aware Moments, not native Dates.
            const date = moment.utc(instant).tz(timezone).locale('en');
            const post = { date, title: 'Boundary post', path: 'boundary/', categories: [] };
            const Query = hexo.model('Post').Query;
            const routes = generateArchives.call({ config, model: name => hexo.model(name) }, {
                posts: new Query([post])
            });
            const monthly = routes.find(route => route.path === `archives/${year}/${String(month).padStart(2, '0')}/`);
            assert.ok(monthly, routes.map(route => route.path).join(', '));
            assert.equal(monthly.data.year, year);
            assert.equal(monthly.data.month, month);
            const { $ } = await render('archive', { config, page: monthly.data });
            assert.equal($('.tag.is-primary').text(), date.format('MMMM YYYY'));
            assert.equal($('time').text(), label);
            assert.equal($('time').attr('datetime'), new Date(instant).toISOString());
            const all = routes.find(route => route.path === 'archives/');
            assert.equal((await render('archive', { config, page: all.data })).$('.tag.is-primary').text(), String(year));
        });
    }

    it('keeps Hexo format tokens, per-page locale aliases and UTC serialization', async () => {
        const config = fixtureConfig({ timezone: 'Asia/Shanghai', language: 'en', date_format: '[published] YYYY/MM/DD dddd' });
        const helper = await createHelper(config, { lang: 'zh_CN' });
        const date = moment.utc('2023-12-31T23:30:00Z');
        assert.equal(helper.date(date), 'published 2024/01/01 星期一');
        assert.equal(helper.date_xml(date), '2023-12-31T23:30:00.000Z');
    });

    for (const date of [new Date('2024-01-01T08:00:00+08:00'), moment.parseZone('2024-01-01T08:00:00+08:00')]) {
        it(`serializes ${date instanceof Date ? 'native Date' : 'Moment'} metadata without a locale or timezone shift`, async () => {
            const props = { date, updated: date, url: 'https://example.com/post/' };
            const OpenGraph = require('hexo-component-inferno/lib/view/misc/open_graph');
            const StructuredData = require('hexo-component-inferno/lib/view/misc/structured_data');
            const { $ } = await render(OpenGraph, props);
            assert.equal($('meta[property="article:published_time"]').attr('content'), '2024-01-01T00:00:00.000Z');
            assert.equal($('meta[property="article:modified_time"]').attr('content'), '2024-01-01T00:00:00.000Z');
            const structured = await render(StructuredData, props);
            const data = JSON.parse(structured.$('script[type="application/ld+json"]').html());
            assert.equal(data.datePublished, '2024-01-01T00:00:00.000Z');
            assert.equal(data.dateModified, '2024-01-01T00:00:00.000Z');
        });
    }

    function runRelativeDate(language, datetime, intl = Intl) {
        let text = 'server date';
        const element = {};
        const empty = { length: 0, each() { return this; }, wrap() { return this; }, addClass() { return this; }, click() { return this; }, remove() { return this; } };
        const jQuery = selector => {
            if (selector === element) return { attr: () => datetime, text: value => { text = value; } };
            if (selector === '.article-meta time') return { each: visit => visit.call(element) };
            return empty;
        };
        jQuery.fn = {};
        class FixedDate extends Date {
            static now() { return Date.parse('2024-01-04T00:00:00Z'); }
        }
        vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../../source/js/main.js'), 'utf8'), {
            jQuery, Date: FixedDate, Intl: intl,
            document: { documentElement: { lang: language }, querySelectorAll: () => [] },
            window: { HexoGallery: { init() {} }, IcarusNavbar: { refresh() {} } }
        });
        return text;
    }

    for (const [language, expected] of [['en', '3 days ago'], ['zh-CN', '3天前'], ['vn', '3 ngày trước'], ['not_a_locale', '3 days ago']]) {
        it(`uses native relative dates with ${language} and offset-bearing ISO input`, () => {
            assert.equal(runRelativeDate(language, '2024-01-01T08:00:00+08:00'), expected);
        });
    }

    it('preserves static text without Intl.RelativeTimeFormat or with an invalid date', () => {
        assert.equal(runRelativeDate('en', '2024-01-01', {}), 'server date');
        assert.equal(runRelativeDate('en', 'invalid'), 'server date');
    });
});
