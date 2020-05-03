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
    install_url: //s7.addthis.com/js/300/addthis_widget.js#pubid=ra-5e8fc96750876c7d
---

This article covers share buttons supported by Icarus 3.

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


## AddThis

<article class="message message-immersive is-danger">
<div class="message-body">
<i class="fas fa-exclamation-triangle mr-2"></i>Some AD blockers may block this share button service.
Use it with caution.
</div>
</article>

<div>
<strong>Installation Guide</strong><a class="tag is-success ml-2" href="{% post_path demo/share/AddThis %}">Preview</a>
</div>

1. Register for [AddThis](https://www.addthis.com/). 
   Select the "Share Buttons" on the "Select a Tool" page after submitting the registration form.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/addthis-select-tool.png 360 '"Select Tool - AddThis" "Select Tool - AddThis"' %}
   <br>

2. Select the style and buttons on the "Select a Tool Type" page and click "Continue".

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/addthis-select-tool-type.png 360 '"Select Tool Type - AddThis" "Select Tool Type - AddThis"' %}
   <br>

3. Make further customizations on the next page and click the "Activate Tool" button when finished.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/addthis-customize-share.png 360 '"Customize Share Buttons - AddThis" "Customize Share Buttons - AddThis"' %}
   <br>

4. Find the HTML code from the "Get The Code" page, copy the URL in the `src` attribute to the share button configuration. 

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/addthis-get-code.png 360 '"Get Code - AddThis" "Get Code - AddThis"' %}
   <br>
   
   For example, the URL in the following AddThis code:

    {% codeblock "AddThis Code" lang:html %}
    <!-- Go to www.addthis.com/dashboard to customize your tools -->
    <script type="text/javascript" src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-xxxxxxxxxxxxx"></script>
    {% endcodeblock %}

    maps to the following theme configuration:

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    share:
        type: addthis
        install_url: //s7.addthis.com/js/300/addthis_widget.js#pubid=ra-xxxxxxxxxxxxx
    {% endcodeblock %}


## AddToAny

<div>
<strong>Installation Guide</strong><a class="tag is-success ml-2" href="{% post_path demo/share/AddToAny %}">Preview</a>
</div>

1. You can activate AddToAny without user registration.
   Just put the following code to your theme configurations:

    {% codeblock themes/icarus/_config.yml lang:yaml %}
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

4. Since the share buttons of Icarus is provided by 
   [ppoffice/hexo-component-inferno](https://github.com/ppoffice/hexo-component-inferno),
   You need to copy the layout file 
   ([src/view/share/addtoany.jsx](https://github.com/ppoffice/hexo-component-inferno/blob/0.2.2/src/view/share/addtoany.jsx)) 
   of AddToAny from this repository
   to `themes/icarus/layout/share/addtoany.jsx`.
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

    You should make the following changes to `addtoany.jsx`:

    {% codeblock themes/icarus/layout/share/addtoany.jsx lang:diff >folded %}
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
<i class="fas fa-exclamation-triangle mr-2"></i>Some AD blockers may block this share button service.
Use it with caution.
</div>
</article>

<article class="message message-immersive is-danger">
<div class="message-body">
<i class="fas fa-exclamation-triangle mr-2"></i>The Baidu share button service seems to be no longer maintained.
Use other services as alternatives.
</div>
</article>

<div>
<strong>Installation Guide</strong><a class="tag is-success ml-2" href="{% post_path demo/share/BaiduShare %}">Preview</a>
</div>

1. You can activate Baidu Share without user registration.
   Just put the following code to your theme configurations:

    {% codeblock themes/icarus/_config.yml lang:yaml %}
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

    {% codeblock themes/icarus/_config.yml lang:yaml %}
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

2. Select "HTML" on the "Choose your CMS platform" page and click "Next".

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/sharethis-choose-platform.png 360 '"Choose Platform - ShareThis" "Choose Platform - ShareThis"' %}
   <br>

3. Enter your email and password to finish the registration for ShareThis on the "Register and get the code!" page.

4. Finally, copy the `src` URL from the HTML code fragment to the share button configuration.
   
   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/sharethis-get-code.png 360 '"Get Code - ShareThis" "Get Code - ShareThis"' %}
   <br>
   
   For example, the following ShareThis code:

    {% codeblock "AddThis Code" lang:html %}
    <script type="text/javascript" src="https://platform-api.sharethis.com/js/sharethis.js#property=xxxxxxxxxxxxx&product=inline-share-buttons" async="async"></script>
    {% endcodeblock %}

    maps to the following theme configuration:

    {% codeblock themes/icarus/_config.yml lang:yaml %}
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
