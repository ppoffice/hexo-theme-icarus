title: Gitment Comment Plugin
date: 2017-01-01
categories:
- Configuration
- Comment Plugins
comment:
    type: gitment
    owner: ppoffice
    repo: Public-Gitment-Repo
    client_id: 4828a94319a33c305063
    client_secret: 5ea20158d656eaf0141dbb4eb38dd91737e3ca7d
---

[Installation instructions](https://github.com/imsun/gitment)

{% codeblock lang:yaml _config.yml %}
comment:
    type: gitment
    owner: xxxxxxxx         # (required) GitHub user name
    repo: xxxxxxxx          # (required) GitHub repository name
    client_id: xxxxxxxx     # (required) OAuth application client id
    client_secret: xxxxxxxx # (required) OAuth application client secret
{% endcodeblock%}