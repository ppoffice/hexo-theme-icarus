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
        order_by: -name
        amount:
        show_count: false
    -
        position: left
        type: followit
        description: 邮件订阅，更新早知道
        action_url: ''
        verification_code: ''
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
        index: false
providers:
    cdn: loli
    fontcdn: loli
    iconcdn: loli
---

本文介绍Icarus 6支持的页面挂件的安装配置。
若要同时展示多个挂件，只需在主题配置的`widgets`数组中添加多个挂件配置。
它们会按照定义的顺序出现。
每个挂件必须包含`type`(挂件类型)与`position`(挂件展示位置)设置项。
示例如下：

{% codeblock _config.icarus.yml lang:yaml %}
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

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-globe-americas mr-2"></i>本文同时提供以下语言的翻译：<a href="{% post_path en/Widgets %}">English</a>。
</div>
</article>

<!-- more -->

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-info-circle mr-2"></i>下面的挂件由<a href="https://github.com/ppoffice/hexo-component-inferno">ppoffice/hexo-component-inferno</a>提供，完整的支持挂件列表和配置详情以其为准。
</div>
</article>


## 侧边栏布局

`position`为`left`的挂件显示在左侧边栏中，`position`为`right`的挂件显示在右侧边栏中。
只有一侧的边栏有挂件时，页面分为两栏；两侧的边栏都有挂件时，页面分为三栏。
在三栏布局中，右侧边栏只在宽屏(1280px及以上)上显示。
在较窄的屏幕上，右侧边栏的挂件会移到左侧边栏的底部。

若要关闭所有挂件，请将主题配置中的`widgets`设置为`null`。
和其他主题配置一样，`widgets`也可以在布局配置文件(`_config.post.yml`和`_config.page.yml`)或文章、页面的front-matter中设置，
因此你可以只在部分页面上关闭挂件：

{% codeblock _config.icarus.yml lang:yaml %}
widgets: null
{% endcodeblock %}


## 作者资料卡

你可以启用作者资料卡挂件来展示文章作者/网站站长的信息。
资料卡的配置如下所示：

{% codeblock _config.icarus.yml lang:yaml %}
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
        # 头像图片的URL或路径
        avatar: https://octodex.github.com/images/hula_loop_octodex03.gif
        # 是否显示圆形头像
        avatar_rounded: false
        # Gravatar账户的邮箱地址。设置后优先于`avatar`使用
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

- 如果没有设置`author`，则显示站点配置文件`_config.yml`中的`author`。

