title: Icarus用户指南 - 用户评论插件
date: 2016-01-01
categories:
- Plugins
- Comment
tags:
- Icarus用户指南
language: zh-CN
toc: true
providers:
    cdn: loli
    fontcdn: loli
    iconcdn: loli
---

本文介绍Icarus 5支持的用户评论插件的安装配置。

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-globe-americas mr-2"></i>本文同时提供以下语言的翻译：<a href="{% post_path en/Comment-Plugins %}">English</a>。
</div>
</article>

<!-- more -->

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-info-circle mr-2"></i>下面的用户评论插件由<a href="https://github.com/ppoffice/hexo-component-inferno">ppoffice/hexo-component-inferno</a>提供，完整的支持插件列表和配置详情以其为准。
</div>
</article>

<style>
.content ol:not([type]) {
    list-style-type: simp-chinese-informal;
}
</style>

## 畅言

**安装指南**

1. 首先，登录[畅言云评](http://changyan.kuaizhan.com)，
   并按照[PC端通用代码接入](http://changyan.kuaizhan.com/static/help/index.html)文档获取评论HTML代码。

2. 复制`appid`与`conf`的值到主题配置的对应配置项中。
   例如，如下的HTML代码：

    {% codeblock "畅言安装代码" lang:html >folded %}
    <!--PC版-->
    <div id="SOHUCS" sid="..."></div>
    <script charset="utf-8" type="text/javascript" src="https://cy-cdn.kuaizhan.com/upload/changyan.js" ></script>
    <script type="text/javascript">
    window.changyan.api.config({
        appid: '????appid????',
        conf: 'prod_xxxxxxxxxxxxxxxxxxxxxxx'
    });
    </script>
    {% endcodeblock %}

    对应到主题配置为：

    {% codeblock _config.icarus.yml lang:yaml %}
    comment:
        type: changyan
        app_id: ????appid????
        conf: prod_xxxxxxxxxxxxxxxxxxxxxxx
    {% endcodeblock %}


## Disqus

<div>
<strong>安装指南</strong><a class="tag is-success ml-2" href="{% post_path hexo-theme-icarus/demo/comment/Disqus %}">在线预览</a>
</div>

1. 首先，登录[Disqus](https://disqus.com/)。
   点击首页的“开始”(GET STARTED)按钮或者访问
   [此处](https://disqus.com/profile/signup/intent/)并点击“我想要将Disqus安装到我的站点”
   (I want to install Disqus on my site)来创建新的站点评论服务。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/disqus-get-started.png 360 '"开始页面 - Disqus" "开始页面 - Disqus"' %}
   <br>

2. 在创建新站点页面中填写“网站名称”(Website Name)以及“网站类型”(Category)，然后点击“创建站点”(Create Site)。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/disqus-create-site.png 360 '"创建站点 - Disqus" "创建站点 - Disqus"' %}
   <br>

3. 如果你愿意的话，选择一个付费订阅。
   你也可以点击左侧的“安装Disqus”(Install Disqus)来跳过此步。

4. 下一步，选择Disqus的安装平台。
   此处选择页面底部的“上面没有列出我使用的平台，使用通用代码安装”
    (I don't see my platform listed, install manually with Universal Code)。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/disqus-select-platform.png 360 '"选择平台 - Disqus" "选择平台 - Disqus"' %}
   <br>

5. 点击页面底部的“配置”(Configure)按钮跳过“通用代码安装指南”(Universal Code install instructions)。

6. 在“配置Disqus”(Configure Disqus)页面中按需填写Disqus个性化配置。
   然后，点击“完成安装”(Complete Setup)和“关闭配置”(Dismiss Setup)按钮来结束配置。

7. 下一步，在评论服务首页的右上角点击“编辑配置”(Edit Settings)按钮。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/disqus-service-homepage.png 360 '"评论服务首页 - Disqus" "评论服务首页 - Disqus"' %}
   <br>

8. 在“为你的站点配置Disqus”(Configure Disqus for Your Site)页面上找到“Shortname”的值，
   复制到主题配置的评论配置项中。
   例如，下面截图中的“Shortname”为`my-hexo-blog-1`：

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/disqus-get-shortname.png 360 '"配置Disqus - Disqus" "配置Disqus - Disqus"' %}
   <br>

   对应的主题配置为：

    {% codeblock _config.icarus.yml lang:yaml %}
    comment:
        type: disqus
        shortname: my-hexo-blog-1
    {% endcodeblock %}

9. （可选）你可以在文章的front-matter中加入`disqusId`来为文章添加Disqus唯一标识。
   这样，你可以在未来更改文章的位置而不会丢失所有评论。

    {% codeblock source/_post/some-post.md lang:markdown %}
    title: 我的第一篇文章
    date: 2015-01-01 00:00:01
    disqusId: some-disqus-id
    ---
    # Hello world
    {% endcodeblock %}


##  DisqusJS

在Disqus服务访问受限的地区可使用DisqusJS作为替代。
关于DisqusJS的配置过程可参考[https://github.com/SukkaW/DisqusJS](https://github.com/SukkaW/DisqusJS)。

<div>
<strong>安装指南</strong><a class="tag is-success ml-2" href="{% post_path hexo-theme-icarus/demo/comment/DisqusJS %}">在线预览</a>
</div>

1. 登录Disqus并访问[此链接](https://disqus.com/api/applications/)。
   点击“注册新应用”(Register new application)或者“注册应用”(registering an application)来创建新的Disqus应用。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/disqusjs-api-applications.png 360 '"应用 - Disqus" "应用 - Disqus"' %}
   <br>

2. 在下一页面中填写”应用名称“(Label)，”介绍“(Description)，以及”网站地址“(Website)。
   然后点击“注册我的应用”(Register my application)。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/disqusjs-register-application.png 360 '"注册应用 - Disqus" "注册应用 - Disqus"' %}
   <br>

3. 应用创建完毕后，进入应用的”设置“(Settings)界面，在”域名“(Domains)输入框中填入你Hexo站点的域名，例如ppoffice.github.io。
   然后点击页面底部的“保存更改”(Save Changes)按钮。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/disqusjs-application-settings.png 360 '"应用设置 - Disqus" "应用设置 - Disqus"' %}
   <br>

