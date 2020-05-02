title: Icarus User Guide - Donation Buttons
date: 2017-01-31
categories:
- Plugins
- Donation
tags:
- Icarus User Guide
language: en
toc: true
donates:
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
---

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-globe-asia mr-2"></i>
This article is also available in <a href="{% post_path zh-CN/Donation-Buttons %}">简体中文</a>.
</div>
</article>

This article covers donation button configurations supported by Icarus 3.
If you need to display multiple donation buttons at once, add individual button configuration
to the `donates` array like the following:

{% codeblock themes/icarus/_config.yml lang:yaml %}
donates:
    -
        type: ... # Button 1
        ...
    -
        type: ... # Button 2
        ...
{% endcodeblock %}

<!-- more -->

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-info-circle mr-2"></i>
The following donation buttons are provided by
<a href="https://github.com/ppoffice/hexo-component-inferno">ppoffice/hexo-component-inferno</a>.
Please refer to it for a complete list of supported buttons and their configuration details.
</div>
</article>

## Alipay

**Installation Guide**

1. Log into Alipay and export payment QR code.
2. Save the QR code picture to the asset directory of your Hexo website, or upload it to an image sharing service.
3. Add the following configuration to your theme configurations:

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    donates:
        -
            type: alipay
            # Path to your QR code image
            qrcode: /path/to/alipay/qrcode.png
    {% endcodeblock %}


## Buy me a Coffee

**Installation Guide**

1. Register for [Buy me a Coffee](https://www.buymeacoffee.com/) and copy the URL to your personal page.
2. Add the following configuration to your theme configurations:

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    donates:
        -
            type: buymeacoffee
            # Path to your Buy me a Coffee personal page
            url: /path/to/buymeacoffee/personal/page
    {% endcodeblock %}

## Paypal

**Installation Guide**

1. Log into Paypal, click [here](https://www.paypal.com/donate/buttons/) to create a Paypal donation button.

2. Select "Country/Region" and "Language" in the "Choose button style" page and click "Continue" to
   advance to the next page.

3. Select "Use account ID" or "Use email address" as the unique identifier of your account in the "Add organization
   details" page.
   Then, click "Continue" to go to the next page.

4. Choose the "Currency you'll receive donations in" and set "Amount donors can give" to "Any amount" in the 
   "Set donation amounts" page.
   We currently do not support the option of donating in "An exact amount".
   Click "Finish and Get Code" to go to the next page.

5. Copy `business` and `currency_code` from the "Button HTML" on the page.
   Put them to the `business` and `currency_code` settings in your theme configurations.
   For example, the following Paypal donation button code

    {% codeblock Paypal HTML code lang:html %}
    <form action="https://www.paypal.com/cgi-bin/webscr" ...>
    <input type="hidden" name="cmd" value="_donations" />
    <input type="hidden" name="business" value="XXXXXXXXXXXXX" />
    <input type="hidden" name="currency_code" value="USD" />
    ...
    </form>
    {% endcodeblock %}

    maps to the following configuration:

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    donates:
        -
            type: paypal
            business: XXXXXXXXXXXXX
            currency_code: USD
    {% endcodeblock %}

## Patreon

**Installation Guide**

1. Register for [Patreon](https://www.patreon.com/) and copy the URL to your personal page.
2. Add the following configuration to your theme configurations:

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    donate:
        -
            type: patreon
            # Path to your Patreon personal page
            url: /path/to/patreon/personal/page
    {% endcodeblock %}

## WeChat

**Installation Guide**

1. Log into WeChat and export payment QR code.
2. Save the QR code picture to the asset directory of your Hexo website, or upload it to an image sharing service.
3. Add the following configuration to your theme configurations:

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    donates:
        -
            type: wechat
            # Path to your QR code image
            qrcode: /path/to/wechat/qrcode.png
    {% endcodeblock %}


<article class="message message-immersive is-warning">
<div class="message-body">
<i class="fas fa-question-circle mr-2"></i>
Something wrong with this article? Click <a href="https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/en/Donation-Button.md">here</a> to submit your revision.
</div>
</article>
