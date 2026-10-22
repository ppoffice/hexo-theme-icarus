title: Icarus User Guide - Configuring the Theme
date: 2020-03-01
categories:
- Configuration
tags:
- Getting Started
- Icarus User Guide
language: en
toc: true
cover: /gallery/covers/vector_landscape_2.svg
thumbnail: /gallery/covers/vector_landscape_2.svg
---

Icarus' default theme configuration file is `_config.icarus.yml`, in the root directory of your site, next to
the site configuration file `_config.yml`.
It defines the global layout and style settings of the theme and controls external features such as plugins and widgets.
This article details the general configurations of the theme.
It also explains what configuration files are used and how Icarus generates and validates these configurations.

<!-- more -->

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-globe-asia mr-2"></i>This article is also available in 
<a href="{% post_path zh-CN/Configuring-Theme %}">简体中文</a>.
</div>
</article>

## General Theme Configurations

### Configuration Version

This version code is related to, but not always the same as, the theme version code.
Icarus uses it to determine whether to upgrade the default theme configuration file.
You should not change it by yourself.

{% codeblock _config.icarus.yml lang:yaml %}
version: 5.1.0
{% endcodeblock %}

### Theme Variant

Choose a skin for Icarus.
`"default"` and `"cyberpunk"` are supported values currently.
You can take a look at the Cyberpunk variant {% post_link demo/Cyberpunk "here" %}.

{% codeblock _config.icarus.yml lang:yaml %}
variant: default
{% endcodeblock %}

### Appearance

The default variant can be light or dark.
Set `appearance` to `light` (the default), `auto` to follow the light or dark color scheme setting of each
visitor's browser or operating system, or `dark` to always use the dark colors.
The Cyberpunk variant has its own dark colors and ignores this setting.

{% codeblock _config.icarus.yml lang:yaml %}
appearance: auto
{% endcodeblock %}

