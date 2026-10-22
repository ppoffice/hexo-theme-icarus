title: 升级指南
date: 2016-01-02
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

### 从6.3升级至6.4

1. 将Icarus升级到6.4.1。
   如果你是通过NPM安装的主题，在站点根目录运行如下命令：

   {% codeblock "Shell" lang:shell %}
   $ npm install --save hexo-theme-icarus@^6.4.1
   {% endcodeblock %}

   如果你是从源码安装的主题，请用6.4.1的源码替换`themes/icarus`。
   Icarus 6.4需要`hexo-component-inferno` 4.2.1或更新的版本。
   从源码安装的用户在站点根目录中安装它之前，依赖检查会中止每一条`hexo`命令，并打印出需要运行的命令：

   {% codeblock "Shell" lang:shell %}
   $ npm install --save hexo-component-inferno@^4.2.1
   {% endcodeblock %}

2. 如果你使用Waline，请检查它的`image_uploader`、`highlighter`、`tex_renderer`和`search`选项。
   它们现在的行为与配置说明一致：设为`true`表示禁用该功能。

   | `_config.icarus.yml`中的值 | Icarus 6.3（hexo-component-inferno 4.1.0） | Icarus 6.4 |
   |---|---|---|
   | 未设置 | 禁用 | Waline的默认值（启用） |
   | `false` | 禁用 | Waline的默认值（启用） |
   | `true` | Waline的默认值（启用） | 禁用 |
   | `null`（留空） | Waline的默认值（启用） | Waline的默认值（启用） |

   例如，如果你从未设置过这些选项，评论框中现在会出现图片上传、代码高亮、TeX渲染和GIF搜索。
   如要关闭某个功能，把对应的选项设为`true`。

3. 如果`_config.yml`中没有设置`category_generator.per_page`，分类页面现在会像`hexo-generator-category`一样，按站点配置的`per_page`分页。
   以前所有文章都显示在同一页上。
   如要保持只有一页，请在`_config.yml`中设置`category_generator.per_page: 0`。

4. 旧版本生成的配置文件在`head.open_graph`下有`type: blog`。
   `blog`并不是Open Graph的类型，所以以前每个页面的`og:type`都是“blog”。
   Icarus 6.4会忽略它：文章页使用`article`，其他页面使用`website`。
   在你删除`type: blog`这一行之前，每次运行`hexo`命令时还会打印一条警告。

5. 以下插件已弃用，使用了它们的页面会在生成站点时打印一条警告：

   - Valine：Valine存储评论所用的LeanCloud将于2027年1月12日停止服务。
     请换用Waline、Twikoo或其他评论插件，参见{% post_link zh-CN/Comment-Plugins %}。
   - Gitment：已不再维护，它的GitHub登录代理也已失效。
     请换用Giscus、utterances或Gitalk。
   - AddThis：已于2023年5月31日停止服务。
     请换用AddToAny或ShareThis，参见{% post_link zh-CN/Share-Buttons %}。
   - Google FeedBurner `subscribe_email`挂件：FeedBurner已于2021年7月停止邮件订阅功能。
     请换用follow.it挂件，参见<a href="{% post_path zh-CN/Widgets %}#follow-it">follow.it</a>。
     新生成的配置文件中也不再包含它。

6. Icarus 6.4同样不会升级你的主题配置文件：配置文件的版本号仍然是`5.1.0`。
   请手动添加你需要的新配置项：

   - <a href="{% post_path zh-CN/Widgets %}#文章归档">文章归档</a>挂件：`show_count`、`group_by`、`order`和`format`。
   - <a href="{% post_path zh-CN/Widgets %}#文章分类">文章分类</a>挂件：`order_by`、`order`、`show_current`、`show_count`和`depth`。
   - <a href="{% post_path zh-CN/Widgets %}#最新文章">最新文章</a>挂件：`limit`。
   - <a href="{% post_path zh-CN/Comment-Plugins %}#Giscus">Giscus</a>：`term`，`specific`和`number`两种映射方式需要它。

   归档和分类挂件以前读取的驼峰式名称（`showCount`、`orderBy`和`showCurrent`）仍然有效。
   这些挂件留空的选项会使用默认值。

7. 如果你修改过主题模板或脚本的副本，请把下面的变更合并进去：

   - `layout/common/head.jsx`：风格的主题样式表和网页字体样式表带有`data-variant`属性。
   - `source/js/pjax.js`：当页面在front-matter中设置了另一个`variant`时，PJAX会切换这些样式表。
     它还会加载新页面有而当前页面没有的插件，例如在文章front-matter中开启的MathJax或KaTeX，并在每次切换后渲染KaTeX公式。

8. 运行`hexo clean`并重新生成站点。

