title: Icarus User Guide - Web Analytics Plugins
date: 2025-09-20
categories:
- Plugins
- Analytics
tags:
- Icarus User Guide
language: en
toc: true
---

This article covers web analytics plugins supported by Icarus.

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-globe-asia mr-2"></i>This article is also available in 
<a href="{% post_path zh-CN/Web-Analytics-Plugins %}">简体中文</a>.
</div>
</article>

<!-- more -->

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-info-circle mr-2"></i>The following web analytics plugins are provided by
<a href="https://github.com/ppoffice/hexo-component-inferno">ppoffice/hexo-component-inferno</a>.
Please refer to it for a complete list of supported plugins and their configuration details.
</div>
</article>

<article class="message message-immersive is-danger">
<div class="message-body">
<i class="fas fa-exclamation-triangle mr-2"></i>All plugins mentioned below may be blocked by AD blockers.
Use them with caution.
</div>
</article>

## Baidu Statistics

**Installation Guide**

1. Log into [Baidu Statistics](https://tongji.baidu.com).
   Click the "Add new website" button on the "Admin > Site list" page
   and fill in the site information such as name and homepage URL.
   Click "OK" to complete site creation.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/baidu-analytics-add-site.png 360 '"Add Site - Baidu Analytics" "Add Site - Baidu Analytics"' %}
   <br>

2. On the next page, find the ID behind `hm.baidu.com/hm.js?` and set it as the value of 
   `plugins` > `baidu_analytics` > `tracking_id` in the theme configurations.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/baidu-analytics-get-code.png 360 '"Get Code - Baidu Analytics" "Get Code - Baidu Analytics"' %}
   <br>

   For example, the following Baidu Statistics code:

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

    maps to the following theme configuration:

    {% codeblock _config.icarus.yml lang:yaml %}
    plugins:
        baidu_analytics:
            tracking_id: 3f06f2b732a5b1034c989f74e28d0eea
    {% endcodeblock %}


## Bing Webmaster Tools

**Installation Guide**

1. Log into [Bing - Webmaster Tools](https://www.bing.com/toolbox/webmaster/).
   Then, choose "Add your site manually" and enter the URL to your site.
   Click "Add" button to continue.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/bing-webmaster-add-site.png 360 '"Add Site - Bing Webmaster Tools" "Add Site - Bing Webmaster Tools"' %}
   <br>

2. In the "Add & verify site" panel, select "HTML Meta Tag" method.
   Copy value of the `content` attribute in the HTML meta tag to the `plugins` > `bing_webmaster` > `tracking_id`
   in the theme configurations.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/bing-webmaster-verify-site.png 360 '"Verify Site - Bing Webmaster Tools" "Verify Site - Bing Webmaster Tools"' %}
   <br>

    {% codeblock _config.icarus.yml lang:yaml %}
    plugins:
        bing_webmaster:
            tracking_id: ABCDEFABCDEFABCDEFABCDEFABCDEFABCDEF
    {% endcodeblock %}


## BuSuanZi Web Counter

**Installation Guide**

1. Set the `plugins` > `busuanzi` to `true` to enable [BuSuanZi web counter](https://busuanzi.ibruce.info/).
   It displays the number of views of the current post on the header of each blog post, and the number of
   unique visitors of the whole site at the bottom of each page.

    {% codeblock _config.icarus.yml lang:yaml %}
    plugins:
        busuanzi: true
    {% endcodeblock %}


## CNZZ Statistics (Umeng+)

<article class="message message-immersive is-warning">
<div class="message-body">
<i class="fas fa-exclamation-triangle mr-2"></i>CNZZ is now provided as part of Umeng+, and its pages may have
changed since the following steps and screenshots were made.
</div>
</article>

**Installation Guide**

1. Log into [Umeng+](https://www.umeng.com/). 
   On the dashboard of Umeng+, click "Create new application" > "Web application".
   Then, fill in your site information such as "website name", "site domain name", and "site homepage URL".
   Click "Confirm adding the site" after finished.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/cnzz-add-site.png 360 '"Add Site - CNZZ" "Add Site - CNZZ"' %}
   <br>

2. Find the HTML code in the "text style" row on the get installation code page.
   Copy the values of `id` and `web_id` to the `plugins` > `cnzz` > `id` and `web_id` in the theme configurations, 
   respectively.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/cnzz-get-code.png 360 '"Get Code - CNZZ" "Get Code - CNZZ"' %}
   <br>

   For example, the following CNZZ installation code:

    {% codeblock "CNZZ installation code" lang:html %}
    <script type="text/javascript" src="https://s9.cnzz.com/z_stat.php?id=123456789000&web_id=123456789000"></script>
    {% endcodeblock %}

    maps to the following theme configuration:

    {% codeblock _config.icarus.yml lang:yaml %}
    plugins:
        cnzz:
            id: 123456789000
            web_id: 123456789000
    {% endcodeblock %}


## Google Analytics

**Installation Guide**

