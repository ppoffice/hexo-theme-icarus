title: Upgrade Guide
date: 2020-01-01
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

### Upgrading from 3.x to 4.x

1. Upgrade Node.js to 10.13.0 or a newer version.

2. Install Icarus 4.x either via source code dowload or NPM install.
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
   For any posts/pages with an thumbnail image, change `thumbnail:` to `cover:` in the front-matter:

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
