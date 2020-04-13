title: Icarus用户指南 - 挂件
date: 2016-01-01
categories:
- Widgets
tags:
- Icarus用户指南
language: zh-CN
toc: true
sidebar:
    left:
        sticky: false
    right:
        sticky: true
widgets:
    -
        position: left
        type: recent_posts
    -
        position: left
        type: links
        links:
            Hexo: 'https://hexo.io'
            Bulma: 'https://bulma.io'
    -
        position: left
        type: archives
    -
        position: left
        type: categories
    -
        position: left
        type: tags
    -
        position: left
        type: subscribe_email
        description: 邮件订阅，更新早知道
        feedburner_id: ''
    -
        position: right
        type: profile
        author: hulatocat
        author_title: A GitHub Octocat
        location: GitHub Inc.
        avatar: https://octodex.github.com/images/hula_loop_octodex03.gif
        avatar_rounded: false
        gravatar:
        follow_link: 'https://octodex.github.com/hulatocat'
        social_links:
            Github:
                icon: fab fa-github
                url: 'https://github.com/'
            Icarus: 'https://github.com/ppoffice/hexo-theme-icarus'
    -
        position: right
        type: toc
providers:
    cdn: loli
    fontcdn: loli
    iconcdn: loli
---

<div class="notification is-success is-size-6">
本文同时提供以下语言的翻译：<a href="{% post_path en/Widgets %}">English</a>。
</div>

本文介绍Icarus 3支持的一些页面挂件的安装配置。若需同时展示多个挂件，只需在主题配置的`widgets`数组中添加多个挂件配置，而他们的展示顺序以配置的定义顺序为准。而每项挂件均包含必填项`type`(挂件类型)与`position`(挂件展示位置：左边/右边)。例如

{% codeblock themes/icarus/_config.yml lang:yaml %}
widgets:
    -
        type: ... # 挂件1
        position: left
        ...
    -
        type: ... # 挂件2
        position: right
        ...
{% endcodeblock %}

<!-- more -->


<div class="notification is-link is-size-6">

Icarus的绝大部分挂件由[ppoffice/hexo-component-inferno](https://github.com/ppoffice/hexo-component-inferno)
提供，具体提供的挂件种类与配置以其为准。

</div>


## 作者资料卡

你可以启用作者资料卡挂件来展示文章作者/网站站长的信息。资料卡的示例配置如下所示：

{% codeblock themes/icarus/_config.yml lang:yaml %}
widgets:
    -
        position: right
        type: profile
        # 作者名称
        author: hulatocat
        # 作者头衔
        author_title: A GitHub Octocat
        # 作者所在地/公司
        location: GitHub Inc.
        # 头像图片地址
        avatar: https://octodex.github.com/images/hula_loop_octodex03.gif
        # 是否显示圆形头像
        avatar_rounded: false
        # Gravatar邮箱(如不设置`avatar`项)
        gravatar:
        # 关注按钮链接地址
        follow_link: 'https://octodex.github.com/hulatocat'
        # 社交媒体链接
        social_links:
            Github:
                icon: fab fa-github
                url: 'https://github.com/'
            Icarus: 'https://github.com/ppoffice/hexo-theme-icarus'
{% endcodeblock %}

需要注意的是：

- 如果你希望使用[Gravatar](https://en.gravatar.com/)提供头像图片，请在`gravatar`项填入
  你的Gravatar邮箱地址，而`avatar`一项请留空；
- `social_links`可以采用如下两种格式：

    **图标形式**：

    {% codeblock social_links lang:yaml %}
    <链接名称>:
        icon: <FontAwesome5图标的HTML class名称>
        url: <链接的URL地址>
    {% endcodeblock %}

    **文字形式**：

    {% codeblock social_links lang:yaml %}
    <链接名称>: <链接的URL地址>
    {% endcodeblock %}


## 文章目录

若要展示文章目录，请首先在主题配置文件中添加如下挂件配置：

{% codeblock themes/icarus/_config.yml lang:yaml %}
widgets:
    -
        type: toc
        position: left
{% endcodeblock %}

然后，在需要开启目录的文章头部加入`toc: true`：

{% codeblock Post.md lang:yaml %}
title: 一篇有目录的文章
toc: true
---
文章内容...
{% endcodeblock %}


## 友站链接

你可以展示友站链接挂件展示相关网站以及它们的链接。友站链接挂件的配置如下所示：

{% codeblock themes/icarus/_config.yml lang:yaml %}
widgets:
    -
        position: left
        type: links
        # 友站名称与链接
        links:
            Hexo: 'https://hexo.io'
            Bulma: 'https://bulma.io'
{% endcodeblock %}


## 最新文章

请通过如下挂件配置开启最新文章挂件：

{% codeblock themes/icarus/_config.yml lang:yaml %}
widgets:
    -
        position: right
        type: recent_posts
{% endcodeblock %}


## 文章归档

请通过如下挂件配置开启文章归档挂件：

{% codeblock themes/icarus/_config.yml lang:yaml %}
widgets:
    -
        position: right
        type: archives
{% endcodeblock %}


## 文章分类

请通过如下挂件配置开启文章分类挂件：

{% codeblock themes/icarus/_config.yml lang:yaml %}
widgets:
    -
        position: right
        type: categories
{% endcodeblock %}


## 文章标签

请通过如下挂件配置开启文章标签挂件：

{% codeblock themes/icarus/_config.yml lang:yaml %}
widgets:
    -
        position: right
        type: tags
{% endcodeblock %}


## 邮件订阅

Icarus的邮件订阅功能由Google Feedburner提供。

1. 若要开启邮件订阅挂件，请首先使用诸如[hexo-generator-feed](https://github.com/hexojs/hexo-generator-feed)
   的Hexo插件生成网站的RSS源。

2. 然后登录[Google Feedburner](https://feedburner.google.com)并添加你的RSS源。完成配置后，请点击网页顶部的”我的源“
   (My Feeds)查看源列表，并点击新添加的源进入源的配置界面。

3. 点击”宣传“(Publicize)标签页，然后点击页面左侧的”邮件订阅“(Email Subscription)，然后在页面右侧找到并点击”激活“(Activate)
   按钮。在打开的”邮件订阅“(Email Subscription)页面的HTML代码中找到

   {% codeblock Google Feedburner URL %}
   https://feedburner.google.com/fb/a/mailverify?uri=******
   {% endcodeblock %}

   复制`uri=`后的ID，例如`feedforall/ABCD`并填入挂件配置的`feedburner_id`中。

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    widgets:
        -
            position: left
            type: subscribe_email
            # (可选) 描述文字
            description: 邮件订阅，更新早知道
            feedburner_id: feedforall/ABCD
    {% endcodeblock %}


## Google AdSense

请登录[Google AdSense](https://www.google.com/adsense)并新建广告，复制广告代码中的`data-ad-client`和`data-ad-slot`
分别填入到挂件配置的`client_id`和`slot_id`项中。示例如下：

{% codeblock themes/icarus/_config.yml lang:yaml %}
widgets:
    -
        position: left
        type: adsense
        client_id: ca-pub-xxxxxxxx
        slot_id: xxxxxxx
{% endcodeblock %}


<div class="notification is-warning is-size-6">
文章内容有误？请点击<a href="https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/zh-CN/Widgets.md">此处</a>提交修改。
</div>
