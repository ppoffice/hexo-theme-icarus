title: Icarus快速上手
date: 2017-01-31 21:55:37
language: zh-CN
categories:
- Translations
comments: false
thumbnail: /gallery/thumbnails/panda.jpg
providers:
    cdn: '[cdnjs]https://cdn.staticfile.org/${package}/${version}/${filename}'
    fontcdn: https://fonts.loli.net/${type}?family=${fontname}
    iconcdn: fontawesome
comment:
    type: valine
    app_id: QuQK82UpN8gNkXIaKIszbPUY-gzGzoHsz
    app_key: B0D5cYRcXrwNGnBoQdRoDTqw
    notify: false
    verify: false
    placeholder: 快来评论吧
meta:
- name="robots";content="noindex, follow"
---
作为静态网站生成器Hexo的一款主题，Icarus以简洁、现代和精美为设计理念。在灵活且强大的配置系统的助力下，用户可以自由实现单栏与多栏的灵活页面布局。同时，Icarus提供了丰富的插件与挂件供用户选择，让网站的个性化配置变得触手可及。此外，得力于全新设计的API，开发者可以更便捷地对Icarus进行深层定制。
<!-- more -->

Icarus的安装非常简单，您只需从GitHub的仓库中下载Icarus源码并解压到博客的主题目录下的`icarus`目录中(themes/icarus)。您也可以使用如下命令将此主题下载到博客中：

```bash
git clone https://github.com/ppoffice/hexo-theme-icarus.git themes/icarus -b <version number>
```

您可以省略` -b <version number>`来下载Icarus的最新开发版本。另外，您也可以将Icarus安装为Git子模块(submodule)到您的博客中：

```bash
git submodule add https://github.com/ppoffice/hexo-theme-icarus.git themes/icarus
```

接下来，请将博客根目录下的`_config.yml`中的主题设置改为`icarus`：

```yaml
theme: icarus
```

最后，请使用如下命令来启动Hexo本地测试服务器。祝您下笔如有神！

```yaml
hexo s
```

> 在此网站上您可以阅读[开始使用](/hexo-theme-icarus/tags/Getting-Started/)系列文章来快速掌握Icarus。同时，如果需要更多的Icarus使用示例，您可以从GitHub上下载[`site`分支](https://github.com/ppoffice/hexo-theme-icarus/tree/site)的Icarus源码。

<a style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-size:12px;line-height:1.2;display:inline-block;border-radius:3px" href="https://unsplash.com/@millerthachiller?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge" target="_blank" rel="noopener noreferrer" title="Download free do whatever you want high-resolution photos from Pascal Müller"><span style="display:inline-block;padding:2px 3px"><svg xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;position:relative;vertical-align:middle;top:-1px;fill:white" viewBox="0 0 32 32"><title>unsplash-logo</title><path d="M20.8 18.1c0 2.7-2.2 4.8-4.8 4.8s-4.8-2.1-4.8-4.8c0-2.7 2.2-4.8 4.8-4.8 2.7.1 4.8 2.2 4.8 4.8zm11.2-7.4v14.9c0 2.3-1.9 4.3-4.3 4.3h-23.4c-2.4 0-4.3-1.9-4.3-4.3v-15c0-2.3 1.9-4.3 4.3-4.3h3.7l.8-2.3c.4-1.1 1.7-2 2.9-2h8.6c1.2 0 2.5.9 2.9 2l.8 2.4h3.7c2.4 0 4.3 1.9 4.3 4.3zm-8.6 7.5c0-4.1-3.3-7.5-7.5-7.5-4.1 0-7.5 3.4-7.5 7.5s3.3 7.5 7.5 7.5c4.2-.1 7.5-3.4 7.5-7.5z"></path></svg></span><span style="display:inline-block;padding:2px 3px">Pascal Müller</span></a>