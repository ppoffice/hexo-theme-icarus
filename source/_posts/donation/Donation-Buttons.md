title: Making Money off Your Blog with Donation Buttons
date: 2016-01-30 00:00:01
donates:
    -
        type: alipay
        qrcode: /gallery/donate/alipay.png
    -
        type: wechat
        qrcode: /gallery/donate/wechat.jpg
    -
        type: paypal
        business: paypal@paypal.com
        currency_code: USD
    -
        type: patreon
        url: https://www.patreon.com/
categories:
- Plugins
- Donation
---

To enable donation buttons right below the post content, fill out the `donate` section in the theme's `_config.yml` file. The following donation entries are currently supported by Icarus. You can always use one or more of these donation entries in your blog.

<!-- more -->

### Alipay

```yml
donate:
    -
        type: alipay
        qrcode: # the URL to your qrcode image
```

### Wechat

```yml
donate:
    -
        type: wechat
        qrcode: # the URL to your qrcode image
```

### Paypal

You need to enable the paypal donation button at [Paypal Donate Button](https://www.paypal.com/donate/buttons/). Once you're done, please find the `business` and `currency_code` in the generated code and fill them in the `_config.yml`.

```yml
donate:
    -
        type: paypal
        business: # Your paypal email address or generated business ID
        currency_code: # currency code
```

### Patreon

```yml
donate:
    -
        type: patreon
        url: # the URL to your Patreon page
```