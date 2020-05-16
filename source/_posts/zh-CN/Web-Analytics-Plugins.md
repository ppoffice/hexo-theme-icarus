title: Icarus用户指南 - 网站分析插件
date: 2016-01-01
categories:
- Plugins
- Analytics
tags:
- Icarus用户指南
language: zh-CN
toc: true
providers:
    cdn: loli
    fontcdn: loli
    iconcdn: loli
---

本文介绍Icarus 3支持的网站统计与分析插件的安装配置。

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-globe-americas mr-2"></i>本文同时提供以下语言的翻译：<a href="{% post_path en/Web-Analytics-Plugins %}">English</a>。
</div>
</article>

<!-- more -->

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-info-circle mr-2"></i>下面的网站统计与分析插件由<a href="https://github.com/ppoffice/hexo-component-inferno">ppoffice/hexo-component-inferno</a>提供，完整的支持插件列表和配置详情以其为准。
</div>
</article>

<article class="message message-immersive is-danger">
<div class="message-body">
<i class="fas fa-exclamation-triangle mr-2"></i>本文中涉及的所有插件均可能被部分广告拦截浏览器扩展拦截，请酌情使用。
</div>
</article>

## 百度统计

**安装指南**

1. 登录[百度统计](https://tongji.baidu.com)。
   在“管理 > 网站列表”页面上点击“新增网站”按钮并填写“网站域名”，“网站首页”等站点信息。
   点击“确定”完成站点创建。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/baidu-analytics-add-site.png 360 '"新增站点 - Baidu Analytics" "新增站点 - Baidu Analytics"' %}
   <br>

2. 在下一页面上找到`hm.baidu.com/hm.js?`后的ID并填写到主题配置的`plugins` > `baidu_analytics` > 
   `tracking_id`值中。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/baidu-analytics-get-code.png 360 '"获取代码 - Baidu Analytics" "获取代码 - Baidu Analytics"' %}
   <br>
   
   例如，如下的统计代码：

    {% codeblock "百度统计代码" lang:html %}
    <script>
    var _hmt = _hmt || [];
    (function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?3f06f2b732a5b1034c989f74e28d0eea";
    var s = document.getElementsByTagName("script")[0]; 
    s.parentNode.insertBefore(hm, s);
    })();
    </script>
    {% endcodeblock %}

    对应的主题配置为：

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    plugins:
        baidu_analytics:
            tracking_id: 3f06f2b732a5b1034c989f74e28d0eea
    {% endcodeblock %}


## 不蒜子网页计数器

**安装指南**

1. 将`plugins` > `busuanzi`设置为`true`来开启不蒜子访客计数器并在网页尾部和每篇博文的头部展示访问次数。

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    plugins:
        busuanzi: true
    {% endcodeblock %}


## CNZZ统计

**安装指南**

1. 登录[友盟+](https://www.umeng.com/)。
   在友盟+工作台首页点击“创建新应用” > “Web应用”。
   然后输入“网站名称”，“网站域名”，“网站首页”等站点信息信息。
   完成后点击“确认添加站点”。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/cnzz-add-site.png 360 '"添加站点 - CNZZ" "添加站点 - CNZZ"' %}
   <br>

2. 在获取统计代码界面找到“文字样式”一栏下的HTML代码。
   分别将其中`id`与`web_id`的值复制到主题配置的`plugins` > `cnzz` > `id`和`web_id`中。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/cnzz-get-code.png 360 '"获取代码 - CNZZ" "获取代码 - CNZZ"' %}
   <br>
   
   例如，如下的统计安装代码：

    {% codeblock "CNZZ统计代码" lang:html %}
    <script type="text/javascript" src="https://s9.cnzz.com/z_stat.php?id=123456789000&web_id=123456789000"></script>
    {% endcodeblock %}

    对应的主题配置为：

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    plugins:
        cnzz:
            id: 123456789000
            web_id: 123456789000
    {% endcodeblock %}


## Google Analytics

**安装指南**

1. 登录[Google Analytics](https://analytics.google.com/)并点击左侧的”管理“(Admin)进入管理界面。

2. 在管理界面上点击”创建资产“(Create Property)按钮，选择“测量的应用类型”(What do you want to measure?)为Web。
   然后点击”继续“(Continue)按钮。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/google-analytics-create-property.png 360 '"创建资产 - Google Analytics" "创建资产 - Google Analytics"' %}
   <br>

3. 然后，填写“网站名称”(Website Name)，“URL地址”(Website URL)，“行业分类”(Industry Category)，以及“报告时区”
   (Reporting Time Zone)等信息。
   点击”创建“(Create)按钮完成资产创建。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/google-analytics-property-setup.png 360 '"资产设置 - Google Analytics" "资产设置 - Google Analytics"' %}
   <br>

4. 在”追踪代码“(Tracking Code)界面上找到"Tracking ID"的值，例如"UA-12345678-0".
   将其填写到主题配置的`plugins` > `google_analytics` > `tracking_id`即可开启Google Analytics插件。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/google-analytics-get-code.png 360 '"获取代码 - Google Analytics" "获取代码 - Google Analytics"' %}
   <br>

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    plugins:
        google_analytics:
            tracking_id: UA-12345678-0
    {% endcodeblock %}


## Hotjar

**安装指南**

1. 登录[Hotjar](https://www.hotjar.com/)，点击页面左上角的➕(加号) > ”添加新站点“(Add new site)链接。

2. 填写”网站地址“(WEBSITE)，”站点类型“(SITE TYPE)，和”站点所有者“(SITE OWNER)，然后点击”添加站点“(Add Site)按钮。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/hotjar-new-site.png 360 '"新建站点 - Hotjar" "新建站点 - Hotjar"' %}
   <br>

3. 在重定向到的”站点&组织“(Sites & Organizations)页面找到新建的站点。
   点击右侧的”追踪代码“(Tracking Code)按钮。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/hotjar-site-list.png 360 '"站点列表 - Hotjar" "站点列表 - Hotjar"' %}
   <br>
   
4. 复制弹出对话框中"Site ID"的值(如"1234567")到主题配置的`plugins` > `hotjar` > `site_id`来启用Hotjar插件。

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/hotjar-get-code.png 360 '"获取代码 - Hotjar" "获取代码 - Hotjar"' %}
   <br>

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    plugins:
        hotjar:
            site_id: 1234567
    {% endcodeblock %}


<article class="message message-immersive is-warning">
<div class="message-body">
<i class="fas fa-question-circle mr-2"></i>文章内容有误？请点击<a href="https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/zh-CN/Web-Analytics-Plugins.md">此处</a>提交修改。
</div>
</article>
