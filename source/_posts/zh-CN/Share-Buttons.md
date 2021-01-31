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
    install_url: //s7.addthis.com/js/300/addthis_widget.js#pubid=ra-5e8fc96750876c7d
providers:
    cdn: loli
    fontcdn: loli
    iconcdn: loli
---

本文介绍Icarus 3支持的分享按钮的安装配置。

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


## AddThis

<article class="message message-immersive is-danger">
<div class="message-body">
<i class="fas fa-exclamation-triangle mr-2"></i>此分享按钮可能会被部分广告拦截浏览器扩展拦截，请酌情使用。
</div>
</article>

<div>
<strong>安装指南</strong>
<a class="tag is-success" style="margin-left:.8em" href="{% post_path demo/share/AddThis %}">在线预览</a>
</div>

1. 注册[AddThis](https://www.addthis.com/)。
   在提交注册表单后的“选择工具”(Select a Tool)页面选择“分享按钮”(Share Buttons)。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/addthis-select-tool.png 360 '"选择工具 - AddThis" "选择工具 - AddThis"' %}
   <br>

2. 在“选择工具类型”(Select a Tool Type)界面选择样式和按钮，点击“继续”(Continue)。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/addthis-select-tool-type.png 360 '"选择工具类型 Type - AddThis" "选择工具类型 Type - AddThis"' %}
   <br>

3. 在下一页面中进一步自定义分享按钮，完成时点击“激活工具”(Activate Tool)按钮。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/addthis-customize-share.png 360 '"自定义分享按钮 - AddThis" "自定义分享按钮 - AddThis"' %}
   <br>

4. 在”获取代码“(Get The Code)页面找到HTML代码，复制`src`属性值中的URL地址并填入分享按钮配置中。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/addthis-get-code.png 360 '"获取代码 - AddThis" "获取代码 - AddThis"' %}
   <br>

   例如，下面AddThis代码中的URL：

    {% codeblock AddThis代码 lang:html %}
    <!-- Go to www.addthis.com/dashboard to customize your tools -->
    <script type="text/javascript" src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-xxxxxxxxxxxxx"></script>
    {% endcodeblock %}

    对应如下的主题配置：

    {% codeblock _config.icarus.yml lang:yaml %}
    share:
        type: addthis
        install_url: //s7.addthis.com/js/300/addthis_widget.js#pubid=ra-xxxxxxxxxxxxx
    {% endcodeblock %}


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
   提供，你需要将AddToAny的布局文件[src/view/share/addtoany.jsx](https://github.com/ppoffice/hexo-component-inferno/blob/0.2.2/src/view/share/addtoany.jsx)从这个仓库中复制到`<icarus_directory>/layout/share/addtoany.jsx`。
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
    +           刚刚获取的AddToAny HTML代码替换到这里
                <script src="https://static.addtoany.com/menu/page.js" defer={true}></script>
            </Fragment>;
        }
    }

    ...下面省略部分代码...
    {% endcodeblock %}


## 百度分享

<article class="message message-immersive is-danger">
<div class="message-body">
<i class="fas fa-exclamation-triangle mr-2"></i>此分享按钮可能会被部分广告拦截浏览器扩展拦截，请酌情使用。
</div>
</article>

<article class="message message-immersive is-danger">
<div class="message-body">
<i class="fas fa-exclamation-triangle mr-2"></i>百度分享按钮服务似乎已下线，建议使用其他分享按钮服务作为替代。
</div>
</article>

<div>
<strong>安装指南</strong>
<a class="tag is-success" style="margin-left:.8em" href="{% post_path demo/share/BaiduShare %}">在线预览</a>
</div>

1. 你可以启用百度分享按钮而无需注册用户。
   直接将下面的代码添加到你的主题配置中：

    {% codeblock _config.icarus.yml lang:yaml %}
    share:
        type: bdshare
    {% endcodeblock %}


## Share.js

<article class="message message-immersive is-danger">
<div class="message-body">
<i class="fas fa-exclamation-triangle mr-2"></i>Share.js服务已停止维护，建议使用其他分享按钮服务作为替代。
</div>
</article>

<div>
<strong>安装指南</strong>
<a class="tag is-success" style="margin-left:.8em" href="{% post_path demo/share/Sharejs %}">在线预览</a>
</div>

1. 你可以启用Share.js分享按钮而无需用户注册。
   直接将下面代码添加到主题配置中：

    {% codeblock _config.icarus.yml lang:yaml %}
    share:
        type: sharejs
    {% endcodeblock %}

2. (可选)请参照[AddToAny](#AddToAny)部分的个性化步骤与[share.js主页](https://github.com/overtrue/share.js)
   来了解更多关于自定义分享按钮的信息。


## ShareThis

<div>
<strong>安装指南</strong>
<a class="tag is-success" style="margin-left:.8em" href="{% post_path demo/share/ShareThis %}">在线预览</a>
</div>

1. 访问[ShareThis](https://sharethis.com/)并点击页面上的“从分享按钮开始”(Start with Share Buttons)按钮。

2. 在“选择分享按钮类型”(Choose type of sharing button)页面选择你需要的按钮类型。
   不要启用”GDPR规范工具“，否则可能会导致一些问题。
   你也可以点击“自定义你的分享按钮”(Customize your share buttons)链接来进行按钮的进一步配置。
   完成后点击“下一步”(Next)。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/sharethis-choose-button-type.png 360 '"选择按钮类型 - ShareThis" "选择按钮类型 - ShareThis"' %}
   <br>

3. 在”选择你的CMS平台“(Choose your CMS platform)页面选择”HTML“并点击”下一步“(Next)。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/sharethis-choose-platform.png 360 '"选择平台 - ShareThis" "选择平台 - ShareThis"' %}
   <br>

3. 在“注册并获取代码”(Register and get the code!)页面输入邮箱和密码完成ShareThis的注册。

4. 最后，从HTML代码段中复制`src`中的URL地址到分享按钮配置中。
   
   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/sharethis-get-code.png 360 '"获取代码 - ShareThis" "获取代码 - ShareThis"' %}
   <br>

   例如，下面的ShareThis代码：

    {% codeblock AddThis代码 lang:html %}
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
