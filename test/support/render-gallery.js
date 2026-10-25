/** Render Gallery lifecycle fixtures using Hexo's actual Inferno compiler, not Playwright JSX. */
const { render, fixtureConfig, makePage } = require('./render');

(async () => {
    const pages = {};
    for (const [name, gallery] of [['gallery-on', true], ['gallery-off', false], ['gallery-next', true], ['gallery-loli', true]]) {
        const { html } = await render('layout', {
            config: fixtureConfig({ widgets: [], search: { type: null }, providers: { cdn: name === 'gallery-loli' ? 'loli' : 'jsdelivr' }, plugins: { pjax: true, gallery, back_to_top: false } }),
            page: makePage({ title: name, path: name + '/', permalink: 'http://localhost:4000/' + name + '/' }),
            site: { posts: [], categories: [], tags: [] },
            body: `<article class="article" id="gallery-article"><div class="content">
                <img id="plain" src="/img/avatar.png" alt="&lt;img src=x onerror=window.__injected=1&gt;">
                <img id="empty" src="/img/avatar.png" alt="">
                <a id="existing" href="https://example.com/"><img id="linked" src="/img/avatar.png" alt="Linked"></a>
                <img id="excluded" class="not-gallery-item" src="/img/avatar.png" alt="Excluded">
                <div class="justified-gallery" id="justified"><p><img src="/img/avatar.png" alt="Grid"></p></div>
                <a class="gallery-nav" href="/gallery-on/">On</a>
                <a class="gallery-nav" href="/gallery-off/">Off</a>
                <a class="gallery-nav" href="/gallery-next/">Next</a>
                <a class="gallery-nav" href="/gallery-loli/">Loli</a>
            </div></article>`
        });
        pages[name] = html;
    }
    process.stdout.write(JSON.stringify(pages));
})().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
