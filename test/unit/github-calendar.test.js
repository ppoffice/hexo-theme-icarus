const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const { SchemaLoader } = require('hexo-component-inferno/lib/core/schema');
const { render, fixtureConfig } = require('../support/render');

async function renderCalendar(widget = {}, language = 'en') {
    const Calendar = require('hexo-component-inferno/lib/view/widget/github_calendar');
    return render(Calendar.Cacheable, {
        config: fixtureConfig({ language }),
        widget: { type: 'github_calendar', ...widget }
    });
}

describe('layout/widget/github_calendar', () => {
    before(() => render(() => null));

    it('resolves the component and schema from the library rather than a theme copy', () => {
        const view = require('hexo-component-inferno/lib/core/view');
        assert.equal(view.require.resolve('widget/github_calendar'), require.resolve('hexo-component-inferno/lib/view/widget/github_calendar'));
        for (const file of ['layout/widget/github_calendar.jsx', 'include/schema/widget/github_calendar.json', 'source/js/github-calendar.js']) {
            assert.equal(fs.existsSync(path.resolve(__dirname, '../..', file)), false, file);
        }
        assert.ok(fs.existsSync(require.resolve('hexo-component-inferno/lib/schema/widget/github_calendar.json')));
    });

    it('keeps variant-specific tokens out of shared calendar styles', () => {
        for (const file of ['include/style/widget.styl', 'include/style/dark.styl']) {
            assert.doesNotMatch(fs.readFileSync(path.resolve(__dirname, '../..', file), 'utf8'), /--m3-/);
        }
        const adapter = fs.readFileSync(path.resolve(__dirname, '../../include/style/m3e/widgets.styl'), 'utf8');
        assert.match(adapter, /--github-calendar-default-color: var\(--m3-primary\)/);
    });

    it('renders a data-driven contribution chart without a visible GitHub ID or inline scripts', async () => {
        const { $ } = await renderCalendar({ username: 'octocat' });
        assert.equal($('.widget[data-type="github_calendar"]').length, 1);
        assert.equal($('.menu-label').text(), 'GitHub Contributions');
        assert.equal($('img').length, 0);
        assert.equal($('.github-calendar-chart').attr('data-username'), 'octocat');
        assert.equal($('.github-calendar-status').text(), 'Loading contributions…');
        assert.equal($('script').length, 0);
        assert.equal($('.github-calendar-chart').attr('tabindex'), undefined);
        assert.equal($('.widget').clone().find('noscript').remove().end().text().includes('octocat'), false);
        assert.equal($('.github-calendar-link').attr('href'), 'https://github.com/octocat?tab=overview');
        assert.equal($('.github-calendar-link').attr('rel'), 'noopener noreferrer');
        assert.equal($('.github-calendar-link').attr('aria-label'), 'GitHub Contributions');
    });

    it('supports localized and custom titles and custom hex colors', async () => {
        const localized = await renderCalendar({ username: 'octocat' }, 'zh-CN');
        assert.equal(localized.$('.menu-label').text(), 'GitHub 贡献日历');
        for (const color of ['#40c463', '40c463']) {
            const { $ } = await renderCalendar({ username: ' octocat ', title: 'Activity', color });
            assert.equal($('.menu-label').text(), 'Activity');
            assert.match($('.github-calendar-chart').attr('style'), /--github-calendar-color:#40c463/);
        }
    });

    it('hides unconfigured or invalid usernames and falls back for an invalid color', async () => {
        for (const username of [undefined, null, '', ' ', '../foo', 'foo/bar', '<script>', 42]) {
            assert.equal((await renderCalendar({ username })).$('.widget').length, 0);
        }
        const { $ } = await renderCalendar({ username: 'octocat', color: 'red/other' });
        assert.equal($('.github-calendar-chart').attr('style'), undefined);
    });

    it('loads through the normal sidebar widget resolver on either side', async () => {
        for (const position of ['left', 'right']) {
            const { $ } = await render('common/widgets', {
                position,
                config: fixtureConfig({ widgets: [{ type: 'github_calendar', position, username: 'octocat' }] })
            });
            assert.equal($('.column-' + position + ' [data-type="github_calendar"]').length, 1);
        }
    });

    it('validates configuration and rejects malformed usernames and colors', () => {
        const schemaDir = path.resolve(__dirname, '../../include/schema');
        const schema = SchemaLoader.load(require('../../include/schema/config.json'), schemaDir).getSchema('/config.json');
        const valid = widget => schema.validate({ version: '5.1.0', widgets: [{ type: 'github_calendar', position: 'left', ...widget }] }) === true;
        for (const widget of [{}, { username: null }, { username: '' }, { username: 'octocat' }, { username: 'user-name', title: 'Activity', color: '#40c463' }]) {
            assert.ok(valid(widget), JSON.stringify(widget));
        }
        for (const widget of [{ username: '../foo' }, { username: 'a'.repeat(40) }, { username: 42 }, { color: 'red' }, { color: '#123' }, { title: 42 }]) {
            assert.ok(!valid(widget), JSON.stringify(widget));
        }
    });
});
