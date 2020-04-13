title: Icarus快速上手
date: 2016-01-02
thumbnail: /gallery/thumbnails/chinese-painting.jpg
tags:
- Getting Started
- Icarus用户指南
language: zh-CN
providers:
    cdn: loli
    fontcdn: loli
    iconcdn: loli
---

<div class="notification is-success is-size-6">
本文同时提供以下语言的翻译：<a href="{% post_path en/Getting-Started %}">English</a>。
</div>

作为静态网站生成器Hexo的一款主题，Icarus以简洁、现代和精美为设计理念。在灵活且强大的配置系统的助力下，用户可以自由实现单栏与
多栏的灵活页面布局。同时，Icarus提供了丰富的插件与挂件供用户选择，让网站的个性化配置变得触手可及。此外，得力于全新设计的API，
开发者可以更便捷地对Icarus进行深层定制。

<!-- more -->

Icarus的安装非常简单，您只需从GitHub的仓库中下载Icarus源码并解压到博客的主题目录下的`themes/icarus`目录中。
您也可以使用如下命令将此主题下载到博客中：

{% codeblock "Git Bash命令行" %}
git clone https://github.com/ppoffice/hexo-theme-icarus.git themes/icarus -b <version number> --depth 1
{% endcodeblock %}

您可以省略`-b <version number>`来下载Icarus的最新开发版本。如果你想同时下载Git仓库的完整修改历史，请同时省略`--depth 1`。
另外，您也可以将Icarus作为Git子模块(submodule)安装到您的博客中：

{% codeblock "Git Bash命令行" %}
git submodule add https://github.com/ppoffice/hexo-theme-icarus.git themes/icarus
{% endcodeblock %}

接下来，请将博客根目录下的`_config.yml`中的主题设置改为`icarus`：

{% codeblock _config.yml lang:yaml %}
theme: icarus
{% endcodeblock %}

或使用`hexo`命令修改主题设置:

{% codeblock "命令行" %}
hexo config theme icarus
{% endcodeblock %}


最后，请使用如下命令来启动Hexo本地测试服务器。

{% codeblock "命令行" %}
hexo s
{% endcodeblock %}

您可以继续阅读[Icarus用户指南](/hexo-theme-icarus/tags/Icarus用户指南/)系列文章来了解Icarus的使用与配置。
同时，您可以从Icarus的[`site`分支](https://github.com/ppoffice/hexo-theme-icarus/tree/site)上获取本网站的源码供您参考。

<div class="notification is-warning is-size-6">
文章内容有误？请点击<a href="https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/zh-CN/Getting-Started.md">此处</a>提交修改。
</div>

<a style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-size:12px;line-height:1.2;display:inline-block;border-radius:3px" href="https://www.dpm.org.cn/collection/paint/228354.html" target="_blank" rel="noopener noreferrer"><span style="display:inline-block;padding:2px 3px"><svg xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;position:relative;vertical-align:middle;top:-1px;fill:white" viewBox="0 0 32 32"><title>unsplash-logo</title><path d="M20.8 18.1c0 2.7-2.2 4.8-4.8 4.8s-4.8-2.1-4.8-4.8c0-2.7 2.2-4.8 4.8-4.8 2.7.1 4.8 2.2 4.8 4.8zm11.2-7.4v14.9c0 2.3-1.9 4.3-4.3 4.3h-23.4c-2.4 0-4.3-1.9-4.3-4.3v-15c0-2.3 1.9-4.3 4.3-4.3h3.7l.8-2.3c.4-1.1 1.7-2 2.9-2h8.6c1.2 0 2.5.9 2.9 2l.8 2.4h3.7c2.4 0 4.3 1.9 4.3 4.3zm-8.6 7.5c0-4.1-3.3-7.5-7.5-7.5-4.1 0-7.5 3.4-7.5 7.5s3.3 7.5 7.5 7.5c4.2-.1 7.5-3.4 7.5-7.5z"></path></svg></span><span style="display:inline-block;padding:2px 3px">王希孟 千里江山图卷</span></a>
