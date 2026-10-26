title: Icarus用户指南 - 站内搜索插件
date: 2024-06-22
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

本文介绍Icarus支持的站内搜索插件的安装配置。

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-globe-americas mr-2"></i>本文同时提供以下语言的翻译：<a href="{% post_path en/Search-Plugins %}">English</a>。
</div>
</article>

<!-- more -->

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-info-circle mr-2"></i>下面的站内搜索插件由<a href="https://github.com/ppoffice/hexo-component-inferno">ppoffice/hexo-component-inferno</a>提供，完整的支持插件列表和配置详情以其为准。
</div>
</article>

访客点击导航栏上的搜索按钮即可打开搜索框。
除百度搜索外，搜索框也可以用键盘打开，并用<kbd>Esc</kbd>关闭，详见[快捷键](#快捷键)。

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

2. 注册并登录[Algolia](https://www.algolia.com/)。
   首次登录控制面板(Dashboard)时点击页面上的“创建索引”(Create Index)按钮。
   然后，输入“索引名称”(Index name)并点击“创建”(Create)完成索引创建。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/algolia-create-index.png 360 '"创建索引 - Algolia" "创建索引 - Algolia"' %}
   <br>

3. 下一步，点击左侧导航栏上的“API密钥”(API Keys)，复制页面上的“应用ID”(Application ID)和“仅限搜索的API Key”
   (Search-Only API Key)。
   打开Hexo站点根目录下的站点配置文件`_config.yml`，填入上面复制的信息到hexo-algolia插件的配置中。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/algolia-api-keys.png 360 '"API密钥 - Algolia" "API密钥 - Algolia"' %}
   <br>

   例如，下面的Algolia索引信息：

    {% codeblock "Algolia索引信息" %}
    Algolia索引名称: My-Hexo-Site
    Application ID: ABCDEFGHIJKL
    Search-Only API Key: 7b08fca7d42412cee901a25643124221
    {% endcodeblock %}

    对应的站点配置为：

    {% codeblock _config.yml lang:yaml %}
    algolia:
        applicationID: ABCDEFGHIJKL
        indexName: My-Hexo-Site
        apiKey: 7b08fca7d42412cee901a25643124221
    {% endcodeblock %}

4. 回到Algolia控制面板的“API密钥”(API Keys)页面并切换到“所有API Keys”(All API Keys)标签页。
   点击“新建API Key”(New API Key)按钮。
   在弹出的“创建API Key”(Create API Key)对话框中，在“索引”(Indices)处选择你在第2步中创建的索引。
   然后，“ACL”项中添加`addObject`，`deleteObject`，`listIndexes`， `deleteIndex`。
   点击“创建”(Create)完成密钥的创建。
   复制刚刚创建的API Key，例如`727fbd8c998fe419318fa350db6793ca`。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/algolia-create-api-key.png 360 '"创建API密钥 - Algolia" "创建API密钥 - Algolia"' %}
   <br>

5. 打开一个Windows命令行(CMD)或Linux/macOS终端并切换当前目录到你的Hexo站点的根目录。
   设置环境变量`HEXO_ALGOLIA_INDEXING_KEY`为上一步中创建的API Key。
   hexo-algolia插件上传网站索引时会用到这个变量。

   Windows下：

    {% codeblock "Windows命令行(CMD)" lang:cmd %}
    C:\Users\you> cd path/to/your/hexo/site
    C:\Users\you> set HEXO_ALGOLIA_INDEXING_KEY=727fbd8c998fe419318fa350db6793ca
    {% endcodeblock %}

   Linux/macOS下：

    {% codeblock "Linux/macOS终端" lang:shell %}
    $ cd path/to/your/hexo/site
    $ export HEXO_ALGOLIA_INDEXING_KEY="727fbd8c998fe419318fa350db6793ca"
    {% endcodeblock %}

    然后，运行下面的命令来清理站点并上传网站索引到Algolia：

    {% codeblock "Windows命令行(CMD)或Linux/macOS终端" lang:shell %}
    $ hexo clean
    $ hexo algolia
    {% endcodeblock %}
   
6. 最后，在主题配置中设置搜索引擎为Algolia：

    {% codeblock _config.icarus.yml lang:yaml %}
    search:
        type: algolia
        excerpt: excerpt        # 可选填，默认为`excerpt`
    {% endcodeblock %}

    `excerpt`是Algolia记录中的一个属性名，这个属性的内容会作为每条搜索结果的预览文字。
    如果你的记录把文章正文存在其他属性中，请设置这一项。
    搜索结果中的标题和预览文字都以纯文本显示，并高亮匹配到的词：
    自hexo-component-inferno 4.2.0起，预览文字中的HTML标签会被去掉，记录中的其他HTML会被转义，而不会被渲染。


