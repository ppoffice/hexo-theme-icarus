title: Icarus User Guide - Share Buttons
date: 2017-01-31
categories:
- Plugins
- Share
tags:
- Icarus User Guide
language: en
toc: true
share:
    type: sharethis
    install_url: //platform-api.sharethis.com/js/sharethis.js#property=5ab6f60ace89f00013641890&product=inline-share-buttons
---

This article covers share buttons supported by Icarus.

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-globe-asia mr-2"></i>This article is also available in 
<a href="{% post_path zh-CN/Share-Buttons %}">简体中文</a>.
</div>
</article>

<!-- more -->

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-info-circle mr-2"></i>The following share buttons are provided by
<a href="https://github.com/ppoffice/hexo-component-inferno">ppoffice/hexo-component-inferno</a>.
Please refer to it for a complete list of supported plugins and their configuration details.
</div>
</article>

<article class="message message-immersive is-warning">
<div class="message-body">
<i class="fas fa-exclamation-triangle mr-2"></i>AddThis shut down on May 31, 2023, and its share buttons
(<code>type: addthis</code>) are deprecated since hexo-component-inferno 4.2.0, so this guide no longer covers them.
If you still use them, please switch to <a href="#AddToAny">AddToAny</a> or <a href="#ShareThis">ShareThis</a>.
</div>
</article>


## AddToAny

<div>
<strong>Installation Guide</strong><a class="tag is-success ml-2" href="{% post_path demo/share/AddToAny %}">Preview</a>
</div>

1. You can activate AddToAny without user registration.
   Just put the following code to your theme configurations:

    {% codeblock _config.icarus.yml lang:yaml %}
    share:
        type: addtoany
    {% endcodeblock %}

Take the following steps if you want to customize the share buttons:

1. Visit [AddToAny](https://www.addtoany.com/)
   official site and click on the "Get the Share Button".

2. Then, select "Any Website" and complete the configuration of the buttons.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/addtoany-select-platform.png 360 '"Select Platform - AddToAny" "Select Platform - AddToAny"' %}
   <br>

3. Click "Get Button Code" after you finish.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/addtoany-get-code.png 360 '"Get Code - AddToAny" "Get Code - AddToAny"' %}
   <br>