9. 阅读[更新说明](https://github.com/ppoffice/hexo-theme-icarus/releases)来了解完整的变更与问题修复列表。

### 从6.2升级至6.3

1. 将Icarus升级到6.3.0。
   如果你是通过NPM安装的主题，在站点根目录运行如下命令：

   {% codeblock "Shell" lang:shell %}
   $ npm install --save hexo-theme-icarus@^6.3.0
   {% endcodeblock %}

   如果你是从源码安装的主题，请用6.3.0的源码替换`themes/icarus`（例如按照{% post_link zh-CN/Getting-Started %}中的说明，使用`-b 6.3.0`克隆）。
   Icarus 6.3需要`hexo-component-inferno` 4.1.0或更新的版本，从源码安装的用户需要自己在站点根目录中安装它。
   在安装之前，依赖检查会中止每一条`hexo`命令，并打印出需要运行的命令，例如：

   {% codeblock "Shell" lang:shell %}
   $ npm install --save hexo-component-inferno@^4.1.0
   {% endcodeblock %}

2. Icarus 6.3不会升级你的主题配置文件。
   配置文件的版本号仍然是`5.1.0`，所以不会运行迁移脚本，新的配置项也不会被添加到你的`_config.icarus.yml`中。
   请手动添加你需要的配置项：

   - 暗色外观的`appearance`、`logo_dark`和`article.highlight.dark_theme`，参见<a href="{% post_path zh-CN/Configuring-Theme %}#外观">外观</a>和{% post_link demo/Dark-Mode "暗色外观演示" %}。
   - `navbar.menu`中的子菜单，参见<a href="{% post_path zh-CN/Configuring-Theme %}#导航栏">导航栏</a>。
   - `providers.cdn_overrides`，参见<a href="{% post_path zh-CN/CDN-Providers %}#为单个包指定CDN">为单个包指定CDN</a>。
   - 归档和分类挂件的`amount`选项，参见{% post_link zh-CN/Widgets %}。
   - Artalk、Beaudar和Cusdis评论插件，参见{% post_link zh-CN/Comment-Plugins %}。
   - Umami、Matomo和`waline_pageview`插件，参见{% post_link zh-CN/Web-Analytics-Plugins %}。

   如果想查看所有配置项及其说明，你可以让Icarus生成一份新的配置文件：暂时重命名你的`_config.icarus.yml`，运行`hexo clean`生成新文件，把需要的配置项复制到你自己的文件中，然后再把你的文件改回原名。

3. 如果你使用Valine评论插件，Icarus现在会在每次运行`hexo`命令时打印一条警告，因为Valine会把评论者的邮箱地址（开启`record_ip`时还有IP地址）暴露给任何拿到你站点公开的LeanCloud密钥的人。
   请考虑换用其他评论插件，例如Waline、Twikoo或Giscus（[#788](https://github.com/ppoffice/hexo-theme-icarus/issues/788)）。

4. 下面的变更只影响自己修改过主题模板或脚本副本的用户：

   - `layout/misc/paginator.jsx`已被删除。
     `layout/index.jsx`和`layout/archive.jsx`重新使用`hexo-component-inferno`的分页组件（`hexo-component-inferno/lib/view/misc/paginator`），请修改引用了`./misc/paginator`的自定义副本。
   - `source/js/pjax.js`中的PJAX选择器有所变化：`[data-pjax]`改为`[data-pjax]:not(link)`，新增了`.navbar-logo`和`.footer-logo`，并删除了`#comments link`和`#comments script`。
     页面标题、外观和代码高亮样式表现在由`switches`选项中的函数切换。
     如果你修改过`pjax.js`，请把这些变更合并进去。

5. 搜索按钮获得焦点时不再自动打开搜索。
   请点击它，或在它上面按Enter或空格键，也可以使用新增的`/`、Ctrl+K或Cmd+K快捷键。

6. 运行`hexo clean`并重新生成站点。

7. 阅读[更新说明](https://github.com/ppoffice/hexo-theme-icarus/releases)来了解完整的变更与问题修复列表。

#### hexo-component-inferno 4.2带来的变化

Icarus 6.3.0接受4.1.0及以后的任何`hexo-component-inferno` 4.x版本，所以安装或更新依赖的站点会得到hexo-component-inferno 4.2，它改变了Waline选项和分类页面的行为。
这些变化在<a href="#从6-3升级至6-4">从6.3升级至6.4</a>的第2到第5步中有说明。

### 从6.x升级至6.2及Hexo 8

1. 将Icarus升级到6.2.0或更新的版本。
   如果你是通过NPM安装的主题，在站点根目录运行如下命令：

   {% codeblock "Shell" lang:shell %}
   $ npm install --save hexo-theme-icarus@^6.2.0
   {% endcodeblock %}

2. (可选)Icarus 6.2同时支持Hexo 7和Hexo 8。
   如需升级到Hexo 8，请先将Node.js升级到20.19.0或者更新的版本，然后将Hexo及你的Hexo插件升级到最新版本。
   请参阅[Hexo更新说明](https://github.com/hexojs/hexo/releases)了解不兼容的变更。

   {% codeblock "Shell" lang:shell %}
   $ npm install --save hexo@^8.0.0
   {% endcodeblock %}

3. 下面的变更只影响修改过主题文件或脚本的用户：

   - `source/css/style.styl`已改名为`source/css/_style.styl`，因此构建时不再输出无用的`css/style.css`。
     请把自定义样式表中的`@import 'style'`改为`@import '_style'`。
   - 页面不再加载moment.js，所以你的脚本中不能再使用`window.moment`。
     相对日期现在改用浏览器的`Intl.RelativeTimeFormat`来格式化。
     如果你的脚本用到了moment.js，请自行加载它。
   - 导航栏中的目录和搜索按钮、回到顶部按钮以及代码块的复制按钮现在都是`<button>`元素，而不再是`<a>`链接。
     请修改把它们当作`a`元素来选择的自定义样式或脚本。

4. Icarus 6.2新增了`--icarus-dont-check-deps`参数，用于跳过依赖检查，例如在尝试某个依赖的更新的主版本时。

5. 运行`hexo clean`并重新生成站点。

6. 阅读[更新说明](https://github.com/ppoffice/hexo-theme-icarus/releases)来了解完整的变更与问题修复列表。

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
