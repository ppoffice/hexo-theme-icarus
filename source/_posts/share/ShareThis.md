title: ShareThis Share Plugin
date: 2018-01-01
categories:
- Configuration
- Share Plugins
tags:
- Getting Started
share:
    type: sharethis
    install_url: //platform-api.sharethis.com/js/sharethis.js#property=5ab6f60ace89f00013641890&product=inline-share-buttons
---

[Installation instructions](https://platform.sharethis.com/settings)

{% codeblock lang:yaml _config.yml %}
share:
    type: sharethis
    install_url: //platform-api.sharethis.com/js/sharethis.js#......  # (required)
{% endcodeblock%}