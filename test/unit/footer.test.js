const assert = require('assert').strict;
const { render, fixtureConfig, makePage } = require('../support/render');

const renderFooter = config => render('common/footer', { config: fixtureConfig(config), page: makePage() });

describe('layout/common/footer', () => {
    it('shows the current year and the author', async () => {
        const { $ } = await renderFooter();
        assert.match($('footer').text(), new RegExp(`© ${new Date().getFullYear()} Fixture Author`));
    });

    it('falls back to the site title when no author is set', async () => {
        const { $ } = await renderFooter({ author: null });
        assert.match($('footer').text(), /© \d{4} Icarus Fixture/);
    });

    it('renders the copyright text as HTML', async () => {
        const { $ } = await renderFooter();
        assert.equal($('footer b').text(), 'notice');
    });

    it('renders footer links', async () => {
        const { $ } = await renderFooter();
        const link = $('footer a[title="Creative Commons"]');
        assert.equal(link.attr('href'), 'https://creativecommons.org/');
        assert.ok(link.find('i').hasClass('fa-creative-commons'));
        assert.equal(link.attr('aria-label'), 'Creative Commons');
        assert.equal(link.find('i').attr('aria-hidden'), 'true');
    });

    describe('logo', () => {
        const logo = async config => (await renderFooter(config)).$('.footer-logo').html();
        const img = src => `<img src="${src}" alt="Icarus Fixture" height="28">`;

        it('is the logo image for the light appearance and the cyberpunk variant', async () => {
            assert.equal(await logo(), img('/img/logo.svg'));
            assert.equal(await logo({ variant: 'cyberpunk', appearance: 'auto' }), img('/img/logo.svg'));
        });

        it('switches to the dark logo for the dark appearance', async () => {
            assert.equal(await logo({ appearance: 'auto' }),
                '<picture><source srcset="/img/logo-dark.svg" media="(prefers-color-scheme: dark)">' + img('/img/logo.svg') + '</picture>');
            assert.equal(await logo({ appearance: 'dark' }), img('/img/logo-dark.svg'));
            assert.equal(await logo({ appearance: 'dark', logo: '/img/mine.svg', logo_dark: '/img/mine-dark.svg' }), img('/img/mine-dark.svg'));
        });

        it('keeps a logo of the site without logo_dark, and text logos', async () => {
            assert.equal(await logo({ appearance: 'dark', logo: '/img/mine.svg' }), img('/img/mine.svg'));
            assert.equal(await logo({ appearance: 'dark', logo: { text: 'Text Logo' } }), 'Text Logo');
        });
    });

    it('shows the busuanzi visitor counter only when enabled', async () => {
        assert.equal((await renderFooter()).$('#busuanzi_container_site_uv').length, 0);
        assert.equal((await renderFooter({ plugins: { busuanzi: true } })).$('#busuanzi_value_site_uv').length, 1);
    });
});
