#Icarus

### The blog theme you may fall in love with, coming to Hexo. [Preview](http://blog.jamespan.me)
![](http://ppoffice.github.io/hexo-theme-icarus/gallery/preview.jpg "")

## Installation

### Install

``` bash
$ git clone https://github.com/JamesPan/hexo-theme-icarus.git themes/icarus
```

**Icarus requires Hexo 3.0 and above.**

### Enable

Modify `theme` setting in `_config.yml` to `icarus`.

### Update

``` bash
cd themes/icarus
git pull
```

## Configuration

### Theme configuration example
``` yml
# Header
menu:
  Home: /
  Archives: /archives
  About: /about

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

# Contacts
contacts:
  github: http://github.com/ppoffice
  twitter: '#'
  facebook: '#'
  dribbble: '#'
  rss: /atom.xml

# Links
links:
  Hexo: http://hexo.io

# Miscellaneous
google_analytics:
favicon: /favicon.png
twitter:
google_plus:
fb_admins:
fb_app_id:
```

- **fancybox** - Enable [Fancybox].
- **contacts** - Your social network links, RSS link, etc.
- **widgets** - Widgets displaying in sidebar.
- **links** - Links displayed in the link widget.
- **google_analytics** - Google Analytics ID.
- **favicon** - Favicon path.

### Site configuration example
``` yml
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

## Languages

English and Simplified Chinese are the default languages of the theme. You can add translations in the `languages` folder and change the default language in blog's `_config.yml`.

``` yml
language: zh-CN
```

## Features

### Profile Sidebar

A nice place to show yourself. You can add your own information in your site's `_config.yml`

![](http://ppoffice.github.io/hexo-theme-icarus/gallery/profile.png "")

### Responsive Layout

Icarus knows on what screen size you are browsering the website, and reorganize the layout to fit your device.

![](http://ppoffice.github.io/hexo-theme-icarus/gallery/responsive.jpg "")

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
- Hexo 2.4+

### Grunt tasks

- **default** - Download [Fancybox] and [Font Awesome].
- **fontawesome** - Only download [Font Awesome].
- **fancybox** - Only download [Fancybox].
- **clean** - Clean temporarily files and downloaded files.

[Hexo]: http://zespia.tw/hexo/
[Fancybox]: http://fancyapps.com/fancybox/
[Font Awesome]: http://fontawesome.io/
[Grunt]: http://gruntjs.com/
