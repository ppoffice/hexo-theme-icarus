title: Upgrade Guide
date: 2026-03-24
language: en
tags:
- Icarus User Guide
toc: true
---

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-globe-asia mr-2"></i>This article is also available in 
<a href="{% post_path zh-CN/Upgrade-Guide %}">简体中文</a>.
</div>
</article>

<!-- more -->

### Upgrading from 6.x to 7.0

1. Icarus backs up `_config.icarus.yml` and upgrades it to version `7.0.0` the first time you run `hexo`.
   Layout configuration files, such as `_config.post.yml`, and front-matter are not upgraded.
   In them, remove `head.open_graph.type: blog`, `head.open_graph.google_plus`, and the Gitalk `client_secret`,
   and set `avatar: /img/avatar.png` in profile widgets without an avatar.
   Also check the following settings:

   - The `image_uploader`, `highlighter`, `tex_renderer`, and `search` options of Waline disable their features
     when set to `true`, and keep them when not set or set to `false`.
   - Category pages are split into pages of `per_page` posts.
     To keep one page, set `category_generator.per_page: 0` in `_config.yml`.

2. Check the plugins that you use:

   - Facebook Comments, Share.js, Baidu Share, AddThis, and the Google FeedBurner `subscribe_email` widget are
     removed, and Valine, Gitment, and Cusdis are deprecated.
     Switch to other plugins.
   - Gitalk 2 requires a GitHub App and your own proxy, set in `proxy`.
     Generate a new client secret, because the old one was published in your pages.
   - Upgrade your Twikoo backend to 2.0.17 and your Artalk server to 2.10.
     To prefer the options of the Artalk server to those of your configuration, set `prefer_remote_conf: true`.
   - Custom Waline page view counters need the page path in their `data-path` attribute.
   - Custom DisqusJS templates need the DisqusJS 3 API.
   - Custom gallery scripts need the native APIs of lightGallery 3 and justified-gallery 4.
     lightGallery 3 is licensed under GPLv3 or a commercial license.

3. The Cyberpunk variant shows the logo set in `logo_dark`, uses `JetBrains Mono` for code, and colors code
   blocks with its own palette.
   `/img/razor-top-black.svg` and `/img/razor-bottom-black.svg` are removed.

4. A self-hosted MathJax 4 needs the whole `mathjax` and `@mathjax/mathjax-newcm-font` packages.

5. If you keep customized copies of the theme's files, apply your changes to the files of 7.0 again:

   - `source/css/style.styl` is renamed to `source/css/_style.styl`.
   - `layout/misc/paginator.jsx` and `layout/widget/profile.jsx` are removed.
   - The navigation bar and PJAX code moved to `source/js/navbar.js`, `source/js/appearance.js`, and
     `source/js/pjax-*.js`.
   - The table of contents, search, back-to-top, and copy buttons are `<button>` elements.
   - Pages no longer load moment.js.
   - Run your own scripts that set up the content of a page on the `pjax:complete` event as well.

### Upgrading from 5.x to 6.0

1. Upgrade Node.js to 14.0 or a newer version, and Hexo to 7.1.1 or a newer version.

2. Install Icarus 6.x either via source code download or NPM install.
   You can find instructions in {% post_link en/Getting-Started %}.
   If you plan to customize the theme by altering its source code, you are required to install
   the theme from source code.

3. Run `hexo clean` to clear cache files and let Icarus upgrade your theme configuration file for
   you.

4. Check out the [release notes](https://github.com/ppoffice/hexo-theme-icarus/releases) and the
   [latest documentation](https://ppoffice.github.io/hexo-theme-icarus/categories/) for more
   information of the new features.

### Upgrading from 4.x to 5.0

1. Upgrade Node.js to 12.4.0 or a newer version, and Hexo to 6.0 or a newer version.

2. Install Icarus 5.x either via source code download or NPM install.
   You can find instructions in {% post_link en/Getting-Started %}.
   If you plan to customize the theme by altering its source code, you are required to install
   the theme from source code.

3. Run `hexo clean` to clear cache files and let Icarus upgrade your theme configuration file for
   you.

4. Check out the [release notes](https://github.com/ppoffice/hexo-theme-icarus/releases) and the
   [latest documentation](https://ppoffice.github.io/hexo-theme-icarus/categories/) for more
   information of the new features.

### Upgrading from 3.x to 4.x

1. Upgrade Node.js to 10.13.0 or a newer version.

2. Install Icarus 4.x either via source code download or NPM install.
   You can find instructions in {% post_link en/Getting-Started %}.
   If you plan to customize the theme by altering its source code, you are required to install
   the theme from source code.

3. Run `hexo clean` to clear cache files.
   Install any missing packages as prompted by Icarus:

   {% codeblock "Shell" lang:shell %}
   $ hexo clean
   ...
   ERROR Please install the missing dependencies your Hexo site root directory:
   ERROR npm install --save hexo@^5.0.2 hexo-component-inferno@^0.8.2 hexo-log@^2.0.0 hexo-util@^2.2.0
   ERROR or:
   ERROR yarn add hexo@^5.0.2 hexo-component-inferno@^0.8.2 hexo-log@^2.0.0 hexo-util@^2.2.0
   {% endcodeblock %}

4. Run `hexo clean` again to let Icarus upgrade your theme configuration file for you.
   Icarus will back up and remove `themes/icarus/_config.yml`, and then create `_config.icarus.yml` as 
   the new theme configuration file.
   You can refer to `_config.icarus.yml.example` for example configurations.

   {% codeblock "Shell" lang:shell %}
   $ hexo clean
   ...
   WARN  Your theme configuration is outdated (3.0.0 < 4.0.0).
   INFO  To skip the configuration upgrade, use "--icarus-dont-upgrade-config".
   INFO  Backing up theme configuration files...
   INFO  themes/icarus/_config.yml => themes/icarus/_config.yml.dc00f8b8f8bc03ede351d711e958dc4b
   INFO  Upgrading theme configurations...
   INFO  Theme configurations are written to /tmp/_config.icarus.yml.
   INFO  Example configurations is at /tmp/_config.icarus.yml.example.
   {% endcodeblock %}

5. Icarus now treats post thumbnails and cover images separately.
   For any posts/pages with a thumbnail image, change `thumbnail:` to `cover:` in the front-matter:

   {% codeblock "post.md" lang:diff %}
     title: Getting Started with Icarus
     date: 2020-04-01
   - thumbnail: /gallery/covers/vector_landscape_1.svg
   + cover: /gallery/covers/vector_landscape_1.svg
   ---
   {% endcodeblock %}

   You can still set `thumbnail` in the front-matter to show a smaller thumbnail image for your posts 
   in the archive page and in the recent post widget.

6. Check out the [release notes](https://github.com/ppoffice/hexo-theme-icarus/releases) and the
   [latest documentation](https://ppoffice.github.io/hexo-theme-icarus/categories/) for more information 
   of the new features.
