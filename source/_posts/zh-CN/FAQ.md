title: 常见问题
date: 2016-01-03
language: zh-CN
toc: true
providers:
    cdn: loli
    fontcdn: loli
    iconcdn: loli
---

<div class="notification is-success is-size-6">
本文同时提供以下语言的翻译：<a href="{% post_path en/FAQ %}">English</a>。
</div>

本文展示了一些经常被提及的Icarus使用问题以及这些问题的解答。
如果此处没有出现你想要求解的问题是，也请阅读[Icarus用户指南](/hexo-theme-icarus/tags/Icarus用户指南/)，[Hexo中文文档](https://hexo.io/zh-cn/docs/index.html)，
以及[Icarus GitHub Issues](https://github.com/ppoffice/hexo-theme-icarus/issues?q=)。

<!-- more -->


## 站点

<article class="message is-primary" style="font-size:1em">
<div class="message-body">
无法生成我的Hexo站点。/我的站点在生成时出现错误。
</div>
</article>

Icarus依赖8.3.0或更新版本的Node.js，4.2.0或更新版本的Hexo，以及其他一些在[`themes/icarus/package.json`](https://github.com/ppoffice/hexo-theme-icarus/blob/master/package.json)
文件的`peerDependencies`部分列出的依赖包。
请确保你的站点正确安装了所有依赖。
例外，你之前使用的主题残留下来的依赖有可能会干扰Icarus的正常运行。
请在更换到Icarus主题之前移除它们。

<article class="message is-primary" style="font-size:1em">
<div class="message-body">
如何改变我的站点的语言？
</div>
</article>

编辑你站点根目录下的`_config.yml`文件，修改如下设置：

{% codeblock _config.yml lang:diff %}
- language: en
+ language: <language_name>
{% endcodeblock %}

你可以在`themes/icarus/languages`目录下找到所有可用的翻译。
`_config.yml`的语言名即为这些文件不带后缀的文件名。


## 布局

<article class="message is-primary" style="font-size:1em">
<div class="message-body">
我如何改变页面的宽度？我如何在特定的文章/页面使用单栏/双栏/三栏布局？
</div>
</article>

如要改变页面的宽度，你需要编辑`themes/icarus/include/style/responsive.styl`这个样式文件。
这个文件定义了不同屏幕尺寸下的页面容器宽度。
如果你同时想改变主内容栏或挂件栏的宽度，请编辑`themes/icarus/layout/common/widgets.jsx`和`themes/icarus/layout/layout.jsx`。
在文件中找到`is-12`，`is-8-tablet`，和`is-4-widescreen`这样的CSS类名并把它们修改成你想要的数值。

你可以参考[Bulma文档](https://bulma.io/documentation/columns/sizes/)来获取更多关于布局系统的细节。
请确保主内容栏和挂件栏的CSS类名称中的数字在相同屏幕尺寸下相加等于12。
例如，如果你想把挂件栏的宽度修改为`is-3-widescreen`并且你只有一个挂件栏，那么你需要保证你的主内容栏有一个`is-9-widescreen`。

你可以通过从主题配置中移除所有挂件来实现单栏布局。
如果要使用双栏布局，请将所有挂件的`position`设置为`left`或`right`，从而将它们放置按照页面的同一侧。
三栏布局可以通过在页面两侧同时放置挂件来实现。

若要更改特定的文章或页面的布局，请参考[Icarus用户指南 - 主题配置](/hexo-theme-icarus/Configuration/icarus用户指南-主题配置/#额外的配置文件与优先级)。

<article class="message is-primary" style="font-size:1em">
<div class="message-body">
挂件/评论插件/分享按钮...的布局文件在哪里？我如何自定义内置的挂件/评论插件/分享按钮...？
</div>
</article>

评论插件，捐赠按钮，站内搜索，分享按钮，挂件，以及其他一些插件的布局文件已移至一个单独的Node.js库——[`hexo-component-inferno`](https://github.com/ppoffice/hexo-component-inferno)。
这样，主题开发者可以更好地在不同主题之间复用这些通用组件，并且允许用户更简便地覆盖这些内置组件。

若要自定义这些组件，你可以从`hexo-component-inferno`仓库中拷贝布局文件并把它们放入Icarus布局目录下的的相应目录中。
例如，如果你想要自定义Valine评论插件，你可以从`hexo-component-inferno`仓库中拷贝[`src/view/comment/valine.jsx`](https://github.com/ppoffice/hexo-component-inferno/blob/0.2.4/src/view/comment/valine.jsx)到`themes/icarus/layout/comment`目录中。
然后，修正此文件头部的一些Node.js引用

{% codeblock themes/icarus/layout/comment/valine.jsx lang:diff %}
- const { cacheComponent } = require('../../util/cache');
+ const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');
{% endcodeblock %}

之后，用`hexo clean`清理你的站点并重新生成HTML文件。

类似的，你可以复制`hexo-component-inferno`仓库中的文件并放入`themes/icarus/source`下的对应目录中来覆盖
主题内置的静态文件。

<article class="message is-primary" style="font-size:1em">
<div class="message-body">
我对布局文件进行了一些修改。但是当我刷新页面(开启了<code>hexo server</code>的情况下)/当我<code>hexo generate</code>时
为什么这些修改没有生效？
</div>
</article>

当你用`hexo server`开启本地Hexo服务器时，这些布局文件会被缓存。
其他情况下临时生成的数据会被缓存在`db.json`或者内存中。
请在`hexo server`或`hexo generate`之前使用`hexo clean`。


## 内容

<article class="message is-primary" style="font-size:1em">
<div class="message-body">
我的Logo/图片没有正确显示。/我的图片仅在首页显示，却无法在文章页面显示。
</div>
</article>

请确保你使用了图片的绝对路径。
例如，如果你的图片放在了`source/gallery/`目录下，并且你的站点位于你域名的子目录下，如`https://ppoffice.github.io/hexo-theme-icarus`，
那么你应该用`/hexo-theme-icarus/gallery/<文件名>.<文件扩展名>`来引用你的图片。

你也可以使用`{% img %}`这个Hexo标签来省去路径中的网站子目录：<code>&#123;% img /gallery/&lt;file_name&gt;.&lt;file_extension&gt; ... %}</code>。
请参考[Hexo中文文档](https://hexo.io/zh-cn/docs/index.html)来了解详情。

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

请使用第三方的Hexo插件，比如[hexo-blog-encrypt](https://github.com/MikeCoder/hexo-blog-encrypt)。

<article class="message is-primary" style="font-size:1em">
<div class="message-body">
我如何像这篇文章一样使用炫酷的页面元素或样式？
</div>
</article>

你可以在你的Markdown文件中使用HTML。
请参考[Bulma文档](https://bulma.io/documentation/)来了解更多的可选元素和样式。


## 挂件与插件

<article class="message is-primary" style="font-size:1em">
<div class="message-body">
我的页面上显示红色的警告，上面说某个插件/挂件的配置项没有填写。
我怎样才能除去这些警告？
</div>
</article>

如果你不想开启某些插件/挂件，你可以把它们从配置中删掉或注释掉。
例如，如果你不想开启任何的评论插件，注释掉这几行：

{% codeblock themes/icarus/_config.yml lang:diff %}
- comment:
-     type: disqus
-     shortname: 
+ # comment:
+ #     type: disqus
+ #     shortname: 
{% endcodeblock %}


<div class="notification is-warning is-size-6">
文章内容有误？请点击<a href="https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/zh-CN/FAQ.md">此处</a>提交修改。
</div>
