title: Icarus用户指南 - 主题配置
date: 2016-01-03
categories:
- Configuration
tags:
- Getting Started
- Icarus用户指南
language: zh-CN
toc: true
providers:
    cdn: loli
    fontcdn: loli
    iconcdn: loli
---

<div class="notification is-success is-size-6">
本文同时提供以下语言的翻译：<a href="{% post_path en/Configuring-Theme %}">English</a>.
</div>

Icarus的默认主题配置文件`_config.yml`存放在`themes/icarus`目录下。
此文件不仅定义了站点全局的布局与样式设置，同时也包含了例如评论系统和挂件等其他组件的配置。
本文将介绍Icarus的主题配置机制，并且简述部分常用配置的格式与含义。

<!-- more -->

## 配置文件生成与校验

Icarus的主题配置文件由[YAML语言](https://yaml.org/)实现。
当你使用Hexo来处理主题文件而你的主题目录下没有默认配置文件`themes/icarus/_config.yml`时，Icarus会通过一系列[JSON Schema](https://json-schema.org/)文件来自动生成默认的
配置文件。
所以正常情况下你的主题目录下没有示例配置文件(`_config.yml.example`)并且也没有必要去手动创建`_config.yml`文件。
大多数的JSON Schema定义存放在`themes/icarus/include/schema`目录下，其他的定义则存放在[ppoffice/hexo-component-inferno](https://github.com/ppoffice/hexo-component-inferno)
仓库中。
你可以在运行`hexo`命令时附上`--icarus-dont-generate-config`来避免配置文件的自动生成。

当你每次在你的站点目录下运行`hexo`命令时，主题同时也会对比JSON Schema来校验你的配置文件是否正确。
如果校验中出现任何错误，Icarus会将错误位置与错误类型打印在屏幕上。
例如，如下的错误信息提醒我们`logo`配置项应该为字符串或是对象，而不是一个整型数。
你可以通过在`hexo`命令后附上`--icarus-dont-check-config`来跳过校验，但并不推荐这么做。

{% codeblock "hexo日志" %}
INFO  === Checking package dependencies ===
INFO  === Checking the configuration file ===
WARN  Configuration file failed one or more checks.
WARN  Icarus may still run, but you will encounter unexcepted results.
WARN  Here is some information for you to correct the configuration file.
WARN  [
  {
    keyword: 'type',
    dataPath: '.logo',
    schemaPath: '#/properties/logo/type',
    params: { type: 'string,object' },
    message: 'should be string,object'
  }
]
{% endcodeblock %}

另外，Icarus会尝试运行迁移脚本将你的配置升级到最新版本。
这些脚本存放在`themes/icarus/include/migration`目录。
你可以在`hexo`命令后附上`--icarus-dont-upgrade-config`来禁止配置升级。
最后，Icarus会检查主题所依赖的Node.js库是否安装并提醒你安装缺失的组件。

## 额外的配置文件与优先级

除了在`themes/icarus/_config.yml`的默认主题配置文件外，Icarus也会从如下位置读取配置：

- `themes/icarus/_config.post.yml`和`themes/icarus/_config.page.yml`
- 文章/页面的[front-matter](https://hexo.io/docs/front-matter.html)
- 根目录下的站点配置文件`_config.yml`

`_config.post.yml`和`_config.page.yml`配置文件与默认配置文件的格式和定义相同。
你可以在`_config.post.yml`中设置仅对文章页面生效的配置，而这些配置将覆盖默认配置文件中的同名配置。
例如，你可以在此配置文件中把所有的挂件放置在页面左侧，从而将所有的文章页面设置为两栏布局，同时其他页面仍保持三栏布局：

{% codeblock themes/icarus/_config.yml lang:yaml %}
widgets:
    -
        type: recent_posts
        position: left
    -
        type: categories
        position: right
    -
        type: tags
        position: right
{% endcodeblock %}

{% codeblock themes/icarus/_config.post.yml lang:yaml %}
widgets:
    -
        type: recent_posts
        position: left
    -
        type: categories
        position: left
    -
        type: tags
        position: left
{% endcodeblock %}

类似的，`_config.page.yml`中的配置也覆盖默认配置文件中的配置，并仅对所有Hexo页面(pages)生效。
此外，如果你想要在某个文章/页面中覆盖默认配置，你可以把这些配置放在那个文章/页面的front-matter(头部)。
例如，如果你想在某篇文章中更换代码高亮主题，你可以像下面这样把配置卸载文章的front-matter中：

{% codeblock source/_post/some-post.md lang:yaml %}
title: 我的第一篇文章
date: '2015-01-01 00:00:01'
article:
    highlight:
        theme: atom-one-dark
---
# 文章标题
{% endcodeblock %}

上面文章头部中的配置总会覆盖掉`_config.post.yml`和`_config.yml`文件中的同名配置。
在自定义页面或者优化访客的页面访问体验时，这个功能会十分有用。
比如，你可以为某篇文章设置更快的CDN，或者根据访客的国家或语言开启本地化的评论服务。
然而需要注意的是，一些Hexo定义的文章或页面属性不会复写掉其他配置文件中的同名配置，例如：

- `title`
- `date`
- `updated`
- `comments` (not `comment`)
- `layout`
- `source`
- `photos`
- `excerpt`

最后，站点根目录下的配置文件`_config.yml`可以被其他所有配置文件中的主题使用到的配置项所覆盖。
例如，`themes/icarus/_config.yml`中的`title`设置会覆盖掉`_config.yml`中的`title`，但`new_post_name`却不会，因为
Icarus没有用到这个配置项。

总而言之，配置文件的范围和覆盖优先级如下

<table class="table is-bordered is-striped">
<tr>
<th>某个文章/页面</th>
</tr>
<tr>
<td>
<ul class="mt-0 ml-4">
<li>front-matter可以覆盖</li>
<li><code>themes/icarus/_config.post.yml</code>或<code>themes/icarus/_config.page.yml</code>可以覆盖</li>
<li><code>themes/icarus/_config.yml</code>可以覆盖</li>
<li><code>_config.yml</code></li>
</ul>
</td>
</tr>
<tr>
<th>所有文章/页面</th>
</tr>
<tr>
<td>
<ul class="mt-0 ml-4">
<li><code>themes/icarus/_config.post.yml</code>或<code>themes/icarus/_config.page.yml</code>可以覆盖</li>
<li><code>themes/icarus/_config.yml</code>可以覆盖</li>
<li><code>_config.yml</code></li>
</ul>
</td>
</tr>
<tr>
<th>所有HTML页面</th>
</tr>
<tr>
<td>
<ul class="mt-0 ml-4">
<li><code>themes/icarus/_config.yml</code>可以覆盖</li>
<li><code>_config.yml</code></li>
</ul>
</td>
</tr>
<tr>
</table>


## 主题配置项概览

### 配置文件版本

{% codeblock themes/icarus/_config.yml lang:yaml %}
version: 3.0.0
{% endcodeblock %}

这个版本号与主题版本号相关却不总是相同。
当Icarus通过迁移脚本升级配置文件时，这个版本号会被用到。
请不要自己更改这个版本号。

### 主题变体

{% codeblock themes/icarus/_config.yml lang:yaml %}
variant: default
{% endcodeblock %}

为Icarus更换”皮肤“。
此配置目前支持”default“和”cyberpunk“两种值。
你可以在{% post_link demo/Cyberpunk "此处" %}查看Cyberpunk变体的效果。

### Logo

{% codeblock themes/icarus/_config.yml lang:yaml %}
logo: /img/logo.svg
{% endcodeblock %}

此项配置设置了页面导航栏和尾部展示的logo图片。
`logo`配置的值既可以时你的logo图片的路径或URL地址，也可以时如下这种文字形式的logo

{% codeblock themes/icarus/_config.yml lang:yaml %}
logo:
    text: My Beautiful Site
{% endcodeblock %}

### Favicon

{% codeblock themes/icarus/_config.yml lang:yaml %}
head:
    favicon: /img/favicon.svg
{% endcodeblock %}

你可以在`head`中的`favicon`配置中设置你的网站的favicon图标的路径或URL地址。

### Open Graph

{% codeblock themes/icarus/_config.yml lang:yaml >folded %}
head:
    open_graph:
        # 页面标题 (og:title) (可选)
        # 大部分情况下请留空
        title: 
        # 页面类型 (og:type) (可选)
        # 大部分情况下请留空
        type: blog
        # 页面URL地址 (og:url) (可选)
        # 大部分情况下请留空
        url: 
        # 页面封面图 (og:image) (可选)
        # 大部分情况下请留空
        image: 
        # 站点名称 (og:site_name) (可选)
        # 大部分情况下请留空
        site_name: 
        # 页面作者 (article:author) (可选)
        # 大部分情况下请留空
        author: 
        # 页面描述 (og:description) (可选)
        # 大部分情况下请留空
        description: 
        # Twitter卡片类型 (twitter:card)
        twitter_card: 
        # Twitter ID (twitter:creator)
        twitter_id: 
        # Twitter站点 (twitter:site)
        twitter_site: 
        # Google+个人主页链接 (已弃用)
        google_plus: 
        # Facebook admin ID
        fb_admins: 
        # Facebook App ID
        fb_app_id: 
{% endcodeblock %}

你可以在`head`部分配置Open Graph。
一些配置项应在主题配置文件中留空并在需要时在文章的front-matter中设置它们。
请参考[Hexo文档](https://hexo.io/zh-cn/docs/helpers.html#open-graph)来了解每个配置项的详细含义。

### Google Structured Data

{% codeblock themes/icarus/_config.yml lang:yaml >folded %}
head:
    structured_data:
        # 页面标题 (可选)
        # 大部分情况下请留空
        title: 
        # 页面描述 (可选)
        # 大部分情况下请留空
        description: 
        # 页面URL地址 (可选)
        # 大部分情况下请留空
        url: 
        # 页面作者 (article:author) (可选)
        # 大部分情况下请留空
        author: 
        # 页面图片 (可选)
        # 大部分情况下请留空
        image: 
{% endcodeblock %}

你可以在`head`部分配置Google Structured Data。
大部分配置项应在主题配置文件中留空并在需要时在文章的front-matter中设置它们。
请参考[Search for Developers](https://developers.google.com/search/docs/guides/intro-structured-data)来了解每个配置项的详细含义。

### 页面Metadata

{% codeblock themes/icarus/_config.yml lang:yaml %}
head:
    meta:
        - 'name=theme-color;content=#123456'
        - 'name=generator;content="Hexo 4.2.0"'
{% endcodeblock %}

你可以通过`head`部分的`meta`设置来向页面中添加`<meta>`标签。
每一个meta标签应作为`meta`数组中的一个元素。
标签的属性应按照`<属性名>=<属性值>`的格式出现并用`;`隔开。

### RSS

{% codeblock themes/icarus/_config.yml lang:yaml %}
head:
    rss: /path/to/atom.xml
{% endcodeblock %}

你可以通过此设置在页面头部添加RSS链接信息。

### 导航栏

{% codeblock themes/icarus/_config.yml lang:yaml %}
navbar:
    # 导航栏菜单项
    menu:
        Home: /
        Archives: /archives
        Categories: /categories
        Tags: /tags
        About: /about
    # 导航栏右侧的链接
    links:
        GitHub: 'https://github.com'
        Download on GitHub:
            icon: fab fa-github
            url: 'https://github.com/ppoffice/hexo-theme-icarus'
{% endcodeblock %}

`navbar`部分定义了导航栏中出现的链接。
你可以通过向`menu`配置项中添加`<链接名>: <链接URL>`的方式添加任意导航栏菜单链接。
如果你希望向导航栏右侧添加链接，请向`links`配置项中添加`<链接名>: <链接URL>`。
你甚至可以使用FontAwesome图标来替换掉纯文字链接，格式如下：

{% codeblock "链接格式" lang:yaml %}
<链接名>:
    icon: <FontAwesome图标的class名>
    url: <链接URL>
{% endcodeblock %}

### 页面尾部

{% codeblock themes/icarus/_config.yml lang:yaml %}
footer:
    links:
        Creative Commons:
            icon: fab fa-creative-commons
            url: 'https://creativecommons.org/'
        Attribution 4.0 International:
            icon: fab fa-creative-commons-by
            url: 'https://creativecommons.org/licenses/by/4.0/'
        Download on GitHub:
            icon: fab fa-github
            url: 'https://github.com/ppoffice/hexo-theme-icarus'
{% endcodeblock %}

你可以通过向`footer`中的`links`配置项中添加添加任意链接。
链接的格式与`navbar`的`links`配置项相同。

### 代码高亮

{% codeblock themes/icarus/_config.yml lang:yaml %}
article:
    highlight:
        # 代码高亮主题
        # https://github.com/highlightjs/highlight.js/tree/master/src/styles
        theme: atom-one-light
        # 显示复制代码按钮
        clipboard: true
        # 代码块的默认折叠状态。可以是"", "folded", "unfolded"
        fold: unfolded
{% endcodeblock %}

如果你已在Hexo中启用了代码高亮功能，那么你可以通过`article`中的`highlight`设置来自定义代码块。
请从[highlight.js/src/styles](https://github.com/highlightjs/highlight.js/tree/9.18.1/src/styles)目录下选择一个高亮主题，
然后将不带`.css`后缀的文件名设置到`theme`配置项中。
你亦可以将`clipboard`设置为`true`或`false`来显示或隐藏复制代码按钮。
最后，如果你希望默认折叠或展开所有代码块，请将`fold`设置为`folded`或`unfolded`。
你也可以将其设置为空来禁止代码块折叠。
另外，你可以使用下面的语法来折叠单独的代码块：

```
{% codeblock "可选文件名" lang:代码语言 >folded %}
...代码块内容...
{% endcodeblock %}
```

### 缩略图

为文章设置缩略图仅需两步。
第一步，确保主题配置文件中缩略图功能已启用：

{% codeblock themes/icarus/_config.yml lang:yaml %}
article:
    thumbnail: true
{% endcodeblock %}

第二步，在文章的front-matter中设置缩略图的路径或URL地址：

{% codeblock post.md lang:yaml %}
title: Icarus快速上手
thumbnail: /gallery/thumbnails/desert.jpg
---
文章内容...
{% endcodeblock %}

文章头部的图片路径应为图片的绝对路径或URL地址，或图片相对于你网站的`source`目录的相对地址。
例如，如果你想使用`<your blog>/source/gallery/image.jpg`作为缩略图，你需要在front-matter中使用`/gallery/image.jpg`作为图片地址。

### 文章阅读时间

{% codeblock themes/icarus/_config.yml lang:yaml %}
article:
    readtime: true
{% endcodeblock %}

你可以将`article`部分的`readtime`设置为`true`来显示文章字数以及预计阅读时间。

### 侧边栏

{% codeblock themes/icarus/_config.yml lang:yaml %}
sidebar:
    left:
        sticky: false
    right:
        sticky: true
{% endcodeblock %}

你设置`sidebar`中的`sticky`设置项为`true`来让边栏的位置固定而不跟随页面滚动。


## 其他配置项

如果你对第三方的插件，挂件，以及CDN提供商的配置感兴趣的话，请参考[Icarus用户指南](/hexo-theme-icarus/tags/Icarus用户指南/)系列文章。


<div class="notification is-warning is-size-6">
文章内容有误？请点击<a href="https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/zh-CN/Configuring-Theme.md">此处</a>提交修改。
</div>


<a style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-size:12px;line-height:1.2;display:inline-block;border-radius:3px" href="https://www.vecteezy.com/free-vector/vector-landscape" target="_blank" rel="noopener noreferrer" title="Vector Landscape Vectors by Vecteezy"><span style="display:inline-block;padding:2px 3px"><svg xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;position:relative;vertical-align:middle;top:-1px;fill:white" viewBox="0 0 32 32"><path d="M20.8 18.1c0 2.7-2.2 4.8-4.8 4.8s-4.8-2.1-4.8-4.8c0-2.7 2.2-4.8 4.8-4.8 2.7.1 4.8 2.2 4.8 4.8zm11.2-7.4v14.9c0 2.3-1.9 4.3-4.3 4.3h-23.4c-2.4 0-4.3-1.9-4.3-4.3v-15c0-2.3 1.9-4.3 4.3-4.3h3.7l.8-2.3c.4-1.1 1.7-2 2.9-2h8.6c1.2 0 2.5.9 2.9 2l.8 2.4h3.7c2.4 0 4.3 1.9 4.3 4.3zm-8.6 7.5c0-4.1-3.3-7.5-7.5-7.5-4.1 0-7.5 3.4-7.5 7.5s3.3 7.5 7.5 7.5c4.2-.1 7.5-3.4 7.5-7.5z"></path></svg></span><span style="display:inline-block;padding:2px 3px">Vector Landscape Vectors by Vecteezy</span></a>
