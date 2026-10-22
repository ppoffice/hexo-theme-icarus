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

This article covers search plugin configurations supported by Icarus.

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-globe-asia mr-2"></i>This article is also available in 
<a href="{% post_path zh-CN/Search-Plugins %}">简体中文</a>.
</div>
</article>

<!-- more -->

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-info-circle mr-2"></i>The following search plugins are provided by
<a href="https://github.com/ppoffice/hexo-component-inferno">ppoffice/hexo-component-inferno</a>.
Please refer to it for a complete list of supported plugins and their configuration details.
</div>
</article>

Visitors open the search box by clicking the search button on the navigation bar.
Except for Baidu Search, the search box can also be opened with the keyboard and closed with <kbd>Esc</kbd>.
See [Keyboard Shortcuts](#Keyboard-Shortcuts) for details.

## Algolia

<div>
<strong>Installation Guide</strong><a class="tag is-success ml-2" href="{% post_path demo/search/Algolia %}">Preview</a>
</div>

1. Install the [hexo-algolia](https://github.com/oncletom/hexo-algolia) plugin under the root directory of your
   Hexo site.

2. Register and log into [Algolia](https://www.algolia.com/).
   Click the "Create Index" button on the dashboard when you log in for the first time.
   Then, enter the name of the index and click the "Create" button to complete index creation.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/algolia-create-index.png 360 '"Create Index - Algolia" "Create Index - Algolia"' %}
   <br>

3. Next, click "API Keys" on the left navigation bar, copy "Application ID" and "Search-Only API Key" on the page.
   Open site configuration file `_config.yml` under the root directory of your Hexo site and fill in the above 
   information to the hexo-algolia plugin configurations.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/algolia-api-keys.png 360 '"API Keys - Algolia" "API Keys - Algolia"' %}
   <br>

   For example, the following Algolia index information:

    {% codeblock "Algolia Index Information" %}
    Algolia Index Name: My-Hexo-Site
    Application ID: ABCDEFGHIJKL
    Search-Only API Key: 7b08fca7d42412cee901a25643124221
    {% endcodeblock %}

    maps to the following plugin configuration:

    {% codeblock _config.yml lang:yaml %}
    algolia:
        applicationID: ABCDEFGHIJKL
        indexName: My-Hexo-Site
        apiKey: 7b08fca7d42412cee901a25643124221
    {% endcodeblock %}

4. Go back to the "API Keys" page from the Algolia dashboard and switch to the "All API Keys" tab.
   Click the "New API Key" button.
   On the popup "Create API Key" dialog, select the index you created in step 2 in the "Indices" select box.
   Then, add `addObject`, `deleteObject`, `listIndexes`, `deleteIndex` to the "ACL" field.
   Click the "Create" button to finish key creation.
   Copy the API key you just created, e.g., `727fbd8c998fe419318fa350db6793ca`.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/algolia-create-api-key.png 360 '"Create API Key - Algolia" "Create API Key - Algolia"' %}
   <br>

5. Open a Windows Command Prompt (CMD) or Linux/macOS terminal and change the working directory to the root
   directory of your Hexo site.
   Set the `HEXO_ALGOLIA_INDEXING_KEY` environment variable to the API key you created in the last step.
   This variable is used by hexo-algolia when uploading indices to Algolia.
   
   On Windows:

    {% codeblock "Windows Command Prompt (CMD)" lang:cmd %}
    C:\Users\you> cd path/to/your/hexo/site
    C:\Users\you> set HEXO_ALGOLIA_INDEXING_KEY=727fbd8c998fe419318fa350db6793ca
    {% endcodeblock %}

   On Linux/macOS:

    {% codeblock "Linux/macOS Terminal" lang:shell %}
    $ cd path/to/your/hexo/site
    $ export HEXO_ALGOLIA_INDEXING_KEY="727fbd8c998fe419318fa350db6793ca"
    {% endcodeblock %}

    Then, run the following commands to clean up your site and upload indices to Algolia:

    {% codeblock "Windows Command Prompt or Linux/macOS Terminal" lang:shell %}
    $ hexo clean
    $ hexo algolia
    {% endcodeblock %}

