<p align="center">
<img height="48" src="https://ppoffice.github.io/hexo-theme-icarus/img/logo.svg" alt="Icarus">
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
<a href="https://ppoffice.github.io/hexo-theme-icarus/">Preview</a> ·
<a href="https://ppoffice.github.io/hexo-theme-icarus/tags/Icarus-User-Guide/">Documentation</a> ·
<a href="https://github.com/ppoffice/hexo-theme-icarus/discussions">Discussions</a> ·
<a href="https://github.com/ppoffice/hexo-theme-icarus/blob/master/README.zh-CN.md">简体中文</a>
</p>

![Icarus](https://ppoffice.github.io/hexo-theme-icarus/gallery/readme/preview.png "Icarus Preview")

## Quick Start

For a published install, in the root directory of a Hexo site compatible with `^7.1.1 || ^8.0.0`:

```shell
npm install hexo-theme-icarus hexo-renderer-inferno
hexo config theme icarus
hexo server
```

Icarus creates `_config.icarus.yml`, with every option described, on the first run.
See [Getting Started](https://ppoffice.github.io/hexo-theme-icarus/uncategorized/getting-started-with-icarus/)
for requirements, source installs, and the distinction between published packages and the current development checkout.

## Highlights

<table>
<tr>
<td width="33%" valign="top">
<img src="https://ppoffice.github.io/hexo-theme-icarus/gallery/readme/dark.png" alt="Dark appearance">
<p><b>Light, dark, or both</b><br>
Follow each visitor's system setting with <code>appearance: auto</code>, or go dark everywhere.</p>
</td>
<td width="33%" valign="top">
<img src="https://ppoffice.github.io/hexo-theme-icarus/gallery/readme/cyberpunk.png" alt="Cyberpunk variant">
<p><b>Cyberpunk variant</b><br>
A second look of neon-lit nights, HUD frames and scanlines, one line away.</p>
</td>
<td width="33%" valign="top">
<img src="https://ppoffice.github.io/hexo-theme-icarus/gallery/readme/responsive.png" alt="Responsive layout">
<p><b>Responsive</b><br>
One to three columns, navbar sub-menus that fold into a menu button, an optional sticky navbar (<code>navbar.sticky</code>), and a mobile table of contents.</p>
</td>
</tr>
<tr>
<td valign="top">
<img src="https://ppoffice.github.io/hexo-theme-icarus/gallery/readme/config.png" alt="Per-page configuration">
<p><b>Configure per page</b><br>
Set options site-wide, override them per layout in <code>_config.post.yml</code>, or per post in its front-matter.</p>
</td>
<td valign="top">
<img src="https://ppoffice.github.io/hexo-theme-icarus/gallery/readme/plugins.png" alt="Waline comments in the dark appearance">
<p><b>40+ plugins built in</b><br>
Comments, search, sharing, donations, analytics and widgets, ready to switch on in the config.</p>
</td>
<td valign="top">
<img src="https://ppoffice.github.io/hexo-theme-icarus/gallery/readme/accessible.png" alt="Navbar sub-menu opened with the keyboard">
<p><b>Fast and accessible</b><br>
PJAX page loading, keyboard and screen reader support, and translations into 17 languages.</p>
</td>
</tr>
</table>

<details>
<summary><b>Supported plugins</b></summary>

| Type | Plugins |
|---|---|
| [Comment](https://ppoffice.github.io/hexo-theme-icarus/categories/Plugins/Comment/) | Artalk, Beaudar, Changyan, Cusdis, Disqus, DisqusJS, Facebook, Giscus, Gitalk 2 (preview), Gitment (deprecated), Isso, LiveRe, Twikoo, Utterances, Valine (deprecated), Waline |
| [Search](https://ppoffice.github.io/hexo-theme-icarus/categories/Plugins/Search/) | Algolia, Baidu, Google CSE, Insight (built-in) |
| [Share](https://ppoffice.github.io/hexo-theme-icarus/categories/Plugins/Share/) | AddToAny, Baidu Share (deprecated), Web Share + AddToAny (Share.js compatibility), ShareThis |
| [Donate](https://ppoffice.github.io/hexo-theme-icarus/categories/Plugins/Donation/) | Afdian, Alipay, Buy Me a Coffee, Patreon, PayPal, WeChat Pay |
| [Analytics](https://ppoffice.github.io/hexo-theme-icarus/Plugins/Analytics/icarus-user-guide-web-analytics-plugins/) | Baidu Statistics, Bing Webmaster, BuSuanZi, CNZZ, Google Analytics, Hotjar, Matomo, StatCounter, Twitter Conversion Tracking, Umami, Waline page views |
| [Widgets](https://ppoffice.github.io/hexo-theme-icarus/categories/Widgets/) | Profile, Table of Contents, Recent Posts, Archives, Categories, Tags, GitHub Contributions, Links, Google AdSense, follow.it, Google FeedBurner (deprecated) |
| [Others](https://ppoffice.github.io/hexo-theme-icarus/categories/Plugins/) | Back to Top, Cookie Consent, Gallery (lightGallery + Justified Gallery), KaTeX, MathJax 4, Browser Capability Notice, Page Loading Animations, Page Prefetching on Hover, Progress Bar |

Most plugins are provided by [hexo-component-inferno](https://github.com/ppoffice/hexo-component-inferno).

</details>

## Documentation

[Getting Started](https://ppoffice.github.io/hexo-theme-icarus/uncategorized/getting-started-with-icarus/) ·
[Configuring the Theme](https://ppoffice.github.io/hexo-theme-icarus/Configuration/icarus-user-guide-configuring-the-theme/) ·
[Upgrade Guide](https://ppoffice.github.io/hexo-theme-icarus/uncategorized/upgrade-guide/) ·
[FAQ](https://ppoffice.github.io/hexo-theme-icarus/uncategorized/faq/) ·
[All Guides](https://ppoffice.github.io/hexo-theme-icarus/tags/Icarus-User-Guide/)

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
