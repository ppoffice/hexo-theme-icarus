title: Icarus用户指南 - CDN提供商
date: 2016-01-01
categories:
- Configuration
tags:
- Icarus用户指南
language: zh-CN
toc: true
providers:
    cdn: loli
    fontcdn: loli
    iconcdn: loli
---

选择合适的CDN提供商可以大幅度减少网站访客的网页加载时间。
Icarus为你提供了几种内置的CDN提供商来承载Icarus所用到的第三方库和资源文件的加载。

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-globe-americas mr-2"></i>本文同时提供以下语言的翻译：<a href="{% post_path en/CDN-Providers %}">English</a>。
</div>
</article>

<!-- more -->

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-info-circle mr-2"></i>下面的CDN功能由<a href="https://github.com/ppoffice/hexo-component-inferno">ppoffice/hexo-component-inferno</a>提供，完整的支持提供商列表和配置详情以其为准。
</div>
</article>

## 内置CDN提供商

目前，Icarus提供如下的内置CDN服务提供商：

- **JavaScript库CDN**
    - cdnjs.com (`cdnjs`)
    - jsDelivr (`jsdelivr`)
    - UNPKG (`unpkg`)
    - loli.net (`loli`)
- **Web字体CDN**
    - Google Fonts (`google`)
    - loli.net (`loli`)
    - font.im (`fontim`)
    - 中国科学技术大学 (`ustc`)
- **FontAwesome图标CDN**（都提供FontAwesome 6.0.0）
    - FontAwesome (`fontawesome`)
    - loli.net (`loli`)

默认的CDN服务提供商配置为：

{% codeblock _config.icarus.yml lang:yaml %}
providers:
    cdn: jsdelivr
    fontcdn: google
    iconcdn: fontawesome
{% endcodeblock %}

## 自定义CDN提供商

除此之外，你还可以通过URL模板来自定义CDN提供商。
每种类别提供商的模板格式如下所示：

### JavaScript库CDN

{% codeblock "CDN URL模板" %}
https://some.cdn.domain.name/${package}/${version}/${filename}
{% endcodeblock %}

你需要将实际的包名称，包版本号，和文件相对路径替换为`${package}`， `${version}`，和`${filename}`占位符。
例如，如下JavaScript库的URL地址：

{% codeblock "UNPKG CDN URL示例" %}
https://unpkg.com/d3@5.7.0/dist/d3.min.js
{% endcodeblock %}

可以被概括成：

{% codeblock "UNPKG CDN URL模板" %}
https://unpkg.com/${package}@${version}/${filename}
{% endcodeblock %}

一些CDN提供商可能采用不同的URL形式。
例如，Icarus用来实现代码块复制按钮的`clipboard`库在CDN.js上有着如下的URL形式：

{% codeblock "CDN.js CDN URL示例" %}
https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.11/clipboard.min.js
{% endcodeblock %}

但在UNPKG上有着这样的URL形式：

{% codeblock "UNPKG CDN URL示例" %}
https://unpkg.com/clipboard@2.0.11/dist/clipboard.min.js
{% endcodeblock %}

因此，你需要注意你的自定义CDN提供商的URL格式。
默认情况下，Icarus向URL模板中传入的参数采用npm的包名称和文件相对路径（例如`clipboard@2.0.11/dist/clipboard.min.js`）。
jsDelivr和UNPKG就采用这种npm形式。
否则，如果你采用如CDN.js这样的CDN提供商，请在URL模板前加上`[cdnjs]`，Icarus会把包名称和文件路径转换为CDN.js使用的形式：

{% codeblock "CDN.js-style URL模板" %}
'[cdnjs]https://some.cdn.domain.name/${package}/${version}/${filename}'
{% endcodeblock %}

### Web字体CDN

你可以传入Google字体镜像站的URL或是与其兼容的网络字体CDN。
默认变体依赖`Ubuntu`和`Source Code Pro`字体，Cyberpunk变体依赖`Oxanium`和`JetBrains Mono`字体，所以确保你使用的CDN提供这些字体。
自定义的URL模板需包含`type`和`fontname`两个占位符：

