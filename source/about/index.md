title:
toc: true
---
<p align="center" class="mb-2">
<img class="not-gallery-item" style="height:48px" src="/hexo-theme-icarus/img/logo.svg">
<br> A simple, delicate, and modern theme for the static site generator Hexo.
</p>
<p class="is-size-6 has-text-centered">
<a href="http://ppoffice.github.io/hexo-theme-icarus/">Preview</a> |
<a href="http://ppoffice.github.io/hexo-theme-icarus/categories/">Documentation</a> |
<a href="https://github.com/ppoffice/hexo-theme-icarus/archive/master.zip">Download</a>
</p>

![Icarus](/hexo-theme-icarus/gallery/preview.png "Icarus Preview")

### :gift: Features

**Extensive Plugin Support**

Icarus includes plentiful search, comment, sharing and other plugins out of the box. You can choose any of them to enrich your
blog experience, or build your own plugin easily referring to the existing Icarus plugins.

Comment plugins

- [Changyan](/hexo-theme-icarus/Plugins/Comment/changyan-comment-plugin/)
- [Disqus](/hexo-theme-icarus/Plugins/Comment/disqus-comment-plugin/)
- [Facebook](/hexo-theme-icarus/Plugins/Comment/facebook-comment-plugin/)
- [Gitment](/hexo-theme-icarus/Plugins/Comment/gitment-comment-plugin/)
- [Isso](/hexo-theme-icarus/Plugins/Comment/isso-comment-plugin/)
- [LiveRe](/hexo-theme-icarus/Plugins/Comment/livere-comment-plugin/)
- [Valine](/hexo-theme-icarus/Plugins/Comment/valine-comment-plugin/)

Search plugins

- [Insight Search](/hexo-theme-icarus/Plugins/Search/insight-search-plugin/)
- [Google Custom Search Engine](/hexo-theme-icarus/Plugins/Search/google-cse-plugin/)
- [Baidu Site Search](/hexo-theme-icarus/Plugins/Search/baidu-search-plugin/)

Share plugins

- [AddThis](/hexo-theme-icarus/Plugins/Share/addthis-share-plugin/)
- [AddToAny](/hexo-theme-icarus/Plugins/Share/addtoany-share-plugin/)
- [Baidu Share](/hexo-theme-icarus/Plugins/Share/baidu-share-plugin/)
- [Share.js](/hexo-theme-icarus/Plugins/Share/share-js-share-plugin/)
- [ShareThis](/hexo-theme-icarus/Plugins/Share/sharethis-share-plugin/)

Donation Buttons

- [Alipay](/hexo-theme-icarus/Plugins/Donation/making-money-off-your-blog-with-donation-buttons/#Alipay)
- [Wechat](/hexo-theme-icarus/Plugins/Donation/making-money-off-your-blog-with-donation-buttons/#Wechat)
- [Paypal](/hexo-theme-icarus/Plugins/Donation/making-money-off-your-blog-with-donation-buttons/#Paypal)
- [Patreon](/hexo-theme-icarus/Plugins/Donation/making-money-off-your-blog-with-donation-buttons/#Patreon)

Other plugins

- [Hexo Tag Plugin](/hexo-theme-icarus/Configuration/Posts/hexo-built-in-tag-helpers/)
- [lightGallery & Justified Gallery](/hexo-theme-icarus/Plugins/General/gallery-plugin/)
- [MathJax](/hexo-theme-icarus/Plugins/General/mathjax-plugin/)
- [Site Analytics](/hexo-theme-icarus/Plugins/General/site-analytics-plugin/)

**Rich Code Highlight Theme Choices**

Icarus directly import code highlight themes from the [highlight.js](https://highlightjs.org/) package, and makes more than
70 highlight themes available to you.

<div class="columns is-multiline is-mobile">
<div class="column is-half-mobile"><img src="/hexo-theme-icarus/gallery/code-highlight/atom-one-light.png"></div>
<div class="column is-half-mobile"><img src="/hexo-theme-icarus/gallery/code-highlight/monokai.png"></div>
<div class="column is-half-mobile"><img src="/hexo-theme-icarus/gallery/code-highlight/androidstudio.png"></div>
</div>

**Elastic Theme Configuration**

In addition to the minimalistic and easy-to-understand configuration design, Icarus allows you to set configurations on a
per-page basis with the ability to merge and override partial configurations.

<div class="columns is-multiline">
    <div class="column is-half is-12-mobile">
        {% codeblock lang:yaml _config.yml %}
        menu:
          Archives: /archives
          Categories: /categories
          Tags: /tags
          About: /about
        {% endcodeblock %}
        <img class="not-gallery-item" style="height:44px" src="/hexo-theme-icarus/gallery/navbar/main-config.png">
    </div>
    <div class="column is-half is-12-mobile">
        {% codeblock lang:yaml post.md %}
        title: A Simple Post
        menu:
          Go Home: /index.html
        ---
        # Here is some simple markdown.
        {% endcodeblock %}
        <img class="not-gallery-item" style="height:44px" src="/hexo-theme-icarus/gallery/navbar/post-config.png">
    </div>
</div>

**Responsive Layout**

No matter what modern browsering device your audiences are using, they can always get the best experience because Icarus's responsive
layout across multiple viewpoints.

![Responsive Layout](/hexo-theme-icarus/gallery/responsive.png)

### :cd: Installation

Download & extract or `git clone` Icarus from GitHub to your blog's theme folder, and that's it!

```shell
git clone https://github.com/ppoffice/hexo-theme-icarus.git themes/icarus
```

Once started, Icarus will remind you of any missing dependencies and configuration files.

### :hammer: Development

This project is built with

- Hexo 3.7.1
- Ejs
- Stylus
- Bulma 0.7.2

Please refer to the documentation for Icarus implementation details.

### :tada: Contribute

If you feel like to help us build a better Icarus, you can

- :electric_plug: Write a plugin
- :black_nib: <a href="https://github.com/ppoffice/hexo-theme-icarus/new/site/source/_posts">Submit a tutorial</a>
- :triangular_flag_on_post: <a href="https://github.com/ppoffice/hexo-theme-icarus/issues/new">Report a bug</a>
- :earth_asia: <a href="https://github.com/ppoffice/hexo-theme-icarus/tree/master/languages">Add a translation</a>

### :memo: License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/ppoffice/hexo-theme-icarus/blob/master/LICENSE) file for details.
