title: Disqus Comment Plugin
date: 2017-01-01
categories:
- Plugins
- Comment
tags:
- Getting Started
comment:
    type: disqus
    shortname: hexo-theme-icarus
---

[Installation instructions](https://disqus.com/admin/install/platforms/universalcode/)

{% codeblock lang:yaml _config.yml %}
comment:
    type: disqus
    shortname: xxxxxxxx     # (required)
{% endcodeblock%}

{% codeblock lang:yaml post.md %}
# (optional) a unique id to identify the post in Disqus system
disqusId: xxxxxxxx
---
Post content...
{% endcodeblock%}