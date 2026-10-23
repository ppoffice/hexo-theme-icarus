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

## Highlights

<div class="columns is-multiline">
<div class="column is-half-tablet is-one-third-widescreen">
<a class="gallery-item" href="/hexo-theme-icarus/gallery/readme/dark.png"><img src="/hexo-theme-icarus/gallery/readme/dark.png" alt="Dark appearance"></a>
<p><b>Light, dark, or both</b><br>
Follow each visitor's system setting with <code>appearance: auto</code>, or go dark everywhere.</p>
</div>
<div class="column is-half-tablet is-one-third-widescreen">
<a class="gallery-item" href="/hexo-theme-icarus/gallery/readme/cyberpunk.png"><img src="/hexo-theme-icarus/gallery/readme/cyberpunk.png" alt="Cyberpunk variant"></a>
<p><b>Cyberpunk variant</b><br>
A second look of neon-lit nights, HUD frames and scanlines, one line away.</p>
</div>
<div class="column is-half-tablet is-one-third-widescreen">
<a class="gallery-item" href="/hexo-theme-icarus/gallery/readme/responsive.png"><img src="/hexo-theme-icarus/gallery/readme/responsive.png" alt="Responsive layout"></a>
<p><b>Responsive</b><br>
One to three columns, navbar sub-menus that fold into a menu button, and a mobile table of contents.</p>
</div>
<div class="column is-half-tablet is-one-third-widescreen">
<a class="gallery-item" href="/hexo-theme-icarus/gallery/readme/config.png"><img src="/hexo-theme-icarus/gallery/readme/config.png" alt="Per-page configuration"></a>
<p><b>Configure per page</b><br>
Set options site-wide, override them per layout in <code>_config.post.yml</code>, or per post in its front-matter.</p>
</div>
<div class="column is-half-tablet is-one-third-widescreen">
<a class="gallery-item" href="/hexo-theme-icarus/gallery/readme/plugins.png"><img src="/hexo-theme-icarus/gallery/readme/plugins.png" alt="Waline comments in the dark appearance"></a>
<p><b>40+ plugins built in</b><br>
Comments, search, sharing, donations, analytics and widgets, ready to switch on in the config.</p>
</div>
<div class="column is-half-tablet is-one-third-widescreen">
<a class="gallery-item" href="/hexo-theme-icarus/gallery/readme/accessible.png"><img src="/hexo-theme-icarus/gallery/readme/accessible.png" alt="Navbar sub-menu opened with the keyboard"></a>
<p><b>Fast and accessible</b><br>
PJAX page loading, keyboard and screen reader support, and translations into 17 languages.</p>
</div>
</div>

<details>
<summary><b>Supported plugins</b></summary>

| Type | Plugins |
|---|---|
| [Comment](/hexo-theme-icarus/categories/Plugins/Comment/) | Artalk, Beaudar, Changyan, Cusdis, Disqus, DisqusJS, Facebook, Giscus, Gitalk, Gitment (deprecated), Isso, LiveRe, Twikoo, Utterances, Valine (deprecated), Waline |
| [Search](/hexo-theme-icarus/categories/Plugins/Search/) | Algolia, Baidu, Google CSE, Insight (built-in) |
| [Share](/hexo-theme-icarus/categories/Plugins/Share/) | AddToAny, Baidu Share, Share.js, ShareThis |
| [Donate](/hexo-theme-icarus/categories/Plugins/Donation/) | Afdian, Alipay, Buy Me a Coffee, Patreon, PayPal, WeChat Pay |
| {% post_link en/Web-Analytics-Plugins 'Analytics' %} | Baidu Statistics, Bing Webmaster, BuSuanZi, CNZZ, Google Analytics, Hotjar, Matomo, StatCounter, Twitter Conversion Tracking, Umami, Waline page views |
| [Widgets](/hexo-theme-icarus/categories/Widgets/) | Profile, Table of Contents, Recent Posts, Archives, Categories, Tags, Links, Google AdSense, follow.it, Google FeedBurner (deprecated) |
| [Others](/hexo-theme-icarus/categories/Plugins/) | Back to Top, Cookie Consent, Gallery (lightGallery + Justified Gallery), KaTeX, MathJax, Outdated Browser, Page Loading Animations, Progress Bar |

Most plugins are provided by [hexo-component-inferno](https://github.com/ppoffice/hexo-component-inferno).
Deprecated plugins rely on services that have shut down or are about to, and Hexo prints a warning when one is enabled.
Code blocks can use any [highlight.js](https://highlightjs.org/) theme, with a separate one for dark pages.

</details>

## Documentation

{% post_link en/Getting-Started 'Getting Started' %} ·
{% post_link en/Configuring-Theme 'Configuring the Theme' %} ·
{% post_link en/Upgrade-Guide 'Upgrade Guide' %} ·
{% post_link en/FAQ 'FAQ' %} ·
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
