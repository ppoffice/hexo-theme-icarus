title: Icarus User Guide - CDN Providers
date: 2017-01-31
categories:
- Configuration
tags:
- Icarus User Guide
language: en
toc: true
---

Choosing the right CDN providers can significantly reduce the page loading time of your viewers.
Icarus lets you pick among several built-in CDN provider options for serving third-party 
libraries and asset files used by Icarus.

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-globe-asia mr-2"></i>This article is also available in 
<a href="{% post_path zh-CN/CDN-Providers %}">简体中文</a>.
</div>
</article>

<!-- more -->

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-info-circle mr-2"></i>The following CDN functionalities are provided by
<a href="https://github.com/ppoffice/hexo-component-inferno">ppoffice/hexo-component-inferno</a>.
Please refer to it for a complete list of supported providers and their configuration details.
</div>
</article>

## Built-in CDN providers

Currently, Icarus offers the following built-in CDN providers:

- **CDNs for JavaScript Libraries**
    - cdnjs.com (`cdnjs`)
    - jsDelivr (`jsdelivr`)
    - UNPKG (`unpkg`)
    - loli.net (`loli`)
- **CDNs for Web Fonts**
    - Google Fonts (`google`)
    - loli.net (`loli`)
- **FontAwesome Font Icon CDNs**
    - FontAwesome 5 (`fontawesome`)
    - loli.net (`loli`)

The default CDN settings are:

{% codeblock _config.icarus.yml lang:yaml %}
providers:
    cdn: jsdelivr
    fontcdn: google
    iconcdn: fontawesome
{% endcodeblock %}

## Custom CDN providers

Additionally, you can also custom CDN providers via URL templates.
The template formats for each type of CDN provider are listed below:

### CDNs for JavaScript Libraries

{% codeblock "CDN URL Template" %}
https://some.cdn.domain.name/${package}/${version}/${filename}
{% endcodeblock %}

You need to replace the actual package name, version of the package, and relative file path with `${package}`, 
`${version}`, and `${filename}` placeholders.
For example, a JavaScript library with the following URL:

{% codeblock "UNPKG CDN URL Example" %}
https://unpkg.com/d3@5.7.0/dist/d3.min.js
{% endcodeblock %}

can be generalized to this:

{% codeblock "UNPKG CDN URL Template" %}
https://unpkg.com/${package}@${version}/${filename}
{% endcodeblock %}

Some CDN providers may adopt different URL schemes.
For example, the `moment.js` library has the URL like this on CDN.js:

{% codeblock "CDN.js CDN URL Example" %}
https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.js
{% endcodeblock %}

while has the following URL on UNPKG:

{% codeblock "UNPKG CDN URL Example" %}
https://unpkg.com/moment@2.22.2/min/moment.min.js
{% endcodeblock %}

Therefore, you should be aware of the URL format of your custom CDN provider.
By default, Icarus will try to pass in the parameter using npm package name and relative file path 
(e.g., `moment@2.22.2/min/moment.min.js`). 
This npm scheme is used by jsDelivr and UNPKG. 
Otherwise, if you are using a CDN.js like provider, please prepend `[cdnjs]` to its URL template:

{% codeblock "CDN.js-style URL Template" %}
[cdnjs]https://some.cdn.domain.name/${package}/${version}/${filename}
{% endcodeblock %}

### CDNs for Web Fonts

You can pass in the URL of a Google Font mirror or compatible webfont CDN. 
Icarus depends on the `Ubuntu`, `Oxanium`, and `Source Code Pro` fonts, so make sure your CDN provides those. 
The URL template should have two placeholders for font `type` (`icon` or `font`) and `fontname`:

{% codeblock "Webfont CDN URL Template" %}
https://some.google.font.mirror/${type}?family=${fontname}
{% endcodeblock %}

### FontAwesome Font Icon CDNs

You can pass in the URL to a custom FontAwesome CDN.
No placeholders are required.
The provided custom CDN should at lease have FontAwesome 5 icons as some of them are used in this theme.

{% codeblock "Icon Font CDN URL Template" %}
https://custom.fontawesome.mirror/some.stylesheet.css
{% endcodeblock %}

All of the above should be put in the `providers` section of the theme configurations:

{% codeblock _config.icarus.yml lang:yaml %}
providers:
    cdn: 'https://some.cdn.domain.name/${package}/${version}/${filename}'
    fontcdn: 'https://some.google.font.mirror/${type}?family=${fontname}'
    iconcdn: 'https://custom.fontawesome.mirror/some.stylesheet.css'
{% endcodeblock %}

## CDN helper functions

Three helper functions have been defined to help developers include third-party libraries easily with custom 
CDN support.
You can check them out at [ppoffice/hexo-component-inferno](https://github.com/ppoffice/hexo-component-inferno/blob/0.2.3/src/hexo/helper/cdn.js).


<article class="message message-immersive is-warning">
<div class="message-body">
<i class="fas fa-question-circle mr-2"></i>Something wrong with this article? 
Click <a href="https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/en/CDN-Providers.md">here</a> 
to submit your revision.
</div>
</article>
