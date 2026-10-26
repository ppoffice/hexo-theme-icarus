title: Icarus用户指南 - 主题配置
date: 2025-02-23
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

Icarus的默认主题配置文件为`_config.icarus.yml`，它位于站点根目录中，与站点配置文件`_config.yml`放在一起。
此文件定义了站点全局的布局与样式设置，同时也控制了例如插件与挂件等外部功能的配置。
本文详细介绍了本主题的一般配置，并且解释了Icarus使用哪些配置文件，以及它是如何生成并验证这些配置的。

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
version: 5.1.0
{% endcodeblock %}

### 主题变体

通过此设置为Icarus更换“皮肤”。
此设置目前支持`default`、`cyberpunk`和`m3e`（Material 3 Expressive）三种值。
你可以在{% post_link demo/Cyberpunk "此处" %}查看Cyberpunk变体的效果，在{% post_link demo/Material-3-Expressive "此处" %}查看Material 3 Expressive变体的效果（英文）。

{% codeblock _config.icarus.yml lang:yaml %}
variant: default
{% endcodeblock %}

### 外观

默认变体和Material 3 Expressive变体可以是亮色或暗色的。
将`appearance`设置为`light`（默认值）、`auto`（跟随每位访客的浏览器或操作系统的亮色/暗色设置）或`dark`（始终使用暗色）。
Cyberpunk变体有自己的暗色配色，会忽略此设置。

{% codeblock _config.icarus.yml lang:yaml %}
appearance: auto
{% endcodeblock %}

