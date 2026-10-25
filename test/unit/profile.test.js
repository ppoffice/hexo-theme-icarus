const assert = require('assert').strict;
const { render, fixtureConfig, makePage, createHelper } = require('../support/render');

const site = {
    posts: { length: 3 },
    categories: [{ length: 2 }, { length: 0 }],
    tags: [{ length: 1 }, { length: 1 }, { length: 0 }]
};

async function renderProfile(widget, overrides = {}) {
    return render('common/widgets', Object.assign({
        page: makePage(),
        site,
        position: 'left'
    }, overrides, { config: Object.assign({}, overrides.config || fixtureConfig(), {
        widgets: [Object.assign({ type: 'profile', position: 'left' }, widget)]
    }) }));
}

describe('shared profile widget integration', () => {
    before(() => render(() => null)); // registers the JSX loader

    it('shows the author, title, location and avatar', async () => {
        const { $ } = await renderProfile({ author: 'Ada', author_title: 'Engineer', location: 'London', avatar: '/me.png' });
        assert.equal($('.title').first().text(), 'Ada');
        assert.match($('.card-content').text(), /Engineer[\s\S]*London/);
        assert.equal($('img.avatar').attr('src'), '/me.png');
        assert.equal($('img.avatar').attr('alt'), 'Ada');
    });

    it('counts posts and only non-empty categories and tags', async () => {
        const { $ } = await renderProfile({});
        const counters = $('.level.is-mobile .level-item').map((i, el) => $(el).find('.title').text()).get();
        assert.deepEqual(counters, ['3', '1', '2']);
    });

    it('uses gravatar, then the configured avatar, and otherwise omits the image', async () => {
        assert.match((await renderProfile({ gravatar: 'a@example.com', avatar: '/ignored.png' })).$('img.avatar').attr('src'), /gravatar\.com\/avatar\//);
        assert.equal((await renderProfile({ avatar: '/me.png', gravatar: '' })).$('img.avatar').attr('src'), '/me.png');
        for (const avatar of [undefined, '', null]) {
            assert.equal((await renderProfile({ avatar })).$('figure, img.avatar').length, 0);
        }
    });

    it('renders icon social links with an accessible name', async () => {
        const { $ } = await renderProfile({ social_links: { GitHub: { icon: 'fab fa-github', url: 'https://github.com/x' } } });
        const link = $('a[title="GitHub"]');
        assert.equal(link.attr('aria-label'), 'GitHub');
        assert.equal(link.find('i').attr('aria-hidden'), 'true');
    });

    it('renders the name of social links without an icon', async () => {
        const { $ } = await renderProfile({ social_links: {
            Blog: 'https://blog.example.com',
            Mastodon: { url: 'https://mastodon.example.com/@x' }
        } });
        assert.equal($('a[title="Blog"]').text(), 'Blog');
        assert.equal($('a[title="Mastodon"]').text(), 'Mastodon');
        assert.equal($('a[title="Mastodon"] i').length, 0);
        assert.equal($('a[title="Mastodon"]').attr('href'), 'https://mastodon.example.com/@x');
    });

    it('resolves the chosen avatar once with subroots, relative links and external URLs', async () => {
        for (const overrides of [{}, { root: '/blog/', url: 'https://example.com/blog/' },
            { root: '/blog/', url: 'https://example.com/blog/', relative_link: true }]) {
            const config = fixtureConfig(overrides);
            const page = makePage({ path: '2024/01/01/profile/index.html' });
            const real = await createHelper(config, page);
            for (const avatar of [undefined, '/me.png', 'https://cdn.example.com/me.png']) {
                const calls = [];
                const helper = Object.assign({}, real, { url_for(url) { calls.push(url); return real.url_for(url); } });
                const { $ } = await renderProfile({ avatar }, { config, page, helper });
                const avatarCalls = avatar ? [avatar] : [];
                assert.deepEqual(calls, avatarCalls.concat(['/archives/', '/categories/', '/tags/']));
                assert.equal($('img.avatar').attr('src'), avatar ? real.url_for(avatar) : undefined);
            }
            const calls = [];
            const helper = Object.assign({}, real, { url_for(url) { calls.push(url); return real.url_for(url); } });
            const { $ } = await renderProfile({ gravatar: 'a@example.com', avatar: '/ignored.png' }, { config, page, helper });
            assert.match($('img.avatar').attr('src'), /gravatar\.com\/avatar\//);
            assert.deepEqual(calls, ['/archives/', '/categories/', '/tags/']);
        }
    });

    it('keeps translations, author fallback, rounded avatars and follow/social accessibility', async () => {
        const { $ } = await renderProfile({ avatar: '/author.png', avatar_rounded: true, follow_link: '/follow/', social_links: {
            Blog: '/about/', GitHub: { url: 'https://github.com/author', icon: 'fab fa-github' }
        } }, { config: fixtureConfig({ language: 'zh-CN', author: 'Site Author' }) });
        assert.equal($('img.avatar').attr('alt'), 'Site Author');
        assert.ok($('img.avatar').hasClass('is-rounded'));
        assert.deepEqual($('.heading').map((i, el) => $(el).text()).get(), ['文章', '分类', '标签']);
        const follow = $('a.button.is-primary');
        assert.equal(follow.text(), '关注我');
        assert.equal(follow.attr('href'), '/follow/');
        for (const link of [follow, $('a[title="Blog"]'), $('a[title="GitHub"]')]) {
            assert.equal(link.attr('target'), '_blank');
            assert.equal(link.attr('rel'), 'me noopener');
        }
        assert.equal($('a[title="Blog"]').text(), 'Blog');
        assert.equal($('a[title="Blog"]').attr('aria-label'), undefined);
        assert.equal($('a[title="GitHub"]').attr('aria-label'), 'GitHub');
        assert.equal($('a[title="GitHub"] i').attr('aria-hidden'), 'true');
        for (const author of ['', null]) {
            assert.equal((await renderProfile({ author })).$('.title.is-size-4').length, 0);
        }
    });

    it('resolves the shared component through the widget loader on either sidebar', async () => {
        const view = require('hexo-component-inferno/lib/core/view');
        assert.equal(view.require('widget/profile'), require('hexo-component-inferno/lib/view/widget/profile'));
        for (const position of ['left', 'right']) {
            const { $ } = await render('common/widgets', {
                position, site, config: fixtureConfig({ widgets: [{ type: 'profile', position }] })
            });
            assert.equal($('.column-' + position + ' .widget[data-type="profile"]').length, 1);
            assert.equal($('img.avatar').length, 0);
        }
    });

});
