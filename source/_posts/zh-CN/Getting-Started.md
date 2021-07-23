title: Icarus快速上手
date: 2016-01-05
tags:
- Getting Started
- Icarus用户指南
language: zh-CN
providers:
    cdn: loli
    fontcdn: loli
    iconcdn: loli
cover: /gallery/covers/chinese-painting.jpg
thumbnail: /gallery/covers/chinese-painting.jpg
---

欢迎使用Icarus！
Icarus是静态网站生成器Hexo的一款简单，精致，而现代的主题。
它力求设计上的优雅，但也不抛弃使用上的简单明了。
它灵活且多功能的配置系统让资深用户也能极尽细节地装饰他们的站点。
Icarus同时也提供了超多插件与挂件来满足你的多元的站点个性化和优化需求。
除此以外，它的崭新实现使得更好的IDE支持和第三方接入成为可能，并提供了更多未来的优化空间。

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-globe-americas mr-2"></i>本文同时提供以下语言的翻译：
<a href="{% post_path en/Getting-Started %}">English</a>.
</div>
</article>

<!-- more -->

在你继续安装Icarus之前，请先花些时间阅览[Hexo文档](https://hexo.io)。
如要安装Icarus，你可以选择如下两种方式中的任意一种：

<div class="tabs is-boxed my-3">
  <ul class="mx-0 my-0">
    <li class="is-active">
      <a href="#install-source">
        <span class="icon is-small"><i class="fas fa-file-code" aria-hidden="true"></i></span>
        <span>从源码安装</span>
      </a>
    </li>
    <li>
      <a href="#install-npm">
        <span class="icon is-small"><i class="fas fa-cubes" aria-hidden="true"></i></span>
        <span>使用NPM安装</span>
      </a>
    </li>
  </ul>
</div>
<div id="install-source" class="tab-content">
  从GitHub的仓库中下载源码的压缩包并解压到你Hexo站点的主题目录中。
  或者，你可以使用Git来克隆Icarus的代码仓库到`themes`目录下：

  {% codeblock "Git Bash/命令行" %}
  git clone https://github.com/ppoffice/hexo-theme-icarus.git themes/icarus -b <version number> --depth 1
  {% endcodeblock %}

  你可以省略`-b <version number>`来获取Icarus的最新开发版本。
  如果你想同时下载Git仓库的完整提交历史，请同时省略`--depth 1`。
  另外，你也可以使用下面的命令将Icarus安装为Git子模块(submodule)：

  {% codeblock "Git Bash/命令行" %}
  git submodule add https://github.com/ppoffice/hexo-theme-icarus.git themes/icarus
  {% endcodeblock %}
</div>

<div id="install-npm" class="tab-content is-hidden">
  若要使用NPM将Icarus安装为Node包，在你的Hexo站点根目录运行如下命令：

  {% codeblock "命令行" %}
  npm install -S hexo-theme-icarus
  {% endcodeblock %}
</div>

<hr>

接下来，在你的站点的`_config.yml`文件中的开启Icarus：

{% codeblock _config.yml lang:yaml %}
theme: icarus
{% endcodeblock %}

或使用`hexo`命令修改主题为Icarus:

{% codeblock "命令行" %}
hexo config theme icarus
{% endcodeblock %}


最后，使用如下命令来启动Hexo本地测试服务器并开始创作。

{% codeblock "命令行" %}
hexo server
{% endcodeblock %}

如需了解更多主题、挂件、和插件相关的信息，请查看
[Icarus用户指南](/hexo-theme-icarus/tags/Icarus用户指南/)。
你也可以参考本站的源代码来获取更多的使用示例。
本站源代码位于GitHub上Icarus代码仓库的[`site`分支](https://github.com/ppoffice/hexo-theme-icarus/tree/site)。
此外，你也可能在[GitHub讨论组](https://github.com/ppoffice/hexo-theme-icarus/discussions)上获得其他Icarus用户的帮助。

**额外资源**

下面是一些帮助你进一步个性化你的站点的其他资源。
你也可以[点击此处](https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/zh-CN/Getting-Started.md)来提交你的Icarus教程。

<div class="menu-list is-size-6">
<a href="https://hexo.io/zh-cn/docs/index.html"><i class="fas fa-bookmark mr-2"></i> Hexo中文文档</a>
<a href="https://removeif.github.io/theme/%E5%8D%9A%E5%AE%A2%E6%BA%90%E7%A0%81%E5%88%86%E4%BA%AB.html"><i class="fas fa-bookmark mr-2"></i> 博客源码分享 by 辣椒の酱</a>
<a href="https://www.imaegoo.com/2020/icarus-3-guide/"><i class="fas fa-bookmark mr-2"></i> hexo-theme-icarus 3 食用经验分享 by iMaeGoo</a>
<a href="https://www.imaegoo.com/2020/icarus-with-bulma/"><i class="fas fa-bookmark mr-2"></i> 活用 Bulma 美化 Icarus 文章 by iMaeGoo</a>
<a href="https://blog.mchook.cn/2021/07/22/icarus%E4%B8%BB%E9%A2%98%E8%87%AA%E5%AE%9A%E4%B9%89/"><i class="fas fa-bookmark mr-2"></i> icarus主题自定义 by kuzen</a>
</div>

<br>

<article class="message message-immersive is-warning">
<div class="message-body">
<i class="fas fa-question-circle mr-2"></i>文章内容有误？点击<a href="https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/zh-CN/Getting-Started.md">此处</a>提交修改。
</div>
</article>

<a style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-size:12px;line-height:1.2;display:inline-block;border-radius:3px" href="https://www.dpm.org.cn/collection/paint/228354.html" target="_blank" rel="noopener noreferrer"><span style="display:inline-block;padding:2px 3px"><svg xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;position:relative;vertical-align:middle;top:-1px;fill:white" viewBox="0 0 32 32"><title>unsplash-logo</title><path d="M20.8 18.1c0 2.7-2.2 4.8-4.8 4.8s-4.8-2.1-4.8-4.8c0-2.7 2.2-4.8 4.8-4.8 2.7.1 4.8 2.2 4.8 4.8zm11.2-7.4v14.9c0 2.3-1.9 4.3-4.3 4.3h-23.4c-2.4 0-4.3-1.9-4.3-4.3v-15c0-2.3 1.9-4.3 4.3-4.3h3.7l.8-2.3c.4-1.1 1.7-2 2.9-2h8.6c1.2 0 2.5.9 2.9 2l.8 2.4h3.7c2.4 0 4.3 1.9 4.3 4.3zm-8.6 7.5c0-4.1-3.3-7.5-7.5-7.5-4.1 0-7.5 3.4-7.5 7.5s3.3 7.5 7.5 7.5c4.2-.1 7.5-3.4 7.5-7.5z"></path></svg></span><span style="display:inline-block;padding:2px 3px">王希孟 千里江山图卷</span></a>
