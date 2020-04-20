title: Icarus User Guide - Configuring the Theme
date: 2020-03-01
thumbnail: /gallery/thumbnails/vector_landscape_2.svg
categories:
- Configuration
tags:
- Getting Started
- Icarus User Guide
language: en
toc: true
---

Icarus' default theme configuration file `_config.yml` resides in the `themes/icarus` directory.
It defines the global layout and style settings of the theme as well as external features such as comment 
plugins and widgets.
In this post, we will be covering settings that relate to the styling and overall layout of your site.
We will be covering the mechanisms used by Icarus to configure your site and going through the format and meaning of some configuration
settings.

<!-- more -->

<div class="notification is-success is-size-6">
This article is also available in: <a href="{% post_path zh-CN/Configuring-Theme %}">简体中文</a>.
</div>

## Generate and Validate the Configuration

An Icarus theme configuration file is written in [the `YAML` language](https://yaml.org/), and the default configuration file 
`themes/icarus/_config.yml` is generated automatically from a set of [JSON schemas](https://json-schema.org/) when the theme is processed by Hexo and you don't have
a theme configuration file available at that time.
That's why you don't see an example file (`_config.yml.example`) under your theme directory and there's no
need to create `_config.yml` yourself.
Most of the JSON schema definitions sit in the `themes/icarus/include/schema` directory and the others are
in the [ppoffice/hexo-component-inferno](https://github.com/ppoffice/hexo-component-inferno) repository.
You may attach the `--icarus-dont-generate-config` flag to your `hexo` commands to prevent configuration
generation.

The theme will also validate your configurations using these schemas every time you execute a `hexo` command
in your site directory.
If anything goes wrong during the validation, Icarus will print out the exact location of the misconfiguration
and it's error type. For example, the following messages tell us that the value of `logo` setting should be
either a string or an object, instead of an integer.
You could ignore the warnings or append the `--icarus-dont-check-config` flag to your `hexo` commands to skip
the validation, but it is not recommended to do so.

{% codeblock "hexo log" %}
INFO  === Checking package dependencies ===
INFO  === Checking the configuration file ===
WARN  Configuration file failed one or more checks.
WARN  Icarus may still run, but you will encounter unexcepted results.
WARN  Here is some information for you to correct the configuration file.
WARN  [
  {
    keyword: 'type',
    dataPath: '.logo',
    schemaPath: '#/properties/logo/type',
    params: { type: 'string,object' },
    message: 'should be string,object'
  }
]
{% endcodeblock %}

Additionally, Icarus will try to use the migration scripts to upgrade your configuration to the newest version.
These scripts are in the `themes/icarus/include/migration` directory.
You may disable the upgrade by append the `--icarus-dont-upgrade-config` flag to your `hexo` commands.
Finally, Icarus will also check the Node.js package dependencies and remind you to install them if you haven't.

## Additional Configuration Files and Priority

Apart from the default theme configuration file at `themes/icarus/_config.yml`, Icarus also look at configurations
from the following sources:

- `themes/icarus/_config.post.yml` and `themes/icarus/_config.page.yml`
- Post/page's [front-matter](https://hexo.io/docs/front-matter.html)
- Site `_config.yml` in the root directory

`_config.post.yml` and `_config.page.yml` follows the same format and definitions of the default theme configuration 
file.
You may put post-specific configurations in `_config.post.yml`, and these configurations will override the default
theme configurations.
For example, you can apply a two-column layout for all posts by moving all widgets to the left side of the page while keeping a three-column layout in other pages:

{% codeblock themes/icarus/_config.yml lang:yaml %}
widgets:
    -
        type: recent_posts
        position: left
    -
        type: categories
        position: right
    -
        type: tags
        position: right
{% endcodeblock %}

{% codeblock themes/icarus/_config.post.yml lang:yaml %}
widgets:
    -
        type: recent_posts
        position: left
    -
        type: categories
        position: left
    -
        type: tags
        position: left
{% endcodeblock %}

Similarly, `_config.page.yml` overrides the default theme configurations and only applies to all Hexo pages.
Additionally, if you wish to override theme configurations for a certain post/page, you can put them in the 
front-matter of that post/page.
For example, if you can change the highlight.js theme of the code blocks by adding the setting in the post's
front-matter like this:

{% codeblock source/_post/some-post.md lang:yaml %}
title: My first post
date: '2015-01-01 00:00:01'
article:
    highlight:
        theme: atom-one-dark
---
# Some Post
{% endcodeblock %}

The above setting in the front-matter will always override the same setting in the `_config.post.yml` and
`_config.yml`.
This feature can be very useful for displaying customized/optimized pages to a specific audience.
For example, you can enable faster CDNs or a localized comment service based on the country and language of the 
page viewers.
However, it should be noted that the post or page attributes defined by Hexo in the front-matter will not 
override the theme configuration files. Examples are:

- `title`
- `date`
- `updated`
- `comments` (not `comment`)
- `layout`
- `source`
- `photos`
- `excerpt`

Finally, the site configuration file `_config.yml` in the root directory will be override by all other 
configuration files for the settings used by the theme.
For instance, `title` in the `themes/icarus/_config.yml` will override `title` in the `_config.yml`, but
`new_post_name` will not since it is not used by Icarus.

In conclusion, the scopes of the configuration files and their priorities are

<table class="table is-bordered is-striped">
<tr>
<th>A certain post/page</th>
</tr>
<tr>
<td>
<ul class="mt-0 ml-4">
<li>front-matter overrides</li>
<li><code>themes/icarus/_config.post.yml</code> or <code>themes/icarus/_config.page.yml</code> overrides</li>
<li><code>themes/icarus/_config.yml</code> overrides</li>
<li><code>_config.yml</code></li>
</ul>
</td>
</tr>
<tr>
<th>All posts/pages</th>
</tr>
<tr>
<td>
<ul class="mt-0 ml-4">
<li><code>themes/icarus/_config.post.yml</code> or <code>themes/icarus/_config.page.yml</code> overrides</li>
<li><code>themes/icarus/_config.yml</code> overrides</li>
<li><code>_config.yml</code></li>
</ul>
</td>
</tr>
<tr>
<th>All HTML pages</th>
</tr>
<tr>
<td>
<ul class="mt-0 ml-4">
<li><code>themes/icarus/_config.yml</code> overrides</li>
<li><code>_config.yml</code></li>
</ul>
</td>
</tr>
<tr>
</table>


## Theme Configuration Walkthrough

### Configuration version

{% codeblock themes/icarus/_config.yml lang:yaml %}
version: 3.0.0
{% endcodeblock %}

This version code is related to and but not always the same as the theme version code.
It is used when Icarus upgrade the configuration file via migration scripts.
You should not change it by yourself.

### Theme variant

{% codeblock themes/icarus/_config.yml lang:yaml %}
variant: default
{% endcodeblock %}

Choose a skin for Icarus.
"default" and "cyberpunk" are supported currently.
You can take a look at the Cyberpunk variant {% post_link demo/Cyberpunk "here" %}.

### Logo

{% codeblock themes/icarus/_config.yml lang:yaml %}
logo: /img/logo.svg
{% endcodeblock %}

Set the logo of your site which will display on the navigation bar and the footer.
The value of the `logo` setting can either be a path/URL to your logo image, or it can be the following if
you want text instead of an image as the logo

{% codeblock themes/icarus/_config.yml lang:yaml %}
logo:
    text: My Beautiful Site
{% endcodeblock %}

### Favicon

{% codeblock themes/icarus/_config.yml lang:yaml %}
head:
    favicon: /img/favicon.svg
{% endcodeblock %}

You may specify the path or URL to your site's favicon in the `head` section.

### Open Graph

{% codeblock themes/icarus/_config.yml lang:yaml >folded %}
head:
    open_graph:
        # Page title (og:title) (optional)
        # You should leave this blank for most of the time
        title: 
        # Page type (og:type) (optional)
        # You should leave this blank for most of the time
        type: blog
        # Page URL (og:url) (optional)
        # You should leave this blank for most of the time
        url: 
        # Page cover (og:image) (optional)
        # You should leave this blank for most of the time
        image: 
        # Site name (og:site_name) (optional)
        # You should leave this blank for most of the time
        site_name: 
        # Page author (article:author) (optional)
        # You should leave this blank for most of the time
        author: 
        # Page description (og:description) (optional)
        # You should leave this blank for most of the time
        description: 
        # Twitter card type (twitter:card)
        twitter_card: 
        # Twitter ID (twitter:creator)
        twitter_id: 
        # Twitter Site (twitter:site)
        twitter_site: 
        # Google+ profile link (deprecated)
        google_plus: 
        # Facebook admin ID
        fb_admins: 
        # Facebook App ID
        fb_app_id: 
{% endcodeblock %}

You may set the Open Graph settings in the `head` section.
You should leave some of the settings blank in the theme configuration file and only set those settings 
in the front-matter of your post when needed.
Please refer to [Hexo documentation](https://hexo.io/docs/helpers.html#open-graph) for details of each setting.

### Google Structured Data

{% codeblock themes/icarus/_config.yml lang:yaml >folded %}
head:
    structured_data:
        # Page title (optional)
        # You should leave this blank for most of the time
        title: 
        # Page description (optional)
        # You should leave this blank for most of the time
        description: 
        # Page URL (optional)
        # You should leave this blank for most of the time
        url: 
        # Page author (article:author) (optional)
        # You should leave this blank for most of the time
        author: 
        # Page images (optional)
        # You should leave this blank for most of the time
        image: 
{% endcodeblock %}

You may set the Google Structured Data settings in the `head` section.
You should leave most of the settings blank in the theme configuration file and only set those settings 
in the front-matter of your post when needed.
Please refer to [Search for Developers](https://developers.google.com/search/docs/guides/intro-structured-data) for details of 
each setting.

### Page Metadata

{% codeblock themes/icarus/_config.yml lang:yaml %}
head:
    meta:
        - 'name=theme-color;content=#123456'
        - 'name=generator;content="Hexo 4.2.0"'
{% endcodeblock %}

You can add custom HTML `<meta>` tags to all pages in the `meta` setting of the `head` section.
Each meta tag should appear as an item of the `meta` array.
The fields of the tag should be in the `<field_name>=<field_value>` format and they are separated by `;`.

### RSS

{% codeblock themes/icarus/_config.yml lang:yaml %}
head:
    rss: /path/to/atom.xml
{% endcodeblock %}

You can add an RSS link in the page head via this setting.

### Navigation Bar

{% codeblock themes/icarus/_config.yml lang:yaml %}
navbar:
    # Naviagtion menu items
    menu:
        Home: /
        Archives: /archives
        Categories: /categories
        Tags: /tags
        About: /about
    # Links to be shown on the right of the navigation bar
    links:
        GitHub: 'https://github.com'
        Download on GitHub:
            icon: fab fa-github
            url: 'https://github.com/ppoffice/hexo-theme-icarus'
{% endcodeblock %}

The `navbar` section defines the links showing in the navigation bar.
You may add arbitrary links to the navigation menu by adding `<link_name>: <link_url>` to the `menu` setting.
If you wish to add links on the right side of the navigation bar, please add `<link_name>: <link_url>` to the `links` setting.
You can even use a FontAwesome icon instead of pure text as link with the following format:

{% codeblock "Link format" lang:yaml %}
<link_name>:
    icon: <fontawesome_icon_class_name>
    url: <link_url>
{% endcodeblock %}

### Footer

{% codeblock themes/icarus/_config.yml lang:yaml %}
footer:
    links:
        Creative Commons:
            icon: fab fa-creative-commons
            url: 'https://creativecommons.org/'
        Attribution 4.0 International:
            icon: fab fa-creative-commons-by
            url: 'https://creativecommons.org/licenses/by/4.0/'
        Download on GitHub:
            icon: fab fa-github
            url: 'https://github.com/ppoffice/hexo-theme-icarus'
{% endcodeblock %}

You may add arbitrary links to the page footer in the `links` setting of the `footer` section.
The format of the links is the same as `links` in the `navbar` section.

### Code Highlight

{% codeblock themes/icarus/_config.yml lang:yaml %}
article:
    highlight:
        # Code highlight themes
        # https://github.com/highlightjs/highlight.js/tree/master/src/styles
        theme: atom-one-light
        # Show copy code button
        clipboard: true
        # Default folding status of the code blocks. Can be "", "folded", "unfolded"
        fold: unfolded
{% endcodeblock %}

If you have already enabled code highlighting in Hexo, you may customize the code blocks with `highlight` settings in the `article`
section.
You can choose a theme from all themes listed in [highlight.js/src/styles](https://github.com/highlightjs/highlight.js/tree/9.18.1/src/styles)
and put the file name without the `.css` extension in the `theme` setting.
You may also turn the "copy" button on or off by setting `clipboard` to `true` or `false`.
Finally, if you wish to fold or unfold all code blocks, please set the `fold` setting to `folded` or `unfolded`.
The folding feature can also be disabled if you leave the `fold` setting empty.
Moreover, you can fold individual code blocks in the markdown file using the following syntax:


```
{% codeblock "optional file name" lang:code_language_name >folded %}
...code block content...
{% endcodeblock %}
```

### Thumbnail

You can add thumbnail images to your posts in two steps.
First, make sure the thumbnail is enabled in the theme's configuration file:

{% codeblock themes/icarus/_config.yml lang:yaml %}
article:
    thumbnail: true
{% endcodeblock %}

Then, provide an URL or path to the image file in the front-matter of your post:

{% codeblock post.md lang:yaml %}
title: Getting Started with Icarus
thumbnail: /gallery/thumbnails/desert.jpg
---
Post content...
{% endcodeblock %}

The image path you put in the front-matter needs to be the absolute path or URL to the image, 
or relative path to the source directory of your website.
For example, if you want to use the `<your blog>/source/gallery/image.jpg` as a thumbnail, you will need to put
`/gallery/image.jpg` in the front-matter.

### Read Time

{% codeblock themes/icarus/_config.yml lang:yaml %}
article:
    readtime: true
{% endcodeblock %}

You can show the word counter and estimated time on top of your article by setting `readtime` to `true`
in the `article` section.

### Sidebar

{% codeblock themes/icarus/_config.yml lang:yaml %}
sidebar:
    left:
        sticky: false
    right:
        sticky: true
{% endcodeblock %}

Sometimes you may want your sidebar's position to stay fixed when your page scrolls.
This can be done via the `sticky` settings in the `sidebar` section.


## Other Configuration Settings

Please refer to the [Icarus User Guide](/hexo-theme-icarus/tags/Icarus-User-Guide/) series if you are interested
in configurating third-party plugins, widgets, and CDN providers of Icarus.


<div class="notification is-warning is-size-6">
Something wrong with this article? Click <a href="https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/en/Configuring-Theme.md">here</a> to submit your revision.
</div>


<a style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-size:12px;line-height:1.2;display:inline-block;border-radius:3px" href="https://www.vecteezy.com/free-vector/vector-landscape" target="_blank" rel="noopener noreferrer" title="Vector Landscape Vectors by Vecteezy"><span style="display:inline-block;padding:2px 3px"><svg xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;position:relative;vertical-align:middle;top:-1px;fill:white" viewBox="0 0 32 32"><path d="M20.8 18.1c0 2.7-2.2 4.8-4.8 4.8s-4.8-2.1-4.8-4.8c0-2.7 2.2-4.8 4.8-4.8 2.7.1 4.8 2.2 4.8 4.8zm11.2-7.4v14.9c0 2.3-1.9 4.3-4.3 4.3h-23.4c-2.4 0-4.3-1.9-4.3-4.3v-15c0-2.3 1.9-4.3 4.3-4.3h3.7l.8-2.3c.4-1.1 1.7-2 2.9-2h8.6c1.2 0 2.5.9 2.9 2l.8 2.4h3.7c2.4 0 4.3 1.9 4.3 4.3zm-8.6 7.5c0-4.1-3.3-7.5-7.5-7.5-4.1 0-7.5 3.4-7.5 7.5s3.3 7.5 7.5 7.5c4.2-.1 7.5-3.4 7.5-7.5z"></path></svg></span><span style="display:inline-block;padding:2px 3px">Vector Landscape Vectors by Vecteezy</span></a>
