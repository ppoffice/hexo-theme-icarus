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

在 Hexo 7.1 以上或 Hexo 8 站点的根目录下运行：

```shell
npm install hexo-theme-icarus hexo-renderer-inferno
hexo config theme icarus
hexo server
```

第一次运行时，Icarus 会在站点根目录生成 `_config.icarus.yml`，每个配置项都附有说明。
其他安装方式请看[用户指南](https://ppoffice.github.io/hexo-theme-icarus/tags/Icarus%E7%94%A8%E6%88%B7%E6%8C%87%E5%8D%97/)里的「Icarus快速上手」。

## 亮点

<table>
<tr>
<td width="33%" valign="top">
<img src="https://ppoffice.github.io/hexo-theme-icarus/gallery/readme/dark.png" alt="暗黑模式">
<p><b>亮色、暗色或自动切换</b><br>
用 <code>appearance: auto</code> 跟随访客的系统设置，也可以全站使用暗色。</p>
</td>
<td width="33%" valign="top">
<img src="https://ppoffice.github.io/hexo-theme-icarus/gallery/readme/cyberpunk.png" alt="Cyberpunk 风格">
<p><b>Cyberpunk 风格</b><br>
灵感来自<a href="https://www.cyberpunk.net">《赛博朋克 2077》</a>的另一套外观，改一行配置即可切换。</p>
</td>
<td width="33%" valign="top">
<img src="https://ppoffice.github.io/hexo-theme-icarus/gallery/readme/responsive.png" alt="响应式布局">
<p><b>响应式布局</b><br>
一到三栏布局，导航栏支持子菜单，放不下时自动折叠成菜单按钮，手机端也能打开文章目录。</p>
</td>
</tr>
<tr>
<td valign="top">
<p><b>按页面配置</b><br>
全站统一配置，也可以用 <code>_config.post.yml</code> 等布局配置文件，或文章的 front-matter 单独覆盖。</p>
</td>
<td valign="top">
<p><b>内置 40 多个插件</b><br>
评论、搜索、分享、打赏、统计和侧边栏小组件，在配置文件里打开就能用。</p>
</td>
<td valign="top">
<p><b>快速且无障碍</b><br>
PJAX 无刷新加载页面，支持键盘操作和屏幕阅读器，内置 17 种语言的翻译。</p>
</td>
</tr>
</table>

<details>
<summary><b>支持的插件</b></summary>

| 类型 | 插件 |
|---|---|
| [评论](https://ppoffice.github.io/hexo-theme-icarus/categories/Plugins/Comment/) | Artalk、Beaudar、畅言、Cusdis、Disqus、DisqusJS、Facebook、Giscus、Gitalk、Gitment、Isso、来必力（LiveRe）、Twikoo、Utterances、Valine、Waline |
| [搜索](https://ppoffice.github.io/hexo-theme-icarus/categories/Plugins/Search/) | Algolia、百度、Google 自定义搜索、Insight（内置） |
| [分享](https://ppoffice.github.io/hexo-theme-icarus/categories/Plugins/Share/) | AddToAny、百度分享、Share.js、ShareThis |
| [打赏](https://ppoffice.github.io/hexo-theme-icarus/categories/Plugins/Donation/) | 爱发电、支付宝、Buy Me a Coffee、Patreon、PayPal、微信 |
| [统计](https://ppoffice.github.io/hexo-theme-icarus/Plugins/Analytics/icarus-user-guide-web-analytics-plugins/) | 百度统计、Bing 网站管理员工具、不蒜子、CNZZ、Google Analytics、Hotjar、Matomo、StatCounter、Twitter 转化跟踪、Umami、Waline 阅读量 |
| [小组件](https://ppoffice.github.io/hexo-theme-icarus/categories/Widgets/) | 个人信息、文章目录、最新文章、归档、分类、标签、链接、Google AdSense、follow.it、Google FeedBurner |
| [其他](https://ppoffice.github.io/hexo-theme-icarus/categories/Plugins/) | 回到顶部、Cookie 提示、图片画廊（lightGallery + Justified Gallery）、KaTeX、MathJax、旧浏览器提示、页面加载动画、进度条 |

大部分插件由 [hexo-component-inferno](https://github.com/ppoffice/hexo-component-inferno) 提供。
代码块可以使用 [highlight.js](https://highlightjs.org/) 的任意主题，暗色页面还可以单独指定一个。

</details>

## 文档

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
