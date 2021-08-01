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

本文介绍Icarus 4支持的页面挂件的安装配置。
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

- 如果你希望使用[Gravatar](https://en.gravatar.com/)而不是`avatar`配置项作为头像图片，请在`gravatar`项填入
  你的Gravatar邮箱地址并在`avatar`一项中留空；

- `social_links`可以采用如下两种格式：

    **图标形式**：

    {% codeblock social_links lang:yaml %}
    <链接名称>:
        icon: <FontAwesome5_图标的_HTML_class名称>
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
        # 是否显示目录项目的序号
        index: true
{% endcodeblock %}

然后，在需要开启目录的文章头部加入`toc: true`：

{% codeblock Post.md lang:yaml %}
title: 一篇有目录的文章
toc: true
---
文章内容...
{% endcodeblock %}


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


## 最新文章

使用如下挂件配置来开启最新文章挂件：

{% codeblock _config.icarus.yml lang:yaml %}
widgets:
    -
        position: right
        type: recent_posts
{% endcodeblock %}


## 文章归档

使用如下挂件配置来开启文章归档挂件：

{% codeblock _config.icarus.yml lang:yaml %}
widgets:
    -
        position: right
        type: archives
{% endcodeblock %}


## 文章分类

使用如下挂件配置来开启文章分类挂件：

{% codeblock _config.icarus.yml lang:yaml %}
widgets:
    -
        position: right
        type: categories
{% endcodeblock %}


## 文章标签

使用如下挂件配置来开启文章标签挂件：

{% codeblock _config.icarus.yml lang:yaml %}
widgets:
    -
        position: right
        type: tags
{% endcodeblock %}


## Google Feedburner

<article class="message message-immersive is-danger">
<div class="message-body">
<i class="fas fa-exclamation-triangle mr-2"></i><a href="https://support.google.com/feedburner/answer/10483501" target="_blank">Google即将关闭Feedburner的邮件订阅功能。</a> 你可以切换到<a href="#follow-it">follow.it挂件</a>或者其他邮件订阅服务。
</div>
</article>

按照如下步骤即可启用Google Feedburner插件：

1. 首先，使用诸如[hexo-generator-feed](https://github.com/hexojs/hexo-generator-feed)此类的Hexo插件生成
   你的Hexo网站的RSS源。

2. 然后登录[Google Feedburner](https://feedburner.google.com)，在输入框内输入你的RSS地址并点击“下一步”(Next)
   来添加你的RSS源。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/feedburner-homepage.png 360 '"主页 - Feedburner" "主页 - Feedburner"' %}
   <br>

3. 然后，在下一页中填写“源标题”。
   点击“下一步”(Next)来继续自定义你的源，或者点击“直接跳到源管理”(Skip directly to feed management)来完成配置。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/feedburner-add-feed.png 360 '"添加源 - Feedburner" "添加源 - Feedburner"' %}
   <br>

4. 完成添加源后，点击网页顶部的”我的源“(My Feeds)链接。
   点击“我的源”(My Feeds)页面上新添加的源。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/feedburner-feed-list.png 360 '"源列表 - Feedburner" "源列表 - Feedburner"' %}
   <br>

5. 切换到”宣传“(Publicize)标签页并点击页面左侧的”邮件订阅“(Email Subscription)链接。
   点击“激活”(Activate)按钮来开启“邮件订阅”(Email Subscription)功能。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/feedburner-activate-email.png 360 '"激活邮件订阅 - Feedburner" "激活邮件订阅 - Feedburner"' %}
   <br>
   
6. 在”邮件订阅“(Email Subscription)页面上从HTML代码中找到如下信息：

   {% codeblock Google Feedburner URL %}
   https://feedburner.google.com/fb/a/mailverify?uri=******
   {% endcodeblock %}

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/feedburner-get-code.png 360 '"获取代码 - Feedburner" "获取代码 - Feedburner"' %}
   <br>

   复制`uri=`后的ID(如`feedforall/ABCD`)到挂件配置的`feedburner_id`设置中：

    {% codeblock _config.icarus.yml lang:yaml %}
    widgets:
        -
            position: left
            type: subscribe_email
            # (可选) 描述文字
            description: 邮件订阅，更新早知道
            feedburner_id: feedforall/ABCD
    {% endcodeblock %}


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


## follow.it


按照如下步骤即可启用[follow.it](https://follow.it)邮件订阅插件：

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
   ”显示弹窗来最大化交流“(Show a pop-up for maximum conversion)页面。

6. 在”连接你的源到follow.it账户“(Connect your feed to a follow.it account)页面上，在输入框中填入你将要用来注册follow.it账户
   和管理订阅者的邮箱地址。
   然后，点击”开始“(Start)。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/follow-it-connect-account.png 360 '"连接账户 - follow.it" "连接账户 - follow.it"' %}
   <br>

7. 你会收到一封来自follow.it的邮件。
   在那封邮件中搜索`<meta name="follow_it-verification-code" content="******"/>`并复制`content=`后双引号中的`content`的值。
   将你复制的值粘贴到挂件设置中的`verification_code`设置项。

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

10. 回到你收到的第一封邮件并点击”点击这里来认领“(Click here to claim it)链接来认领你的订阅源。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/follow-it-verify-claim.png 360 '"验证认领 - follow.it" "验证认领 - follow.it"' %}
   <br>


<article class="message message-immersive is-warning">
<div class="message-body">
<i class="fas fa-question-circle mr-2"></i>文章内容有误？请点击<a href="https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/zh-CN/Widgets.md">此处</a>提交修改。
</div>
</article>
