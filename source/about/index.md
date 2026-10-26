title: About
toc: true
---
<p align="center">
<img class="not-gallery-item" style="height:48px;width:auto" src="/hexo-theme-icarus/img/logo.svg" alt="Icarus">
</p>
<p align="center">
<a href="https://www.npmjs.com/package/hexo-theme-icarus"><img src="https://img.shields.io/npm/v/hexo-theme-icarus" alt="npm version"></a>
<a href="https://www.npmjs.com/package/hexo-theme-icarus"><img src="https://img.shields.io/npm/dm/hexo-theme-icarus" alt="npm downloads"></a>
<a href="https://github.com/ppoffice/hexo-theme-icarus/actions/workflows/test.yml"><img src="https://github.com/ppoffice/hexo-theme-icarus/actions/workflows/test.yml/badge.svg" alt="Test"></a>
<a href="https://github.com/ppoffice/hexo-theme-icarus/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/hexo-theme-icarus" alt="License"></a>
</p>
<p align="center">
A simple, delicate, and modern theme for the static site generator <a href="https://hexo.io/">Hexo</a>.
<br>
<a href="/hexo-theme-icarus/">Preview</a> ·
<a href="/hexo-theme-icarus/tags/Icarus-User-Guide/">Documentation</a> ·
<a href="https://github.com/ppoffice/hexo-theme-icarus/discussions">Discussions</a> ·
<a href="https://github.com/ppoffice/hexo-theme-icarus/blob/master/README.zh-CN.md">简体中文</a>
</p>

<a class="gallery-item" href="/hexo-theme-icarus/gallery/readme/preview.png"><img src="/hexo-theme-icarus/gallery/readme/preview.png" alt="Icarus preview"></a>

## Quick Start

In the root directory of your Hexo 7.1+ or Hexo 8 site:

```shell
npm install hexo-theme-icarus hexo-renderer-inferno
hexo config theme icarus
hexo server
```

Icarus creates `_config.icarus.yml`, with every option described, on the first run.
See {% post_link en/Getting-Started 'Getting Started' %} for other ways to install it.

## Three Variants

One line in `_config.icarus.yml`, or in the front-matter of a single post, switches the whole look.

<div class="columns is-multiline">
<div class="column is-half-tablet is-one-third-widescreen">
<a class="gallery-item" href="/hexo-theme-icarus/gallery/readme/dark.png"><img src="/hexo-theme-icarus/gallery/readme/dark.png" alt="The default variant, half light and half dark"></a>
<p><b>Default</b> · <code>variant: default</code><br>
The classic Icarus look in light, dark, or <code>appearance: auto</code>, which follows each visitor's system and adds a light/dark switch to the navbar.
{% post_link demo/Dark-Mode 'Demo' %}</p>
</div>
<div class="column is-half-tablet is-one-third-widescreen">
<a class="gallery-item" href="/hexo-theme-icarus/gallery/readme/cyberpunk.png"><img src="/hexo-theme-icarus/gallery/readme/cyberpunk.png" alt="The Cyberpunk variant"></a>
<p><b>Cyberpunk</b> · <code>variant: cyberpunk</code><br>
Always dark: neon colors, HUD panels with chamfered corners, scanlines, and its own code palette.
{% post_link demo/Cyberpunk 'Demo' %}</p>
</div>
<div class="column is-half-tablet is-one-third-widescreen">
<a class="gallery-item" href="/hexo-theme-icarus/gallery/readme/m3e.png"><img src="/hexo-theme-icarus/gallery/readme/m3e.png" alt="The Material 3 Expressive variant, half light and half dark"></a>
<p><b>Material 3 Expressive</b> · <code>variant: m3e</code><br>
Tinted surfaces, rounded cards, and pill-shaped controls that change shape on hover and keyboard focus, with light and dark schemes.
{% post_link demo/Material-3-Expressive 'Demo' %}</p>
</div>
</div>

## Highlights

<div class="columns is-multiline">
<div class="column is-half-tablet is-one-third-widescreen">
<a class="gallery-item" href="/hexo-theme-icarus/gallery/readme/responsive.png"><img src="/hexo-theme-icarus/gallery/readme/responsive.png" alt="Responsive layout on a desktop and a phone"></a>
<p><b>Responsive</b><br>
One to three columns, navbar sub-menus that fold into a menu button, an optional sticky navbar, and a mobile table of contents.</p>
</div>
<div class="column is-half-tablet is-one-third-widescreen">
<a class="gallery-item" href="/hexo-theme-icarus/gallery/readme/config.png"><img src="/hexo-theme-icarus/gallery/readme/config.png" alt="Per-page configuration"></a>
<p><b>Configure per page</b><br>
Set options site-wide, override them per layout in <code>_config.post.yml</code>, or per post in its front-matter.</p>
</div>
<div class="column is-half-tablet is-one-third-widescreen">
<a class="gallery-item" href="/hexo-theme-icarus/gallery/readme/plugins.png"><img src="/hexo-theme-icarus/gallery/readme/plugins.png" alt="Giscus comments, Insight search, gallery, sharing, donation buttons, MathJax and widgets"></a>
<p><b>50+ plugins built in</b><br>
Comments, search, sharing, donations, analytics and widgets, ready to switch on in the config.</p>
</div>
</div>