- 如果你希望使用[Gravatar](https://en.gravatar.com/)作为头像图片，请在`gravatar`项填入你的Gravatar邮箱地址。
  设置了`gravatar`时，即使同时设置了`avatar`，也会使用Gravatar头像。
  两者都没有设置时，显示Icarus的默认头像(`/img/avatar.png`)。

- `social_links`可以采用如下两种格式：

    **图标形式**：

    {% codeblock social_links lang:yaml %}
    <链接名称>:
        icon: <FontAwesome图标的HTML_class名称>
        url: <链接的URL地址>
    {% endcodeblock %}

    **文字形式**：

    {% codeblock social_links lang:yaml %}
    <链接名称>: <链接的URL地址>
    {% endcodeblock %}


## 文章目录

若要展示文章目录，请在主题配置中添加如下挂件配置：

{% codeblock _config.icarus.yml lang:yaml %}
widgets:
    -
        type: toc
        position: left
        index: true         # 可选项。是否显示目录项目的序号，默认为`true`。
        collapsed: true     # 可选项。是否收起未在阅读的章节的子标题，默认为`true`。
        depth: 3            # 可选项。显示的标题层级数，默认为`3`。
{% endcodeblock %}

然后，在需要开启目录的文章或页面的front-matter中加入`toc: true`：

{% codeblock Post.md lang:yaml %}
title: 一篇有目录的文章
toc: true
---
文章内容...
{% endcodeblock %}

关于文章目录挂件需要注意的是：

- 文章目录挂件只在front-matter中有`toc: true`的文章和页面上显示。
  在其他页面上它不会占用空间，如果所在的侧边栏没有其他挂件，这一侧边栏也不会显示。
- `depth`从文章实际使用的最高一级标题开始计算层级。
  例如设置`depth: 2`时，标题从`##`开始的文章会显示`##`和`###`标题。
- 访客阅读文章时，目录中当前章节的条目会高亮显示，并保持在可见区域内。
- 在手机上，页面中不显示这个挂件，而是在导航栏中显示一个按钮，点击即可在页面上方打开文章目录。


## 友站链接

你可以使用友站链接挂件来展示外部网站的列表。
示例配置如下所示：

{% codeblock _config.icarus.yml lang:yaml %}
widgets:
    -
        position: left
        type: links
        # 友站名称与链接
        links:
            Hexo: 'https://hexo.io'
            Bulma: 'https://bulma.io'
{% endcodeblock %}

每个网站名称的旁边会显示其域名。
若要隐藏某个网站的域名，请将其写成包含`link`和`hide_hostname`设置的对象：

{% codeblock _config.icarus.yml lang:yaml %}
widgets:
    -
        position: left
        type: links
        links:
            Hexo: 'https://hexo.io'
            Bulma:
                link: 'https://bulma.io'
                hide_hostname: true
{% endcodeblock %}


## 最新文章

使用如下挂件配置来开启最新文章挂件：

{% codeblock _config.icarus.yml lang:yaml %}
widgets:
    -
        position: right
        type: recent_posts
        limit: 5            # 可选项。显示的最新文章数量，默认为5。
{% endcodeblock %}


## 文章归档

使用如下挂件配置来开启文章归档挂件：

{% codeblock _config.icarus.yml lang:yaml %}
widgets:
    -
        position: right
        type: archives
        group_by: monthly   # 可选项。按月(monthly)或按年(yearly)归档，默认为`monthly`。
        order: -1           # 可选项。`-1`表示最新的归档排在前面，`1`表示最早的归档排在前面，默认为`-1`。
        format:             # 可选项。归档名称的Moment.js格式，默认为`MMMM YYYY`(按月)或`YYYY`(按年)。
        amount: 10          # 可选项。最多显示的归档数量。留空以显示所有归档。
        show_count: true    # 可选项。是否显示每个归档的文章数量，默认为`true`。
{% endcodeblock %}

设置了`amount`并且归档数量超过它时，列表末尾会加上一个指向归档页面的“更多”链接。
`show_count`需要hexo-component-inferno 4.2.0及以上版本。


## 文章分类

使用如下挂件配置来开启文章分类挂件：

{% codeblock _config.icarus.yml lang:yaml %}
widgets:
    -
        position: right
        type: categories
        order_by: name      # 可选项。按分类名称(name)或文章数量(length)排序，默认为`name`。
        order: 1            # 可选项。`1`为升序，`-1`为降序，默认为`1`。
        depth: 0            # 可选项。显示的分类层级数，如`1`表示只显示顶级分类。设为`0`或留空时显示所有层级。
        show_current: false # 可选项。是否高亮当前文章所属的分类，默认为`false`。
        amount: 10          # 可选项。最多显示的顶级分类数量。留空以显示所有分类。
        show_count: true    # 可选项。是否显示每个分类的文章数量，默认为`true`。
{% endcodeblock %}

设置了`amount`并且顶级分类数量超过它时，列表末尾会加上一个指向分类页面的“更多”链接。
`order_by`、`depth`、`show_current`和`show_count`需要hexo-component-inferno 4.2.0及以上版本。


## 文章标签

使用如下挂件配置来开启文章标签挂件：

{% codeblock _config.icarus.yml lang:yaml %}
widgets:
    -
        position: right
        type: tags
        order_by: name      # 可选项。按标签名称(name)或文章数量(length)排序，加上`-`前缀来倒序排列，默认为`name`。
        amount: 20          # 可选项。最多显示的标签数量。留空以显示所有标签。
        show_count: true    # 可选项。是否在标签名称右侧显示文章数量，默认为`true`。
{% endcodeblock %}

设置了`amount`并且标签数量超过它时，列表末尾会加上一个指向标签页面的“更多”链接。


## follow.it

按照如下步骤即可启用[follow.it](https://follow.it)邮件订阅挂件：

1. 首先，使用诸如[hexo-generator-feed](https://github.com/hexojs/hexo-generator-feed)此类的Hexo插件生成
   你的Hexo网站的RSS源。

2. 访问[follow.it](https://follow.it/ni)并在“向你的站点添加关注功能”(Add the follow feature to your site)下方的
   输入框中填写RSS源的文件地址，例如`http://example.com/atom.xml`。
   然后，点击“下一步”(Next)。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/follow-it-enter-feed-url.png 360 '"输入订阅源URL - follow.it" "输入订阅源URL - follow.it"' %}
   <br>

3. 点击“定义关注表单设计”(Define the follow form’s design)页面上的“继续”(Continue)按钮。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/follow-it-create-form.png 360 '"创建表单 - follow.it" "创建表单 - follow.it"' %}
   <br>

4. 搜索`action=`并复制`action=`后双引号中的链接。
   把你复制的action链接粘贴到挂件配置中的`action_url`设置项。
   在那之后，点击“完成”(Done)。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/follow-it-copy-code.png 360 '"复制Action链接 - follow.it" "复制Action链接 - follow.it"' %}
   <br>

   {% codeblock _config.icarus.yml lang:yaml %}
   widgets:
       -
           position: left
           type: followit
           description: 
           action_url: https://api.follow.it/******
           verification_code: ''
   {% endcodeblock %}

5. 点击“继续”(Continue)按钮或者“跳过此步”(Skip this)链接来跳过“选择你想要的关注按钮”(Pick the Follow icons you want)和
   “显示弹窗来最大化交流”(Show a pop-up for maximum conversion)页面。

6. 在“连接你的源到follow.it账户”(Connect your feed to a follow.it account)页面上，在输入框中填入你将要用来注册follow.it账户
   和管理订阅者的邮箱地址。
   然后，点击“开始”(Start)。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/follow-it-connect-account.png 360 '"连接账户 - follow.it" "连接账户 - follow.it"' %}
   <br>

