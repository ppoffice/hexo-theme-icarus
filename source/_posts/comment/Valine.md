title: Valine Comment Plugin
date: 2017-01-01
categories:
- Configuration
- Comment Plugins
comment:
    type: valine
    app_id: QuQK82UpN8gNkXIaKIszbPUY-gzGzoHsz
    app_key: B0D5cYRcXrwNGnBoQdRoDTqw
    notify: false
    verify: false
    placeholder: Valine Comment
---

[Installation instructions](https://valine.js.org/quickstart.html)

{% codeblock lang:yaml _config.yml %}
comment:
    type: valine
    app_id: xxxxxxxx        # (required) LeanCloud application id
    app_key: xxxxxxxx       # (required) LeanCloud application key
    notify: false           # (optional) receive email notification
    verify: false           # (optional) show verification code
    placeholder: xxxxxxxx   # (optional) comment box placeholder text
{% endcodeblock%}