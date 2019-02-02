title: Site Analytics Plugin
date: 2016-01-31
categories:
- Plugins
- General
---

### Google Analytics

[Installation instructions](https://analytics.google.com/analytics/web)

{% codeblock lang:yaml _config.yml %}
plugins:
    google-analytics:
        tracking_id: XXXXXX (required)
{% endcodeblock %}

### Baidu Analytics

[Installation instructions](https://tongji.baidu.com/web/welcome/login)

{% codeblock lang:yaml _config.yml %}
plugins:
    baidu-analytics:
        tracking_id: XXXXXX (required)
{% endcodeblock %}

### Hotjar

[Installation instructions](https://help.hotjar.com/hc/en-us/sections/115002608787-Installation-Guides)

{% codeblock lang:yaml _config.yml %}
plugins:
    hotjar:
        site_id: XXXXXX (required)
{% endcodeblock %}

### Busuanzi

{% codeblock lang:yaml _config.yml %}
plugins:
    busuanzi: true
{% endcodeblock %}