和其他主题配置一样，`appearance`也可以在布局配置文件中为所有文章或页面设置，或在某个文章或页面的front-matter中单独设置（参见[配置文件与优先级](#配置文件与优先级)）。
页面显示为暗色时，代码块会使用[代码高亮](#代码高亮)设置中的`dark_theme`，logo也会换成[`logo_dark`](#Logo)。
你可以在{% post_link demo/Dark-Mode "此处" %}查看暗色外观的效果。

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

当默认变体或Material 3 Expressive变体显示为暗色时（参见[外观](#外观)），以及使用Cyberpunk变体时，logo图片会换成`logo_dark`中设置的图片：

{% codeblock _config.icarus.yml lang:yaml %}
logo: /img/logo.svg
logo_dark: /img/logo-dark.svg
{% endcodeblock %}

如果没有设置`logo_dark`，主题自带的logo（`/img/logo.svg`）会换成`/img/logo-dark.svg`，其他logo图片则保持不变。
文字logo不会改变。

### Favicon

你可以在`head`配置中指定你的网站favicon的路径或URL地址。

{% codeblock _config.icarus.yml lang:yaml %}
head:
    favicon: /img/favicon.svg
{% endcodeblock %}

### Web App Manifest

Icarus支持基本的PWA`manifest.json`的生成与Meta标签。
要开启web app manifest，请在主题配置的`head`配置中使用如下的配置。
你也可以参考[MDN](https://developer.mozilla.org/zh-CN/docs/Web/Manifest)来了解每个配置项的详情。

{% codeblock _config.icarus.yml lang:yaml >folded %}
head:
    manifest:
        # Web应用的名称 (默认为站点标题)
        name: Icarus - Hexo Theme
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
                # 图片文件的路径（相对于站点根目录）
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
        # 留空时，文章使用`article`，其他页面使用`website`
        type: 
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
        # Facebook admin ID
        fb_admins: 
        # Facebook App ID
        fb_app_id: 
{% endcodeblock %}

hexo-component-inferno 4.1.0及更早版本生成的配置文件会把`type`设为`blog`，但它并不是有效的Open Graph类型。
如果你的配置文件里有`type: blog`，请把它留空。

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

自hexo-component-inferno 4.2.0起，每组中只有第一个`=`用来分隔属性名和属性值，所以属性值中可以包含`=`。
如果属性值中需要使用`;`（或属性名中需要使用`=`），请用反斜杠转义，例如`'http-equiv=refresh;content=5\;url=https://example.com/'`。

### RSS

你可以通过`head`部分的`rss`设置来添加RSS链接信息。

{% codeblock _config.icarus.yml lang:yaml %}
head:
    rss: /path/to/atom.xml
{% endcodeblock %}

### 导航栏

`navbar`部分定义了导航栏中的菜单与链接。
你可以通过向`menu`设置项中添加`<链接名>: <链接URL>`的方式添加任意导航栏菜单链接。
如要把几个链接归到同一个菜单项下，请把这个菜单项设置为由`<链接名>: <链接URL>`组成的对象，这些链接会显示在子菜单中。
如要向导航栏右侧添加链接，请向`links`设置项中添加`<链接名>: <链接URL>`。

{% codeblock _config.icarus.yml lang:yaml %}
navbar:
    # 导航栏菜单项
    menu:
        Home: /
        Archives: /archives
        Categories: /categories
        Tags: /tags
        # 子菜单
        About:
            About Me: /about
            Projects: /projects
    # 导航栏右侧的链接
    links:
        GitHub: 'https://github.com'
        Download on GitHub:
            icon: fab fa-github
            url: 'https://github.com/ppoffice/hexo-theme-icarus'
{% endcodeblock %}

当菜单项和链接无法在一行中显示时（例如在手机上），菜单项会折叠到一个下拉菜单中，点击菜单按钮即可打开。

你也可以使用FontAwesome图标来作为纯文字链接的替换，格式如下：

{% codeblock "链接格式" lang:yaml %}
<链接名>:
    icon: <FontAwesome图标的class名>
    url: <链接URL>
{% endcodeblock %}

这种格式适用于`navbar.links`、`footer.links`、`article.licenses`以及个人信息挂件的`social_links`，但不适用于`navbar.menu`中的菜单项，菜单项始终显示为文字。

导航栏默认会随页面一起滚走。
如要让它固定在窗口顶部，请将`navbar`部分的`sticky`设置为`true`；设置为`mobile`则只在宽度小于769px的屏幕（如手机）上固定。
固定后，指向标题的链接和目录中的条目会把标题滚动到导航栏的正下方。

{% codeblock _config.icarus.yml lang:yaml %}
navbar:
    # 导航栏是否固定在窗口顶部：true、mobile或false
    sticky: mobile
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
请从[highlight.js/src/styles](https://github.com/highlightjs/highlight.js/tree/11.11.1/src/styles)下列出的所有主题中
选择一个主题。
然后，复制文件名(不带`.css`后缀)到`theme`设置项中。
`base16`目录中的主题（如`solarized-light`）需要在名称中保留目录名，例如`base16/solarized-light`。
`dark_theme`设置项是页面显示为暗色时改用的主题（参见[外观](#外观)）。

Material 3 Expressive变体的代码块背景和主要语法颜色使用其自身的配色。

在使用鼠标的设备上，代码块的复制按钮只在鼠标悬停于代码块上或代码块获得焦点时显示；在触摸屏上则始终显示。
如要隐藏复制代码按钮，将`clipboard`设置为`false`。
如果你希望折叠或展开所有代码块，将`fold`设置为`"folded"`或`"unfolded"`。
你也可以将`fold`设置为空来禁止代码块折叠。
折叠的代码块会隐藏全部代码。
如要改为显示开头几行并逐渐淡出，请将`fold_preview`设置为要显示的行数。
点击预览即可展开代码块；代码行数不超过预览行数的代码块会完整显示。

{% codeblock _config.icarus.yml lang:yaml %}
article:
    highlight:
        # 代码高亮主题
        # https://github.com/highlightjs/highlight.js/tree/master/src/styles
        theme: atom-one-light
        # 默认变体显示为暗色时使用的代码高亮主题（参见appearance）
        dark_theme: atom-one-dark
        # 显示复制代码按钮
        clipboard: true
        # 代码块的默认折叠状态。可以是"", "folded", "unfolded"
        fold: unfolded
        # 折叠的代码块仍作为预览显示的行数（0表示隐藏全部代码）
        fold_preview: 0
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

Icarus会在文章的发布时间旁边显示更新时间。
你可以在文章的front-matter中设置更新时间：

{% codeblock post.md lang:yaml %}
title: Icarus快速上手
updated: 2020-04-01 00:00:00
---
Post content...
{% endcodeblock %}

主题配置文件`article`部分的`update_time`设置决定是否显示更新时间：

{% codeblock _config.icarus.yml lang:yaml %}
article:
    update_time: true
{% endcodeblock %}

设置为`true`（默认值）会显示所有文章的更新时间，设置为`false`会隐藏所有文章的更新时间，设置为`auto`则在文章的更新时间与发布时间相同时隐藏更新时间。

如果front-matter中没有`updated`，Hexo会把Markdown文件的修改时间当作更新时间，因为站点配置文件中`updated_option`的默认值是`mtime`。
所以每篇文章都会显示更新时间（即使设置为`auto`，通常也是如此），而且在你检出或复制文件后，更新时间可能会改变。
如果只想显示在front-matter中设置了`updated`的文章的更新时间，请在`_config.yml`中把`updated_option`设置为`empty`：

{% codeblock _config.yml lang:yaml %}
updated_option: empty
{% endcodeblock %}

### 过时文章提示

Icarus可以在长时间没有更新的文章顶部显示一条提示，让读者知道其中的部分内容可能已经过时。
如要显示该提示，请将`article`部分`outdated_notice`设置中的`enable`设置为`true`。
`days`是文章最后一次更新后开始显示提示的天数（默认为365）。
文章的最后一次更新时间是它的更新时间（参见[文章更新时间](#文章更新时间)），没有更新时间时则为发布时间。

{% codeblock _config.icarus.yml lang:yaml %}
article:
    outdated_notice:
        enable: true
        days: 365
{% endcodeblock %}

文章距上次更新的天数由读者的浏览器计算，所以无需重新生成站点，提示也会按时显示。
提示只显示在文章中，不会显示在页面或首页的文章摘要中。
如要在某篇文章中关闭提示，请在它的front-matter中将`outdated_notice`设置为`false`：

{% codeblock post.md lang:yaml %}
title: Icarus快速上手
outdated_notice: false
---
Post content...
{% endcodeblock %}

文章的更新时间默认是Markdown文件的修改时间，每次检出文件时都会改变（例如由CI服务生成站点时）。
为了让提示反映文章真实的更新时间，请在文章的front-matter中设置`updated`，或者按上文所述在`_config.yml`中把`updated_option`设置为`empty`。

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

除了旧的配置文件，上面的文件都位于站点根目录中。
如果你还保留着旧的配置文件：`_config.icarus.yml`会覆盖`themes/icarus/_config.yml`，但`themes/icarus/_config.post.yml`和`themes/icarus/_config.page.yml`中设置的顶层配置项会覆盖站点根目录中的布局配置文件。
为避免意外，请把它们的内容移到站点根目录中的配置文件里。

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

如要去掉所有挂件，例如让所有自定义页面都使用单栏布局，请将`widgets`设置为`null`：

{% codeblock _config.page.yml lang:yaml %}
widgets: null
{% endcodeblock %}

### 文章/页面的Front-matter

如果你只想要在某个文章/页面中覆盖主题配置，你可以在那个文章/页面的front-matter中写下配置。
例如，你可以像下面这样在一篇文章的front-matter中更改某篇文章的代码高亮主题：

{% codeblock source/_posts/some-post.md lang:yaml %}
title: 我的第一篇文章
date: '2015-01-01 00:00:01'
article:
    highlight:
        theme: atom-one-dark
---
# 文章标题
{% endcodeblock %}

上面的配置会为那篇文章覆盖掉`_config.post.yml`和`_config.icarus.yml`中的`article`配置。

注意，布局配置文件和front-matter是按顶层配置项逐个覆盖主题配置的，不会合并顶层配置项内部的设置。
在上面的例子中，这篇文章使用的是front-matter中的`article`部分，而不是`_config.icarus.yml`中的整个`article`部分。
这个部分中的其他设置，例如`highlight.clipboard`、`highlight.fold`、`readtime`和`licenses`，都不会再从`_config.icarus.yml`中读取：比如这篇文章的阅读时间和许可协议都会消失。
请把需要保留的设置也写上：

{% codeblock source/_posts/some-post.md lang:yaml %}
title: 我的第一篇文章
date: '2015-01-01 00:00:01'
article:
    highlight:
        theme: atom-one-dark
        clipboard: true
        fold: unfolded
    readtime: true
    licenses:
        'CC BY-NC-SA 4.0': 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
---
# 文章标题
{% endcodeblock %}

这种层次化的配置系统对于页面个性化和不同访客间的差异化优化十分有效。
比如，你可以根据页面目标访客的国家和语言来开启更快的CDN或本地化的评论服务。

然而需要注意的是，一些Hexo定义的文章或页面属性不会覆盖掉其他配置源中的同名配置，如
`title`、`date`、`updated`、`comments`（不是`comment`）、`layout`、`source`、`photos`和`excerpt`。

### 站点配置文件

上面列出的所有配置源，包括主题配置文件，布局配置文件，和文章/页面的front-matter，会覆盖掉站点配置文件中Icarus使用到的配置。
例如，`_config.icarus.yml`中的`title`设置会覆盖掉`_config.yml`中的`title`，但`new_post_name`却不会，因为
Icarus没有用到这个配置项。

另外，站点配置文件`_config.yml`中的`theme_config`选项会与主题配置文件中的主题配置合并并覆盖掉同名配置。
然而，我们非常不推荐使用这个配置选项，Icarus发现它时也会打印一条警告。

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
如要查看所有可用的配置项及其说明，请阅读生成的`_config.icarus.yml`。
大多数的JSON Schema存放在`<icarus_directory>/include/schema`目录下，而其他的则存放在
[ppoffice/hexo-component-inferno](https://github.com/ppoffice/hexo-component-inferno)仓库中。
你可以在你的`hexo`命令后附上`--icarus-dont-generate-config`来避免配置文件的自动生成。

当你每次运行`hexo`命令时，主题也会对比JSON Schema来校验你的配置文件。
如果校验中出现任何错误，Icarus会将错误位置与错误类型打印在屏幕上。
例如，如下的错误信息告诉我们`logo`配置（`instancePath: '/logo'`）的值必须是字符串或对象，而不是一个整数。
你可以在你的`hexo`命令后附上`--icarus-dont-check-config`来跳过校验，但并不推荐这么做。

{% codeblock "hexo日志" %}
INFO  === Checking package dependencies ===
INFO  === Checking theme configurations ===
WARN  Theme configurations failed one or more checks.
WARN  Icarus may still run, but you will encounter unexpected results.
WARN  Here is some information for you to correct the configuration file.
WARN  [
  {
    instancePath: '/logo',
    schemaPath: '#/properties/logo/type',
    keyword: 'type',
    params: { type: [Array] },
    message: 'must be string,object'
  }
]
{% endcodeblock %}

对于一些虽然合法、但很可能不是你想要的设置，配置检查也会打印警告：Valine评论插件（它会暴露评论者的邮箱地址）；`waline_pageview`插件与Waline评论插件的`pageview`选项同时开启（每次浏览会被计数两次），或者`waline_pageview`没有可用的Waline服务端来统计浏览量；以及站点配置文件中的`theme_config`选项。

此外，如果你的默认主题配置文件不是最新版本的话，Icarus会运行迁移脚本将它升级到最新版本。
这些脚本存放在`<icarus_directory>/include/migration`目录。
升级之前，Icarus会备份你的配置文件；升级之后，Icarus还会把一份新生成的配置文件写入`_config.icarus.yml.example`供你参考。
你可以在你的`hexo`命令后附上`--icarus-dont-upgrade-config`来禁止配置升级。
最后，Icarus也会检查主题依赖的Node.js库是否安装并提醒你安装缺失的库。
你可以在你的`hexo`命令后附上`--icarus-dont-check-deps`来跳过此检查，例如在尝试某个依赖的更新的主版本时。


<article class="message message-immersive is-warning">
<div class="message-body">
<i class="fas fa-question-circle mr-2"></i>文章内容有误？请点击<a href="https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/zh-CN/Configuring-Theme.md">此处</a>提交修改。
</div>
</article>
