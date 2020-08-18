title: Icarus用户指南 - 赞赏按钮
date: 2016-01-01
categories:
- Plugins
- Donation
tags:
- Icarus用户指南
language: zh-CN
toc: true
donates:
    -
        type: afdian
        url: https://afdian.net/
    -
        type: alipay
        qrcode: /gallery/donate/alipay.png
    -
        type: buymeacoffee
        url: https://www.buymeacoffee.com/
    -
        type: paypal
        business: paypal@paypal.com
        currency_code: USD
    -
        type: patreon
        url: https://www.patreon.com/
    -
        type: wechat
        qrcode: /gallery/donate/wechat.jpg
providers:
    cdn: loli
    fontcdn: loli
    iconcdn: loli
---

本文介绍Icarus 3支持的赞赏按钮的安装配置。
若需同时展示多个按钮，只需像如下这样在主题配置的`donates`数组中添加多个按钮配置：

{% codeblock themes/icarus/_config.yml lang:yaml %}
donates:
    -
        type: ... # 按钮1
        ...
    -
        type: ... # 按钮2
        ...
{% endcodeblock %}

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-globe-americas mr-2"></i>本文同时提供以下语言的翻译：<a href="{% post_path en/Donation-Buttons %}">English</a>。
</div>
</article>

<!-- more -->

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-info-circle mr-2"></i>下面的赞赏按钮由<a href="https://github.com/ppoffice/hexo-component-inferno">ppoffice/hexo-component-inferno</a>提供，完整的支持按钮列表和配置详情以其为准。
</div>
</article>

<style>
.content ol:not([type]) {
    list-style-type: simp-chinese-informal;
}
</style>

## 爱发电

**安装指南**

1. 注册[爱发电](https://afdian.net/)并复制个人页面的地址。

2. 将如下配置添加到主题配置中：

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    donates:
        -
            type: afdian
            # 个人赞助页面的地址
            url: /path/to/afdian/personal/page
    {% endcodeblock %}


## 支付宝

**安装指南**

1. 登录支付宝并导出个人支付二维码图片。

2. 将二维码图片保存到你的Hexo网站的附件文件夹下，或将它上传至图床。

3. 向主题配置中添加如下配置：

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    donates:
        -
            type: alipay
            # 支付宝二维码图片地址
            qrcode: /path/to/alipay/qrcode.png
    {% endcodeblock %}


## Buy me a Coffee

**安装指南**

1. 注册[Buy me a Coffee](https://www.buymeacoffee.com/)并复制个人页面的地址。

2. 将如下配置添加到主题配置中：

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    donates:
        -
            type: buymeacoffee
            # 个人赞助页面的地址
            url: /path/to/buymeacoffee/personal/page
    {% endcodeblock %}

## Paypal

**安装指南**

1. 登录Paypal，点击[此处](https://www.paypal.com/donate/buttons/)来创建一个Paypal捐赠按钮。

2. 在“选择按钮样式”(Choose button style)页面选择“国家/地区”(Country/Region)和“语言”(Language)，点击“继续”(Continue)
   进入下一页面。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/paypal-button-style.png 360 '"选择按钮样式 - Paypal" "选择按钮样式 - Paypal"' %}
   <br>

3. 在“添加机构详情”(Add organization details)页面中，选择“使用账号ID”(Use account ID)或“使用Email地址”(Use email address)
   作为唯一账号标识符。
   然后点击“继续”(Continue)进入下一页面。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/paypal-organization-details.png 360 '"添加机构详情 - Paypal" "添加机构详情 - Paypal"' %}
   <br>

4. 在“设置捐赠数额”(Set donation amounts)页面选择“接收的货币种类”(Currency you'll receive donations in)，捐赠数额选择
   “任意数额”(Any amount)。
   此捐赠按钮暂不支持“指定数额”的捐赠选项。
   点击“结束并获取代码”(Finish and Get Code)按钮进入下一页面。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/paypal-donation-amount.png 360 '"设置捐赠数额 - Paypal" "设置捐赠数额 - Paypal"' %}
   <br>

5. 从“按钮HTML代码”(Button HTML)页面中复制`business`和`currency_code`两项的值。
   将它们填写到主题配置的`business`和`currency_code`设置中。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/paypal-get-code.png 360 '"获取代码 - Paypal" "获取代码 - Paypal"' %}
   <br>

   例如，下方的Paypal捐赠按钮代码：

    {% codeblock Paypal按钮HTML代码 lang:html %}
    <form action="https://www.paypal.com/cgi-bin/webscr" ...>
    <input type="hidden" name="cmd" value="_donations" />
    <input type="hidden" name="business" value="XXXXXXXXXXXXX" />
    <input type="hidden" name="currency_code" value="USD" />
    ...
    </form>
    {% endcodeblock %}

    对应的主题配置为:

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    donates:
        -
            type: paypal
            business: XXXXXXXXXXXXX
            currency_code: USD
    {% endcodeblock %}

## Patreon

**安装指南**

1. 注册[Patreon](https://www.patreon.com/)并复制个人页面的URL地址。

2. 将如下配置添加到主题配置中：

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    donate:
        -
            type: patreon
            # 个人赞助页面的地址
            url: /path/to/patreon/personal/page
    {% endcodeblock %}

## 微信

**安装指南**

1. 登录微信并导出个人支付二维码图片。

2. 将二维码图片保存到你的Hexo网站的附件文件夹下，或将它上传至图床。

3. 向主题配置中添加如下配置：

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    donates:
        -
            type: wechat
            # 微信二维码图片地址
            qrcode: /path/to/wechat/qrcode.png
    {% endcodeblock %}


<article class="message message-immersive is-warning">
<div class="message-body">
<i class="fas fa-question-circle mr-2"></i>文章内容有误？请点击<a href="https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/zh-CN/Donation-Buttons.md">此处</a>提交修改。
</div>
</article>