4. Since the share buttons of Icarus are provided by 
   [ppoffice/hexo-component-inferno](https://github.com/ppoffice/hexo-component-inferno),
   you need to copy the layout file of AddToAny from the
   [src/view/share](https://github.com/ppoffice/hexo-component-inferno/tree/HEAD/src/view/share)
   directory of this repository to `<icarus_directory>/layout/share/addtoany.jsx`.
   Icarus uses a layout file in its `layout/` directory instead of the one in hexo-component-inferno with the same path.
   Then, replace the AddToAny code in `addtoany.jsx` and fix the package import in the file header.

   For example, assume the following code is what you get from the last step:

    {% codeblock "AddToAny Code" lang:html >folded %}
    <!-- AddToAny BEGIN -->
    <div class="a2a_kit a2a_kit_size_32 a2a_default_style">
    <a class="a2a_dd" href="https://www.addtoany.com/share"></a>
    <a class="a2a_button_facebook"></a>
    <a class="a2a_button_twitter"></a>
    <a class="a2a_button_email"></a>
    </div>
    <script async src="https://static.addtoany.com/menu/page.js"></script>
    <!-- AddToAny END -->
    {% endcodeblock %}

    then you should make the following changes to `addtoany.jsx`:

    {% codeblock &lt;icarus_directory&gt;/layout/share/addtoany.jsx lang:diff >folded %}
    const { Component, Fragment } = require('inferno');
    - const { cacheComponent } = require('../../util/cache');
    + const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');

    ...Some code is skipped here...

    class AddToAny extends Component {
        render() {
            return <Fragment>
    -           <div class="a2a_kit a2a_kit_size_32 a2a_default_style">
    -               <a class="a2a_dd" href="https://www.addtoany.com/share"></a>
    -               <a class="a2a_button_facebook"></a>
    -               <a class="a2a_button_twitter"></a>
    -               <a class="a2a_button_telegram"></a>
    -               <a class="a2a_button_whatsapp"></a>
    -               <a class="a2a_button_reddit"></a>
    -           </div>
    -           <script src="https://static.addtoany.com/menu/page.js" defer={true}></script>
    +           <!-- AddToAny HTML code you just got... -->
    +           <div class="a2a_kit a2a_kit_size_32 a2a_default_style">
    +               <a class="a2a_dd" href="https://www.addtoany.com/share"></a>
    +               <a class="a2a_button_facebook"></a>
    +               <a class="a2a_button_twitter"></a>
    +               <a class="a2a_button_email"></a>
    +           </div>
    +           <script async src="https://static.addtoany.com/menu/page.js"></script>
            </Fragment>;
        }
    }

    ...The following code is skipped here...
    {% endcodeblock %}


## Baidu Share

<article class="message message-immersive is-danger">
<div class="message-body">
<i class="fas fa-exclamation-triangle mr-2"></i>The Baidu share button service is discontinued and not recommended.
Its script is loaded from an <code>http://</code> address, which browsers block on pages served over HTTPS,
so the buttons do not show up on most sites.
Some ad blockers may also block it.
Please use <a href="#AddToAny">AddToAny</a> or <a href="#ShareThis">ShareThis</a> instead.
</div>
</article>

**Installation Guide**

1. Baidu Share does not need user registration.
   It is enabled with the following theme configuration:

    {% codeblock _config.icarus.yml lang:yaml %}
    share:
        type: bdshare
    {% endcodeblock %}


## Share.js

<article class="message message-immersive is-danger">
<div class="message-body">
<i class="fas fa-exclamation-triangle mr-2"></i>The Share.js button service is no longer maintained.
Use other services as alternatives.
</div>
</article>

<div>
<strong>Installation Guide</strong><a class="tag is-success ml-2" href="{% post_path demo/share/Sharejs %}">Preview</a>
</div>

1. You can activate Share.js without user registration.
   Just put the following code to your theme configurations:

    {% codeblock _config.icarus.yml lang:yaml %}
    share:
        type: sharejs
    {% endcodeblock %}

2. (Optional) Please refer to the customization steps in the [AddToAny](#AddToAny) section and the 
   [share.js homepage](https://github.com/overtrue/share.js) for information about customizing the share
   buttons.


## ShareThis

<div>
<strong>Installation Guide</strong><a class="tag is-success ml-2" href="{% post_path demo/share/ShareThis %}">Preview</a>
</div>

1. Visit [ShareThis](https://sharethis.com/) and click the "Start with Share Buttons" button on the page.

2. Select the type of buttons you need on the "Choose type of sharing button" page.
   Don't enable the "GDPR compliance tool" since it may cause issues.
   You can also make advanced adjustments by clicking the "Customize your share buttons" link.
   Click "Next" when you are done.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/sharethis-choose-button-type.png 360 '"Choose Button Type - ShareThis" "Choose Button Type - ShareThis"' %}
   <br>

3. Select "HTML" on the "Choose your CMS platform" page and click "Next".

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/sharethis-choose-platform.png 360 '"Choose Platform - ShareThis" "Choose Platform - ShareThis"' %}
   <br>

4. Enter your email and password to finish the registration for ShareThis on the "Register and get the code!" page.

5. Finally, copy the `src` URL from the HTML code fragment to the share button configuration.
   
   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/sharethis-get-code.png 360 '"Get Code - ShareThis" "Get Code - ShareThis"' %}
   <br>
   
   For example, the following ShareThis code:

    {% codeblock "ShareThis Code" lang:html %}
    <script type="text/javascript" src="https://platform-api.sharethis.com/js/sharethis.js#property=xxxxxxxxxxxxx&product=inline-share-buttons" async="async"></script>
    {% endcodeblock %}

    maps to the following theme configuration:

    {% codeblock _config.icarus.yml lang:yaml %}
    share:
        type: sharethis
        install_url: https://platform-api.sharethis.com/js/sharethis.js#property=xxxxxxxxxxxxx&product=inline-share-buttons
    {% endcodeblock %}


<article class="message message-immersive is-warning">
<div class="message-body">
<i class="fas fa-question-circle mr-2"></i>Something wrong with this article? 
Click <a href="https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/en/Share-Buttons.md">here</a> 
to submit your revision.
</div>
</article>
