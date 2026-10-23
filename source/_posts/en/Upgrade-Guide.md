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

### Upgrading from 6.5 to 6.6

1. Upgrade Icarus to 6.6.0.
   If you installed the theme via NPM, run the following command in your site root directory:

   {% codeblock "Shell" lang:shell %}
   $ npm install --save hexo-theme-icarus@^6.6.0
   {% endcodeblock %}

   If you installed the theme from source, replace `themes/icarus` with the 6.6.0 source code.
   Icarus 6.6 has the same dependencies as 6.5.

2. `hexo-component-inferno` 4.2.2 loads the post thumbnails of the archive pages and the recent posts widget
   only when they are about to be scrolled to.
   Icarus 6.6 still works with 4.2.1, so update it to get this improvement.
   If you installed the theme via NPM, run:

   {% codeblock "Shell" lang:shell %}
   $ npm update hexo-component-inferno
   {% endcodeblock %}

   If you installed the theme from source, run:

   {% codeblock "Shell" lang:shell %}
   $ npm install --save hexo-component-inferno@^4.2.2
   {% endcodeblock %}

3. If you keep customized copies of the theme's files, apply the changes of 6.6 to them:

   - `layout/common/navbar.jsx`: the `sticky` option of the navigation bar.
   - `layout/common/article.jsx`: the outdated post notice, and the loading of the cover images.
   - `layout/index.jsx`: only the first cover image of an index page is loaded right away.
   - `layout/common/head.jsx`: the web fonts are requested with `display=swap`, and the page connects in advance
     to the origins of the icon and web font files.
   - `layout/common/scripts.jsx`: the preview of folded code blocks.
   - `source/js/main.js` and `source/js/pjax.js`: the outdated post notice, the preview of folded code blocks, the
     sticky navigation bar, and the prefetching of pages with PJAX.

4. Icarus 6.6 does not change the version of the theme configuration file, which is still `5.1.0`.
   Its new options are off by default (see {% post_link en/Configuring-Theme %} and
   {% post_link en/Other-Plugins %}):

   - `navbar.sticky` keeps the navigation bar at the top of the window.
   - `article.outdated_notice` shows a notice on the posts that have not been updated for a long time.
   - `article.highlight.fold_preview` shows the first lines of folded code blocks.
   - `plugins.prefetch` prefetches the pages that visitors are about to open.

5. Run `hexo clean` and generate your site again.