<article class="message message-immersive is-warning">
<div class="message-body">
<i class="fas fa-exclamation-triangle mr-2"></i>Google has replaced Universal Analytics with Google Analytics 4 (GA4).
Old tracking IDs that start with <code>UA-</code> no longer collect data.
Use the Measurement ID (<code>G-XXXXXXXXXX</code>) of a GA4 property instead.
The Google Analytics pages change from time to time, so the names below may differ slightly from what you see.
</div>
</article>

1. Log into [Google Analytics](https://analytics.google.com/) and open the "Admin" page.
   Create a new property, and fill in the property name, reporting time zone, currency, and your business details.

2. When asked to start collecting data, choose the "Web" platform.
   Enter the URL and a name for your site, and create the web data stream.

3. Find the "Measurement ID", e.g., `G-XXXXXXXXXX`, in the details of the web data stream.
   You can also find it later in the "Data streams" list of the property on the "Admin" page.
   Set it to the `plugins` > `google_analytics` > `tracking_id` in the theme configurations to enable the Google
   Analytics plugin.

    {% codeblock _config.icarus.yml lang:yaml %}
    plugins:
        google_analytics:
            tracking_id: G-XXXXXXXXXX
    {% endcodeblock %}

   Icarus adds the Google tag (gtag.js) with this ID to the `<head>` of every page, so you do not need to copy
   the tag that Google Analytics shows you.


## Hotjar

**Installation Guide**

1. Log into [Hotjar](https://www.hotjar.com/) and click the ➕ (plus sign) > "Add new site" link on the top left of the page.

2. Fill in the "WEBSITE", "SITE TYPE", and "SITE OWNER", then click the "Add Site" button.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/hotjar-new-site.png 360 '"New Site - Hotjar" "New Site - Hotjar"' %}
   <br>

3. Find the newly created site on the "Sites & Organizations" page you have been redirected to.
   Click the "Tracking Code" button on the right.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/hotjar-site-list.png 360 '"Site List - Hotjar" "Site List - Hotjar"' %}
   <br>
   
4. Copy the value of "Site ID" (e.g., 1234567) from the popup dialog to `plugins` > `hotjar` > `site_id` in the theme configurations 
   to enable the Hotjar plugin.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/hotjar-get-code.png 360 '"Get Code - Hotjar" "Get Code - Hotjar"' %}
   <br>

    {% codeblock _config.icarus.yml lang:yaml %}
    plugins:
        hotjar:
            site_id: 1234567
    {% endcodeblock %}


## Matomo

**Installation Guide**

1. Set up [Matomo](https://matomo.org/), either on your own server or with Matomo Cloud, and add your site to it.

2. Find the JavaScript tracking code of your site in Matomo.
   Copy the value of `u` (the URL of your Matomo server) and the value passed to `setSiteId` to `plugins` >
   `matomo` > `url` and `plugins` > `matomo` > `site_id` in the theme configurations, respectively.
   Both settings are required.

   For example, the following Matomo tracking code:

   {% codeblock "Matomo tracking code" lang:html %}
   <script>
     var _paq = window._paq = window._paq || [];
     _paq.push(['trackPageView']);
     _paq.push(['enableLinkTracking']);
     (function() {
       var u="https://matomo.example.com/";
       _paq.push(['setTrackerUrl', u+'matomo.php']);
       _paq.push(['setSiteId', '1']);
       ...
     })();
   </script>
   {% endcodeblock %}

   maps to the following theme configuration:

   {% codeblock _config.icarus.yml lang:yaml %}
   plugins:
       matomo:
           # URL of your Matomo server, such as https://matomo.example.com/ or https://example.matomo.cloud/
           url: https://matomo.example.com/
           # ID of your site in Matomo
           site_id: 1
           # Optional. Set to true to track visitors without cookies. Defaults to false.
           disable_cookies: false
   {% endcodeblock %}

   Icarus loads `matomo.js` from your Matomo server.
   When <a href="{% post_path en/Other-Plugins %}#PJAX">PJAX</a> is enabled, every page that visitors switch to is
   tracked as a new page view.


## Statcounter

**Installation Guide**

1. Log into [Statcounter](https://statcounter.com/).
   Click "Add New Project" button in the "Projects" page.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/statcounter-projects.png 360 '"Projects - Statcounter" "Projects - Statcounter"' %}
   <br>

2. Fill in the website URL and project title in the "Add Project" page.
   Tweak rest of the project settings if you need to.
   Then, click the "Add Project" button.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/statcounter-add-project.png 360 '"Add Project - Statcounter" "Add Project - Statcounter"' %}
   <br>

3. Click "Continue to Default Installation" in the "Platform Check Complete" page.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/statcounter-platform-check.png 360 '"Platform Check Complete - Statcounter" "Platform Check Complete - Statcounter"' %}
   <br>

4. Finally, in the "Insert the Code on Your Website" page, copy the value of `sc_project` and `sc_security` variable in the HTML snippet
   to `plugins` > `statcounter` > `project` and `plugins` > `statcounter` > `security` in the theme configurations, respectively.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/statcounter-insert-code.png 360 '"Insert Code - Statcounter" "Insert Code - Statcounter"' %}
   <br>

   For example, the following Statcounter code:

   {% codeblock "Statcounter code" lang:html %}
   <script type="text/javascript">
   var sc_project=12345678; 
   var sc_invisible=1; 
   var sc_security="abcdef12"; 
   var sc_https=1; 
   </script>
   <script type="text/javascript"
   src="https://www.statcounter.com/counter/counter.js"
   async></script>
   ...
   {% endcodeblock %}

   maps to the following theme configuration:

   {% codeblock _config.icarus.yml lang:yaml %}
   plugins:
      statcounter:
         project: 12345678
         security: abcdef12
   {% endcodeblock %}


