const { test, expect } = require('./fixtures');
const { execFileSync } = require('child_process');

const pages = {};

test.beforeAll(() => {
    // Render outside Playwright's require hook: its JSX transform creates test
    // locator objects, whereas the real Hexo renderer must create Inferno VNodes.
    Object.assign(pages, JSON.parse(execFileSync(process.execPath, ['-e', `
    const { render, fixtureConfig, makePage } = require(process.argv[1]);
    (async () => {
    const pages = {};
    for (const variant of ['default', 'cyberpunk', 'm3e']) {
        const { html } = await render('layout', {
            config: fixtureConfig({ variant, author: 'Profile Author', search: { type: null }, widgets: [{
                type: 'profile', position: 'left', author_title: 'Writer', location: 'London', avatar_rounded: true,
                follow_link: '/about/', social_links: { Blog: '/about/', GitHub: { url: 'https://github.com/author', icon: 'fab fa-github' } }
            }] }),
            site: { posts: { length: 3 }, categories: [{ length: 2 }, { length: 0 }], tags: [{ length: 1 }] },
            page: makePage({ path: 'profile-default-avatar/', permalink: 'http://localhost:4000/profile-default-avatar/' }),
            body: '<article class="article"><div class="content">Shared profile</div></article>'
        });
        pages[variant] = html;
    }
    process.stdout.write(JSON.stringify(pages));
    })().catch(error => { console.error(error); process.exitCode = 1; });
    `, require.resolve('../support/render')], {
        encoding: 'utf8',
        env: { ...process.env, NODE_OPTIONS: '', NODE_ENV: 'production', BABEL_DISABLE_CACHE: '1' }
    })));
});

for (const variant of ['default', 'cyberpunk', 'm3e']) {
    test(`renders the shared Profile with the real theme avatar and ${variant} stylesheet`, async ({ page, visit, diagnostics }) => {
        await page.setViewportSize({ width: 1600, height: 1000 });
        await page.route('**/profile-default-avatar/', route => route.fulfill({ contentType: 'text/html', body: pages[variant] }));
        await visit('/profile-default-avatar/', { variant });
        const profile = page.locator('.widget[data-type="profile"]');
        await expect(profile).toBeVisible();
        const avatar = profile.getByRole('img', { name: 'Profile Author' });
        await expect(avatar).toHaveAttribute('src', '/img/avatar.png');
        await expect(avatar).toHaveClass('avatar is-rounded');
        expect(await avatar.evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
        await expect(profile.locator('.title.is-size-4')).toHaveText('Profile Author');
        await expect(profile.locator('.heading')).toHaveText(['Posts', 'Category', 'Tag']);
        await expect(profile.locator('nav.is-mobile .title')).toHaveText(['3', '1', '1']);
        await expect(profile.getByRole('link', { name: 'Follow', exact: true })).toHaveAttribute('href', '/about/');
        await expect(profile.getByRole('link', { name: 'Blog', exact: true })).toBeVisible();
        await expect(profile.getByRole('link', { name: 'GitHub', exact: true })).toHaveAttribute('rel', 'me noopener');
        expect(await page.locator(`link[data-variant][href="/css/${variant}.css"]`).evaluate(link => !!link.sheet)).toBe(true);
        expect(diagnostics.pageErrors).toEqual([]);
        expect(diagnostics.failedRequests).toEqual([]);
    });
}
