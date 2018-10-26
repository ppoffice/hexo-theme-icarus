title: Configuring Icarus
date: 2018-10-22 19:23:58
thumbnail: /gallery/plant.jpg
categories:
- Configuration
- Theme
tags:
- Getting Started
---

The configuration of Icarus consists of two parts: theme configuration and post configuration.

<!-- more -->

## Theme Configuration

Icarus uses the `_config.yml` file under your theme directory for global page layout, plugins and widgets settings that are effective across the whole blog. On startup, Icarus will check the existence of this configuration file and creates it for you automatically if file is not found. It will also validate this file against the specifications if it is already there. You can check the specifications at anytime from the `*.spec.js` files inside the `themes/icarus/includes/specs` folder.

A default theme configuration consists of the following parts:

- Site preference and page meta data
- Top navigation bar links
- Page footer links
- Article display settings
- [Comment](/hexo-theme-icarus/categories/Plugins/Comment/), [share](/hexo-theme-icarus/categories/Plugins/Share/), and [search](/hexo-theme-icarus/categories/Plugins/Search/) plugin settings
- [Sidebar widget](/hexo-theme-icarus/categories/Widgets/) settings
- Other display and analytics [plugins](/hexo-theme-icarus/categories/Plugins/General/)
- CDN settings

Most of the settings are documented in the `_config.yml` file. And for more details, you can refer to the [online documentation](/hexo-theme-icarus/categories/).

## Post Configuration

Apart from the global theme configuration, you can also customize any settings in a specific post. That is, you can override the theme settings from a post. Let's say you want to show different navigation bar menus in a post, we can simply put the `navbar` settings in the post's front-matter:

```yaml
navbar:
    menu:
        Home: /
        Special!: /special
```

This will replace your default navbar menu settings only in this post. This feature can be useful if you want to tune your page for a specific type of audience, such as enabling faster CDN and comment service based on the country and language of the viewer.

<a style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-size:12px;line-height:1.2;display:inline-block;border-radius:3px" href="https://unsplash.com/@alexholtdesign?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge" target="_blank" rel="noopener noreferrer" title="Download free do whatever you want high-resolution photos from Alex Holt"><span style="display:inline-block;padding:2px 3px"><svg xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;position:relative;vertical-align:middle;top:-1px;fill:white" viewBox="0 0 32 32"><title>unsplash-logo</title><path d="M20.8 18.1c0 2.7-2.2 4.8-4.8 4.8s-4.8-2.1-4.8-4.8c0-2.7 2.2-4.8 4.8-4.8 2.7.1 4.8 2.2 4.8 4.8zm11.2-7.4v14.9c0 2.3-1.9 4.3-4.3 4.3h-23.4c-2.4 0-4.3-1.9-4.3-4.3v-15c0-2.3 1.9-4.3 4.3-4.3h3.7l.8-2.3c.4-1.1 1.7-2 2.9-2h8.6c1.2 0 2.5.9 2.9 2l.8 2.4h3.7c2.4 0 4.3 1.9 4.3 4.3zm-8.6 7.5c0-4.1-3.3-7.5-7.5-7.5-4.1 0-7.5 3.4-7.5 7.5s3.3 7.5 7.5 7.5c4.2-.1 7.5-3.4 7.5-7.5z"></path></svg></span><span style="display:inline-block;padding:2px 3px">Alex Holt</span></a>