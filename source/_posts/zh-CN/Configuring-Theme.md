title: Icarus用户指南 - 主题配置
date: 2016-01-04
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

Icarus的默认主题配置文件为`_config.icarus.yml`。
此文件定义了站点全局的布局与样式设置，同时也控制了例如插件与挂件等外部功能的配置。
本文详细介绍了本主题的一般配置，并且解释了Icarus使用哪些配置文件和它是如何生成并验证这些配置。

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-globe-americas mr-2"></i>本文同时提供以下语言的翻译：
<a href="{% post_path en/Configuring-Theme %}">English</a>.
</div>
</article>

<!-- more -->

<style>
.content ol:not([type]) {
    list-style-type: simp-chinese-informal;
}
</style>

## 一般主题配置

### 配置文件版本

这个版本号与主题版本号相关却不总是相同。
Icarus使用此版本号来决定是否升级默认主题配置文件。
请不要自己更改这个版本号。

{% codeblock _config.icarus.yml lang:yaml %}
version: 5.0.0
{% endcodeblock %}

### 主题变体

通过此设置为Icarus更换”皮肤“。
此设置目前支持”`default`“和”`cyberpunk`“两种值。
你可以在{% post_link demo/Cyberpunk "此处" %}查看Cyberpunk变体的效果。

{% codeblock _config.icarus.yml lang:yaml %}
variant: default
{% endcodeblock %}

### Logo

设置你站点的logo。
此logo会显示在导航栏和页脚。
`logo`配置的值既可以是你的logo图片的路径或URL地址：

{% codeblock _config.icarus.yml lang:yaml %}
logo: /img/logo.svg
{% endcodeblock %}

也可以像下面这样设置成文字：

{% codeblock _config.icarus.yml lang:yaml %}
logo:
    text: My Beautiful Site
{% endcodeblock %}

### Favicon

你可以在`head`配置中指定你的网站favicon的路径或URL地址。

{% codeblock _config.icarus.yml lang:yaml %}
head:
    favicon: /img/favicon.svg
{% endcodeblock %}

### Web App Manifest

