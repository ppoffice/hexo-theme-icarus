**Theme configurations** consist of two parts: `menu` and `customize`:

## Menu
![Menu](https://ooo.0o0.ooo/2016/02/08/56b8797670b51.png)

Menus give you direct access to the archive, categories, custom pages, etc. You can create a menu simply by adding menu name and link address to the `menu` configuration section:

```diff
menu:
    Home: .
    Archives: archives
+   GitHub: https://github.com
```

> You can use both absolute addresses and relative addresses.

If you want enable the `Categories` and `Tags` for your blog, please copy `_source/categories` and `_source/tags` folder to `sources` folder under your site's root folder, and then add menu to your `_config.yml`.

```diff
menu:
    Home: .
    Archives: archives
+   Categories: categories
+   Tags: tags
```

## Customize
Customize configurations control the general appearance of your theme.

### Logo
You can replace the default logo with custom images. The `width` and `height` options define the size of the logo(in pixels), and `url` is the logo image file address. You can also hide the logo using `enabled: false`

```yaml
logo:
    enabled: true
    width: 165
    height: 60
    url: images/logo-header.png
```

> Don't add units to `width` and `height`, these options only support pure numbers.

> Please reserve `width`, `height` and `url` settings even when `enabled` is false.

### Profile
![Profile](https://ooo.0o0.ooo/2016/02/08/56b87cdd78cae.png)

Profile bar is the place to show a brief personal introduction of yours.

```yaml
profile:
    enabled: true
    avatar: css/images/avatar.png
    gravatar: 
    author: PPOffice
    author_title: Web Developer & Designer
    location: Harbin, China
    follow: https://github.com/ppoffice/
```

**enabled**: whether to show profile bar, options: true, false

**avatar**: path to your avatar image

**gavatar**: enter your Gravatar email address to enable Gavatar, this will override your avatar configuration

**author**: blogger name

**author_title**: a custom title

**location**: a custom location

**follow**: path to your homepage or something like that

### Highlight
![Highlight](https://ooo.0o0.ooo/2016/01/14/56973bf1680d1.png)

Icarus supports more than 60 code highlight themes imported from [Highlight.js](https://github.com/isagalaev/highlight.js). You can go to `icarus/source/css/_highlight` folder to see available options.

```diff
- highlight: androidstudio
+ highlight: tomorrow
```

### Sidebar
Change position of the sidebar. Available options are `left` and `right`.

```yaml
sidebar: left
```

### Thumbnail
Whether to enable thumbnail feature for each post. Available options are `true` and `false`.

```yaml
thumbnail: true
```

#### How to add a thumbnail to a post?
You can set your own thumbnail image by adding `banner` or `thumbnail` option in your post's [front-matter](https://hexo.io/docs/front-matter.html):

```diff
title: Hello World
date: 2013/7/13 20:46:25
+ thumbnail: https://example.com/image.jpg
---
```

### Favicon
Add a favicon for your site.

```yaml
favicon: favicon.png
```

### Social Links
![Social Links](https://ooo.0o0.ooo/2016/02/08/56b87c6be279f.png)

Show social links at the bottom of your profile bar. Add link name and link address in the `social_links` configuration and an [FontAwesome](http://fontawesome.io/) icon will be picked for you. Available social link options are listed [here](http://fontawesome.io/icons/#brand).

```diff
social_links:
    github: https://github.com/ppoffice/hexo-theme-icarus
+   youtube: https://youtube.com
```

> Social links with empty link addresses will be omitted, so make sure you don't leave the addresses empty.
