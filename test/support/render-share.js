/** Render share lifecycle fixtures with Hexo's real Inferno compiler. */
const { render, fixtureConfig, makePage } = require('./render');

(async () => {
    const pages = {};
    const providers = {
        'share-none': null,
        'share-addtoany': 'addtoany',
        'share-web': 'web_share',
        'share-this': 'sharethis',
        'share-next': 'addtoany',
        'share-web-dark': 'web_share',
        'share-web-cyberpunk': 'web_share',
        'share-web-m3e': 'web_share'
    };
    for (const [name, type] of Object.entries(providers)) {
        const variants = { 'share-web-m3e': 'm3e', 'share-web-cyberpunk': 'cyberpunk' };
        const config = fixtureConfig({
            variant: variants[name] || 'default',
            appearance: name.endsWith('-dark') ? 'dark' : 'light',
            widgets: [], search: { type: null },
            plugins: { pjax: true, gallery: false, back_to_top: false },
            share: { type, install_url: 'https://platform-api.sharethis.com/js/sharethis.js#property=fixture&product=inline-share-buttons' }
        });
        const page = makePage({ title: name, path: name + '/', permalink: 'https://example.com/' + name + '/' });
        const share = await render('common/share', { config, page });
        const { html } = await render('layout', {
            config, page, site: { posts: [], categories: [], tags: [] },
            body: `<article class="article"><div class="content"><h1>${name}</h1></div>
                <div id="fixture-share">${share.html}</div>
                <nav>${Object.keys(providers).map(target => `<a class="share-nav" href="/${target}/">${target}</a>`).join(' ')}</nav>
            </article>`
        });
        pages[name] = html;
    }
    process.stdout.write(JSON.stringify(pages));
})().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
