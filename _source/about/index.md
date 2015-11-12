title: "About"
layout: "page"
---
### The blog theme you may fall in love with, coming to Hexo. [Preview](http://ppoffice.github.io/hexo-theme-icarus/)
![](http://ppoffice.github.io/hexo-theme-icarus/gallery/preview.jpg "")

## Installation

### Install

``` bash
$ git clone https://github.com/ppoffice/hexo-theme-icarus.git themes/icarus
```

**Icarus requires Hexo 3.0 and above.**

### Enable

1. Rename `themes\icarus\_config.yml.example` to `themes\icarus\_config.yml`;
2. Copy `themes\icarus\_config.yml.site.example` to your hexo blog's root directory and rename it to `_config.yml`;
3. Copy `themes\icarus\_source\*` into your hexo blog's directory `source`;
4. Then modify `theme` setting in `_config.yml` to `icarus`.

### Update

``` bash
cd themes/icarus
git pull
```

## Configuration

### Theme configuration example
```r
# Header
menu:
  Home: .
  Archives: archives
  Categories: categories # you need to add extra page to enable this, please see the config below.
  Tags: tags             # you need to add extra page to enable this, please see the config below.
  About: about

# Content
excerpt_link: Read More
fancybox: true

# Sidebar
sidebar: right
widgets:
- recent_posts
- category
- tag
- tagcloud
- archive
thumbnail: true

# Contacts
contacts:
  github: http://github.com/ppoffice/hexo-theme-icarus
  twitter: '#'
  facebook: '#'
  dribbble: '#'
  rss: atom.xml

# Links
links:
  Hexo: http://hexo.io

# Miscellaneous
google_analytics:
favicon: favicon.png
twitter:
google_plus:
fb_admins:
fb_app_id:
```

- **excerpt_link** - Cooperate with `<!-- more -->` tag to show only part of the article in index pages.
- **fancybox** - Enable [Fancybox].
- **contacts** - Your social network links, RSS link, etc.
- **widgets** - Widgets displaying in sidebar.
- **thumbnail** - Whether to show post thumbnails in the sidebar and archive pages.
- **links** - Links displayed in the link widget.
- **google_analytics** - Google Analytics ID.
- **favicon** - Favicon path.

### Site configuration example
```r
# Site
title: Icarus
subtitle:
description: Hexo theme - Icarus
author: PPOffice
author_title: 'Web Developer & Designer'
avatar: css/images/avatar.png
location: 'Harbin, China'
language: en
timezone:

...

# Disqus
disqus_shortname:
```

- **author** - Your name.
- **author_title** - Title to your occupation.
- **avatar** - Your avatar image link.
- **location** - Where you live in.
- **disqus_shortname** - Your Disqus shortname.

### Post Thumbnail & Banner

You can add a thumbnail and a banner to each post by adding the following lines into your post source files' front-matter:
```r
title: Demo
date: 2015-01-01
...
# add those
thumbnail: http://example.com/thumbnail.jpg
banner: http://example.com/banner.jpg
```

### Custom Categories & Tags Pages

To enable custom categories page and tags page, just copy the `categories` folder and `tags` folder under your theme's `_source` foler into your site's `source` folder. Then edit theme's _config.yml and add the following lines: 
```r
# Header
menu:
  ...
  Categories: categories # -> add this line
  Tags: tags # -> and add this line
  ...
```

### Languages

English and Simplified Chinese are the default languages of the theme. You can add translations in the `languages` folder and change the default language in blog's `_config.yml`.

```r
language: zh-CN
```

## Features

### Profile Sidebar

A nice place to show yourself. You can add your own information in your site's `_config.yml`

![](http://ppoffice.github.io/hexo-theme-icarus/gallery/profile.png "")

### Post Banner & Thumbnail

Thanks to [atika](https://github.com/atika), you can now add thumbnails and banners to every post to create better reading experience.

### Responsive Layout

Icarus knows on what screen size you are browsering the website, and reorganize the layout to fit your device.

![](http://ppoffice.github.io/hexo-theme-icarus/gallery/responsive.jpg "")

### Custom Categories & Tags Pages

Get your categories and tags listed in single pages to make your blog more methodic.

### Fancybox

Icarus uses [Fancybox] to showcase your photos. You can use Markdown syntax or fancybox tag plugin to add your photos.

```
![img caption](img url)
```

### Sidebar

Icarus provides 6 built-in widgets:

- recent_posts
- category
- archives
- tag
- tagcloud
- links

All of them are enabled by default. You can edit them in `widget` setting.

## Development

### Requirements

- [Grunt] 0.4+
- Hexo 3.0+

### Grunt tasks

- **default** - Download [Fancybox] and [Font Awesome].
- **fontawesome** - Only download [Font Awesome].
- **fancybox** - Only download [Fancybox].
- **clean** - Clean temporarily files and downloaded files.

[Hexo]: http://zespia.tw/hexo/
[Fancybox]: http://fancyapps.com/fancybox/
[Font Awesome]: http://fontawesome.io/
[Grunt]: http://gruntjs.com/


