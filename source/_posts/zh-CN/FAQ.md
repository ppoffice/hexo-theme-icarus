title: 常见问题
date: 2016-01-03
language: zh-CN
tags:
- Icarus用户指南
toc: true
providers:
    cdn: loli
    fontcdn: loli
    iconcdn: loli
---

本文解答了一些Icarus常见问题。
如果你的问题没有在这里得到解答，也请阅读
[Icarus用户指南](/hexo-theme-icarus/tags/Icarus用户指南/)，
[Hexo中文文档](https://hexo.io/zh-cn/docs/index.html)，
以及[GitHub Issues](https://github.com/ppoffice/hexo-theme-icarus/issues?q=)。
此外，你也可以在[GitHub讨论组](https://github.com/ppoffice/hexo-theme-icarus/discussions)上向其他Icarus用户请求帮助。

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-globe-americas mr-2"></i>本文同时提供以下语言的翻译：<a href="{% post_path en/FAQ %}">English</a>。
</div>
</article>

<!-- more -->


## 站点

<article class="message is-primary" style="font-size:1em">
<div class="message-body">
我无法生成我的站点。 / 我在生成站点时遇到错误。
</div>
</article>

Icarus运行在Node.js 8.3.0或更新的版本上。
它同时依赖Hexo 4.2.0或更新版本。
除此之外，请确保所有的Node.js依赖已安装。
你可以在[`<icarus_directory>/package.json`](https://github.com/ppoffice/hexo-theme-icarus/blob/master/package.json)
文件的`peerDependencies`部分下找到这些依赖。
同时，从你的站点中移除所有无用的Node.js依赖，否则它们可能会导致Icarus出现奇怪的问题。

<article class="message is-primary" style="font-size:1em">
<div class="message-body">
如何更改我的站点的语言？
</div>
</article>

打开站点根目录下的站点配置文件`_config.yml`，修改如下设置：

{% codeblock _config.yml lang:diff %}
- language: en
+ language: <语言名>
{% endcodeblock %}

你可以在`<icarus_directory>/languages`目录下找到所有可用的翻译。
`<语言名>`为不带后缀名的翻译文件名。


## 布局

<article class="message is-primary" style="font-size:1em">
<div class="message-body">
我如何改变页面的宽度？我如何使用单栏/双栏/三栏布局？
</div>
</article>

如要改变页面的宽度，编辑`<icarus_directory>/include/style/responsive.styl`这个样式文件。
此文件定义了不同屏幕尺寸下的页面容器宽度。

如要改变挂件或主内容宽度，编辑`<icarus_directory>/layout/common/widgets.jsx`和`<icarus_directory>/layout/layout.jsx`。
在这些文件中找到诸如`is-12`，`is-8-tablet`，和`is-4-widescreen`这样的CSS类名。
CSS类名中的数字标志着一个挂件或主内容所占据的栏数量。
数字后的屏幕尺寸，如`tablet`和`widescreen`，指代着栏数量生效的屏幕尺寸条件。
修改类名中的数字使主内容栏的栏数量和所有挂件栏的栏数量在相同屏幕尺寸下相加等于12。

例如，为使主内容栏在宽屏(`widescreen`)下更宽，你可以做出如下修改：

{% codeblock &lt;icarus_directory&gt;/layout/layout.jsx lang:diff >folded %}
 <div class={classname({
     column: true,
     'order-2': true,
     'column-main': true,
     'is-12': columnCount === 1,
-    'is-8-tablet is-8-desktop is-8-widescreen': columnCount === 2,
+    'is-8-tablet is-8-desktop is-9-widescreen': columnCount === 2,
     'is-8-tablet is-8-desktop is-6-widescreen': columnCount === 3
{% endcodeblock %}

{% codeblock &lt;icarus_directory&gt;/layout/common/widgets.jsx lang:diff >folded %}
 function getColumnSizeClass(columnCount) {
     switch (columnCount) {
         case 2:
-            return 'is-4-tablet is-4-desktop is-4-widescreen';
+            return 'is-4-tablet is-4-desktop is-3-widescreen';
         case 3:
             return 'is-4-tablet is-4-desktop is-3-widescreen';
{% endcodeblock %}

你可以参考[Bulma文档](https://bulma.io/documentation/columns/sizes/)来获取更多关于布局系统的细节。

下面时一些创建单栏/双栏/三栏布局的提示：

- 你可以从主题配置中移除所有的挂件来创建单栏布局。
- 你可以将所有的挂件移动到页面的一侧来创建双栏布局。
- 你可以将挂件放在页面两边来创建三栏布局。

若要更改单个文章或页面的布局，请参考[配置文件与优先级](/hexo-theme-icarus/Configuration/icarus用户指南-主题配置/#配置文件与优先级)。

<article class="message is-primary" style="font-size:1em">
<div class="message-body">
挂件/评论插件/分享按钮...的布局文件在哪里？我如何个性化内置的挂件/评论插件/分享按钮...？
</div>
</article>

插件和挂件的布局文件已被移至一个单独的Node.js库中——[`hexo-component-inferno`](https://github.com/ppoffice/hexo-component-inferno)。
这样，主题开发者可以更好地在不同主题之间复用这些通用组件，并且普通用户可以更简便地覆盖这些内置组件。

若要自定义这些组件，从`hexo-component-inferno`仓库中拷贝布局文件并把它们放入`<icarus_directory>/layout`下的的相应目录中。
例如，如果你想要自定义Valine评论插件，你可以从`hexo-component-inferno`仓库中拷贝
[`src/view/comment/valine.jsx`](https://github.com/ppoffice/hexo-component-inferno/blob/0.2.4/src/view/comment/valine.jsx)
到`<icarus_directory>/layout/comment/valine.jsx`。
同时像下面这样改正此文件头部的一些Node.js引用：

{% codeblock &lt;icarus_directory&gt;/layout/comment/valine.jsx lang:diff %}
- const { cacheComponent } = require('../../util/cache');
+ const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');
{% endcodeblock %}

最后，用`hexo clean`清理你的站点并重新生成HTML文件。

类似的，你可以用同样的方式覆盖主题内置的静态文件，如
[`asset/js/insight.js`](https://github.com/ppoffice/hexo-component-inferno/blob/0.2.4/asset/js/insight.js) 。

<article class="message is-primary" style="font-size:1em">
<div class="message-body">
为什么我的改变的布局文件在我刷新页面时没有生效（假设我正在使用<code>hexo server</code>）？
</div>
</article>

当你使用`hexo server`启动本地Hexo服务器时，Icarus会缓存布局文件。
如要使布局文件的修改生效，请重启本地服务器。

其他情况下临时生成的数据会被Hexo缓存在内存或者`db.json`数据库中。
在运行`hexo server`或`hexo generate`之前执行`hexo clean`应该可以解决此问题。


## 内容

<article class="message is-primary" style="font-size:1em">
<div class="message-body">
我的图片没有正确显示。 / 我的图片仅在首页显示，却无法在文章页面显示。
</div>
</article>

请确保你使用了图片的绝对路径。
例如，你的站点位于你域名的子目录下，如`https://ppoffice.github.io/hexo-theme-icarus`，
并且你的图片`image.jpg`放在了`source/gallery/`目录下。
那么你应该用`/hexo-theme-icarus/gallery/image.jpg`来引用你的图片。

你也可以像下面这样使用<code>{% raw %}{% img %}{% endraw %}</code>这个Hexo标签来自动引用图片：

```
{% img /gallery/image.jpg "Image title" %}
```

在这种情况下，你可以从图片路径中省略网站子目录。
你可以参考[Hexo文档](https://hexo.io/zh-cn/docs/index.html)来了解更多详情。

<article class="message is-primary" style="font-size:1em">
<div class="message-body">
如何为文章添加摘要？如何显示“阅读更多”按钮？
</div>
</article>

在你的文章中添加`<!-- more -->`标签。
标签前面的文章内容会被标记为摘要，而其后的内容不会显示在文章列表上。

你也可以在文章的front-matter中设置自定义摘要。

{% codeblock some-post.md lang:yaml %}
title: 一篇文章
date: 2020-01-01
excerpt: 这是一篇关于...
---
# 文章内容...
{% endcodeblock %}

<article class="message is-primary" style="font-size:1em">
<div class="message-body">
我如何加密文章？
</div>
</article>

使用如[hexo-blog-encrypt](https://github.com/MikeCoder/hexo-blog-encrypt)这样的第三方的Hexo插件。

<article class="message is-primary" style="font-size:1em">
<div class="message-body">
我如何像这篇文章一样使用炫酷的页面元素？
</div>
</article>

请参考[Bulma文档](https://bulma.io/documentation/)来了解所有可选的元素和样式。
复制其中的HTML代码段并直接放入你的Markdown文件中。


## 挂件与插件

<article class="message is-primary" style="font-size:1em">
<div class="message-body">
我如何才能移除页面上警告我一些配置值没有设置的红色警示信息？
</div>
</article>

这些警示信息通常在你遗漏一些插件或挂件的配置设置时出现。
如果你不想开启某个插件或挂件，把它们从你的主题配置中删掉或注释掉。

例如，注释掉这几行来禁用掉评论插件：

{% codeblock _config.icarus.yml lang:diff %}
- comment:
-     type: disqus
-     shortname: 
+ # comment:
+ #     type: disqus
+ #     shortname: 
{% endcodeblock %}


<article class="message message-immersive is-warning">
<div class="message-body">
<i class="fas fa-question-circle mr-2"></i>文章内容有误？请点击<a href="https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/zh-CN/FAQ.md">此处</a>提交修改。
</div>
</article>