7. 你会收到一封来自follow.it的邮件。
   在那封邮件中搜索`<meta name="follow.it-verification-code" content="******"/>`并复制`content=`后双引号中的`content`的值。
   将你复制的值粘贴到挂件设置中的`verification_code`设置项。
   Icarus会用这个验证码在你的网页的`<head>`中加入验证用的meta标签。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/follow-it-copy-verification-code.png 360 '"复制验证码 - follow.it" "复制验证码 - follow.it"' %}
   <br>

   {% codeblock _config.icarus.yml lang:yaml %}
   widgets:
       -
           position: left
           type: followit
           description: 
           action_url: https://api.follow.it/******
           verification_code: ******
   {% endcodeblock %}

8. 生成你的站点并将其上传到你的服务器。

9. 回到follow.it并用你的邮箱地址注册一个账户。

10. 回到你收到的第一封邮件并点击“点击这里来认领”(Click here to claim it)链接来认领你的订阅源。

    {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/follow-it-verify-claim.png 360 '"验证认领 - follow.it" "验证认领 - follow.it"' %}
    <br>


## Google AdSense

在[Google AdSense](https://www.google.com/adsense)上新建广告。
然后，复制广告HTML代码中的`data-ad-client`和`data-ad-slot`值分别填入到挂件配置的`client_id`和`slot_id`项中。
示例如下：

{% codeblock _config.icarus.yml lang:yaml %}
widgets:
    -
        position: left
        type: adsense
        client_id: ca-pub-xxxxxxxx
        slot_id: xxxxxxx
{% endcodeblock %}


## Google Feedburner

<article class="message message-immersive is-danger">
<div class="message-body">
<i class="fas fa-exclamation-triangle mr-2"></i>Google Feedburner挂件（<code>subscribe_email</code>）自hexo-component-inferno 4.2.0起已弃用，使用它生成网站时会输出警告。
<a href="https://support.google.com/feedburner/answer/10483501" target="_blank">Google已于2021年7月停止了Feedburner的邮件订阅功能。</a>
请换用<a href="#follow-it">follow.it挂件</a>或者其他邮件订阅服务。
</div>
</article>

<article class="message message-immersive is-warning">
<div class="message-body">
<i class="fas fa-question-circle mr-2"></i>文章内容有误？请点击<a href="https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/zh-CN/Widgets.md">此处</a>提交修改。
</div>
</article>
