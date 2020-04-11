title: Icarus User Guide - Search Plugin
date: 2017-01-31
categories:
- Plugins
- Search
tags:
- Icarus User Guide
language: en
toc: true
---

<div class="notification is-success is-size-6">
This article is also available in: <a href="{% post_path zh-CN/Search-Plugins %}">简体中文</a>.
</div>

This article covers some search plugins supported by Icarus 3.

<!-- more -->

<div class="notification is-link is-size-6">

The search plugins of Icarus is provided by
[ppoffice/hexo-component-inferno](https://github.com/ppoffice/hexo-component-inferno).
Please refer to it for a complete list of supported buttons and their configurations.

</div>

## Algolia

<div>
<strong>Installation Guide</strong>
<a class="tag is-success" style="margin-left:.8em" href="{% post_path demo/search/Algolia %}">Preview</a>
</div>

1. Install the [hexo-algolia](https://github.com/oncletom/hexo-algolia) plugin under the root directory of your
   Hexo site.

2. Register and log into [Algolia](https://www.algolia.com/).
   Click "Create Index" button on the dashboard when you log in for the first time.
   Then, enter the name of Index (Index name) and click the "Create" button to complete index creation.

3. Next, click "API Keys" on the left navigation bar, copy "Application ID" and "Search-Only API Key" on the page.
   Open site configuration file `_config.yml` under the root directory of your Hexo site and fill in the above 
   information to the hexo-algolia plugin configurations.
   For example, the following Aloglia index information

    {% codeblock "Algolia Index Information" %}
    Algolia Index Name: My-Hexo-Site
    Application ID: ABCDEFGHIJKL
    Search-Only API Key: 7b08fca7d42412cee901a25643124221
    {% endcodeblock %}

    can be mapped to the following plugin configuration

    {% codeblock _config.yml lang:yaml %}
    algolia:
        applicationID: My-Hexo-Site
        indexName: ABCDEFGHIJKL
        apiKey: 7b08fca7d42412cee901a25643124221
    {% endcodeblock %}

4. Go back to the "API Keys" page from the Algolia dashboard and switch to the "All API Keys" tab.
   Click the "New API Key" button.
   On the popup "Create API Key" dialog, select the index your created in the last step in "Indices" select box.
   Then, type the domain name of your site to the "HTTP Referers" field and add `addObject`, `deleteObject`, 
   `listIndexes`, `deleteIndex` to the "ACL" field.
   Click the "Create" button to finish key creation.
   Copy the API key you just created, e.g., `727fbd8c998fe419318fa350db6793ca`.

5. Open a Windows Command Prompt (CMD) or Linux/macOS terminal and change the working directory to the root
   directory of your Hexo site.
   Set the environment variable used by the hexo-algolia plugin when upload the indices to Algolia to the 
   API key you created in the last step.
   
   On Windows

    {% codeblock "Windows Command Prompt (CMD)" lang:cmd %}
    C:\Users\you> cd path/to/your/hexo/site
    C:\Users\you> set HEXO_ALGOLIA_INDEXING_KEY="727fbd8c998fe419318fa350db6793ca"
    {% endcodeblock %}

   On Linux/macOS

    {% codeblock "Linux/macOS Terminal" lang:shell %}
    $ cd path/to/your/hexo/site
    $ export HEXO_ALGOLIA_INDEXING_KEY="727fbd8c998fe419318fa350db6793ca"
    {% endcodeblock %}

    Then, run the following commands to clean up your site and upload indices to Algolia

    {% codeblock "Windows Command Prompt or Linux/macOS Terminal" lang:shell %}
    $ hexo clean
    $ hexo algolia
    {% endcodeblock %}

6. Finally, open theme configuration file and set the search engine to Algolia

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    search:
        type: algolia
    {% endcodeblock %}


## Baidu Search

**Installation Guide**

1. Open theme configuration file and set the set the search engine to Baidu

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    search:
        type: baidu
    {% endcodeblock %}


## Google Custom Search Engine (CSE)

<div>
<strong>Installation Guide</strong>
<a class="tag is-success" style="margin-left:.8em" href="{% post_path demo/search/Google-CSE %}">Preview</a>
</div>

1. Log into your Google account and visit [Google CSE](https://cse.google.com/cse/create/new) to create a CSE.
   Type in the domain name of your site in the "Sites to Search" field, select correct language from the "Language"
   select box, and fill in the "Name of the search engine". Click the "Create" button to finish engine creation.

2. Then, click the "Get code" button on the right side of "Add it to your site". Copy the value of `cx` to the 
   search settings in your theme's configuration file.
   For example, the following HTML code

    {% codeblock "Google CSE HTML code" lang:html %}
    <script async src="https://cse.google.com/cse.js?cx=012345601234560123456:abcdefghijklmn"></script>
    <div class="gcse-search"></div>
    {% endcodeblock %}

    can be mapped to the following theme configuration

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    search:
        type: google_cse
        cx: 012345601234560123456:abcdefghijklmn
    {% endcodeblock %}


## Insight

**Installation Guide**

1. Insight is the default search engine of this site.
   You can enable it using the following theme configuration

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    search:
        type: insight
    {% endcodeblock %}


<div class="notification is-warning is-size-6">
Something wrong with this article? Click <a href="https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/en/Search-Plugins.md">here</a> to submit your revision.
</div>
