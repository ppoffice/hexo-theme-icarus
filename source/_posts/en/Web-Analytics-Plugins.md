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

This article covers web analytics plugins supported by Icarus 3.

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

1. Set the `plugins` > `busuanzi` to `true` to enable [BuSuanZi web counter](https://busuanzi.ibruce.info/) 
   and display the number of visitors on the header of each blog post and the bottom of the page.

    {% codeblock _config.icarus.yml lang:yaml %}
    plugins:
        busuanzi: true
    {% endcodeblock %}


## CNZZ Statistics

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

1. Log into [Google Analytics](https://analytics.google.com/) and click the "Admin" on the left side of the user dashboard.

2. On the admin page, click the "Create Property" button and set "What do you want to measure?" to "Web".
   Click the "Continue" button after that.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/google-analytics-create-property.png 360 '"Create Property - Google Analytics" "Create Property - Google Analytics"' %}
   <br>

3. Then, fill in the Website Name, Website URL, Industry Category, and Reporting Time Zone.
   Click the "Create" button to finish the property creation.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/google-analytics-property-setup.png 360 '"Property Setup - Google Analytics" "Property Setup - Google Analytics"' %}
   <br>

3. Find the value of "Tracking ID", e.g., "UA-12345678-0", on the "Tracking Code" page. 
   Set it to the `plugins` > 
   `google_analytics` > `tracking_id` in the theme configurations to enable the Google Analytics plugin.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/google-analytics-get-code.png 360 '"Get Code - Google Analytics" "Get Code - Google Analytics"' %}
   <br>

    {% codeblock _config.icarus.yml lang:yaml %}
    plugins:
        google_analytics:
            tracking_id: UA-12345678-0
    {% endcodeblock %}


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


## Twitter Conversion Tracking

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


<article class="message message-immersive is-warning">
<div class="message-body">
<i class="fas fa-question-circle mr-2"></i>Something wrong with this article? 
Click <a href="https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/en/Web-Analytics-Plugins.md">here</a> 
to submit your revision.
</div>
</article>
