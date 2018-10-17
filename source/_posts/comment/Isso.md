title: Isso Comment Plugin
date: 2017-01-01
categories:
- Configuration
- Comment Plugins
---

[Installation instructions](https://posativ.org/isso/docs/quickstart/#integration)

{% codeblock lang:yaml _config.yml %}
comment:
    type: isso
    url: isso.service/path  # (required) url of your Isso service
{% endcodeblock%}