6. Check out the [release notes](https://github.com/ppoffice/hexo-theme-icarus/releases) for the full list of
   changes and bug fixes.

### Upgrading from 6.4 to 6.5

1. Upgrade Icarus to 6.5.0.
   If you installed the theme via NPM, run the following command in your site root directory:

   {% codeblock "Shell" lang:shell %}
   $ npm install --save hexo-theme-icarus@^6.5.0
   {% endcodeblock %}

   If you installed the theme from source, replace `themes/icarus` with the 6.5.0 source code.
   Icarus 6.5 has the same dependencies as 6.4.

2. The Cyberpunk variant has a new look, no longer based on the video game Cyberpunk 2077: neon lights on a
   dark background, panels framed like a heads-up display, and a dark navigation bar and footer
   (see {% post_link demo/Cyberpunk %}).
   If your site, or some of its pages, use `variant: cyberpunk`, check the following:

   - Its navigation bar and footer are dark now, so it shows the dark logo: the image set in `logo_dark`, or
     `/img/logo-dark.svg` when `logo` is the theme's own logo.
     If you use your own logo image, set a version for dark backgrounds in `logo_dark`
     (see {% post_link en/Configuring-Theme %}).
   - Its code font is `JetBrains Mono` instead of `Roboto Mono`.
     If you set your own web font CDN, make sure it provides this font
     (see {% post_link en/CDN-Providers %}).
   - Its code blocks are colored with its own palette, whatever the theme set in
     `article.highlight.theme`.
   - The images of its former navigation bar and footer, `/img/razor-top-black.svg` and
     `/img/razor-bottom-black.svg`, are removed.
     If you use them elsewhere, copy them from the 6.4.1 source code into the `source` directory of your site.
   - `source/css/cyberpunk.styl` is rewritten.
     If you customized it, apply your changes to the new file again.
     Its colors are now variables at the top of the file.

3. If you keep customized copies of the theme's files, apply the changes of 6.5 to them:

   - `layout/common/navbar.jsx` and `layout/common/footer.jsx`: they show the logo for the appearance given by
     the new `getLogoAppearance` function of `include/util/appearance.js`, which is `dark` for the Cyberpunk
     variant.
   - `layout/common/head.jsx`: the web fonts of the Cyberpunk variant are `Oxanium` and `JetBrains Mono`.

4. Icarus 6.5 does not change the theme configuration file: its version is still `5.1.0`, and it has no new
   options.

5. Run `hexo clean` and generate your site again.

6. Check out the [release notes](https://github.com/ppoffice/hexo-theme-icarus/releases) for the full list of
   changes and bug fixes.

### Upgrading from 6.3 to 6.4

1. Upgrade Icarus to 6.4.1.
   If you installed the theme via NPM, run the following command in your site root directory:

   {% codeblock "Shell" lang:shell %}
   $ npm install --save hexo-theme-icarus@^6.4.1
   {% endcodeblock %}

   If you installed the theme from source, replace `themes/icarus` with the 6.4.1 source code.
   Icarus 6.4 requires `hexo-component-inferno` 4.2.1 or a newer version.
   Until source installs install it in the site root directory, the dependency check stops every `hexo`
   command and prints the command to run:

   {% codeblock "Shell" lang:shell %}
   $ npm install --save hexo-component-inferno@^4.2.1
   {% endcodeblock %}

2. If you use Waline, check its `image_uploader`, `highlighter`, `tex_renderer`, and `search` options.
   They now work the way the configuration has always described them: `true` disables the feature.

   | Value in `_config.icarus.yml` | Icarus 6.3 (hexo-component-inferno 4.1.0) | Icarus 6.4 |
   |---|---|---|
   | not set | disabled | Waline's default (enabled) |
   | `false` | disabled | Waline's default (enabled) |
   | `true` | Waline's default (enabled) | disabled |
   | `null` (empty) | Waline's default (enabled) | Waline's default (enabled) |

   For example, if you never set these options, image upload, code highlighting, TeX rendering, and the
   GIF search now appear in your comment box.
   To turn a feature off, set its option to `true`.

3. Category pages are now split into pages of `per_page` posts (the site setting) when
   `category_generator.per_page` is not set in `_config.yml`, like `hexo-generator-category` does.
   Before, they showed all posts on one page.
   To keep one page, set `category_generator.per_page: 0` in `_config.yml`.

4. Configuration files generated by earlier versions have `type: blog` under `head.open_graph`.
   `blog` is not an Open Graph type, so every page had `og:type` "blog".
   Icarus 6.4 ignores it: posts get `article` and other pages get `website`.
   It also prints a warning on every `hexo` command until you delete the `type: blog` line.

5. The following plugins are deprecated, and pages that use them print a warning when you generate your
   site:

   - Valine: LeanCloud, where Valine stores the comments, shuts down on January 12, 2027.
     Switch to Waline, Twikoo, or another comment plugin; see {% post_link en/Comment-Plugins %}.
   - Gitment: it is no longer maintained, and its GitHub sign-in proxy no longer works.
     Use Giscus, utterances, or Gitalk instead.
   - AddThis: it shut down on May 31, 2023.
     Use AddToAny or ShareThis instead; see {% post_link en/Share-Buttons %}.
   - The Google FeedBurner `subscribe_email` widget: FeedBurner stopped email subscriptions in July 2021.
     Use the follow.it widget instead; see <a href="{% post_path en/Widgets %}#follow-it">follow.it</a>.
     Newly generated configuration files no longer include it.

6. Icarus 6.4 does not upgrade your theme configuration file either: the configuration version is still
   `5.1.0`.
   Add the new options you want by hand:

   - <a href="{% post_path en/Widgets %}#Archives">Archives</a> widget: `show_count`, `group_by`, `order`,
     and `format`.
   - <a href="{% post_path en/Widgets %}#Categories">Categories</a> widget: `order_by`, `order`,
     `show_current`, `show_count`, and `depth`.
   - <a href="{% post_path en/Widgets %}#Recent-Posts">Recent Posts</a> widget: `limit`.
   - <a href="{% post_path en/Comment-Plugins %}#Giscus">Giscus</a>: `term`, which the `specific` and
     `number` mappings need.

   The camelCase names that the archives and categories widgets used to read (`showCount`, `orderBy`, and
   `showCurrent`) still work.
   Options of these widgets that you leave empty take their default values.

7. If you have a customized copy of the theme's templates or scripts, merge the following changes into it:

   - `layout/common/head.jsx`: the theme and web font stylesheets of the variant have a `data-variant`
     attribute.
   - `source/js/pjax.js`: PJAX switches these stylesheets when a page sets another `variant` in its
     front-matter.
     It also loads the plugins of the new page that the current page does not have, such as MathJax or
     KaTeX enabled in the front-matter of a post, and renders KaTeX after each switch.

8. Run `hexo clean` and generate your site again.

9. Check out the [release notes](https://github.com/ppoffice/hexo-theme-icarus/releases) for the full list of
   changes and bug fixes.

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

#### Changes from hexo-component-inferno 4.2

Icarus 6.3.0 accepts any `hexo-component-inferno` 4.x from 4.1.0 on, so a site that installs or updates its
packages gets hexo-component-inferno 4.2, which changes the Waline options and the category pages.
These changes are described in steps 2 to 5 of
<a href="#Upgrading-from-6-3-to-6-4">Upgrading from 6.3 to 6.4</a>.

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