6. Finally, set the search engine to Algolia in your theme configurations:

    {% codeblock _config.icarus.yml lang:yaml %}
    search:
        type: algolia
        excerpt: excerpt        # Optional. Defaults to `excerpt`
    {% endcodeblock %}

    `excerpt` is the name of the attribute of your Algolia records that is shown as the preview text of each
    search result.
    Set it if your records keep the text of the posts in another attribute.
    The search results show the title and the preview text as plain text with the matched words highlighted:
    since hexo-component-inferno 4.2.0, HTML tags in the preview text are removed, and other HTML in the records
    is escaped instead of being rendered.


## Baidu Search

**Installation Guide**

1. Open theme configuration file and set search engine to Baidu:

    {% codeblock _config.icarus.yml lang:yaml %}
    search:
        type: baidu
    {% endcodeblock %}

    Baidu Search sends visitors to the Baidu website to search your site, which is limited to the domain in the
    `url` setting of your site configuration file `_config.yml`.
    Make sure `url` is the address of your site.
    The search box of Baidu Search has no keyboard shortcuts.


## Google Custom Search Engine (CSE)

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-info-circle mr-2"></i>Google now seems to call this service Programmable Search Engine, so its
pages may look different from the screenshots below.
</div>
</article>

<div>
<strong>Installation Guide</strong><a class="tag is-success ml-2" href="{% post_path demo/search/Google-CSE %}">Preview</a>
</div>

1. Log into your Google account and visit [Google CSE](https://cse.google.com/cse/create/new) to create a CSE.
   Type in the URL of your site (without `http://` or `https://`) in the "Sites to Search" field.
   Select the correct language from the "Language" select box.
   Then, fill in the "Name of the search engine". 
   Click the "Create" button to finish engine creation.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/google-cse-create.png 360 '"Create Custom Search - Google CSE" "Create Custom Search - Google CSE"' %}
   <br>

2. Then, click the "Get code" button on the right side of "Add it to your site". Copy the value of `cx` to the 
   search settings in your theme's configurations.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/google-cse-code.png 360 '"Get Code - Google CSE" "Get Code - Google CSE"' %}
   <br>

   For example, the following HTML code:

    {% codeblock "Google CSE HTML code" lang:html %}
    <script async src="https://cse.google.com/cse.js?cx=012345601234560123456:abcdefghijklmn"></script>
    <div class="gcse-search"></div>
    {% endcodeblock %}

    maps to the following theme configuration:

    {% codeblock _config.icarus.yml lang:yaml %}
    search:
        type: google_cse
        cx: 012345601234560123456:abcdefghijklmn
    {% endcodeblock %}


## Insight

**Installation Guide**

1. Insight is the default search engine of this site.
   You can enable it using the following theme configuration:

    {% codeblock _config.icarus.yml lang:yaml %}
    search:
        type: insight
        index_pages: true       # Optional. Defaults to `true`. Set to `false` to exclude pages from search results.
    {% endcodeblock %}

2. Insight does not need any external service.
   When you generate your site, it saves the text of your posts, pages, categories, and tags to a `content.json`
   file, which the search box downloads and searches in the browser.
   Since hexo-component-inferno 4.2.0, the keywords are matched as plain text instead of regular expressions,
   and the search results are escaped and shown as plain text.
   You can also use <kbd>↑</kbd> and <kbd>↓</kbd> to select a search result and <kbd>Enter</kbd> to open it.


## Keyboard Shortcuts

Except for Baidu Search, all search plugins above support the following keyboard shortcuts:

- <kbd>/</kbd> opens the search box, unless you are typing in an input field, a text area, or other editable
  content.
- <kbd>Ctrl</kbd> + <kbd>K</kbd> (<kbd>⌘ Command</kbd> + <kbd>K</kbd> on macOS) opens the search box, even when you
  are typing.
- <kbd>Esc</kbd> closes the search box, and the focus returns to where it was before the search box opened.

Focusing the search button on the navigation bar, for example with <kbd>Tab</kbd>, does not open the search box.
Press <kbd>Enter</kbd> or <kbd>Space</kbd> on it, or click it, instead.
Moving the focus out of the open search box, for example with <kbd>Tab</kbd>, closes it.


<article class="message message-immersive is-warning">
<div class="message-body">
<i class="fas fa-question-circle mr-2"></i>Something wrong with this article? 
Click <a href="https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/en/Search-Plugins.md">here</a> 
to submit your revision.
</div>
</article>
