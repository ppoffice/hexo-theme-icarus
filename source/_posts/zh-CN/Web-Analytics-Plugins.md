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
    iconcdn: fontawesome
---

<div class="notification is-success is-size-6">
本文同时提供以下语言的翻译：<a href="{% post_path en/Web-Analytics-Plugins %}">English</a>。
</div>

本文介绍Icarus 3支持的一些网站统计与分析插件的安装配置。

<!-- more -->

<div class="notification is-link is-size-6">

Icarus的网站统计与分析插件由[ppoffice/hexo-component-inferno](https://github.com/ppoffice/hexo-component-inferno)
提供，具体提供的插件种类与配置以其为准。

</div>

<div class="notification is-warning is-size-6">
本文中涉及的所有插件均可能被部分广告拦截浏览器扩展拦截，请酌情使用。
</div>

## 百度统计

**安装指南**

1. 登录[百度统计](https://tongji.baidu.com)。在“网站列表”页面上点击“新增网站”按钮并填写你的Hexo站点的“网站域名”，“网站首页”
   等信息，点击“确定”。

2. 在跳转到的“代码获取”页面中找到`hm.baidu.com/hm.js?`后引号内的一串ID并填写到主题配置的`plugins` > `baidu_analytics` > 
   `tracking_id`。例如如下的统计代码

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

    对应的主题配置为

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    plugins:
        baidu_analytics:
            tracking_id: 3f06f2b732a5b1034c989f74e28d0eea
    {% endcodeblock %}


## 不蒜子网页计数器

**安装指南**

1. 将主题配置中的`plugins`部分下的`busuanzi`设置为`true`即可开启不蒜子访客计数器，在网站页面的尾部和每篇博文的头部展示访问次数。

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    plugins:
        busuanzi: true
    {% endcodeblock %}


## CNZZ统计

**安装指南**

1. 登录[友盟+](https://www.umeng.com/)，在友盟+工作台首页点击“创建新应用” > “Web应用”。然后输入“网站名称”，“网站域名”，
   “网站首页”等信息，并点击“确认添加站点”。

2. 在跳转到的“统计代码“获取界面上找到”文字形式“的统计代码，并将其中`id`与`web_id`的值填写到主题配置的`plugins` > `cnzz` > 
   `id`和`web_id`。例如如下的统计代码

    {% codeblock "CNZZ统计代码" lang:html %}
    <script type="text/javascript" src="https://s9.cnzz.com/z_stat.php?id=123456789000&web_id=123456789000"></script>
    {% endcodeblock %}

    对应的主题配置为

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    plugins:
        cnzz:
            id: 123456789000
            web_id: 123456789000
    {% endcodeblock %}


## Google Analytics

**安装指南**

1. 登录[Google Analytics](https://analytics.google.com/)。在进入用户主页后点击左侧导航栏下方的”管理“(Admin)进入管理界面。

2. 在管理界面上点击”创建资产“(Create Property)按钮，选择测量的应用类型(What do you want to measure?)为Web并点击”继续“。
   然后填写网站的名称(Website Name)，URL地址(Website URL)，分类(Industry Category)，以及报告时区(Reporting Time Zone)等信息。
   点击”创建“(Create)。

3. 在之后的”追踪代码“(Tracking Code)界面上找到"Tracking ID"的值，例如"UA-12345678-0"，填写到主题配置的`plugins` > 
   `google_analytics` > `tracking_id`即可完成配置。

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    plugins:
        google_analytics:
            tracking_id: UA-12345678-0
    {% endcodeblock %}


## Hotjar

**安装指南**

1. 登录[Hotjar](https://www.hotjar.com/)，点击页面左上角的➕(加号)菜单中的”添加新站点“(Add new site)链接。

2. 填写”网站地址“(WEBSITE)，”站点类型“(SITE TYPE)，和”站点所有者“(SITE OWNER)，然后点击”添加站点“(Add Site)按钮。

3. 在跳转到的”站点&组织“(Sites & Organizations)页面找到新建的站点项，点击其右侧的”追踪代码“(Tracking Code)按钮并在弹出的
   对话框中找到"Site ID"的值，例如"1234567"，填写到主题配置的`plugins` > `hotjar` > `site_id`即可完成配置。

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    plugins:
        hotjar:
            site_id: 1234567
    {% endcodeblock %}


<div class="notification is-warning is-size-6">
文章内容有误？请点击<a href="https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/zh-CN/Web-Analytics-Plugins.md">此处</a>提交修改。
</div>
