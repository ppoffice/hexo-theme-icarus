title: Icarus User Guide - Web Analytics Plugins
date: 2017-01-31
categories:
- Plugins
- Analytics
tags:
- Icarus User Guide
language: en
toc: true
---

<div class="notification is-success is-size-6">
This article is also available in: <a href="{% post_path zh-CN/Web-Analytics-Plugins %}">简体中文</a>.
</div>

This article covers some web analytics plugins supported by Icarus 3.

<!-- more -->

<div class="notification is-link is-size-6">

The web analytics plugins of Icarus are provided by
[ppoffice/hexo-component-inferno](https://github.com/ppoffice/hexo-component-inferno).
Please refer to it for a complete list of supported plugins and their configurations.

</div>

<div class="notification is-warning is-size-6">
All plugins mentioned in this article may be blocked by some ad blocking browser extensions.
Please use with caution.
</div>

## Baidu Statistics

**Installation Guide**

1. Log into [Baidu Statistics](https://tongji.baidu.com). Click the "Add new website" button on the "site list" page
   and fill in the site information such as name and homepage URL.
   Click "OK" to complete site creation.

2. On the next page find the ID behind `hm.baidu.com/hm.js?` within the quotes and set it as the value of 
   `plugins` > `baidu_analytics` > `tracking_id` in the theme's configuration file.
   For example, the following Baidu Statistics code

    {% codeblock "Baidu Statistics code" lang:html %}
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

    can be mapped to the following theme configuration

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    plugins:
        baidu_analytics:
            tracking_id: 3f06f2b732a5b1034c989f74e28d0eea
    {% endcodeblock %}


## BuSuanZi Web Counter

**Installation Guide**

1. Set the `plugins` > `busuanzi` to `true` to enable BuSuanZi web counter and display visitor count on the bottom of the 
   page and header of each blog post.

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    plugins:
        busuanzi: true
    {% endcodeblock %}


## CNZZ Statistics

**Installation Guide**

1. Log into [Umeng+](https://www.umeng.com/). On the dashboard of Umeng+, click "Create new application" > "Web application"
   and fill in site information such as "website name", "site domain name", and "site homepage URL".
   Click "Confirm adding the site".

2. Find the HTML code in the "text style" row on the get installation code page and copy the values of `id` and `web_id`
   to the `plugins` > `cnzz` > `id` and `web_id` in the theme's configuration file respectively.
   For example, the following CNZZ installation code

    {% codeblock "CNZZ installation code" lang:html %}
    <script type="text/javascript" src="https://s9.cnzz.com/z_stat.php?id=123456789000&web_id=123456789000"></script>
    {% endcodeblock %}

    can be mapped to the following theme configuration

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    plugins:
        cnzz:
            id: 123456789000
            web_id: 123456789000
    {% endcodeblock %}


## Google Analytics

**Installation Guide**

1. Log into [Google Analytics](https://analytics.google.com/) and click the "Admin" on the left side of the user dashboard.

2. On the admin page, click the "Create Property" button and set "What do you want to measure?" to Web.
   Click the "Continue" button after that.
   Then, fill in the Website Name, Website URL, Industry Category, and Reporting Time Zone.
   Click the "Create" button to finish property creation.

3. Find the value of "Tracking ID", e.g., "UA-12345678-0", on the "Tracking Code" page. Set it to the `plugins` > 
   `google_analytics` > `tracking_id` in the theme's configuration file to enable the Google Analytics plugin.

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    plugins:
        google_analytics:
            tracking_id: UA-12345678-0
    {% endcodeblock %}


## Hotjar

**Installation Guide**

1. Log into [Hotjar](https://www.hotjar.com/) and click the ➕ (plus sign) > "Add new site" link on the top left of the page.

2. Fill in the "WEBSITE", "SITE TYPE", and "SITE OWNER", then click the "Add Site" button.

3. Find the newly created site on the "Sites & Organizations" page you have been redirected to.
   Click the "Tracking Code" button on the right and copy the value of "Site ID" (e.g., 1234567) from the popup dialog.
   Finally, copy it to `plugins` > `hotjar` > `site_id` in the theme's configuration file to enable the Hotjar plugin.

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    plugins:
        hotjar:
            site_id: 1234567
    {% endcodeblock %}


<div class="notification is-warning is-size-6">
Something wrong with this article? Click <a href="https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/en//Web-Analytics-Plugins.md">here</a> to submit your revision.
</div>
