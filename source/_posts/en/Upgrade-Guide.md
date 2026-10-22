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

### Upgrading from 6.2 to 6.3

1. Upgrade Icarus to 6.3.0.
   If you installed the theme via NPM, run the following command in your site root directory:

   {% codeblock "Shell" lang:shell %}
   $ npm install --save hexo-theme-icarus@^6.3.0
   {% endcodeblock %}

   If you installed the theme from source, replace `themes/icarus` with the 6.3.0 source code
   (e.g., clone it with `-b 6.3.0` as described in {% post_link en/Getting-Started %}).
   Icarus 6.3 requires `hexo-component-inferno` 4.1.0 or a newer version, which source installs have to
   install in the site root directory themselves.
   Until you do, the dependency check stops every `hexo` command and prints the command to run, for example:

   {% codeblock "Shell" lang:shell %}
   $ npm install --save hexo-component-inferno@^4.1.0
   {% endcodeblock %}

2. Icarus 6.3 does not upgrade your theme configuration file.
   The configuration version is still `5.1.0`, so no migration runs and none of the new options are added to
   your `_config.icarus.yml`.
   Add the ones you want by hand:

   - `appearance`, `logo_dark`, and `article.highlight.dark_theme` for the dark appearance; see
     <a href="{% post_path en/Configuring-Theme %}#Appearance">Appearance</a> and {% post_link demo/Dark-Mode %}.
   - Sub-menus in `navbar.menu`; see <a href="{% post_path en/Configuring-Theme %}#Navigation-Bar">Navigation Bar</a>.
   - `providers.cdn_overrides`; see
     <a href="{% post_path en/CDN-Providers %}#Per-package-CDN-providers">Per-package CDN providers</a>.
   - The `amount` option of the archives and categories widgets; see {% post_link en/Widgets %}.
   - The Artalk, Beaudar, and Cusdis comment plugins; see {% post_link en/Comment-Plugins %}.
   - The Umami, Matomo, and `waline_pageview` plugins; see {% post_link en/Web-Analytics-Plugins %}.

   To see every option with its description, you can let Icarus generate a fresh configuration file:
   rename your `_config.icarus.yml` temporarily, run `hexo clean` to generate a new one, copy the options you
   need into your own file, and then put your file back.

3. If you use the Valine comment plugin, Icarus now prints a warning on every `hexo` command,
   because Valine exposes the email addresses of commenters (and their IP addresses with `record_ip`) to
   anyone with the public LeanCloud keys of your site.
   Consider switching to another comment plugin, such as Waline, Twikoo, or Giscus
   ([#788](https://github.com/ppoffice/hexo-theme-icarus/issues/788)).

4. The following changes only matter if you have customized copies of the theme's templates or scripts:

   - `layout/misc/paginator.jsx` is removed.
     `layout/index.jsx` and `layout/archive.jsx` use the paginator of `hexo-component-inferno` again
     (`hexo-component-inferno/lib/view/misc/paginator`), so update customized copies that require
     `./misc/paginator`.
   - The PJAX selectors in `source/js/pjax.js` changed: `[data-pjax]` became `[data-pjax]:not(link)`,
     `.navbar-logo` and `.footer-logo` were added, and `#comments link` and `#comments script` were removed.
     The page title, the appearance, and the code highlight stylesheets are now switched by functions in
     the `switches` option.
     Merge these changes into a customized `pjax.js`.

5. Focusing the search button no longer opens the search.
   Click it, or press Enter or Space on it, or use the new `/`, Ctrl+K, or Cmd+K shortcuts.

6. Run `hexo clean` and generate your site again.

7. Check out the [release notes](https://github.com/ppoffice/hexo-theme-icarus/releases) for the full list of
   changes and bug fixes.

#### Changes from hexo-component-inferno 4.2.0

Icarus 6.3.0 accepts any `hexo-component-inferno` 4.x from 4.1.0 on, so a site that installs or updates its
packages now gets hexo-component-inferno 4.2.0.
It changes some behaviors that you may notice right after upgrading:

- **Waline:** `image_uploader`, `highlighter`, `tex_renderer`, and `search` now work the way the
  configuration has always described them: `true` disables the feature.
  If you use Waline, check these options:

  | Value in `_config.icarus.yml` | hexo-component-inferno 4.1.0 | hexo-component-inferno 4.2.0 |
  |---|---|---|
  | not set | disabled | Waline's default (enabled) |
  | `false` | disabled | Waline's default (enabled) |
  | `true` | Waline's default (enabled) | disabled |
  | `null` (empty) | Waline's default (enabled) | Waline's default (enabled) |

  For example, if you never set these options, image upload, code highlighting, TeX rendering, and the
  GIF search now appear in your comment box.
  To turn a feature off, set its option to `true`.
- **Category pages** are now split into pages of `per_page` posts (the site setting) when
  `category_generator.per_page` is not set in `_config.yml`, like `hexo-generator-category` does.
  Before, they showed all posts on one page.
  To keep one page, set `category_generator.per_page: 0` in `_config.yml`.
- Pages that use Valine, Gitment, AddThis, or the Google FeedBurner `subscribe_email` widget print a
  deprecation warning when you generate your site.

### Upgrading from 6.x to 6.2 and Hexo 8

1. Upgrade Icarus to 6.2.0 or a newer version.
   If you installed the theme via NPM, run the following command in your site root directory:

   {% codeblock "Shell" lang:shell %}
   $ npm install --save hexo-theme-icarus@^6.2.0
   {% endcodeblock %}

2. (Optional) Icarus 6.2 supports both Hexo 7 and Hexo 8.
   To upgrade to Hexo 8, upgrade Node.js to 20.19.0 or a newer version first, and then upgrade Hexo and
   your Hexo plugins to their latest versions.
   Refer to the [Hexo release notes](https://github.com/hexojs/hexo/releases) for the breaking changes.

   {% codeblock "Shell" lang:shell %}
   $ npm install --save hexo@^8.0.0
   {% endcodeblock %}

3. The following changes only matter if you customized the theme's files or scripts:

   - `source/css/style.styl` is renamed to `source/css/_style.styl`, so the build no longer outputs an
     unused `css/style.css`.
     Update customized stylesheets that `@import 'style'` to `@import '_style'`.
   - Pages no longer load moment.js, so `window.moment` is not available to your scripts any more.
     Relative dates are formatted with the browser's `Intl.RelativeTimeFormat` instead.
     Load moment.js yourself if your scripts use it.
   - The table of contents and search buttons in the navigation bar, the back-to-top button, and the copy
     button of code blocks are now `<button>` elements instead of `<a>` links.
     Update custom styles or scripts that select them as `a` elements.

4. Icarus 6.2 adds the `--icarus-dont-check-deps` flag to skip the dependency check, e.g., when you try out a
   newer major version of a dependency.

5. Run `hexo clean` and generate your site again.

6. Check out the [release notes](https://github.com/ppoffice/hexo-theme-icarus/releases) for the full list of
   changes and bug fixes.

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