Also built in:

- **Fast navigation**: PJAX page loading with scroll restoration on Back/Forward, and page prefetching on hover.
- **Reading**: a reading progress bar, folded code blocks with a preview, and a notice on posts that have not been updated for a long time.
- **Math and images**: KaTeX or MathJax 4, and lightGallery 3 with Justified Gallery.
- **Privacy**: in `opt-in` mode, Cookie Consent loads the built-in analytics only after visitors allow them; Web Share shares without a third-party SDK.
- **Accessible**: keyboard navigation, screen reader labels, `/` or Ctrl+K to search, and translations into 17 languages.

<details>
<summary><b>Supported integrations</b></summary>

| Type | Integrations |
|---|---|
| [Comment](/hexo-theme-icarus/categories/Plugins/Comment/) | Artalk, Beaudar, Changyan, Disqus, DisqusJS, Giscus, Gitalk 2 (preview), Isso, LiveRe, Twikoo, Utterances, Waline |
| [Search](/hexo-theme-icarus/categories/Plugins/Search/) | Algolia, Baidu, Google CSE, Insight (built-in) |
| [Share](/hexo-theme-icarus/categories/Plugins/Share/) | AddToAny, ShareThis, Web Share |
| [Donate](/hexo-theme-icarus/categories/Plugins/Donation/) | Afdian, Alipay, Buy Me a Coffee, Patreon, PayPal, WeChat Pay |
| {% post_link en/Web-Analytics-Plugins 'Analytics' %} | Baidu Statistics, Bing Webmaster, BuSuanZi, CNZZ (Umeng+), Google Analytics, Hotjar, Matomo, StatCounter, X (Twitter) Conversion Tracking, Umami, Waline page views |
| [Widgets](/hexo-theme-icarus/categories/Widgets/) | Profile, Table of Contents, Recent Posts, Archives, Categories, Tags, GitHub Contributions, Links, Google AdSense, follow.it |
| [Others](/hexo-theme-icarus/categories/Plugins/) | Back to Top, Cookie Consent, Gallery (lightGallery + Justified Gallery), KaTeX, MathJax 4, Browser Capability Notice, Page Loading Animations, PJAX, Page Prefetching, Progress Bar |

Most integrations are provided by [hexo-component-inferno](https://github.com/ppoffice/hexo-component-inferno).
The image viewer uses [lightGallery 3.0.0](https://github.com/sachinchoolur/lightGallery),
under [GPLv3 or a commercial license](https://www.lightgalleryjs.com/docs/license/).
Code blocks can use any [highlight.js](https://highlightjs.org/) theme, with a separate one for dark pages.

</details>

## Documentation

{% post_link en/Getting-Started 'Getting Started' %} ·
{% post_link en/Configuring-Theme 'Configuring the Theme' %} ·
{% post_link en/Upgrade-Guide 'Upgrade Guide' %} ·
{% post_link en/FAQ 'FAQ' %} ·
[Demos](/hexo-theme-icarus/tags/Demo/) ·
[All Guides](/hexo-theme-icarus/tags/Icarus-User-Guide/)

## Contributing

Bug reports, feature ideas, [translations](https://github.com/ppoffice/hexo-theme-icarus/tree/master/languages)
and [tutorials](https://github.com/ppoffice/hexo-theme-icarus/new/site/source/_posts) are all welcome.
Open an [issue](https://github.com/ppoffice/hexo-theme-icarus/issues/new/choose) or a pull request.

Icarus is built with [Hexo](https://hexo.io/), [Inferno](https://infernojs.org/),
[Stylus](https://stylus-lang.com/) and [Bulma](https://bulma.io/). To work on it:

```shell
npm ci
npm run lint
npm test            # unit and integration tests
npm run test:e2e    # browser tests; run "npx playwright install chromium" once first
```

The tests need Node.js 20.19 or later. See the
[contributing guide](https://github.com/ppoffice/hexo-theme-icarus/blob/master/CONTRIBUTING.md) for code style and commit conventions.

## License

[MIT](https://github.com/ppoffice/hexo-theme-icarus/blob/master/LICENSE)
