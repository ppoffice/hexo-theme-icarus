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

<div class="notification is-success is-size-6">
This article is also available in: <a href="{% post_path zh-CN/Share-Buttons %}">简体中文</a>.
</div>

This article covers some share buttons supported by Icarus 3.

<!-- more -->


<div class="notification is-link is-size-6">

The share button feature of Icarus is provided by
[ppoffice/hexo-component-inferno](https://github.com/ppoffice/hexo-component-inferno).
Please refer to it for a complete list of supported buttons and their configurations.

</div>


## AddThis

<div class="notification is-warning is-size-6">
This share button service may be blocked by some ad blocking browser extensions.
Please use with caution.
</div>

<div>
<strong>Installation Guide</strong>
<a class="tag is-success" style="margin-left:.8em" href="{% post_path demo/share/AddThis %}">Preview</a>
</div>

1. Register for [AddThis](https://www.addthis.com/). Select the "Share Buttons" on the "Select a Tool" page 
   during your first registration.

2. Select the style and buttons on the "Select a Tool Type" page and click "Continue".

3. Make further style and behavior customizations on the next page and click "Activate Tool" button when you
   finish.

4. Find the HTML code from the get the code page, copy the URL in the `src` attribute and fill it into the 
   corresponding theme configuration option. For example, the URL in the following AddThis code

    {% codeblock "AddThis Code" lang:html %}
    <!-- Go to www.addthis.com/dashboard to customize your tools -->
    <script type="text/javascript" src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-xxxxxxxxxxxxx"></script>
    {% endcodeblock %}

    is copied to this theme configuration

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    share:
        type: addthis
        install_url: //s7.addthis.com/js/300/addthis_widget.js#pubid=ra-xxxxxxxxxxxxx
    {% endcodeblock %}


## AddToAny

<div>
<strong>Installation Guide</strong>
<a class="tag is-success" style="margin-left:.8em" href="{% post_path demo/share/AddToAny %}">Preview</a>
</div>

1. You can activate AddToAny without registering an user account

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    share:
        type: addtoany
    {% endcodeblock %}

2. (Optional) If you want to further customize the share buttons, please visit [AddToAny](https://www.addtoany.com/)
   official site and click on the "Get the Share Button" button.
   Then, select "Any Website" and complete the configuration of the buttons.
   Click "Get Button Code" after you finish.
   For example, this is the default code you can get from AddToAny:

    {% codeblock "AddToAny Code" lang:html %}
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

    Since the share buttons of this Hexo theme is provided by 
    [ppoffice/hexo-component-inferno](https://github.com/ppoffice/hexo-component-inferno),
    You will need to copy the view files in it to the corresponding directory under this theme if you wish to
    do the customizations. For example, we shall copy 
    [src/view/share/addtoany.jsx](https://github.com/ppoffice/hexo-component-inferno/blob/0.2.2/src/view/share/addtoany.jsx)
    to `themes/icarus/layout/share/` before we modify the file.
    Then, we need to correct the `require` path in the file and replace old HTML code in that file with the HTML 
    from above.

    {% codeblock themes/icarus/layout/share/addtoany.jsx lang:diff %}
    const { Component, Fragment } = require('inferno');
    - const { cacheComponent } = require('../../util/cache');
    + const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');

    ...Some code is skipped here...

    class AddToAny extends Component {
        render() {
            return <Fragment>
    -            <div class="a2a_kit a2a_kit_size_32 a2a_default_style">
    -                <a class="a2a_dd" href="https://www.addtoany.com/share"></a>
    -                <a class="a2a_button_facebook"></a>
    -                <a class="a2a_button_twitter"></a>
    -                <a class="a2a_button_telegram"></a>
    -                <a class="a2a_button_whatsapp"></a>
    -                <a class="a2a_button_reddit"></a>
    -            </div>
    +           AddToAny HTML code you just got
                <script src="https://static.addtoany.com/menu/page.js" defer={true}></script>
            </Fragment>;
        }
    }

    ...The following code is skipped here...
    {% endcodeblock %}


## Baidu Share

<div class="notification is-warning is-size-6">
This share button service may be blocked by some ad blocking browser extensions.
Please use with caution.
</div>

<div class="notification is-warning is-size-6">
The Baidu share button service seems to be no longer maintained.
Please use to other services as alternatives.
</div>

<div>
<strong>Installation Guide</strong>
<a class="tag is-success" style="margin-left:.8em" href="{% post_path demo/share/BaiduShare %}">Preview</a>
</div>

1. You can activate Baidu Share without registering an user account

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    share:
        type: bdshare
    {% endcodeblock %}


## Share.js

<div class="notification is-warning is-size-6">
The Share.js button service is no longer maintained.
Please use to other services as alternatives.
</div>

<div>
<strong>Installation Guide</strong>
<a class="tag is-success" style="margin-left:.8em" href="{% post_path demo/share/Sharejs %}">Preview</a>
</div>

1. You can activate Share.js without registering an user account

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    share:
        type: sharejs
    {% endcodeblock %}

2. (Optional) Please refer to the second step in [AddToAny](#AddToAny) installation guide and the 
   [share.js homepage](https://github.com/overtrue/share.js) for information about customizing the share
   buttons.


## ShareThis

<div>
<strong>Installation Guide</strong>
<a class="tag is-success" style="margin-left:.8em" href="{% post_path demo/share/ShareThis %}">Preview</a>
</div>

1. Visit [ShareThis](https://sharethis.com/) and click "Start with Share Buttons" button on the page.

2. Select the type of buttons you need on the "Choose type of sharing button" page.
   You can also make advanced adjustments by clicking the "Customize your share buttons" link.
   Click "Next" when you are done.

3. Select "HTML" and the "Next" button on the "Register and get the code!" page.
   Enter your email and password to finish the registration for ShareThis.

4. Finally, copy the `src` URL from the HTML code fragment on the page and put it to the corresponding
   theme configuration option. For example, the URL from the following ShareThis code

    {% codeblock "AddThis Code" lang:html %}
    <script type="text/javascript" src="https://platform-api.sharethis.com/js/sharethis.js#property=xxxxxxxxxxxxx&product=inline-share-buttons" async="async"></script>
    {% endcodeblock %}

    is copied to this theme configuration

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    share:
        type: sharethis
        install_url: https://platform-api.sharethis.com/js/sharethis.js#property=xxxxxxxxxxxxx&product=inline-share-buttons
    {% endcodeblock %}


<div class="notification is-warning is-size-6">
Something wrong with this article? Click <a href="https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/en/Share-Buttons.md">here</a> to submit your revision.
</div>
