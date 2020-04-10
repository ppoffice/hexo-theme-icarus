title: Icarus用户指南 - 分享按钮
date: 2017-01-31
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
---

<div class="notification is-success is-size-6">
本文同时提供以下语言的翻译：<a href="{% post_path en/Share-Buttons %}">English</a>。
</div>

本文介绍Icarus 3支持的一些分享按钮的安装配置。

<!-- more -->


<div class="notification is-link is-size-6">

Icarus的分享按钮由[ppoffice/hexo-component-inferno](https://github.com/ppoffice/hexo-component-inferno)
提供，具体提供的按钮种类与配置以其为准。

</div>

<style>
.content ol:not([type]) {
    list-style-type: simp-chinese-informal;
}
</style>


## AddThis

<div class="notification is-warning is-size-6">
此分享按钮可能会被部分广告拦截浏览器扩展拦截，请酌情使用。
</div>

<div>
<strong>安装指南</strong>
<a class="tag is-success" style="margin-left:.8em" href="{% post_path demo/share/AddThis %}">在线预览</a>
</div>

1. 注册[AddThis](https://www.addthis.com/)。在首次注册时的“选择工具”(Select a Tool)页面选择“分享按钮”(Share Buttons)。

2. 在“选择工具类型”(Select a Tool Type)界面选择分享按钮的展示样式，点击“继续”(Continue)。

3. 在下一步的页面中按照需要进一步自定义分享按钮的样式与行为，完成时点击“激活工具”(Activate Tool)按钮。

4. 在获取代码界面找到分享按钮的HTML代码，复制其中的`src`地址并填入相应的主题配置中，例如下面的AddThis代码

    {% codeblock AddThis代码 lang:html %}
    <!-- Go to www.addthis.com/dashboard to customize your tools -->
    <script type="text/javascript" src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-xxxxxxxxxxxxx"></script>
    {% endcodeblock %}

    对应的主题配置为

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    share:
        type: addthis
        install_url: //s7.addthis.com/js/300/addthis_widget.js#pubid=ra-xxxxxxxxxxxxx
    {% endcodeblock %}


## AddToAny

<div>
<strong>安装指南</strong>
<a class="tag is-success" style="margin-left:.8em" href="{% post_path demo/share/AddToAny %}">在线预览</a>
</div>

1. 无需注册步骤，直接修改主题配置来启用AddToAny：

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    share:
        type: addtoany
    {% endcodeblock %}

2. (可选)若你需要对分享按钮进行进一步的个性化配置，请打开[AddToAny](https://www.addtoany.com/)官网，点击“获取分享按钮”
   (Get the Share Button)，然后选择“任意网站”(Any Website)。在页面中完成配置后点击“获取按钮代码”(Get Button Code)。
   例如，下面是获得的默认代码：

    {% codeblock AddToAny代码 lang:html %}
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

    由于本Hexo主题的分享按钮由[ppoffice/hexo-component-inferno](https://github.com/ppoffice/hexo-component-inferno)
    提供，若要对其中的分享按钮代码进行修改，需首先复制其中的文件到主题相应的目录下。例如，这里我们复制
    [src/view/share/addtoany.jsx](https://github.com/ppoffice/hexo-component-inferno/blob/0.2.2/src/view/share/addtoany.jsx)到`themes/icarus/layout/share/`目录下。然后修改其中的`require`路径为正确的路径，并将上面的AddToAny的HTML代码替换
    到文件的相应位置中即可。

    {% codeblock themes/icarus/layout/share/addtoany.jsx lang:diff %}
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

<div class="notification is-warning is-size-6">
此分享按钮可能会被部分广告拦截浏览器扩展拦截，请酌情使用。
</div>

<div class="notification is-warning is-size-6">
百度分享按钮服务似乎已下线，建议使用其他分享按钮服务作为替代。
</div>

<div>
<strong>安装指南</strong>
<a class="tag is-success" style="margin-left:.8em" href="{% post_path demo/share/BaiduShare %}">在线预览</a>
</div>

1. 无需注册步骤，直接修改主题配置来启用百度分享：

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    share:
        type: bdshare
    {% endcodeblock %}


## Share.js

<div class="notification is-warning is-size-6">
Share.js服务已停止维护，建议使用其他分享按钮服务作为替代。
</div>

<div>
<strong>安装指南</strong>
<a class="tag is-success" style="margin-left:.8em" href="{% post_path demo/share/Sharejs %}">在线预览</a>
</div>

1. 无需注册步骤，直接修改主题配置来启用Share.js：

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    share:
        type: sharejs
    {% endcodeblock %}

2. (可选)如果你需要自定义分享按钮，请参照[AddToAny](#AddToAny)中的第二步与[share.js主页](https://github.com/overtrue/share.js)
   的相关信息。


## ShareThis

<div>
<strong>安装指南</strong>
<a class="tag is-success" style="margin-left:.8em" href="{% post_path demo/share/ShareThis %}">在线预览</a>
</div>

1. 打开[ShareThis官网](https://sharethis.com/)，点击页面上的“从分享按钮开始”(Start with Share Buttons)按钮。

2. 在“选择分享按钮类型”(Choose type of sharing button)选择需要的按钮类型，如有需要的话可点击下方的“自定义你的分享按钮”
   (Customize your share buttons)链接进行进一步配置。完成后点击“下一步”(Next)。

3. 在“注册并获取代码”(Register and get the code!)界面点击HTML和“下一步”(Next)按钮。然后输入邮箱和密码完成ShareThis的注册。

4. 最后，复制代码获取界面中的`src`地址并填入相应的主题配置中，例如下面的ShareThis代码

    {% codeblock AddThis代码 lang:html %}
    <script type="text/javascript" src="https://platform-api.sharethis.com/js/sharethis.js#property=xxxxxxxxxxxxx&product=inline-share-buttons" async="async"></script>
    {% endcodeblock %}

    对应的主题配置为

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    share:
        type: sharethis
        install_url: https://platform-api.sharethis.com/js/sharethis.js#property=xxxxxxxxxxxxx&product=inline-share-buttons
    {% endcodeblock %}


<div class="notification is-warning is-size-6">
文章内容有误？请点击<a href="https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/zh-CN/Share-Buttons.md">此处</a>提交修改。
</div>
