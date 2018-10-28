title: Getting Started with Icarus
date: 2018-10-22 19:23:59
thumbnail: /gallery/desert.jpg
tags:
- Getting Started
---
A simple, delicate, and modern theme for the static site generator Hexo. It allows you to set up a single or multiple-column (up to three column) blog with its versatile layout configuration. Additionally, it offers plentiful plugins and pluggable widgets so that you can enable the features you want in no time. And with the all-new API designing, Icarus makes the development of this theme painless for developers and users.

<!-- more -->

To set up Icarus in your blog, please download the tarball from the GitHub and extract it to your Hexo blog's theme directory. Alternatively, you can run the following command:

```bash
git clone https://github.com/ppoffice/hexo-theme-icarus.git themes/icarus -b <version number>
```
You may omit the ` -b <version number>` to get the latest development version of Icarus. Furthermore, you can install Icarus as a git submodule by executing the following command:

```bash
git submodule add https://github.com/ppoffice/hexo-theme-icarus.git themes/icarus
```

Next, replace the theme setting in your blog's `_config.yml` file:

```yaml
theme: icarus
```

Finally, use the following command to start the Hexo local server and begin composing!

```yaml
hexo s
```
> Don't forget to check out the [Getting Started](/hexo-theme-icarus/tags/Getting-Started/) series to help you master Icarus quickly! Also, you can fetch the [`site` branch](https://github.com/ppoffice/hexo-theme-icarus/tree/site) from the GitHub repository if you need more configuration examples.
