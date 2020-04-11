title: Icarus用户指南 - 用户评论插件
date: 2017-01-31
categories:
- Plugins
- Comment
tags:
- Icarus用户指南
language: zh-CN
toc: true
---

<div class="notification is-success is-size-6">
本文同时提供以下语言的翻译：<a href="{% post_path en/Comment-Plugins %}">English</a>。
</div>

本文介绍Icarus 3支持的一些用户评论插件的安装配置。

<!-- more -->

<div class="notification is-link is-size-6">

Icarus的用户评论插件由[ppoffice/hexo-component-inferno](https://github.com/ppoffice/hexo-component-inferno)
提供，具体提供的插件种类与配置以其为准。

</div>

<style>
.content ol:not([type]) {
    list-style-type: simp-chinese-informal;
}
</style>

## 畅言

**安装指南**

1. 首先，注册并登录[畅言云评](http://changyan.kuaizhan.com)，
并按照[PC端通用代码接入](http://changyan.kuaizhan.com/static/help/index.html)的帮助文档获取代码。

2. 从获取的PC端代码中复制`appid`与`conf`值到Icarus主题配置文件的评论配置项中。
   例如，获取到的如下的PC端代码：

    ```html
    <!--PC版-->
    <div id="SOHUCS" sid="..."></div>
    <script charset="utf-8" type="text/javascript" src="https://cy-cdn.kuaizhan.com/upload/changyan.js" ></script>
    <script type="text/javascript">
    window.changyan.api.config({
        appid: '????appid????',
        conf: 'prod_xxxxxxxxxxxxxxxxxxxxxxx'
    });
    </script>
    ```
    对应到主题配置文件中的配置项为：

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    comment:
        type: changyan
        app_id: ????appid????
        conf: prod_xxxxxxxxxxxxxxxxxxxxxxx
    {% endcodeblock %}
    
3. 另外，畅言云评要求站长对使用其评论服务的网站进行备案，详情请参阅
   [ICP备案](http://changyan.kuaizhan.com/static/help/o-beian.html)文档。


## Disqus

<div>
<strong>安装指南</strong>
<a class="tag is-success" style="margin-left:.8em" href="{% post_path demo/comment/Disqus %}">在线预览</a>
</div>

1. 首先，注册并登录[Disqus](https://disqus.com/)，点击首页的“开始”(GET STARTED)按钮或者访问
   [此处](https://disqus.com/profile/signup/intent/)并点击“我想要将Disqus安装到我的站点”
   (I want to install Disqus on my site)来创建新的站点评论服务。

2. 在创建新站点页面中填写网站名称(Website Name)以及网站类型(Category)，然后点击“创建站点”(Create Site)。

3. 下一步，选择Disqus的安装平台。此处选择最下方的“上面没有列出我使用的平台，使用通用代码安装”
    (I don't see my platform listed, install manually with Universal Code)。

4. 点击最下方的“配置”(Configure)按钮跳过通用代码安装指南(Universal Code install instructions)页面。
   在“配置Disqus”(Configure Disqus)页面中按需填写Disqus个性化配置。点击“完成安装”(Complete Setup)
   和“关闭配置”(Dismiss Setup)来结束配置。

5. 最后，在评论站点首页的右上角点击“编辑配置”(Edit Settings)，进入到站点配置页面。
   在页面上找到Shortname配置值并复制到主题配置文件相应的评论配置项中(`comment`下的`shortname`)。
   例如，下图中的Shortname为`test-usildmkxo`

   ![General Settings - Disqus Admin](/hexo-theme-icarus/gallery/screenshots/disqus-general-settings.png)

   复制到配置文件中为

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    comment:
        type: disqus
        shortname: test-usildmkxo
    {% endcodeblock %}

6. （可选）你可以在文章的头部加入`disqusId`来为文章添加Disqus唯一标识。这样如果文章之后被移动或者链接更改，其
   评论也不会随之丢失。

    {% codeblock source/_post/some-post.md lang:markdown %}
    title: My first post
    date: 2015-01-01 00:00:01
    disqusId: some-disqus-id
    ---
    # Hello world
    {% endcodeblock %}


##  DisqusJS

DisqusJS适用于原版Disqus服务访问受限的地区使用。关于DisqusJS的配置过程可参考
[https://github.com/SukkaW/DisqusJS](https://github.com/SukkaW/DisqusJS)。

<div>
<strong>安装指南</strong>
<a class="tag is-success" style="margin-left:.8em" href="{% post_path demo/comment/DisqusJS %}">在线预览</a>
</div>

1. 登录Disqus并打开[此链接](https://disqus.com/api/applications/)，点击“注册新应用”(Register new 
   application)或者“注册应用”(registering an application)。

2. 在打开的页面中填写应用名称(Label)，介绍(Description)，以及网站地址(Website)，然后点击“注册我的应用”
   (Register my application)。

3. 应用创建完毕后进入设置界面(Settings)，在域名(Domains)输入框中填入你的网站域名，例如ppoffice.github.io。
   点击页面下方的“保存设置”(Save Changes)按钮。

4. 点击页面中上放的“详情”(Details)链接切换到当前应用的主页，从下方OAuth设置(OAuth Settings)中复制API Key
   到相应的主题配置项(`comment`下的`api_key`)中。下面是示例配置：

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    comment:
        type: disqusjs
        shortname: test-usildmkxo
        api_key: xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        api: https://disqus.skk.moe/disqus/     # 可选填
        admin: ppoffice                         # 可选填
        admin_label: Admin                      # 可选填
        nesting: 4                              # 可选填
    {% endcodeblock %}

3. 关于上述配置的含义和可选值，请参考[SukkaW/DisqusJS官方文档](https://github.com/SukkaW/DisqusJS)或
   hexo-component-inferno中的[配置项描述](https://github.com/ppoffice/hexo-component-inferno/blob/0.2.1/src/schema/comment/disqusjs.json)。


##  Facebook

<div class="notification is-warning is-size-6">
此评论插件可能会被部分广告拦截浏览器扩展拦截，请酌情使用。
</div>

<div>
<strong>安装指南</strong>
<a class="tag is-success" style="margin-left:.8em" href="{% post_path demo/comment/Facebook %}">在线预览</a>
</div>

1. Facebook的评论服务配置较为简单，仅需在主题配置中将`comment`的`type`设置为`facebook`即可。

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    comment:
        type: facebook
    {% endcodeblock %}


## Gitalk

<div>
<strong>安装指南</strong>
<a class="tag is-success" style="margin-left:.8em" href="{% post_path demo/comment/Gitalk %}">在线预览</a>
</div>

1. 登录GitHub并[点此注册](https://github.com/settings/applications/new)一个新的OAuth应用。在填写相应的应用名称
   (Application name)，应用主页(Homepage URL)，应用描述(Application description)后，在认证回调地址(Authorization 
   callback URL)填写你的博客的根URL地址。

2. 点击“注册应用”(Register application)后，在应用详情界面复制Client ID与Client Secret并填入主题配置的相应配置项中。
   例如，对于下面的Client ID和Client Secret

    {% codeblock GitHub OAuth Application %}
    Client ID
    xxxxxxxxxxxxxxxxxxxx
    Client Secret
    xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    {% endcodeblock %}

   Gitalk在Icarus的配置为

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    comment:
        type: gitalk
        client_id: xxxxxxxxxxxxxxxxxxxx
        client_secret: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        repo: Some-of-Your-GitHub-Repo
        owner: you_github_name
        admin:
            - you_github_name
        per_page: 20                    # 可选填
        distraction_free_mode: false    # 可选填
        pager_direction: last           # 可选填
        create_issue_manually: false    # 可选填
        proxy:                          # 可选填
        flip_move_options:              # 可选填
        enable_hotkey: true             # 可选填
    {% endcodeblock %}

3. 关于上述配置的含义和可选值，请参考[Gitalk官方文档](https://github.com/gitalk/gitalk)或hexo-component-inferno
   中的[配置项描述](https://github.com/ppoffice/hexo-component-inferno/blob/0.2.1/src/schema/comment/gitalk.json)。


## Gitment

<div class="notification is-warning is-size-6">
Gitment项目似乎已停止维护，建议使用Gitalk或utterances作为基于GitHub Issues的评论系统的替代。
</div>

**安装指南**

1. 参照上面Gitalk中关于注册GitHub OAuth应用的步骤注册应用，并将Client ID与Client Secret并填入主题配置的相应配置项中。
   下面是Gitment的示例配置：

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    comment:
        type: gitment
        owner: you_github_name
        repo: Some-of-Your-GitHub-Repo
        client_id: xxxxxxxxxxxxxxxxxxxx
        client_secret: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        theme: gitment.defaultTheme     # 可选填
        per_page: 20                    # 可选填
        max_comment_height: 250         # 可选填
    {% endcodeblock %}

3. 关于上述配置的含义和可选值，请参考[Gitment官方文档](https://github.com/imsun/gitment)或hexo-component-inferno
   中的[配置项描述](https://github.com/ppoffice/hexo-component-inferno/blob/0.2.1/src/schema/comment/gitment.json)。


## Isso

如果你不希望以来第三方评论服务而自建评论系统的话，可考虑选用Isso。
当然，不同于第三方评论系统，你需要准备一个服务器用来运行Isso服务端程序。

**安装指南**

1. 请参照[Isso官方文档](https://posativ.org/isso/docs/install/)安装并启动Isso服务。

2. 编辑主题配置文件并填入Isso服务的HTTP URL。例如，你的Isso服务地址为https://posativ.org/isso/api/，
   则需在主题评论配置填写为：

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    comment:
        type: isso
        url: posativ.org/isso/api
    {% endcodeblock %}


## LiveRe

<div class="notification is-warning is-size-6">
此评论插件可能会被部分广告拦截浏览器扩展拦截，请酌情使用。
</div>

<div>
<strong>安装指南</strong>
<a class="tag is-success" style="margin-left:.8em" href="{% post_path demo/comment/LiveRe %}">在线预览</a>
</div>

1. 首先，注册并登录[LiveRe](https://livere.com/)。登录后，点击导航栏上的“安装”(Install)链接，进入安装界面。

2. 在安装界面选择免费(City)选项下方的“现在安装”(Install Now)按钮。在获取LiveRe City代码(Get LiveRe City code)界面
   填入站点地址(Site URL)，网站名称(Name of website)，和网站类别(Choose site category)，勾选“同意广告协议后”并点击
   获取代码后，跳转到LiveRe代码页面。

3. 复制代码中`data-uid="..."`引号内的编号，填写到主题配置中的相应选项中。例如，下方的LiveRe代码

   ![LiveRe - Install](/hexo-theme-icarus/gallery/screenshots/livere-code.png)

   对应的主题配置为

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    comment:
        type: livere
        uid: ABCD1234O0OxxxxXXXX000==
    {% endcodeblock %}


## Utterances

<div>
<strong>安装指南</strong>
<a class="tag is-success" style="margin-left:.8em" href="{% post_path demo/comment/Utterances %}">在线预览</a>
</div>

1. 准备一个公开的GitHub仓库(Repository)。

2. 访问[GitHub Apps - utterances](https://github.com/apps/utterances)页面来将utterances安装至准备好的仓库。
   点击“配置”(Configure)按钮，在下一页面中选择需要安装utterances的用户。在安装页面，你可以选择将其安装到所有仓库(All repositories)
   或是选定的一些仓库(Only select repositories)。点击“安装”(Install)。

3. 若安装成功，网页跳转到[utterances官网](https://utteranc.es/)。之后可以阅读页面上的配置项的说明，并按照说明将对应配置值填入到
   主题配置中。下方为示例配置：

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    comment:
        type: utterances
        repo: Your-GitHub-Username/Your-Public-Repo-Name
        issue_term: pathname        # 必填项，与issue_number二选一填写
        issue_number: 100           # 必填项，与issue_term二选一填写，每篇文章对应一个issue，填写前需要手动创建issue
        label: some-issue-label     # 可选填
        theme: github-light         # 可选填
    {% endcodeblock %}


## Valine

<div>
<strong>安装指南</strong>
<a class="tag is-success" style="margin-left:.8em" href="{% post_path demo/comment/Valine %}">在线预览</a>
</div>

1. 按照Valine官方的[快速开始文档](https://valine.js.org/quickstart.html)创建LeanCloud应用。

2. 将App ID和App Key复制并填入主题配置的对应配置项中，并按照官方网站上的[配置项](https://valine.js.org/configuration.html)
   说明按需填写其他配置项。下面是示例配置：

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    comment:
        type: valine
        app_id: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        app_key: xxxxxxxxxxxxxxxxxxxxxx
        placeholder: ""                 # 可选填
        notify: false                   # 可选填
        verify: false                   # 可选填
        avatar:                         # 可选填
        avatar_force: false             # 可选填
        meta: ["nick", "mail", "link"]  # 可选填
        page_size: 10                   # 可选填
        visitor: false                  # 可选填
        highlight: true                 # 可选填
        record_ip: false                # 可选填
    {% endcodeblock %}


<div class="notification is-warning is-size-6">
文章内容有误？请点击<a href="https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/zh-CN/Comment-Plugins.md">此处</a>提交修改。
</div>
