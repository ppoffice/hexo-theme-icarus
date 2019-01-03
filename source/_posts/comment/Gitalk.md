title: Gitalk Comment Plugin
date: 2015-01-01
categories:
- Plugins
- Comment
comment:
    type: gitalk
    owner: ppoffice
    repo: Public-Gitment-Repo
    client_id: 4828a94319a33c305063
    client_secret: 5ea20158d656eaf0141dbb4eb38dd91737e3ca7d
    admin:
        - ppoffice
---

[Installation instructions](https://github.com/gitalk/gitalk)

{% codeblock lang:yaml _config.yml %}
comment:
    type: gitalk
    owner: xxxxxxxx         # (required) GitHub user name
    repo: xxxxxxxx          # (required) GitHub repository name
    client_id: xxxxxxxx     # (required) OAuth application client id
    client_secret: xxxxxxxx # (required) OAuth application client secret
    admin: xxxxxxxx         # (required) GitHub repo owner and collaborators who can initialize github issues
                            #            Can either be a string or an array.
                            #            admin:
                            #                - xxxxxx1
                            #                - xxxxxx2
{% endcodeblock%}