Like other theme settings, `appearance` can also be set for all posts or pages in the layout configuration files,
or for a single post or page in its front-matter (see [Configuration Files and Priority](#Configuration-Files-and-Priority)).
Code blocks use the `dark_theme` of the [code highlight](#Code-Highlight) settings and the logo switches to
[`logo_dark`](#Logo) when the page is dark.
You can see the dark appearance {% post_link demo/Dark-Mode "here" %}.

### Logo

Set the logo of your site.
It will display on the navigation bar and the footer.
The value of the `logo` can either be the path or URL to your logo image:

{% codeblock _config.icarus.yml lang:yaml %}
logo: /img/logo.svg
{% endcodeblock %}

or text if you set it like the following:

{% codeblock _config.icarus.yml lang:yaml %}
logo:
    text: My Beautiful Site
{% endcodeblock %}

When the default variant looks dark (see [Appearance](#Appearance)), the logo image is replaced with the image
set in `logo_dark`:

{% codeblock _config.icarus.yml lang:yaml %}
logo: /img/logo.svg
logo_dark: /img/logo-dark.svg
{% endcodeblock %}

Without `logo_dark`, the theme's own logo (`/img/logo.svg`) switches to `/img/logo-dark.svg`, and other logo
images stay the same.
Text logos are not changed.

### Favicon

You can specify the path or URL to your site's favicon in the `head` section.

{% codeblock _config.icarus.yml lang:yaml %}
head:
    favicon: /img/favicon.svg
{% endcodeblock %}

### Web App Manifest

Icarus supports basic PWA `manifest.json` generation and meta tags.
To enable web app manifest, use the following configuration in the `head` section of your theme configuration file.
You can also refer to [MDN](https://developer.mozilla.org/en-US/docs/Web/Manifest) for details
on each manifest configuration setting.

{% codeblock _config.icarus.yml lang:yaml >folded %}
head:
    manifest:
        # Name of the web application (default to the site title)
        name: Icarus - Hexo Theme
        # The displayed name of the web application
        # when there is not enough space to display full name
        short_name: Icarus
        # The start URL of the web application
        start_url: https://ppoffice.github.io/
        # The default theme color for the application
        theme_color: "#3273dc"
        # A placeholder background color for the application page to display
        # before its stylesheet is loaded
        background_color: "#3273dc"
        # The preferred display mode for the website
        display: standalone
        # Image files that can serve as application icons for different contexts
        icons:
            -
                # The path to the image file, relative to the site root
                src: icons/touch-icon-iphone.png
                # A string containing space-separated image dimensions
                sizes: 144x144
                # A hint as to the media type of the image (optional)
                type: image/png
            -
                src: icons/touch-icon-ipad.png
                sizes: 152x152
            -
                src: icon/logo.ico
                sizes: 72x72 96x96 128x128 256x256
{% endcodeblock %}

### Open Graph

You can set up Open Graph in the `head` section.
You should leave most of the settings blank in the configuration file.
Only set those settings in the front-matter of your post if you need them.
Please refer to [Hexo documentation](https://hexo.io/docs/helpers.html#open-graph) for details on each setting.

{% codeblock _config.icarus.yml lang:yaml >folded %}
head:
    open_graph:
        # Page title (og:title) (optional)
        title: 
        # Page type (og:type) (optional)
        # Leave it empty to use `article` for posts and `website` for other pages
        type: 
        # Page URL (og:url) (optional)
        url: 
        # Page cover (og:image) (optional)
        image: 
        # Site name (og:site_name) (optional)
        site_name: 
        # Page author (article:author) (optional)
        author: 
        # Page description (og:description) (optional)
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

Configuration files generated with hexo-component-inferno 4.1.0 or earlier set `type` to `blog`, which is not
a valid Open Graph type.
If yours has `type: blog`, leave it empty instead.

### Google Structured Data

You can set up Google Structured Data in the `head` section.
You should leave most of the settings blank in the configuration file.
Only set those settings in the front-matter of your post if you need them.
Please refer to [Search for Developers](https://developers.google.com/search/docs/guides/intro-structured-data) 
for details on each setting.

{% codeblock _config.icarus.yml lang:yaml >folded %}
head:
    structured_data:
        # Page title (optional)
        title: 
        # Page description (optional)
        description: 
        # Page URL (optional)
        url: 
        # Page author (article:author) (optional)
        author: 
        # Page images (optional)
        image: 
        # The publisher of the article (optional)
        publisher:
        # The logo of the publisher (optional)
        publisher_logo:
{% endcodeblock %}

### Page Metadata

You can add custom `<meta>` tags to the generated HTML from the `meta` setting in the `head` section.
Each meta tag should appear as an item of the `meta` array.
The value of each `meta` item should be in the `<field_name>=<field_value>` format 
with `field_name` and `field_value` represent the field and value of the `<meta>` tag respectively.
Separate the `<field_name>=<field_value>` pairs with `;` if the `<meta>` tag has multiple fields and values.

{% codeblock _config.icarus.yml lang:yaml %}
head:
    meta:
        - 'name=theme-color;content=#123456'
        - 'name=generator;content="Hexo 4.2.0"'
{% endcodeblock %}

Since hexo-component-inferno 4.2.0, only the first `=` of each pair separates the field name from the value, so
the value can contain `=`.
To use `;` in a value (or `=` in a field name), escape it with a backslash, for example,
`'http-equiv=refresh;content=5\;url=https://example.com/'`.

### RSS

You can add a link to your RSS feed at the `rss` setting in the `head` section.

{% codeblock _config.icarus.yml lang:yaml %}
head:
    rss: /path/to/atom.xml
{% endcodeblock %}

### Navigation Bar

The `navbar` section defines the menu items and links in the navigation bar.
You may put any menu item in the navigation bar by adding `<link_name>: <link_url>` to the `menu` setting.
To group several links under one menu item, set the menu item to an object of `<link_name>: <link_url>` pairs
instead; it shows them in a sub-menu.
To put links on the right side of the navigation bar, add `<link_name>: <link_url>` to the `links` setting.

{% codeblock _config.icarus.yml lang:yaml %}
navbar:
    # Navigation menu items
    menu:
        Home: /
        Archives: /archives
        Categories: /categories
        Tags: /tags
        # A sub-menu
        About:
            About Me: /about
            Projects: /projects
    # Links to be shown on the right of the navigation bar
    links:
        GitHub: 'https://github.com'
        Download on GitHub:
            icon: fab fa-github
            url: 'https://github.com/ppoffice/hexo-theme-icarus'
{% endcodeblock %}

When the menu items and links do not fit on one line, for example on phones, the menu items fold into a
drop-down that opens with a menu button.

You can display a FontAwesome icon instead of text-only link with the following format:

{% codeblock "Link format" lang:yaml %}
<link_name>:
    icon: <fontawesome_icon_class_name>
    url: <link_url>
{% endcodeblock %}

This format works for `navbar.links`, `footer.links`, `article.licenses`, and the `social_links` of the profile
widget, but not for the items of `navbar.menu`, which are always text.

### Footer

The `footer` section defines the links on the right side of the page footer.
The link format is exactly the same as `links` in the `navbar` section.

{% codeblock _config.icarus.yml lang:yaml %}
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

You can also display custom copyright text at the footer section:

{% codeblock _config.icarus.yml lang:yaml %}
footer:
    copyright: Made with 💖
{% endcodeblock %}

### Code Highlight

If you have enabled code highlighting in Hexo, you can customize the code blocks with `highlight` settings 
in the `article` section.
Choose a theme from all themes listed under 
[highlight.js/src/styles](https://github.com/highlightjs/highlight.js/tree/11.11.1/src/styles).
Then, copy the file name (without the `.css` extension) to the `theme` setting.
Themes in the `base16` directory, such as `solarized-light`, keep the directory in their names, e.g.,
`base16/solarized-light`.
The `dark_theme` setting is the theme used instead when the page is dark (see [Appearance](#Appearance)).

On devices with a mouse, the "copy" button of a code block only shows while the code block is hovered or
focused; on touch screens it is always visible.
To hide the "copy" button of every code block, set `clipboard` to `false`.
If you wish to fold or unfold all code blocks, set the `fold` setting to `"folded"` or `"unfolded"`.
You can also disable the folding feature by leaving the `fold` setting empty.

{% codeblock _config.icarus.yml lang:yaml %}
article:
    highlight:
        # Code highlight themes
        # https://github.com/highlightjs/highlight.js/tree/master/src/styles
        theme: atom-one-light
        # Code highlight theme used when the default variant looks dark (see appearance)
        dark_theme: atom-one-dark
        # Show copy code button
        clipboard: true
        # Default folding status of the code blocks. Can be "", "folded", "unfolded"
        fold: unfolded
{% endcodeblock %}

Additionally, you can fold an individual code block in the Markdown file using the following syntax:

```
{% codeblock "optional file name" lang:code_language_name >folded %}
...code block content...
{% endcodeblock %}
```

### Cover & Thumbnail

You can add a cover image to your post by adding the `cover` property in post's front-matter:

{% codeblock post.md lang:yaml %}
title: Getting Started with Icarus
cover: /gallery/covers/cover.jpg
---
Post content...
{% endcodeblock %}

Similarly, you may set the thumbnail of your post in the front-matter as well:

{% codeblock post.md lang:yaml %}
title: Getting Started with Icarus
thumbnail: /gallery/covers/thumbnail.jpg
---
Post content...
{% endcodeblock %}

The thumbnail will show in the archive page as well as in the recent post widget.

If you choose to use the image path in the front-matter, you need to ensure the path is absolute
or relative to the source directory of your site.
For example, to use `<your blog>/source/gallery/image.jpg` as a thumbnail image, you need to put
`thumbnail: /gallery/image.jpg` in the front-matter.

### Read Time

You can show a word counter and the estimated reading time of your article above the article title by 
setting `readtime` to `true` in the `article` section.

{% codeblock _config.icarus.yml lang:yaml %}
article:
    readtime: true
{% endcodeblock %}

### Update Time

Icarus shows the update time of an article next to its publication time.
You can set the update time in the article's front-matter:

{% codeblock post.md lang:yaml %}
title: Getting Started with Icarus
updated: 2020-04-01 00:00:00
---
Post content...
{% endcodeblock %}

The `update_time` setting in the `article` section of your theme configuration file controls whether it is
shown:

{% codeblock _config.icarus.yml lang:yaml %}
article:
    update_time: true
{% endcodeblock %}

`true` (the default) shows the update time of every article, `false` hides it for all articles, and `auto`
hides it when it is the same as the article publication time.

Without `updated` in the front-matter, Hexo uses the modification time of the Markdown file as the update time,
because the default value of `updated_option` in the site configuration file is `mtime`.
That is why every article shows an update time, usually even with `auto`, and why it can change when you
check out or copy your files.
To only show the update time of the articles that set `updated` in their front-matter, set `updated_option` to
`empty` in `_config.yml`:

{% codeblock _config.yml lang:yaml %}
updated_option: empty
{% endcodeblock %}

### Article Licensing

You can show a section at the end of your posts/pages describing the licensing of your work.
Both text and icons are accepted as license links.
This configuration is the same as `links` in the navigation bar or the footer:

{% codeblock _config.icarus.yml lang:yaml %}
article:
    # Article licensing block
    licenses:
        Creative Commons:
            icon: fab fa-creative-commons
            url: 'https://creativecommons.org/'
        'CC BY-NC-SA 4.0': 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
{% endcodeblock %}

### Sidebar

To make a sidebar fixed when you scroll the page, set the `sticky` setting of that sidebar to `true` in
the `sidebar` section.

{% codeblock _config.icarus.yml lang:yaml %}
sidebar:
    left:
        sticky: false
    right:
        sticky: true
{% endcodeblock %}


### Other Configurations

You can refer to the [Icarus User Guide](/hexo-theme-icarus/tags/Icarus-User-Guide/) to learn more about 
third-party plugins, widgets, and CDN provider configurations.


## Configuration Files and Priority

Apart from the default theme configuration file `_config.icarus.yml`, Icarus also looks at the following
locations for alternative configurations:

- The site configuration file at `_config.yml`
- Layout configuration files at `_config.post.yml` and `_config.page.yml`
- Post/page's [front-matter](https://hexo.io/docs/front-matter.html)
- (Deprecated) Legacy theme configuration file at `themes/icarus/_config.yml`
- (Deprecated) Legacy layout configuration file at `themes/icarus/_config.post.yml` and `themes/icarus/_config.page.yml`

All the files above, except the legacy ones, are in the root directory of your site.
If you still have legacy files, `_config.icarus.yml` overrides `themes/icarus/_config.yml`, but
`themes/icarus/_config.post.yml` and `themes/icarus/_config.page.yml` override the layout configuration files
in the root directory of your site for the top-level settings they set.
Move their content to the files in the root directory of your site to avoid surprises.

### Layout Configuration Files

Layout configuration files follow the same format and definitions as theme configuration files.
The configurations in `_config.post.yml` apply to all posts, and those in `_config.page.yml` apply to all custom pages.
They both override configurations in theme configuration files.

For example, you can adopt a two-column layout for all posts in `_config.post.yml`:

{% codeblock _config.post.yml lang:yaml %}
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

while keeping a three-column layout in all other pages:

{% codeblock _config.icarus.yml lang:yaml %}
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

To remove all widgets, for example to give all custom pages a one-column layout, set `widgets` to `null`:

{% codeblock _config.page.yml lang:yaml %}
widgets: null
{% endcodeblock %}

### Post/Page Front-matter

If you wish to override theme configurations only for a certain post/page, you can set them in the front-matter 
of that post/page.
For example, you can change the code block highlight theme of a single post by setting it in that post's
front-matter like the following:

{% codeblock source/_posts/some-post.md lang:yaml %}
title: My first post
date: '2015-01-01 00:00:01'
article:
    highlight:
        theme: atom-one-dark
---
# Some Post
{% endcodeblock %}

The above setting will always override the `article` settings in `_config.post.yml` and `_config.icarus.yml`
for that post.

Note that layout configuration files and the front-matter override the theme configurations one top-level
setting at a time, without merging the settings inside it.
In the example above, the post gets the `article` section of its front-matter instead of the whole `article`
section of `_config.icarus.yml`.
The other settings of that section, such as `highlight.clipboard`, `highlight.fold`, `readtime`, and `licenses`,
are no longer read from `_config.icarus.yml` for that post: for example, its reading time and license block
disappear.
Repeat the settings you want to keep:

{% codeblock source/_posts/some-post.md lang:yaml %}
title: My first post
date: '2015-01-01 00:00:01'
article:
    highlight:
        theme: atom-one-dark
        clipboard: true
        fold: unfolded
    readtime: true
    licenses:
        'CC BY-NC-SA 4.0': 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
---
# Some Post
{% endcodeblock %}

This layered configuration scheme is handy for differentiating page customizations and optimizations 
for different audiences.
For instance, you can enable faster CDNs or a localized comment service based on the country and language 
of your page viewers.

However, it should be noted that post or page attributes defined by Hexo will not override the theme 
configurations from the front-matter.
Examples are `title`, `date`, `updated`, `comments`, `layout`, `source`, `photos`, and `excerpt`.

### Site Configuration File

All configuration sources listed above, including theme configuration files, layout configuration files, 
and post/page front-matter, will override the site configuration file only for configurations
used by Icarus.
For instance, `title` in the `_config.icarus.yml` will override `title` in the `_config.yml`, but
`new_post_name` will not since it is not used by Icarus.

Also, the `theme_config` option in the site configuration file will merge with and override theme
configurations from theme configuration files.
However, using this option is highly discouraged, and Icarus prints a warning when it finds it.

### Conclusion

In conclusion, the scopes of the configuration sources and their priorities are:

- For a certain post or page

    - Post/Page front-matter overrides all following sources.
    - Layout configuration files override all following sources.
    - `theme_config` option in the site configuration file overrides all following sources.
    - Theme configuration files override all following sources.
    - The site configuration file.

- For all posts or pages

    - Layout configuration files override all following sources.
    - `theme_config` option in the site configuration file overrides all following sources.
    - Theme configuration files override all following sources.
    - The site configuration file.

- For all posts, pages, and index pages

    - `theme_config` option in the site configuration file overrides all following sources.
    - Theme configuration files override all following sources.
    - The site configuration file.


## Configuration Generation and Validation

All Icarus theme configurations are written in [YAML language](https://yaml.org/).
Icarus will automatically generate the default configuration file `_config.icarus.yml` from a set of 
[JSON schemas](https://json-schema.org/) if it does not exist.
That's why you don't see an example configuration file (such as `_config.yml.example`) under the theme directory.
To see all available settings with their descriptions, look at the generated `_config.icarus.yml`.
Most of the JSON schemas are in the `<icarus_directory>/include/schema` directory, while the others are
in the [ppoffice/hexo-component-inferno](https://github.com/ppoffice/hexo-component-inferno) repository.
You can attach the `--icarus-dont-generate-config` flag to your `hexo` commands to prevent automatic configuration
generation.

The theme also validates your configurations against these schemas every time you execute a `hexo` command.
If anything goes wrong during the validation, Icarus will print out the exact location of the misconfiguration
and its error type.
For example, the following messages tell us that the value of the `logo` setting (`instancePath: '/logo'`)
must be either a string or an object, instead of an integer.
You may skip the validation by appending the `--icarus-dont-check-config` flag to your `hexo` commands, but it is 
not recommended to do so.

{% codeblock "hexo log" %}
INFO  === Checking package dependencies ===
INFO  === Checking theme configurations ===
WARN  Theme configurations failed one or more checks.
WARN  Icarus may still run, but you will encounter unexpected results.
WARN  Here is some information for you to correct the configuration file.
WARN  [
  {
    instancePath: '/logo',
    schemaPath: '#/properties/logo/type',
    keyword: 'type',
    params: { type: [Array] },
    message: 'must be string,object'
  }
]
{% endcodeblock %}

The configuration check also warns you about a few settings that are valid but probably not what you want:
the Valine comment plugin, which exposes the email addresses of commenters;
the `waline_pageview` plugin together with the `pageview` option of the Waline comment plugin, which counts each
page view twice, or without a Waline server to count the page views;
and the `theme_config` option in the site configuration file.

Additionally, Icarus will execute migration scripts to upgrade the default theme configuration file to the newest 
version if it is not.
These scripts are in the `<icarus_directory>/include/migration` directory.
Before the upgrade, Icarus backs up your configuration files, and after it, Icarus also writes a newly generated
configuration file to `_config.icarus.yml.example` for your reference.
You may disable the upgrade by appending the `--icarus-dont-upgrade-config` flag to your `hexo` commands.
Finally, Icarus will also check the Node.js package dependencies and remind you to install them if you haven't.
You may skip this check by appending the `--icarus-dont-check-deps` flag to your `hexo` commands, e.g., when
trying out a newer major version of a dependency.


<article class="message message-immersive is-warning">
<div class="message-body">
<i class="fas fa-question-circle mr-2"></i>Something wrong with this article? 
Click <a href="https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/en/Configuring-Theme.md">here</a> 
to submit your revision.
</div>
</article>


<a style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-size:12px;line-height:1.2;display:inline-block;border-radius:3px" href="https://www.vecteezy.com/free-vector/vector-landscape" target="_blank" rel="noopener noreferrer" title="Vector Landscape Vectors by Vecteezy"><span style="display:inline-block;padding:2px 3px"><svg xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;position:relative;vertical-align:middle;top:-1px;fill:white" viewBox="0 0 32 32"><path d="M20.8 18.1c0 2.7-2.2 4.8-4.8 4.8s-4.8-2.1-4.8-4.8c0-2.7 2.2-4.8 4.8-4.8 2.7.1 4.8 2.2 4.8 4.8zm11.2-7.4v14.9c0 2.3-1.9 4.3-4.3 4.3h-23.4c-2.4 0-4.3-1.9-4.3-4.3v-15c0-2.3 1.9-4.3 4.3-4.3h3.7l.8-2.3c.4-1.1 1.7-2 2.9-2h8.6c1.2 0 2.5.9 2.9 2l.8 2.4h3.7c2.4 0 4.3 1.9 4.3 4.3zm-8.6 7.5c0-4.1-3.3-7.5-7.5-7.5-4.1 0-7.5 3.4-7.5 7.5s3.3 7.5 7.5 7.5c4.2-.1 7.5-3.4 7.5-7.5z"></path></svg></span><span style="display:inline-block;padding:2px 3px">Vector Landscape Vectors by Vecteezy</span></a>
