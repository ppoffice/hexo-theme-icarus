title: Cyberpunk Theme Variant
date: 2018-10-22 19:23:58
tags:
- Demo
variant: cyberpunk
article:
    highlight:
        theme: qtcreator_dark
thumbnail: /uncategorized/cyberpunk-theme-variant/CP77-KV-en.jpg
---

Icarus includes a new variant called Cyberpunk starting from version 3.0.0.
The theme is inspired by the video game [Cyberpunk 2077](https://www.cyberpunk.net/us/en/) 
developed by CD PROJEKT RED.
This variant aims at providing a different Icarus experience to these who like dark-themed
blogs.
It should be noted that it uses recent web styling features that are not working properly 
in some legacy browsers, including Internet Explorer and legacy Microsoft Edge.

<!-- more -->

To enable the Cyberpunk theme, please open your theme's `_config.yml` and make the following
change:

{% codeblock themes/icarus/_config.yml lang:diff %}
- variant: default
+ variant: cyberpunk
{% endcodeblock %}

You may also want to change the theme of highlighted code blocks.
In that case, you can find some dark highlight.js themes 
[here](https://github.com/highlightjs/highlight.js/tree/master/src/styles).
Copy the file name excluding the `.css` extension and put it in the `article.highlight.theme`
option in Icarus' `_config.yml`.
For example, if you want to change the theme to `xt256`, simply make the following edit:

{% codeblock themes/icarus/_config.yml lang:diff %}
# Article related configurations
article:
    highlight:
-         theme: atom-one-light
+         theme: xt256
{% endcodeblock %}

Apart from the color palette, Icarus also used two image resources taken from the official 
website of the game, which are placed on the top navigation bar and bottom page footer.
If you wish to make further modifications to this theme variant, please take a look at
`themes/icarus/source/css/cyberpunk.styl`.
