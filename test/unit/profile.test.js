const assert = require('assert').strict;
const { render, fixtureConfig, makePage } = require('../support/render');

const site = {
    posts: { length: 3 },
    categories: [{ length: 2 }, { length: 0 }],
    tags: [{ length: 1 }, { length: 1 }, { length: 0 }]
};

async function renderProfile(widget) {
    const Profile = require('../../layout/widget/profile');
    return render(Profile.Cacheable, {
        config: fixtureConfig(),
        page: makePage(),
        site,
        widget: Object.assign({ type: 'profile', position: 'left' }, widget)
    });
}

describe('layout/widget/profile', () => {
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

    it('uses gravatar, then the avatar, then the default image', async () => {
        assert.match((await renderProfile({ gravatar: 'a@example.com' })).$('img.avatar').attr('src'), /gravatar\.com\/avatar\//);
        assert.equal((await renderProfile({})).$('img.avatar').attr('src'), '/img/avatar.png');
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
});
