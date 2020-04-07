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

<div class="notification is-success is-size-6">
This article is also available in: <a href="{% post_path zh-CN/Donation-Buttons %}">简体中文</a>.
</div>

This article covers some donation buttons supported by Icarus 3.
If you need to display multiple donation buttons at once, simply add individual button configurations
to the `donates` array like this

{% codeblock themes/icarus/_config.yml lang:yaml %}
donates:
    -
        type: ... # Button 1
        ...
    -
        type: ... # Button 2
        ...
{% endcodeblock %}


<div class="notification is-info is-size-6">

The donation button feature of Icarus is provided by
[ppoffice/hexo-component-inferno](https://github.com/ppoffice/hexo-component-inferno).
Please refer to it for a complete list of supported buttons and their configurations.

</div>

<!-- more -->

## Alipay

Log into Alipay and export payment QR code. Save the picture to a photo or asset directory
of your Hexo website or upload it to an image sharing service.
Then, add the following configuration to your theme's configuration file:

{% codeblock themes/icarus/_config.yml lang:yaml %}
donates:
    -
        type: alipay
        # Path to your QR code image
        qrcode: /path/to/alipay/qrcode.png
{% endcodeblock %}


## Buy me a Coffee

Register for [Buy me a Coffee](https://www.buymeacoffee.com/) and copy the URL to your personal page.
Add the following configuration to your theme's configuration file:

{% codeblock themes/icarus/_config.yml lang:yaml %}
donates:
    -
        type: buymeacoffee
        # Path to your Buy me a Coffee personal page
        url: /path/to/buymeacoffee/personal/page
{% endcodeblock %}

## Paypal

1. Register and log into Paypal, click [here](https://www.paypal.com/donate/buttons/) to make a Paypal donation
   button.

2. Select correct "Country/Region" and "Language" in the "Choose button style" page, click "Continue" to
   advance to the next page.

3. Select "Use account ID" or "Use email addres" as the unique identifier of your account in the "Add organization
   details" page. Click "Continue" to go to the next page.

4. Set the correct "Currency you'll receive donations in" and "Amount donors can give" to "Any amount" in the 
   "Set donation amounts" page. We currently do not support the option of donating in "An exact amount".
   Click "Finish and Get Code" to go to the next page.

5. Copy `business` and `currency_code` from the "Button HTML" on the page. Put them to the theme's configuration.
   For example, the following Paypal donation button code

    {% codeblock Paypal HTML code lang:html %}
    <form action="https://www.paypal.com/cgi-bin/webscr" ...>
    <input type="hidden" name="cmd" value="_donations" />
    <input type="hidden" name="business" value="XXXXXXXXXXXXX" />
    <input type="hidden" name="currency_code" value="USD" />
    ...
    </form>
    {% endcodeblock %}

    is translated into this configuration

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    donates:
        -
            type: paypal
            business: XXXXXXXXXXXXX
            currency_code: USD
    {% endcodeblock %}

## Patreon

Register for [Patreon](https://www.patreon.com/) and copy the URL to your personal page.
Add the following configuration to your theme's configuration file:

{% codeblock themes/icarus/_config.yml lang:yaml %}
donate:
    -
        type: patreon
        # Path to your Patreon personal page
        url: /path/to/patreon/personal/page
{% endcodeblock %}

## WeChat

Log into WeChat and export payment QR code. Save the picture to a photo or asset directory
of your Hexo website or upload it to an image sharing service.
Then, add the following configuration to your theme's configuration file:

{% codeblock themes/icarus/_config.yml lang:yaml %}
donates:
    -
        type: wechat
        # Path to your QR code image
        qrcode: /path/to/wechat/qrcode.png
{% endcodeblock %}


<div class="notification is-warning is-size-6">
Something wrong with this article? Click <a href="https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/en/Donation-Buttons.md">here</a> to submit your revision.
</div>
