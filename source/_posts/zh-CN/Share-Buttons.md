title: Icarus用户指南 - 分享按钮
date: 2016-01-01
categories:
- Plugins
- Share
tags:
- Icarus用户指南
language: zh-CN
toc: true
share:
    type: sharethis
    install_url: //platform-api.sharethis.com/js/sharethis.js#property=5ab6f60ace89f00013641890&product=inline-share-buttons
providers:
    cdn: loli
    fontcdn: loli
    iconcdn: loli
---

本文介绍Icarus支持的分享按钮的安装配置。

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-globe-americas mr-2"></i>本文同时提供以下语言的翻译：<a href="{% post_path en/Share-Buttons %}">English</a>。
</div>
</article>

<!-- more -->

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-info-circle mr-2"></i>下面的分享按钮由<a href="https://github.com/ppoffice/hexo-component-inferno">ppoffice/hexo-component-inferno</a>提供，完整的支持按钮列表和配置详情以其为准。
</div>
</article>

<style>
.content ol:not([type]) {
    list-style-type: simp-chinese-informal;
}
</style>


## AddToAny

<div>
<strong>安装指南</strong>
<a class="tag is-success" style="margin-left:.8em" href="{% post_path demo/share/AddToAny %}">在线预览</a>
</div>

1. 你可以启用AddToAny而无需注册用户。
   仅需将下面的代码放到你的主题配置中：

    {% codeblock _config.icarus.yml lang:yaml %}
    share:
        type: addtoany
    {% endcodeblock %}

如果你想自定义分享按钮，请采用如下步骤：

1. 访问[AddToAny](https://www.addtoany.com/)官网并点击“获取分享按钮”(Get the Share Button)。

2. 然后，选择“任意网站”(Any Website)并完成按钮的配置。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/addtoany-select-platform.png 360 '"选择平台 - AddToAny" "选择平台 - AddToAny"' %}
   <br>

3. 完成后点击“获取按钮代码”(Get Button Code)。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/addtoany-get-code.png 360 '"获取代码 - AddToAny" "获取代码 - AddToAny"' %}
   <br>

4. 由于分享按钮是由[ppoffice/hexo-component-inferno](https://github.com/ppoffice/hexo-component-inferno)
   提供，你需要从这个仓库的[src/view/share](https://github.com/ppoffice/hexo-component-inferno/tree/HEAD/src/view/share)目录中把AddToAny的布局文件复制到`<icarus_directory>/layout/share/addtoany.jsx`。
   Icarus会优先使用它自己`layout/`目录下的布局文件，而不是hexo-component-inferno中同一路径的文件。
   然后，替换`addtoany.jsx`中AddToAny代码并修正文件头部的包引用。
   
   例如，假设下面的代码是你从上一步获得的代码：

    {% codeblock AddToAny代码 lang:html >folded %}
    <!-- AddToAny BEGIN -->
    <div class="a2a_kit a2a_kit_size_32 a2a_default_style">
    <a class="a2a_dd" href="https://www.addtoany.com/share"></a>
    <a class="a2a_button_facebook"></a>
    <a class="a2a_button_twitter"></a>
    <a class="a2a_button_email"></a>
    </div>
    <script async src="https://static.addtoany.com/menu/page.js"></script>
    <!-- AddToAny END -->
    {% endcodeblock %}

    那么你需要对`addtoany.jsx`做出如下修改：

    {% codeblock &lt;icarus_directory&gt;/layout/share/addtoany.jsx lang:diff >folded %}
    const { Component, Fragment } = require('inferno');
    - const { cacheComponent } = require('../../util/cache');
    + const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');

    ...中间省略部分代码...

    class AddToAny extends Component {
        render() {
            return <Fragment>
    -            <div class="a2a_kit a2a_kit_size_32 a2a_default_style">
    -                <a class="a2a_dd" href="https://www.addtoany.com/share"></a>
    -                <a class="a2a_button_facebook"></a>
    -                <a class="a2a_button_twitter"></a>
    -                <a class="a2a_button_telegram"></a>
    -                <a class="a2a_button_whatsapp"></a>
    -                <a class="a2a_button_reddit"></a>
    -            </div>
    -            <script src="https://static.addtoany.com/menu/page.js" defer={true}></script>
    +            <!-- 刚刚获取的AddToAny HTML代码…… -->
    +            <div class="a2a_kit a2a_kit_size_32 a2a_default_style">
    +                <a class="a2a_dd" href="https://www.addtoany.com/share"></a>
    +                <a class="a2a_button_facebook"></a>
    +                <a class="a2a_button_twitter"></a>
    +                <a class="a2a_button_email"></a>
    +            </div>
    +            <script async src="https://static.addtoany.com/menu/page.js"></script>
            </Fragment>;
        }
    }

    ...下面省略部分代码...
    {% endcodeblock %}


## ShareThis

<div>
<strong>安装指南</strong>
<a class="tag is-success" style="margin-left:.8em" href="{% post_path demo/share/ShareThis %}">在线预览</a>
</div>

1. 访问[ShareThis](https://sharethis.com/)并点击页面上的“从分享按钮开始”(Start with Share Buttons)按钮。

2. 在“选择分享按钮类型”(Choose type of sharing button)页面选择你需要的按钮类型。
   不要启用“GDPR规范工具”(GDPR compliance tool)，否则可能会导致一些问题。
   你也可以点击“自定义你的分享按钮”(Customize your share buttons)链接来进行按钮的进一步配置。
   完成后点击“下一步”(Next)。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/sharethis-choose-button-type.png 360 '"选择按钮类型 - ShareThis" "选择按钮类型 - ShareThis"' %}
   <br>

3. 在“选择你的CMS平台”(Choose your CMS platform)页面选择“HTML”并点击“下一步”(Next)。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/sharethis-choose-platform.png 360 '"选择平台 - ShareThis" "选择平台 - ShareThis"' %}
   <br>

4. 在“注册并获取代码”(Register and get the code!)页面输入邮箱和密码完成ShareThis的注册。

5. 最后，从HTML代码段中复制`src`中的URL地址到分享按钮配置中。
   
   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/sharethis-get-code.png 360 '"获取代码 - ShareThis" "获取代码 - ShareThis"' %}
   <br>

   例如，下面的ShareThis代码：

    {% codeblock ShareThis代码 lang:html %}
    <script type="text/javascript" src="https://platform-api.sharethis.com/js/sharethis.js#property=xxxxxxxxxxxxx&product=inline-share-buttons" async="async"></script>
    {% endcodeblock %}

    对应下面的主题配置：

    {% codeblock _config.icarus.yml lang:yaml %}
    share:
        type: sharethis
        install_url: https://platform-api.sharethis.com/js/sharethis.js#property=xxxxxxxxxxxxx&product=inline-share-buttons
    {% endcodeblock %}


<article class="message message-immersive is-warning">
<div class="message-body">
<i class="fas fa-question-circle mr-2"></i>文章内容有误？请点击<a href="https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/zh-CN/Share-Buttons.md">此处</a>提交修改。
</div>
</article>