{% codeblock "Webfont CDN URL模板" %}
https://some.google.font.mirror/${type}?family=${fontname}
{% endcodeblock %}

`${type}`是Google Fonts API的路径，即`css`或`css2`；`${fontname}`是字体列表。
Icarus使用较新的`css2` API请求字体，例如`https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;600&family=Source+Code+Pro`，所以你使用的镜像必须支持它。

### FontAwesome图标CDN

你可以传入自定义的FontAwesome CDN提供商的URL。
URL中不需要包含占位符。
本主题用到了一些FontAwesome 6图标，所以自定义的提供商需要至少提供它们。
内置的提供商加载的是FontAwesome 6.0.0。

{% codeblock "Icon Font CDN URL模板" %}
https://custom.fontawesome.mirror/some.stylesheet.css
{% endcodeblock %}

以上自定义配置需放到主题配置中的`providers`部分：

{% codeblock _config.icarus.yml lang:yaml %}
providers:
    cdn: 'https://some.cdn.domain.name/${package}/${version}/${filename}'
    fontcdn: 'https://some.google.font.mirror/${type}?family=${fontname}'
    iconcdn: 'https://custom.fontawesome.mirror/some.stylesheet.css'
{% endcodeblock %}

## 为单个包指定CDN

从Icarus 6.3.0起，你可以让某些JavaScript库使用与`cdn`不同的CDN提供商或URL来加载，例如当你的CDN提供商没有某个库的时候。
请把这些库的npm包名称添加到`cdn_overrides`中，并为每个包指定一个内置CDN提供商的名称，或是一个与`cdn`格式相同的URL模板：

{% codeblock _config.icarus.yml lang:yaml %}
providers:
    cdn: jsdelivr
    cdn_overrides:
        jquery: unpkg
        highlight.js: 'https://cdn.example.com/${package}@${version}/${filename}'
        clipboard: 'https://example.com/js/clipboard.min.js'
{% endcodeblock %}

不包含`${package}`、`${version}`和`${filename}`中任何一个占位符的URL（如上面`clipboard`的URL）会原样用于这个包的每一个文件。
因此，只能对只加载一个文件的包这样设置。

下面这些包是通过上述CDN设置加载的：

- **Icarus**
    - `jquery`：每个页面都会使用
    - `clipboard`：代码块的复制按钮
    - `highlight.js`：代码高亮主题的样式表（`appearance: auto`时有两个文件）
    - `pjax`：PJAX插件
- **插件和挂件**（来自hexo-component-inferno）
    - `@waline/client`：Waline评论插件和`waline_pageview`插件（多个文件）
    - `artalk`、`disqusjs`和`gitalk`（各两个文件），`twikoo`和`valine`：评论插件
    - `algoliasearch`和`instantsearch.js`：Algolia搜索插件
    - `social-share.js`：Share.js分享按钮（两个文件）
    - `lightgallery`和`justifiedGallery`：图片画廊插件（各两个文件）
    - `katex`（多个文件）和`mathjax`：KaTeX和MathJax插件
    - `cookieconsent`和`outdatedbrowser`：Cookie同意提示和过期浏览器提示插件（各两个文件）
    - `pace-js`：页面加载进度条插件

其他插件的脚本从你的站点或者它们各自服务的URL加载，不受CDN设置的影响。

## CDN工具函数

本主题定义了三个工具函数来帮助主题开发者轻松使用自定义CDN来引用第三方的前端资源。
详情请参见[ppoffice/hexo-component-inferno](https://github.com/ppoffice/hexo-component-inferno/blob/HEAD/src/hexo/helper/cdn.js)。


<article class="message message-immersive is-warning">
<div class="message-body">
<i class="fas fa-question-circle mr-2"></i>文章内容有误？请点击<a href="https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/zh-CN/CDN-Providers.md">此处</a>提交修改。
</div>
</article>
