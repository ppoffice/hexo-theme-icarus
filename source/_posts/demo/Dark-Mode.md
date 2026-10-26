title: Dark Appearance
date: 2026-10-19
tags:
- Demo
toc: true
appearance: dark
cover: /gallery/covers/dark-mode.png
thumbnail: /gallery/covers/dark-mode.png
---

The default and Material 3 Expressive variants of Icarus can be dark, either all the time or only when the browser or operating
system of your visitors asks for a dark color scheme.
This has long been requested by the community
([#1108](https://github.com/ppoffice/hexo-theme-icarus/issues/1108)).
The dark colors live in the same stylesheet as the light ones, so there is no extra request.
This post itself is always displayed with the dark appearance, while the rest of this site uses `appearance: auto`
and follows the color scheme of your system.

<article class="message message-immersive is-warning">
<div class="message-body">
<i class="fas fa-info-circle mr-2"></i>The dark appearance is available since Icarus 6.3.0.
It is not available in Icarus 6.2.0 or earlier.
</div>
</article>

<!-- more -->

## Enabling the Dark Appearance

The appearance is controlled by the new `appearance` setting, which accepts three values:

- `light` (the default): the light look Icarus has always had.
- `auto`: light or dark, following the color scheme setting of each visitor's browser or operating system
  (the `prefers-color-scheme` media query).
  Visitors can also pick light or dark with the sun and moon button in the navigation bar, and their browser remembers the choice.
- `dark`: always dark.

To follow the setting of your visitors, open `_config.icarus.yml` and add the following line
(or change it, if your configuration file already has `appearance: light`):

{% codeblock _config.icarus.yml lang:diff %}
  variant: default
+ appearance: auto
{% endcodeblock %}

To make your site dark for everyone, use `dark` instead:

{% codeblock _config.icarus.yml lang:diff %}
  variant: default
+ appearance: dark
{% endcodeblock %}

Form controls and scrollbars drawn by the browser follow the appearance as well.
Pages set to `light` or `dark` have no sun and moon button.
The Cyberpunk variant, which is already dark, ignores this setting, as well as the `dark_theme` setting
described below, and always shows the dark logo set in `logo_dark`.

## Per-Layout and Per-Page Appearance

Like most other theme settings, `appearance` can be overridden in the layout configuration files
(`_config.post.yml` and `_config.page.yml`) and in the front-matter of a post or page.
For example, to make all posts dark while keeping the index and other pages light:

{% codeblock _config.post.yml lang:yaml %}
appearance: dark
{% endcodeblock %}

Or, to make a single post dark:

{% codeblock post.md lang:yaml %}
title: A Post at Night
appearance: dark
---
Post content...
{% endcodeblock %}

This is exactly how this post is made dark.

## Code Highlight Theme

When a page is dark, code blocks use the `dark_theme` setting in the `article` > `highlight` section,
which defaults to `atom-one-dark`.
With `auto`, code blocks switch along with the rest of the page.
You can find other dark themes of highlight.js 11.11.1, the version that Icarus uses,
[here](https://github.com/highlightjs/highlight.js/tree/11.11.1/src/styles).
Copy the file name, excluding the `.css` extension, and put it in the `dark_theme` setting.
Themes in the `base16` folder need the folder name as well, such as `base16/dracula`.
For example, to use `github-dark`:

{% codeblock _config.icarus.yml lang:diff %}
  article:
      highlight:
          theme: atom-one-light
+         dark_theme: github-dark
{% endcodeblock %}

## Logo

The logo shipped with Icarus has a dark version with a light wordmark, which is used automatically on dark
pages as long as `logo` is left as `/img/logo.svg`.
If you use your own logo image, provide a version for dark backgrounds with `logo_dark`; otherwise, your logo
is shown as it is on dark pages.
Text logos need nothing.

{% codeblock _config.icarus.yml lang:diff %}
  logo: /img/my-logo.svg
+ logo_dark: /img/my-logo-dark.svg
{% endcodeblock %}

## Customizing the Colors

This section applies to the default variant.
For the Material 3 Expressive variant, see {% post_link demo/Material-3-Expressive "Material 3 Expressive Theme Variant" %}.

The dark colors are Stylus variables, such as `$dark-background`, `$dark-surface`, `$dark-text`, and
`$dark-link`, listed at the top of `<icarus_directory>/include/style/dark.styl`.
They are declared with `?=`, so you can either change them there or define your own values at the top of
`<icarus_directory>/source/css/default.styl`, before the stylesheets are imported:

{% codeblock <icarus_directory>/source/css/default.styl lang:diff %}
+ $dark-background = #0d1117
+ $dark-link = #58a6ff
  @import '_style'
  @import '../../include/style/dark'
{% endcodeblock %}

Pages with the `auto` or `dark` appearance also have a `data-appearance="auto"` or `data-appearance="dark"`
attribute on the `<html>` element (light pages have none), which your own styles can target.
When a visitor picks light or dark with the button, the attribute of an `auto` page changes to `light` or `dark`.
Remember that `auto` pages are only dark inside the `prefers-color-scheme: dark` media query:

{% codeblock lang:css %}
html[data-appearance="dark"] .content img {
    filter: brightness(.9);
}

@media (prefers-color-scheme: dark) {
    html[data-appearance="auto"] .content img {
        filter: brightness(.9);
    }
}
{% endcodeblock %}

## Limitations

- The Giscus, utterances, Beaudar, Gitalk, Waline, and Artalk comment plugins follow the appearance of the
  page, unless you set their own theme or dark mode settings.
  Some of them pick their colors when the comments are loaded, so reload the page if the appearance changes afterwards.
- Other comment plugins, and other content from third-party services, such as the Google Custom Search, Baidu,
  and Algolia search widgets, and share buttons, keep their own (usually light) look.
- Images are not inverted or dimmed.
- Browsers that do not support the `:where()` CSS selector display the light appearance, and those that do
  not support the `prefers-color-scheme` media query display `auto` pages in light.