## 百度搜索

**安装指南**

1. 打开主题配置文件并设置搜索为百度搜索：

    {% codeblock _config.icarus.yml lang:yaml %}
    search:
        type: baidu
    {% endcodeblock %}

    百度搜索会把访客带到百度网站上搜索你的站点，搜索范围限定为站点配置文件`_config.yml`中`url`设置的域名。
    请确认`url`是你的站点地址。
    百度搜索的搜索框不支持快捷键。


## 谷歌自定义搜索

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-info-circle mr-2"></i>谷歌现在似乎把这项服务称为Programmable Search Engine（可编程搜索引擎），因此它的页面可能与下面的截图不同。
</div>
</article>

<div>
<strong>安装指南</strong>
<a class="tag is-success" style="margin-left:.8em" href="{% post_path demo/search/Google-CSE %}">在线预览</a>
</div>

1. 登录你的谷歌账户并访问[Google CSE](https://cse.google.com/cse/create/new)来创建自定义搜索。
   在“需要搜索的站点”(Sites to Search)中填入你的Hexo站点域名。
   在“语言”(Language)选择框中选择正确的语言。
   然后填写自定义“搜索引擎名称”(Name of the search engine)。
   点击“创建”(Create)按钮完成引擎的创建。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/google-cse-create.png 360 '"创建自定义搜索 - Google CSE" "创建自定义搜索 - Google CSE"' %}
   <br>

2. 然后，点击页面上的“添加到你的站点”(Add it to your site)右侧的“获取代码”(Get code)按钮。
   从HTML代码中复制`cx`的值，填入对应的主题配置项中。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/google-cse-code.png 360 '"获取代码 - Google CSE" "获取代码 - Google CSE"' %}
   <br>

   例如，下面的HTML代码：

    {% codeblock "Google CSE HTML代码" lang:html %}
    <script async src="https://cse.google.com/cse.js?cx=012345601234560123456:abcdefghijklmn"></script>
    <div class="gcse-search"></div>
    {% endcodeblock %}

    对应下面的主题配置：

    {% codeblock _config.icarus.yml lang:yaml %}
    search:
        type: google_cse
        cx: 012345601234560123456:abcdefghijklmn
    {% endcodeblock %}


## Insight

**安装指南**

1. Insight为本站默认的站内搜索引擎。
   你可以通过下面的主题配置来启用它：

    {% codeblock _config.icarus.yml lang:yaml %}
    search:
        type: insight
        index_pages: true       # 可选项，默认为`true`。设置为`false`时从搜索结果中排除所有页面（page）
    {% endcodeblock %}

2. Insight不需要任何外部服务。
   生成网站时，它会把文章、页面、分类和标签的文字保存到`content.json`文件中，搜索框会下载这个文件并在浏览器中搜索。
   自hexo-component-inferno 4.2.0起，搜索关键词按纯文本匹配，不再被当作正则表达式；搜索结果也会被转义，以纯文本显示。
   你还可以用<kbd>↑</kbd>和<kbd>↓</kbd>选择搜索结果，按<kbd>Enter</kbd>打开它。


## 快捷键

除百度搜索外，上面所有的搜索插件都支持下面的快捷键：

- <kbd>/</kbd>：打开搜索框。正在输入框、文本框或其他可编辑内容中输入时除外。
- <kbd>Ctrl</kbd> + <kbd>K</kbd>（macOS上为<kbd>⌘ Command</kbd> + <kbd>K</kbd>）：打开搜索框，正在输入时也可以使用。
- <kbd>Esc</kbd>：关闭搜索框，焦点会回到打开搜索框之前的位置。

用<kbd>Tab</kbd>等方式让导航栏上的搜索按钮获得焦点时，不会打开搜索框；请在按钮上按<kbd>Enter</kbd>或<kbd>空格</kbd>，或者点击它。
用<kbd>Tab</kbd>等方式把焦点移出已打开的搜索框时，搜索框会关闭。


<article class="message message-immersive is-warning">
<div class="message-body">
<i class="fas fa-question-circle mr-2"></i>文章内容有误？请点击<a href="https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/zh-CN/Search-Plugins.md">此处</a>提交修改。
</div>
</article>
