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
一款简洁、精致、现代的 <a href="https://hexo.io/zh-cn/">Hexo</a> 主题。
<br>
<a href="https://ppoffice.github.io/hexo-theme-icarus/">预览</a> ·
<a href="https://ppoffice.github.io/hexo-theme-icarus/tags/Icarus%E7%94%A8%E6%88%B7%E6%8C%87%E5%8D%97/">中文文档</a> ·
<a href="https://github.com/ppoffice/hexo-theme-icarus/discussions">讨论区</a> ·
<a href="https://github.com/ppoffice/hexo-theme-icarus/blob/master/README.md">English</a>
</p>

![Icarus](https://ppoffice.github.io/hexo-theme-icarus/gallery/readme/preview.png "Icarus 预览")

## 快速开始

安装发布版时，在兼容 `^7.1.1 || ^8.0.0` 的 Hexo 站点根目录运行：

```shell
npm install hexo-theme-icarus hexo-renderer-inferno
hexo config theme icarus
hexo server
```

第一次运行时，Icarus 会在站点根目录生成 `_config.icarus.yml`，每个配置项都附有说明。
环境要求、源码安装及发布包与当前开发代码的区别，请看[Icarus快速上手](https://ppoffice.github.io/hexo-theme-icarus/uncategorized/icarus快速上手/)。

## 三种主题变体

在 `_config.icarus.yml` 或单篇文章的 front-matter 里改一行，就能切换整体外观。

<table>
<tr>
<td width="33%" valign="top">
<img src="https://ppoffice.github.io/hexo-theme-icarus/gallery/readme/dark.png" alt="默认变体，一半亮色一半暗色">
<p><b>默认</b> · <code>variant: default</code><br>
经典的 Icarus 外观，可用亮色、暗色或 <code>appearance: auto</code>：跟随访客的系统设置，并在导航栏提供亮暗切换按钮。
<a href="https://ppoffice.github.io/hexo-theme-icarus/uncategorized/dark-appearance/">演示</a></p>
</td>
<td width="33%" valign="top">
<img src="https://ppoffice.github.io/hexo-theme-icarus/gallery/readme/cyberpunk.png" alt="Cyberpunk 变体">
<p><b>Cyberpunk</b> · <code>variant: cyberpunk</code><br>
始终是暗色：霓虹配色、切角 HUD 面板、扫描线，代码块也有自己的配色。
<a href="https://ppoffice.github.io/hexo-theme-icarus/uncategorized/cyberpunk-theme-variant/">演示</a></p>
</td>
<td width="33%" valign="top">
<img src="https://ppoffice.github.io/hexo-theme-icarus/gallery/readme/m3e.png" alt="Material 3 Expressive 变体，一半亮色一半暗色">
<p><b>Material 3 Expressive</b> · <code>variant: m3e</code><br>
柔和着色的表面、圆角卡片和胶囊形控件，悬停或键盘聚焦时会变换形状，支持亮色和暗色。
<a href="https://ppoffice.github.io/hexo-theme-icarus/uncategorized/material-3-expressive主题变体介绍/">演示</a></p>
</td>
</tr>
</table>

## 亮点

<table>
<tr>
<td width="33%" valign="top">
<img src="https://ppoffice.github.io/hexo-theme-icarus/gallery/readme/responsive.png" alt="桌面端和手机端的响应式布局">
<p><b>响应式布局</b><br>
一到三栏布局，导航栏子菜单放不下时折叠成菜单按钮，导航栏可固定在顶部，手机端也能打开文章目录。</p>
</td>
<td width="33%" valign="top">
<img src="https://ppoffice.github.io/hexo-theme-icarus/gallery/readme/config.png" alt="按页面配置">
<p><b>按页面配置</b><br>
全站统一配置，也可以用 <code>_config.post.yml</code> 等布局配置文件，或文章的 front-matter 单独覆盖。</p>
</td>
<td width="33%" valign="top">
<img src="https://ppoffice.github.io/hexo-theme-icarus/gallery/readme/plugins.png" alt="Giscus 评论、Insight 搜索、图片画廊、分享、打赏按钮、MathJax 和小组件">
<p><b>内置 50 多个插件</b><br>
评论、搜索、分享、打赏、统计和侧边栏小组件，在配置文件里打开就能用。</p>
</td>
</tr>
</table>

此外还内置了：

- **快速浏览**：PJAX 无刷新加载，前进后退时恢复滚动位置；鼠标悬停时预加载页面。
- **阅读体验**：阅读进度条、可预览的折叠代码块，以及长期未更新文章的提示。
- **公式与图片**：KaTeX 或 MathJax 4，lightGallery 3 搭配 Justified Gallery。
- **隐私**：Cookie 提示在 `opt-in` 模式下，访客同意后才加载内置统计；Web Share 分享无需第三方 SDK。
- **无障碍**：支持键盘操作和屏幕阅读器，按 `/` 或 Ctrl+K 打开搜索，内置 17 种语言的翻译。

<details>
<summary><b>支持的集成</b></summary>

| 类型 | 集成 |
|---|---|
| [评论](https://ppoffice.github.io/hexo-theme-icarus/categories/Plugins/Comment/) | Artalk、Beaudar、畅言、Disqus、DisqusJS、Giscus、Gitalk 2（预览版）、Isso、来必力（LiveRe）、Twikoo、Utterances、Waline |
| [搜索](https://ppoffice.github.io/hexo-theme-icarus/categories/Plugins/Search/) | Algolia、百度、Google 自定义搜索、Insight（内置） |
| [分享](https://ppoffice.github.io/hexo-theme-icarus/categories/Plugins/Share/) | AddToAny、ShareThis、Web Share |
| [打赏](https://ppoffice.github.io/hexo-theme-icarus/categories/Plugins/Donation/) | 爱发电、支付宝、Buy Me a Coffee、Patreon、PayPal、微信 |
| [统计](https://ppoffice.github.io/hexo-theme-icarus/Plugins/Analytics/icarus-user-guide-web-analytics-plugins/) | 百度统计、Bing 网站管理员工具、不蒜子、CNZZ（友盟+）、Google Analytics、Hotjar、Matomo、StatCounter、X（Twitter）转化跟踪、Umami、Waline 阅读量 |
| [小组件](https://ppoffice.github.io/hexo-theme-icarus/categories/Widgets/) | 个人信息、文章目录、最新文章、归档、分类、标签、GitHub 贡献日历、链接、Google AdSense、follow.it |
| [其他](https://ppoffice.github.io/hexo-theme-icarus/categories/Plugins/) | 回到顶部、Cookie 提示、图片画廊（lightGallery + Justified Gallery）、KaTeX、MathJax 4、浏览器能力提示、页面加载动画、PJAX、页面预加载、进度条 |

大部分集成由 [hexo-component-inferno](https://github.com/ppoffice/hexo-component-inferno) 提供。

</details>

## 文档

[快速上手](https://ppoffice.github.io/hexo-theme-icarus/uncategorized/icarus快速上手/) ·
[主题配置](https://ppoffice.github.io/hexo-theme-icarus/Configuration/icarus用户指南-主题配置/) ·
[升级指南](https://ppoffice.github.io/hexo-theme-icarus/uncategorized/升级指南/) ·
[常见问题](https://ppoffice.github.io/hexo-theme-icarus/uncategorized/常见问题/) ·
[功能演示](https://ppoffice.github.io/hexo-theme-icarus/tags/Demo/) ·
[中文用户指南](https://ppoffice.github.io/hexo-theme-icarus/tags/Icarus%E7%94%A8%E6%88%B7%E6%8C%87%E5%8D%97/) ·
[全部文档](https://ppoffice.github.io/hexo-theme-icarus/categories/)

## 参与贡献

欢迎提交 bug、建议新功能、[添加翻译](https://github.com/ppoffice/hexo-theme-icarus/tree/master/languages)或[投稿教程](https://github.com/ppoffice/hexo-theme-icarus/new/site/source/_posts)。
可以[新建 issue](https://github.com/ppoffice/hexo-theme-icarus/issues/new/choose)，或直接提交 pull request。

Icarus 基于 [Hexo](https://hexo.io/zh-cn/)、[Inferno](https://infernojs.org/)、[Stylus](https://stylus-lang.com/) 和 [Bulma](https://bulma.io/) 开发。参与开发：

```shell
npm ci
npm run lint
npm test            # 单元测试和集成测试
npm run test:e2e    # 浏览器测试，首次运行前先执行 "npx playwright install chromium"
```

测试需要 Node.js 20.19 或更高版本。代码风格和提交规范见[贡献指南](https://github.com/ppoffice/hexo-theme-icarus/blob/master/CONTRIBUTING.md)。

## 许可证

[MIT](https://github.com/ppoffice/hexo-theme-icarus/blob/master/LICENSE)