4. 点击当前页面中的“详情”(Details)链接切换到当前应用的主页。
   从”OAuth设置“(OAuth Settings)部分中复制”API Key“到相应的主题配置项中。
   
   例如，下面截图中的”API Key“：

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/disqusjs-api-key.png 360 '"应用详情 - Disqus" "应用详情 - Disqus"' %}
   <br>

   对应为下面的主题配置：

    {% codeblock _config.icarus.yml lang:yaml %}
    comment:
        type: disqusjs
        shortname: my-hexo-blog-1
        api_key: xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        api: https://disqus.skk.moe/disqus/     # 可选填
        admin: ppoffice                         # 可选填
        admin_label: Admin                      # 可选填
        nesting: 4                              # 可选填
    {% endcodeblock %}

5. 如要更多了解DisqusJS和它的配置，请访问[SukkaW/DisqusJS文档](https://github.com/SukkaW/DisqusJS)或
   [hexo-component-inferno](https://github.com/ppoffice/hexo-component-inferno/blob/0.2.1/src/schema/comment/disqusjs.json)。


##  Facebook

<article class="message message-immersive is-danger">
<div class="message-body">
<i class="fas fa-exclamation-triangle mr-2"></i>此评论插件可能会被部分广告拦截扩展拦截，请酌情使用。
</div>
</article>

<div>
<strong>安装指南</strong><a class="tag is-success ml-2" href="{% post_path hexo-theme-icarus/demo/comment/Facebook %}">在线预览</a>
</div>

1. 如要开启Facebook评论服务，将`comment`的`type`设置为`facebook`即可。

    {% codeblock _config.icarus.yml lang:yaml %}
    comment:
        type: facebook
    {% endcodeblock %}


## Gitalk

<div>
<strong>安装指南</strong><a class="tag is-success ml-2" href="{% post_path hexo-theme-icarus/demo/comment/Gitalk %}">在线预览</a>
</div>

1. 登录GitHub并[点此注册](https://github.com/settings/applications/new)一个新的OAuth应用。
   填写”应用名称“(Application name)，”应用主页“(Homepage URL)，”应用描述“(Application description)。
   然后，在”认证回调地址“(Authorization callback URL)填写你的博客的根URL地址。
   点击“注册应用”(Register application)按钮来跳转到应用详情界面。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/gitalk-register-application.png 360 '"注册OAuth应用 - GitHub" "注册OAuth应用 - GitHub"' %}
   <br>

2. 复制”Client ID“与”Client Secret“的值并填入主题配置的相应配置项中。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/gitalk-application-settings.png 360 '"OAuth应用设置 - GitHub" "OAuth应用设置 - GitHub"' %}
   <br>

   例如，对于下面的”Client ID“和”Client Secret“：

    {% codeblock GitHub OAuth应用 %}
    Client ID
    xxxxxxxxxxxxxxxxxxxx
    Client Secret
    xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    {% endcodeblock %}

   对应如下的Gitalk的配置：

    {% codeblock _config.icarus.yml lang:yaml %}
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
        language: zh-CN                 # 可选填
    {% endcodeblock %}

3. 关于上述配置的含义和可选值，请参考[Gitalk文档](https://github.com/gitalk/gitalk)或
   [hexo-component-inferno](https://github.com/ppoffice/hexo-component-inferno/blob/0.2.1/src/schema/comment/gitalk.json)。


## Gitment

<article class="message message-immersive is-danger">
<div class="message-body">
<i class="fas fa-exclamation-triangle mr-2"></i>Gitment似乎已停止维护。你可以选择Gitalk或utterances作为基于GitHub Issues的评论系统的替代。
</div>
</article>

**安装指南**

1. 参照Gitalk中的步骤注册GitHub OAuth应用。

2. 复制”Client ID“与”Client Secret“的值到主题配置的相应配置项中。

   下面是Gitment的示例配置：

    {% codeblock _config.icarus.yml lang:yaml %}
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

3. 关于上述配置的含义，请参考[Gitment文档](https://github.com/imsun/gitment)或
   [hexo-component-inferno](https://github.com/ppoffice/hexo-component-inferno/blob/0.2.1/src/schema/comment/gitment.json)。


## Isso

如果你希望自己搭建一个评论系统而不是依赖第三方的评论服务时，Isso是一个可行的选择。
然而，不同于第三方评论系统，你需要准备一个Web服务器用来运行Isso服务端程序。

**安装指南**

1. 请参照[Isso文档](https://posativ.org/isso/docs/install/)安装并启动Isso服务器。

2. 将Isso服务器的HTTP URL填入到主题配置的相应配置项中。
   例如，如果你的Isso服务地址为`https://posativ.org/isso/api/`，你会有如下的评论配置：

    {% codeblock _config.icarus.yml lang:yaml %}
    comment:
        type: isso
        url: posativ.org/isso/api
    {% endcodeblock %}


## LiveRe

<article class="message message-immersive is-danger">
<div class="message-body">
<i class="fas fa-exclamation-triangle mr-2"></i>此评论插件可能会被部分广告拦截扩展拦截，请酌情使用。
</div>
</article>

**安装指南**

1. 首先，登录[LiveRe](https://livere.com/)。
   点击导航栏上的“安装”(Install)链接，进入安装界面。

2. 选择免费”City“选项下方的“现在安装”(Install Now)按钮。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/livere-select-plan.png 360 '"选择付费方案 - LiveRe" "选择付费方案 - LiveRe"' %}
   <br>

3. 在”获取LiveRe City代码“(Get LiveRe City code)页面填写”站点地址“(Site URL)，”网站名称“(Name of website)，
   和”网站类别“(Choose site category)。
   勾选“同意广告协议”(I have check the advertising terms...)并点击”获取代码“(Get code)按钮来跳转到LiveRe HTML代码页面。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/livere-configure-service.png 360 '"配置服务 - LiveRe" "配置服务 - LiveRe"' %}
   <br>

4. 复制`data-uid="..."`引号内的值到主题配置中的相应配置项中。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/livere-get-code.png 360 '"获取代码 - LiveRe" "获取代码 - LiveRe"' %}
   <br>

   例如，下方的LiveRe代码：

   {% codeblock "LiveRe安装代码" lang:html >folded %}
   <!-- LiveRe City install code -->
   <div id="lv-container" data-id="city" data-uid="ABCD1234O0OxxxxXXXX000==">
      <script type="text/javascript">
      (function(d, s) {
         var j, e = d.getElementsByTagName(s)[0];

         if (typeof LivereTower === 'function') { return; }

         j = d.createElement(s);
         j.src = 'https://cdn-city.livere.com/js/embed.dist.js';
         j.async = true;

         e.parentNode.insertBefore(j, e);
      })(document, 'script');
      </script>
   <noscript> Please activate JavaScript for write a comment in LiveRe</noscript>
   </div>
   <!-- completed City install code -->
   {% endcodeblock %}

   对应的主题配置为：

    {% codeblock _config.icarus.yml lang:yaml %}
    comment:
        type: livere
        uid: ABCD1234O0OxxxxXXXX000==
    {% endcodeblock %}


## Twikoo

Twikoo是一个基于云函数的自建评论系统。
不同于其他第三方评论服务，在Icarus中设置和使用Twikoo之前，你需要将它的后端部署到云环境上。

<div>
<strong>安装指南</strong><a class="tag is-success ml-2" href="{% post_path hexo-theme-icarus/demo/comment/Twikoo %}">在线预览</a>
</div>

1. 按照[Twikoo文档](https://twikoo.js.org/)，将Twikoo云函数部署到你指定的云服务商之上。

2. 将你部署的`env_id`填入主题设置中的对应设置项之中。

    {% codeblock _config.icarus.yml lang:yaml %}
    comment:
        type: twikoo
        env_id: xxxxxxxx
        region: ap-guangzhou     # 可选填
        lang: zh-CN              # 可选填
    {% endcodeblock %}


## utterances

<div>
<strong>安装指南</strong><a class="tag is-success ml-2" href="{% post_path hexo-theme-icarus/demo/comment/Utterances %}">在线预览</a>
</div>

1. 准备一个公开的GitHub仓库(Repository)。

2. 访问[GitHub Apps - utterances](https://github.com/apps/utterances)并点击”安装“(Install)。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/utterances-github-app.png 360 '"GitHub应用页 - utterances" "GitHub应用页 - utterances"' %}
   <br>

3. (可选)如果你的账号下有组织账号，在下一页中选择需要安装utterances的用户。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/utterances-select-user.png 360 '"选择用户 - utterances" "选择用户 - utterances"' %}
   <br>

4. 在下一页面选择将utterances安装到”所有仓库“(All repositories)或是”选定的仓库“(Only select repositories)。
   然后点击“安装”(Install)按钮。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/utterances-select-repo.png 360 '"选择仓库 - utterances" "选择仓库 - utterances"' %}
   <br>

5. 若安装成功，网页将跳转到[utterances官网](https://utteranc.es/)。
   你可以阅读每个的配置项的说明，并按照配置你的utterances安装。
   
6. 完成配置后，转到页面上的”开启utterances“(Enable Utterances)并从utterances的HTML代码中复制属性值到主题配置的对应配置项中。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/utterances-get-code.png 360 '"获取代码 - utterances" "获取代码 - utterances"' %}
   <br>
   
   例如下面的utterances代码：

   {% codeblock "utterances安装代码" lang:html >folded %}
   <script src="https://utteranc.es/client.js"
         repo="Your-GitHub-Username/Your-Public-Repo-Name"
         issue-term="pathname"
         theme="github-light"
         crossorigin="anonymous"
         async>
   </script>
   {% endcodeblock %}

   对应下面的主题配置：

    {% codeblock _config.icarus.yml lang:yaml %}
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
<strong>安装指南</strong><a class="tag is-success ml-2" href="{% post_path hexo-theme-icarus/demo/comment/Valine %}">在线预览</a>
</div>

<br>

<article class="message message-immersive is-danger">
<div class="message-body">
<i class="fas fa-exclamation-triangle mr-2"></i>有用户发现一个存在于Valine评论插件的漏洞会导致此评论服务暴露所有评论者的
IP地址 (<a href="https://github.com/xCss/Valine/issues/336" target="_blank" rel="noopener">xCss/Valine#336</a>)。
请在此漏洞修复之前换用其他评论服务。
</div>
</article>

1. 按照[快速开始文档](https://valine.js.org/quickstart.html)创建LeanCloud应用。

2. 将你LeanCloud应用的”App ID“和”App Key“复制到主题配置的对应配置项中。
   此外，你可以参考[配置项](https://valine.js.org/configuration.html)来了解可选配置项的详情和可能的配置值。
   下面是示例配置：

    {% codeblock _config.icarus.yml lang:yaml %}
    comment:
        type: valine
        app_id: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        app_key: xxxxxxxxxxxxxxxxxxxxxx
        placeholder: ""                 # 可选填
        avatar: mm                      # 可选填
        avatar_force: false             # 可选填
        meta: ["nick", "mail", "link"]  # 可选填
        page_size: 10                   # 可选填
        lang: zh-CN                     # 可选填
        visitor: false                  # 可选填
        highlight: true                 # 可选填
        record_ip: false                # 可选填
        server_urls:                    # 可选填
        emoji_cdn:                      # 可选填
        emoji_maps:                     # 可选填
        enable_qq: false                # 可选填
        required_fields: []             # 可选填
    {% endcodeblock %}


## Waline

<div>
<strong>安装指南</strong><a class="tag is-success ml-2" href="{% post_path hexo-theme-icarus/demo/comment/Waline %}">在线预览</a>
</div>

1. 按照[快速上手](https://waline.js.org/guide/get-started.html)创建LeanCloud应用和Vercel项目。

2. 将你Vercel项目的”服务器地址“(Server URL)复制到主题配置的对应配置项中。
   通常它类似于`https://your-domain.vercel.app`。
   此外，你可以参考[前端配置](https://waline.js.org/reference/client.html)来了解可选配置项的详情和可能的配置值。
   下面是示例配置：

    {% codeblock _config.icarus.yml lang:yaml %}
    comment:
        type: waline
        server_url: https://your-domain.vercel.app
        path: window.location.pathname                # 可选填
        lang: zh-CN                                   # 可选填
        locale:                                       # 可选填
            placeholder: 'Comment here...'
        emoji:                                        # 可选填
            - '//unpkg.com/@waline/emojis@1.0.1/weibo'
        dark: auto                                    # 可选填
        meta: ["nick", "mail", "link"]                # 可选填
        required_meta: []                             # 可选填
        login: enable                                 # 可选填
        word_limit: 0                                 # 可选填
        page_size: 10                                 # 可选填
        image_uploader: false                         # 可选填
        highlighter: true                             # 可选填
        tex_renderer: false                           # 可选填
        search: false                                 # 可选填
        pageview: false                               # 可选填
        comment: false                                # 可选填
        copyright: true                               # 可选填
    {% endcodeblock %}


<article class="message message-immersive is-warning">
<div class="message-body">
<i class="fas fa-question-circle mr-2"></i>文章内容有误？请点击<a href="https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/zh-CN/Comment-Plugins.md">此处</a>提交修改。
</div>
</article>