## Twitter (X) Conversion Tracking

<article class="message message-immersive is-warning">
<div class="message-body">
<i class="fas fa-exclamation-triangle mr-2"></i>Twitter has been renamed X.
The following link and code were made for Twitter and may have changed since then.
</div>
</article>

**Installation Guide**

1. Follow [How to set up conversion tracking](https://business.twitter.com/en/help/campaign-measurement-and-analytics/conversion-tracking-for-websites.html) to enable universal website tag of Twitter conversion tracking.

2. Find the `init` (Pixel ID) in your conversion tracking code. Copy its value to `plugins` > `twitter_conversion_tracking` > `pixel_id`
   in the theme configurations.

   For example, the following Twitter conversion tracking code:

   {% codeblock "Twitter conversion tracking code" lang:html %}
   <!-- Twitter universal website tag code -->
   <script>
   !function(e,n,u,a){e.twq||(a=e.twq=function(){a.exe?a.exe.apply(a,arguments):
   a.queue.push(arguments);},a.version='1',a.queue=[],t=n.createElement(u),
   t.async=!0,t.src='//static.ads-twitter.com/uwt.js',s=n.getElementsByTagName(u)[0],
   s.parentNode.insertBefore(t,s))}(window,document,'script');
   // Insert Twitter Pixel ID and Standard Event data below
   twq('init','abcdef');
   twq('track','PageView');
   </script>
   <!-- End Twitter universal website tag code -->
   {% endcodeblock %}

   maps to the following theme configuration:

   {% codeblock _config.icarus.yml lang:yaml %}
   plugins:
      twitter_conversion_tracking:
         pixel_id: abcdef
   {% endcodeblock %}


## Umami

**Installation Guide**

1. Add your site to [Umami](https://umami.is/), either on Umami Cloud or on your own Umami server.

2. Find the tracking code of your site in Umami.
   Copy the value of `data-website-id` to `plugins` > `umami` > `website_id` in the theme configurations.
   This setting is required.
   If you host Umami yourself, also copy the `src` of the script to `plugins` > `umami` > `script_url`.

   For example, the following Umami tracking code:

   {% codeblock "Umami tracking code" lang:html %}
   <script defer src="https://umami.example.com/script.js" data-website-id="12345678-abcd-1234-abcd-123456789abc"></script>
   {% endcodeblock %}

   maps to the following theme configuration:

   {% codeblock _config.icarus.yml lang:yaml %}
   plugins:
       umami:
           # ID of your site in Umami
           website_id: 12345678-abcd-1234-abcd-123456789abc
           # Optional. URL of the Umami tracker script. Defaults to https://cloud.umami.is/script.js (Umami Cloud).
           script_url: https://umami.example.com/script.js
           # Optional. Only track the visits on these comma-separated domains, e.g., example.com,www.example.com
           domains:
   {% endcodeblock %}

   Umami also tracks the pages that visitors switch to with
   <a href="{% post_path en/Other-Plugins %}#PJAX">PJAX</a>.


## Waline Page View Counter

**Installation Guide**

Waline can [count the views of each page](https://waline.js.org/en/guide/features/pageview.html) as well as
host comments.
The counter uses the same Waline client as the comments.
To count page views with Waline and display the number of views on the header of each post, set
`plugins` > `waline_pageview` to `true` in the theme configurations.
The counter then uses the `server_url` of the
<a href="{% post_path en/Comment-Plugins %}#Waline">Waline comment plugin</a>, which requires `comment` > `type` to be
`waline`:

{% codeblock _config.icarus.yml lang:yaml %}
plugins:
    waline_pageview: true
{% endcodeblock %}

If you use another comment plugin, or want to count page views with a different Waline server, set the URL of your
Waline server in `plugins` > `waline_pageview` > `server_url` instead:

{% codeblock _config.icarus.yml lang:yaml %}
plugins:
    waline_pageview:
        server_url: https://your-domain.vercel.app
{% endcodeblock %}

Some notes on this plugin:

- Do not also turn on the `pageview` setting of the Waline comment plugin, or each page view is counted twice.
  Icarus prints a warning when you generate your site with both of them on.
- If neither `server_url` is set, the counter is not shown, and Icarus prints a warning when you generate your site.
- Pages are counted by the path of their URLs, and the pages that visitors switch to with
  <a href="{% post_path en/Other-Plugins %}#PJAX">PJAX</a> are counted too.


<article class="message message-immersive is-warning">
<div class="message-body">
<i class="fas fa-question-circle mr-2"></i>Something wrong with this article? 
Click <a href="https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/en/Web-Analytics-Plugins.md">here</a> 
to submit your revision.
</div>
</article>
