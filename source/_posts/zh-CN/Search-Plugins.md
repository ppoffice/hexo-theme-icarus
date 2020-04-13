title: Icarus用户指南 - 站内搜索插件
date: 2016-01-01
categories:
- Plugins
- Search
tags:
- Icarus用户指南
language: zh-CN
toc: true
providers:
    cdn: loli
    fontcdn: loli
    iconcdn: loli
---

<div class="notification is-success is-size-6">
本文同时提供以下语言的翻译：<a href="{% post_path en/Search-Plugins %}">English</a>。
</div>

本文介绍Icarus 3支持的一些站内搜索插件的安装配置。

<!-- more -->

<div class="notification is-link is-size-6">

Icarus的站内搜索插件由[ppoffice/hexo-component-inferno](https://github.com/ppoffice/hexo-component-inferno)
提供，具体提供的插件种类与配置以其为准。

</div>

<style>
.content ol:not([type]) {
    list-style-type: simp-chinese-informal;
}
</style>

## Algolia

<div>
<strong>安装指南</strong>
<a class="tag is-success" style="margin-left:.8em" href="{% post_path demo/search/Algolia %}">在线预览</a>
</div>

1. 在Hexo站点的根目录安装[hexo-algolia](https://github.com/oncletom/hexo-algolia)插件。

2. 注册并登录[Algolia](https://www.algolia.com/)。首次登录控制面板(Dashboard)时点击页面上的“创建索引”(Create Index)按钮并
   输入任意索引名称(Index name)。最后点击“创建”(Create)完成索引创建。

3. 下一步，点击右侧导航栏上的API Keys，复制页面上的“应用ID”(Application ID)和“仅限搜索的API Key”(Search-Only API Key)。打开
   Hexo站点根目录下的站点配置文件`_config.yml`，填入上面复制的信息到hexo-algolia插件的配置中。
   例如，对于下面的Algolia索引信息

    {% codeblock "Algolia索引信息" %}
    Algolia索引名称: My-Hexo-Site
    Application ID: ABCDEFGHIJKL
    Search-Only API Key: 7b08fca7d42412cee901a25643124221
    {% endcodeblock %}

    对应的站点配置为

    {% codeblock _config.yml lang:yaml %}
    algolia:
        applicationID: My-Hexo-Site
        indexName: ABCDEFGHIJKL
        apiKey: 7b08fca7d42412cee901a25643124221
    {% endcodeblock %}

4. 回到Algolia控制面板的API Keys页面，切换到同一页面上的“所有API Keys”(All API Keys)标签页，点击“新建API Key”(New API Key)。
   在弹出的“创建API Key”(Create API Key)对话框中选择“索引”(Indices)为上一步中创建的索引，“HTTP Referers”填入Hexo站点的
   域名，“ACL”中填入`addObject`，`deleteObject`，`listIndexes`， `deleteIndex`四项。点击“创建”(Create)完成创建。
   复制刚刚创建的API Key，例如`727fbd8c998fe419318fa350db6793ca`。

5. 打开一个命令行终端(Windows命令行(CMD)或Linux/macOS终端)，切换当前目录到你的Hexo站点的根目录并设置hexo-algolia
   插件上传网站索引用到的环境变量为上一步中创建的API Key。
   
   Windows下

    {% codeblock "Windows命令行(CMD)" lang:cmd %}
    C:\Users\you> cd path/to/your/hexo/site
    C:\Users\you> set HEXO_ALGOLIA_INDEXING_KEY="727fbd8c998fe419318fa350db6793ca"
    {% endcodeblock %}

   Linux/macOS下

    {% codeblock "Linux/macOS终端" lang:shell %}
    $ cd path/to/your/hexo/site
    $ export HEXO_ALGOLIA_INDEXING_KEY="727fbd8c998fe419318fa350db6793ca"
    {% endcodeblock %}

    然后运行下面的命令来清理并上传网站索引到Algolia

    {% codeblock "Windows命令行(CMD)或Linux/macOS终端" lang:shell %}
    $ hexo clean
    $ hexo algolia
    {% endcodeblock %}
   
6. 最后，打开主题配置文件并设置搜索为Algolia

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    search:
        type: algolia
    {% endcodeblock %}


## 百度搜索

**安装指南**

1. 打开主题配置文件并设置搜索为百度搜索

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    search:
        type: baidu
    {% endcodeblock %}


## 谷歌自定义搜索

<div>
<strong>安装指南</strong>
<a class="tag is-success" style="margin-left:.8em" href="{% post_path demo/search/Google-CSE %}">在线预览</a>
</div>

1. 登录谷歌并访问[Google CSE](https://cse.google.com/cse/create/new)来创建自定义搜索。在“需要搜索的站点”(Sites to Search)
   中填入你的Hexo站点域名，“语言”(Language)选择需要的语言，并填写自定义“搜索引擎名称”(Name of the search engine)。点击“创建”
   (Create)。

2. 然后，点击页面上的“添加到你的站点”(Add it to your site)右侧的“获取代码”(Get code)按钮，然后从HTML代码中复制`cx`的值填入到对应
   主题配置项中。例如下面的HTML代码

    {% codeblock "Google CSE HTML代码" lang:html %}
    <script async src="https://cse.google.com/cse.js?cx=012345601234560123456:abcdefghijklmn"></script>
    <div class="gcse-search"></div>
    {% endcodeblock %}

    对应的主题配置为

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    search:
        type: google_cse
        cx: 012345601234560123456:abcdefghijklmn
    {% endcodeblock %}


## Insight

**安装指南**

1. Insight为本站默认的站内搜索引擎。你可以通过下面的主题配置设置搜索为Insight

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    search:
        type: insight
    {% endcodeblock %}


<div class="notification is-warning is-size-6">
文章内容有误？请点击<a href="https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/zh-CN/Search-Plugins.md">此处</a>提交修改。
</div>
