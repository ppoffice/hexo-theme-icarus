title: 升级指南
date: 2016-01-02
tags:
- Icarus用户指南
language: zh-CN
providers:
    cdn: loli
    fontcdn: loli
    iconcdn: loli
toc: true
---

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-globe-americas mr-2"></i>本文同时提供以下语言的翻译：
<a href="{% post_path en/Upgrade-Guide %}">English</a>.
</div>
</article>

<!-- more -->

### 从4.x升级至5.x

1. 将Node.js升级到12.4.0或者更新的版本。

2. 下载源代码或者从NPM安装Icarus 5.x。
   你可以在{% post_link zh-CN/Getting-Started %}中找到安装指导。
   如果你打算通过修改源代码的方式自定义主题，你必须从源代码安装主题。

3. 运行`hexo clean`来清理缓存并让Icarus为你升级主题配置文件。

4. 阅读[更新说明](https://github.com/ppoffice/hexo-theme-icarus/releases)和[最新文档](https://ppoffice.github.io/hexo-theme-icarus/categories/)来了解更多新功能的信息。

### 从3.x升级至4.x

1. 将Node.js升级到10.13.0或者更新的版本。

2. 下载源代码或者从NPM安装Icarus 4.x。
   你可以在{% post_link zh-CN/Getting-Started %}中找到安装指导。
   如果你打算通过修改源代码的方式自定义主题，你必须从源代码安装主题。

3. 运行`hexo clean`来清理缓存。
   按照Icarus的提示安装缺失的依赖软件包：

   {% codeblock "命令行" lang:shell %}
   $ hexo clean
   ...
   ERROR Please install the missing dependencies your Hexo site root directory:
   ERROR npm install --save hexo@^5.0.2 hexo-component-inferno@^0.8.2 hexo-log@^2.0.0 hexo-util@^2.2.0
   ERROR or:
   ERROR yarn add hexo@^5.0.2 hexo-component-inferno@^0.8.2 hexo-log@^2.0.0 hexo-util@^2.2.0
   {% endcodeblock %}

4. 再次运行`hexo clean`来让Icarus为你升级主题配置文件。
   Icarus会备份并删除`themes/icarus/_config.yml`文件，然后创建`_config.icarus.yml`作为新的主题配置文件。
   你可以参考`_config.icarus.yml.example`来了解示例配置.

   {% codeblock "命令行" lang:shell %}
   $ hexo clean
   ...
   WARN  Your theme configuration is outdated (3.0.0 < 4.0.0).
   INFO  To skip the configuration upgrade, use "--icarus-dont-upgrade-config".
   INFO  Backing up theme configuration files...
   INFO  themes/icarus/_config.yml => themes/icarus/_config.yml.dc00f8b8f8bc03ede351d711e958dc4b
   INFO  Upgrading theme configurations...
   INFO  Theme configurations are written to /tmp/_config.icarus.yml.
   INFO  Example configurations is at /tmp/_config.icarus.yml.example.
   {% endcodeblock %}

5. Icarus现在将文章的缩略图和封面图区别对待。
   对于有缩略图的所有文章/页面，将其front-matter中的`thumbnail:`更改为`cover:`。

   {% codeblock "post.md" lang:diff %}
     title: Icarus快速上手
     date: 2020-04-01
   - thumbnail: /gallery/covers/vector_landscape_1.svg
   + cover: /gallery/covers/vector_landscape_1.svg
   ---
   {% endcodeblock %}

   你仍可以在front-matter中设置`thumbnail`来在文章归档页面以及最新文章挂件中显示小一点的缩略图。

6. 阅读[更新说明](https://github.com/ppoffice/hexo-theme-icarus/releases)和[最新文档](https://ppoffice.github.io/hexo-theme-icarus/categories/)来了解更多新功能的信息.