Icarus支持基本的PWA`manifest.json`的生成与Meta标签。
要开启web app manifest，请再主题配置中使用如下的配置。
你也可以参考[MDN](https://developer.mozilla.org/zh-CN/docs/Web/Manifest)来了解每个配置项的详情。

{% codeblock _config.icarus.yml lang:yaml >folded %}
manifest:
    # Web应用的名称 (默认为站点标题)
    name: Icaurs - Hexo Theme
    # Web的显示名称
    # 当没有空间显示全名时显示
    short_name: Icarus
    # Web应用的初始URL
    start_url: https://ppoffice.github.io/
    # 应用的默认主题颜色
    theme_color: "#3273dc"
    # 在应用的样式表加载之前显示的应用页默认占位背景颜色
    background_color: "#3273dc"
    # 网站首选的展示模式
    display: standalone
    # 在不同上下文下用作应用图标的图片文件
    icons:
        -
            # 图片文件的路径
            src: icons/touch-icon-iphone.png
            # 空格分割的表示图标尺寸的字符串
            sizes: 144x144
            # 图片的媒体类型提示 (可选)
            type: image/png
        -
            src: icons/touch-icon-ipad.png
            sizes: 152x152
        -
            src: icon/logo.ico
            sizes: 72x72 96x96 128x128 256x256
{% endcodeblock %}

### Open Graph

你可以在`head`配置中设置Open Graph。
你应该在配置文件中将绝大部分配置留空。
仅在需要的时候在文章的front-matter中为这些设置赋值。
请参考[Hexo文档](https://hexo.io/zh-cn/docs/helpers.html#open-graph)来详细了解每个配置项。

{% codeblock _config.icarus.yml lang:yaml >folded %}
head:
    open_graph:
        # 页面标题 (og:title) (可选)
        title: 
        # 页面类型 (og:type) (可选)
        type: blog
        # 页面URL地址 (og:url) (可选)
        url: 
        # 页面封面图 (og:image) (可选)
        image: 
        # 站点名称 (og:site_name) (可选)
        site_name: 
        # 页面作者 (article:author) (可选)
        author: 
        # 页面描述 (og:description) (可选)
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

### Google Structured Data

你可以在`head`配置中设置Google Structured Data。
你应该在配置文件中将绝大部分配置留空。
仅在需要的时候在文章的front-matter中为这些设置赋值。
请参考[Search for Developers](https://developers.google.com/search/docs/guides/intro-structured-data)来详细了解每个配置项。

{% codeblock _config.icarus.yml lang:yaml >folded %}
head:
    structured_data:
        # 页面标题 (可选)
        title: 
        # 页面描述 (可选)
        description: 
        # 页面URL地址 (可选)
        url: 
        # 页面作者 (article:author) (可选)
        author: 
        # 页面图片 (可选)
        image: 
        # 文章发布者 (可选)
        publisher:
        # 发布者Logo (可选)
        publisher_logo:
{% endcodeblock %}

### 页面元信息

你可以通过`head`部分的`meta`设置来向生成的HTML中添加自定义`<meta>`标签。
每一个meta标签应作为`meta`数组中的一个元素出现。
`meta`设置每一个元素的值应为`<属性名>=<属性值>`的格式，其中`属性名`和`属性值`分别代表着`<meta>`标签的属性和值。
如果`<meta>`标签有多个属性和值，请使用`;`来分隔`<属性名>=<属性值>`。

{% codeblock _config.icarus.yml lang:yaml %}
head:
    meta:
        - 'name=theme-color;content=#123456'
        - 'name=generator;content="Hexo 4.2.0"'
{% endcodeblock %}

### RSS

你可以通过`head`部分的`rss`设置来添加RSS链接信息。

{% codeblock _config.icarus.yml lang:yaml %}
head:
    rss: /path/to/atom.xml
{% endcodeblock %}

### 导航栏

`navbar`部分定义了导航栏中的菜单与链接。
你可以通过向`menu`设置项中添加`<链接名>: <链接URL>`的方式添加任意导航栏菜单链接。
如要向导航栏右侧添加链接，请向`links`设置项中添加`<链接名>: <链接URL>`。

{% codeblock _config.icarus.yml lang:yaml %}
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

你也可以使用FontAwesome图标来作为纯文字链接的替换，格式如下：

{% codeblock "链接格式" lang:yaml %}
<链接名>:
    icon: <FontAwesome图标的class名>
    url: <链接URL>
{% endcodeblock %}

### 页脚

`footer`部分定义了页脚右侧的链接。
链接的配置格式与`navbar`中`links`的配置格式完全一致。

{% codeblock _config.icarus.yml lang:yaml %}
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

你也可以在页脚展示自定义版权文字：

{% codeblock _config.icarus.yml lang:yaml %}
footer:
    copyright: 用💖发电
{% endcodeblock %}

### 代码高亮

如果你已在Hexo中启用了代码高亮功能，你可以通过`article`中的`highlight`设置来自定义代码块。
请从[highlight.js/src/styles](https://github.com/highlightjs/highlight.js/tree/9.18.1/src/styles)下列出的所有主题中
选择一个主题。
然后，复制文件名(不带`.css`后缀)到`theme`设置项中。

如要隐藏复制代码按钮，将`clipboard`设置为`false`。
如果你希望折叠或展开所有代码块，将`fold`设置为`"folded"`或`"unfolded"`。
你也可以将`fold`设置为空来禁止代码块折叠。

{% codeblock _config.icarus.yml lang:yaml %}
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

此外，你可以在Markdown文件中使用下面的语法来折叠单独的代码块：

```
{% codeblock "可选文件名" lang:代码语言 >folded %}
...代码块内容...
{% endcodeblock %}
```

### 封面 & 缩略图

若要为文章添加封面图，请在文章的front-matter中添加`cover`选项：

{% codeblock post.md lang:yaml %}
title: Icarus快速上手
cover: /gallery/covers/cover.jpg
---
Post content...
{% endcodeblock %}

类似地，你也可以在文章的front-matter中为文章设置缩略图：

{% codeblock post.md lang:yaml %}
title: Icarus快速上手
thumbnail: /gallery/covers/thumbnail.jpg
---
Post content...
{% endcodeblock %}

文章的缩略图会显示在归档页面和最新文章挂件中。

如果你在front-matter中使用的是图片的路径，你需要确保它是绝对或者相对于你的source目录的路径。
例如，为使用`<your blog>/source/gallery/image.jpg`作为缩略图，你需要在front-matter中使用`/gallery/image.jpg`作为图片路径。

### 文章阅读时间

你可以将`article`部分的`readtime`设置为`true`来显示文章字数统计以及预计阅读时间。

{% codeblock _config.icarus.yml lang:yaml %}
article:
    readtime: true
{% endcodeblock %}

### 文章更新时间

若要显示文章的更新时间，请在文章的front_matter中设置`updated`时间：

{% codeblock post.md lang:yaml %}
title: Icarus快速上手
updated: 2020-04-01 00:00:00
---
Post content...
{% endcodeblock %}

然后，将主题配置文件的`article`部分的`update_time`设置为`true`：

{% codeblock _config.icarus.yml lang:yaml %}
article:
    update_time: true
{% endcodeblock %}

你也可以将`update_time`设置为`false`来隐藏所有文章的更新时间，或设置为`auto`而在文章的更新时间
与发布时间相同时隐藏更新时间。

### 文章许可协议

你可以在你的文章/页面的底部展示你的作品的使用许可，许可链接可以是文字或者图标。
这里的配置与导航栏或者页脚的`links`配置一致：

{% codeblock _config.icarus.yml lang:yaml %}
article:
    # 文章许可协议
    licenses:
        Creative Commons:
            icon: fab fa-creative-commons
            url: 'https://creativecommons.org/'
        'CC BY-NC-SA 4.0': 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
{% endcodeblock %}

### 侧边栏

设置`sidebar`中某个侧边栏的`sticky`为`true`来让它的位置固定而不跟随页面滚动。

{% codeblock _config.icarus.yml lang:yaml %}
sidebar:
    left:
        sticky: false
    right:
        sticky: true
{% endcodeblock %}


### 其他配置

你可以参考[Icarus用户指南](/hexo-theme-icarus/tags/Icarus用户指南/)来了解更多第三方的插件、挂件、以及CDN提供商的配置。


## 配置文件与优先级

除了在`_config.icarus.yml`的默认主题配置文件外，Icarus也会从如下位置获取替代配置：

- 位于`_config.yml`的站点配置文件
- 位于`_config.post.yml`和`_config.page.yml`的布局配置文件
- 文章/页面的[front-matter](https://hexo.io/docs/front-matter.html)
- (已弃用) 位于`themes/icarus/_config.yml`的旧主题配置文件
- (已弃用) 位于`themes/icarus/_config.post.yml`和`themes/icarus/_config.page.yml`的旧布局配置文件

### 布局配置文件

布局配置文件遵循着与主题配置文件相同的格式和定义。
`_config.post.yml`中的配置对所有文章生效，而`_config.page.yml`中的配置对所有自定义页面生效。
这两个文件将覆盖主题配置文件中的配置。

例如，你可以在`_config.post.yml`中把所有文章变为两栏布局：

{% codeblock _config.post.yml lang:yaml %}
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

同时所有其他页面仍保持三栏布局：

{% codeblock _config.icarus.yml lang:yaml %}
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

### 文章/页面的Front-matter

如果你只想要在某个文章/页面中覆盖主题配置，你可以在那个文章/页面的front-matter中写下配置。
例如，你可以像下面这样在一篇文章的front-matter中更改某篇文章的代码高亮主题：

{% codeblock source/_post/some-post.md lang:yaml %}
title: 我的第一篇文章
date: '2015-01-01 00:00:01'
article:
    highlight:
        theme: atom-one-dark
---
# 文章标题
{% endcodeblock %}

上面的配置会为那篇文章覆盖掉`_config.post.yml`和`_config.icarus.yml`中的`article.highlight`。
这种层次化的配置系统对于页面个性化和不同访客间的差异化优化十分有效。
比如，你可以为根据你页面目标访客的国家和语言来开启更快的CDN或本地化的评论服务。

然而需要注意的是，一些Hexo定义的文章或页面属性不会覆盖掉其他配置源中的同名配置，如
`title`, `date`, `updated`, `comments` (not `comment`), `layout`, `source`, `photos`, 和`excerpt`。

### 站点配置文件

上面列出的所有配置源，包括主题配置文件，布局配置文件，和文章/页面的front-matter，会覆盖掉站点配置文件中Icarus使用到的配置。
例如，`_config.icarus.yml`中的`title`设置会覆盖掉`_config.yml`中的`title`，但`new_post_name`却不会，因为
Icarus没有用到这个配置项。

另外，主题配置文件中的`theme_config`选项会与主题配置文件中的主题配置合并并覆盖掉同名配置。
然而，我们非常不推荐使用这个配置选项。

### 总结

总而言之，配置源的作用范围和优先级如下：

- 对于某个文章或页面

    - 文章/页面的front-matter覆盖所有下面的配置源。
    - 布局配置文件覆盖所有下面的配置源。
    - 站点配置文件中的`theme_config`选项覆盖所有下面的配置源。
    - 主题配置文件覆盖所有下面的配置源。
    - 站点配置文件。

- 对于所有的文章或页面

    - 布局配置文件覆盖所有下面的配置源。
    - 站点配置文件中的`theme_config`选项覆盖所有下面的配置源。
    - 主题配置文件覆盖所有下面的配置源。
    - 站点配置文件。

- 对于所有的文章，页面，和索引页

    - 站点配置文件中的`theme_config`选项覆盖所有下面的配置源。
    - 主题配置文件覆盖所有下面的配置源。
    - 站点配置文件。


## 配置生成与校验

所有的Icarus主题配置均使用[YAML语言](https://yaml.org/)编写。
如果配置文件不存在，Icarus会通过一系列[JSON Schema](https://json-schema.org/)来自动生成默认的配置文件`_config.icarus.yml`。
这也是为什么你在主题目录下找不到示例配置文件(如`_config.yml.example`)。
大多数的JSON Schema存放在`<icarus_directory>/include/schema`目录下，而其他的则存放在
[ppoffice/hexo-component-inferno](https://github.com/ppoffice/hexo-component-inferno)仓库中。
你可以在你的`hexo`命令后附上`--icarus-dont-generate-config`来避免配置文件的自动生成。

当你每次运行`hexo`命令时，主题也会对比JSON Schema来校验你的配置文件。
如果校验中出现任何错误，Icarus会将错误位置与错误类型打印在屏幕上。
例如，如下的错误信息告诉我们`logo`配置值应该为字符串或是对象，而不是一个整型数。
你可以在你的`hexo`命令后附上`--icarus-dont-check-config`来跳过校验，但并不推荐这么做。

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

此外，如果你的默认主题配置文件不是最新版本的话，Icarus会运行迁移脚本将它升级到最新版本。
这些脚本存放在`<icarus_directory>/include/migration`目录。
你可以在你的`hexo`命令后附上`--icarus-dont-upgrade-config`来禁止配置升级。
最后，Icarus也会检查主题依赖的Node.js库是否安装并提醒你安装缺失的库。


<article class="message message-immersive is-warning">
<div class="message-body">
<i class="fas fa-question-circle mr-2"></i>文章内容有误？请点击<a href="https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/zh-CN/Configuring-Theme.md">此处</a>提交修改。
</div>
</article>
