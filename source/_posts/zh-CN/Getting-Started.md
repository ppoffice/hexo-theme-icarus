title: Icarus快速上手
date: 2025-02-24
tags:
- Getting Started
- Icarus用户指南
language: zh-CN
providers:
    cdn: loli
    fontcdn: loli
    iconcdn: loli
cover: /gallery/covers/getting-started-zh.webp
thumbnail: /gallery/covers/getting-started-zh.webp
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
Icarus 6.6需要Hexo 7.1.1或更新的版本（Hexo 7或Hexo 8），以及Node.js 14或更新的版本。
注意Hexo 8本身需要Node.js 20.19或更新的版本。
如要安装Icarus，你可以选择如下两种方式中的任意一种：

{% tabs align:left style:boxed %}
<!-- tab id:install-source 'icon:fas fa-file-code' title:从源码安装 -->
从GitHub的仓库中下载源码的压缩包并解压到你Hexo站点的`themes/icarus`目录中。
目录名必须是`icarus`，与下文在站点配置中设置的主题名一致。
或者，你可以使用Git来克隆Icarus的代码仓库到`themes`目录下：

{% codeblock "Git Bash/命令行" %}
git clone https://github.com/ppoffice/hexo-theme-icarus.git themes/icarus -b <version number> --depth 1
{% endcodeblock %}

请将`<version number>`替换为你需要的版本，例如`-b 6.6.0`。
Icarus的版本标签没有`v`前缀。
你可以省略`-b <version number>`来获取Icarus的最新开发版本。
如果你想同时下载Git仓库的完整提交历史，请同时省略`--depth 1`。
另外，你也可以使用下面的命令将Icarus安装为Git子模块(submodule)：

{% codeblock "Git Bash/命令行" %}
git submodule add https://github.com/ppoffice/hexo-theme-icarus.git themes/icarus
{% endcodeblock %}

从源码安装时，Icarus使用的是你站点中的Node.js依赖包，所以你还需要在站点根目录中安装它的依赖，其中包括`hexo-renderer-inferno`渲染器。
你不需要自己逐个查找这些依赖：每次运行`hexo`命令时（见下面的步骤），Icarus都会检查依赖，列出缺失的包，并打印出安装它们的命令，例如：

{% codeblock "命令行" %}
$ hexo clean
INFO  === Checking package dependencies ===
ERROR Package bulma-stylus is not installed.
ERROR Package hexo-component-inferno is not installed.
ERROR Package hexo-renderer-inferno is not installed.
...
ERROR Please install the missing dependencies in your Hexo site root directory:
ERROR npm install --save bulma-stylus@0.8.0 hexo-component-inferno@^4.1.0 hexo-renderer-inferno@^1.0.2 ...
ERROR or:
ERROR yarn add bulma-stylus@0.8.0 hexo-component-inferno@^4.1.0 hexo-renderer-inferno@^1.0.2 ...
{% endcodeblock %}

请在站点根目录（而不是`themes/icarus`目录）中运行打印出来的`npm install`（或`yarn add`）命令。
Hexo只会加载站点`package.json`中列出的渲染器，例如`hexo-renderer-inferno`。
<!-- endtab -->

<!-- tab active id:install-npm 'icon:fas fa-cubes' title:使用NPM安装 -->
若要使用NPM将Icarus安装为Node包，在你的Hexo站点根目录运行如下命令：

{% codeblock "命令行" %}
npm install -S hexo-theme-icarus hexo-renderer-inferno
{% endcodeblock %}

Icarus的其他依赖会随它一起安装。
之所以要单独安装`hexo-renderer-inferno`，是因为Hexo只会加载站点`package.json`中列出的渲染器。
<!-- endtab -->
{% endtabs %}

<hr>

接下来，在你的站点的`_config.yml`文件中开启Icarus：

{% codeblock _config.yml lang:yaml %}
theme: icarus
{% endcodeblock %}

或使用`hexo`命令修改主题为Icarus：

{% codeblock "命令行" %}
hexo config theme icarus
{% endcodeblock %}


最后，使用如下命令来启动Hexo本地测试服务器并开始创作。

{% codeblock "命令行" %}
hexo server
{% endcodeblock %}

第一次使用Icarus运行`hexo`命令时，它会在站点根目录中生成主题配置文件`_config.icarus.yml`，其中包含了所有配置项及其说明。
你可以编辑这个文件来配置主题，详见{% post_link zh-CN/Configuring-Theme %}。

如需了解更多主题、挂件、和插件相关的信息，请查看
[Icarus用户指南](/hexo-theme-icarus/tags/Icarus用户指南/)。
你也可以参考本站的源代码来获取更多的使用示例。
本站源代码位于GitHub上Icarus代码仓库的[`site`分支](https://github.com/ppoffice/hexo-theme-icarus/tree/site)。
此外，你也可能在[GitHub讨论组](https://github.com/ppoffice/hexo-theme-icarus/discussions)上获得其他Icarus用户的帮助。

**额外资源**

下面是一些帮助你进一步个性化你的站点的其他资源。
除Hexo文档外，下列社区教程大多是为较早的Icarus版本（如Icarus 3和4）编写的，部分内容可能已不适用于当前版本，请结合本站的文档参考。
你也可以[点击此处](https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/zh-CN/Getting-Started.md)来提交你的Icarus教程。

<div class="menu-list is-size-6">
<a href="https://hexo.io/zh-cn/docs/index.html"><i class="fas fa-bookmark mr-2"></i> Hexo中文文档</a>
<a href="https://removeif.github.io/theme/%E5%8D%9A%E5%AE%A2%E6%BA%90%E7%A0%81%E5%88%86%E4%BA%AB.html"><i class="fas fa-bookmark mr-2"></i> 博客源码分享 by 辣椒の酱</a>
<a href="https://www.imaegoo.com/2020/icarus-3-guide/"><i class="fas fa-bookmark mr-2"></i> hexo-theme-icarus 3 食用经验分享 by iMaeGoo</a>
<a href="https://www.imaegoo.com/2020/icarus-with-bulma/"><i class="fas fa-bookmark mr-2"></i> 活用 Bulma 美化 Icarus 文章 by iMaeGoo</a>
<a href="https://blog.mchook.cn/2021/07/22/icarus%E4%B8%BB%E9%A2%98%E8%87%AA%E5%AE%9A%E4%B9%89/"><i class="fas fa-bookmark mr-2"></i> icarus主题自定义 by kuzen</a>
<a href="https://blakeneko.github.io/2021/07/28/Icarus4%E4%B8%BB%E9%A2%98%E8%87%AA%E5%AE%9A%E4%B9%89%E8%AE%B0%E5%BD%95/"><i class="fas fa-bookmark mr-2"></i> Icarus4主题自定义记录 by BlakeNeko</a>
<a href="https://www.alphalxy.com/2019/03/customize-icarus/"><i class="fas fa-bookmark mr-2"></i> Icarus 主题自定义 by AlphaLxy</a>
<a href="https://www.mutter.cn/%E9%85%8D%E7%BD%AE/hexoThemeIcarusDarkTheme/"><i class="fas fa-bookmark mr-2"></i> Icarus black 黑色主题 by Mutter</a>
</div>

<br>

<article class="message message-immersive is-warning">
<div class="message-body">
<i class="fas fa-question-circle mr-2"></i>文章内容有误？点击<a href="https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/zh-CN/Getting-Started.md">此处</a>提交修改。
</div>
</article>
