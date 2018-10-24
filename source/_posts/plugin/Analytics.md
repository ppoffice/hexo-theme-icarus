title: Site Analytics Plugin
date: 2018-01-01
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
