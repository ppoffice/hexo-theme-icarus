title: 升级指南
date: 2025-02-21
tags:
- Icarus用户指南
language: zh-CN
providers:
    cdn: loli
    fontcdn: loli
    iconcdn: loli
toc: true
---

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-globe-americas mr-2"></i>本文同时提供以下语言的翻译：
<a href="{% post_path en/Upgrade-Guide %}">English</a>.
</div>
</article>

<!-- more -->

### 从6.x升级至7.0

1. 第一次运行`hexo`时，Icarus会备份`_config.icarus.yml`并把它升级到`7.0.0`版本。
   `_config.post.yml`等布局配置文件和front-matter不会被升级。
   请在其中删除`head.open_graph.type: blog`、`head.open_graph.google_plus`和Gitalk的`client_secret`，并为没有头像的个人信息挂件设置`avatar: /img/avatar.png`。
   另外请检查以下配置：

   - Waline的`image_uploader`、`highlighter`、`tex_renderer`和`search`选项设为`true`时禁用对应功能，未设置或设为`false`时保留。
   - 分类页面按`per_page`分页。
     如要保持只有一页，请在`_config.yml`中设置`category_generator.per_page: 0`。

2. 请检查你使用的插件：

   - Facebook评论、Share.js、百度分享、AddThis和Google FeedBurner `subscribe_email`挂件已被移除，Valine、Gitment和Cusdis已弃用。
     请换用其他插件。
   - Gitalk 2需要一个GitHub App和你自己的代理（在`proxy`中设置）。
     请重新生成client secret，因为旧的已经公开在你的页面中。
   - 请将Twikoo后端升级到2.0.17，Artalk服务端升级到2.10。
     如要让Artalk服务端的选项优先于配置文件中的选项，请设置`prefer_remote_conf: true`。
   - 自定义的Waline阅读量计数需要在`data-path`属性中填写页面路径。
   - 自定义的DisqusJS模板需要使用DisqusJS 3的API。
   - 自定义的图库脚本需要使用lightGallery 3和justified-gallery 4的原生API。
     lightGallery 3采用GPLv3或商业许可。

3. Cyberpunk变体显示`logo_dark`中设置的logo，代码使用`JetBrains Mono`字体，代码块使用自己的配色。
   `/img/razor-top-black.svg`和`/img/razor-bottom-black.svg`已被删除。

4. 自己托管MathJax 4时需要完整的`mathjax`和`@mathjax/mathjax-newcm-font`两个包。

5. 如果你保留了主题文件的自定义副本，请在7.0的文件上重新应用你的修改：

   - `source/css/style.styl`已改名为`source/css/_style.styl`。
   - `layout/misc/paginator.jsx`和`layout/widget/profile.jsx`已被删除。
   - 导航栏和PJAX的代码移到了`source/js/navbar.js`、`source/js/appearance.js`和`source/js/pjax-*.js`。
   - 目录、搜索、回到顶部和复制按钮都是`<button>`元素。
   - 页面不再加载moment.js。
   - 处理页面内容的自定义脚本需要同时在`pjax:complete`事件中运行。

### 从5.x升级至6.0

1. 将Node.js升级到14.0或者更新的版本，并将Hexo升级到7.1.1或者更新的版本。

2. 下载源代码或者从NPM安装Icarus 6.x。
   你可以在{% post_link zh-CN/Getting-Started %}中找到安装指导。
   如果你打算通过修改源代码的方式自定义主题，你必须从源代码安装主题。

3. 运行`hexo clean`来清理缓存并让Icarus为你升级主题配置文件。

4. 阅读[更新说明](https://github.com/ppoffice/hexo-theme-icarus/releases)和[最新文档](https://ppoffice.github.io/hexo-theme-icarus/categories/)来了解更多新功能的信息。

### 从4.x升级至5.0

1. 将Node.js升级到12.4.0或者更新的版本，并将Hexo升级到6.0或者更新的版本。

2. 下载源代码或者从NPM安装Icarus 5.x。
   你可以在{% post_link zh-CN/Getting-Started %}中找到安装指导。
   如果你打算通过修改源代码的方式自定义主题，你必须从源代码安装主题。

3. 运行`hexo clean`来清理缓存并让Icarus为你升级主题配置文件。

4. 阅读[更新说明](https://github.com/ppoffice/hexo-theme-icarus/releases)和[最新文档](https://ppoffice.github.io/hexo-theme-icarus/categories/)来了解更多新功能的信息。

### 从3.x升级至4.x

1. 将Node.js升级到10.13.0或者更新的版本。

2. 下载源代码或者从NPM安装Icarus 4.x。
   你可以在{% post_link zh-CN/Getting-Started %}中找到安装指导。
   如果你打算通过修改源代码的方式自定义主题，你必须从源代码安装主题。

3. 运行`hexo clean`来清理缓存。
   按照Icarus的提示安装缺失的依赖软件包：

   {% codeblock "命令行" lang:shell %}
   $ hexo clean
   ...
   ERROR Please install the missing dependencies your Hexo site root directory:
   ERROR npm install --save hexo@^5.0.2 hexo-component-inferno@^0.8.2 hexo-log@^2.0.0 hexo-util@^2.2.0
   ERROR or:
   ERROR yarn add hexo@^5.0.2 hexo-component-inferno@^0.8.2 hexo-log@^2.0.0 hexo-util@^2.2.0
   {% endcodeblock %}

4. 再次运行`hexo clean`来让Icarus为你升级主题配置文件。
   Icarus会备份并删除`themes/icarus/_config.yml`文件，然后创建`_config.icarus.yml`作为新的主题配置文件。
   你可以参考`_config.icarus.yml.example`来了解示例配置。

   {% codeblock "命令行" lang:shell %}
   $ hexo clean
   ...
   WARN  Your theme configuration is outdated (3.0.0 < 4.0.0).
   INFO  To skip the configuration upgrade, use "--icarus-dont-upgrade-config".
   INFO  Backing up theme configuration files...
   INFO  themes/icarus/_config.yml => themes/icarus/_config.yml.dc00f8b8f8bc03ede351d711e958dc4b
   INFO  Upgrading theme configurations...
   INFO  Theme configurations are written to /tmp/_config.icarus.yml.
   INFO  Example configurations is at /tmp/_config.icarus.yml.example.
   {% endcodeblock %}

5. Icarus现在将文章的缩略图和封面图区别对待。
   对于有缩略图的所有文章/页面，将其front-matter中的`thumbnail:`更改为`cover:`。

   {% codeblock "post.md" lang:diff %}
     title: Icarus快速上手
     date: 2020-04-01
   - thumbnail: /gallery/covers/vector_landscape_1.svg
   + cover: /gallery/covers/vector_landscape_1.svg
   ---
   {% endcodeblock %}

   你仍可以在front-matter中设置`thumbnail`来在文章归档页面以及最新文章挂件中显示小一点的缩略图。

6. 阅读[更新说明](https://github.com/ppoffice/hexo-theme-icarus/releases)和[最新文档](https://ppoffice.github.io/hexo-theme-icarus/categories/)来了解更多新功能的信息。
