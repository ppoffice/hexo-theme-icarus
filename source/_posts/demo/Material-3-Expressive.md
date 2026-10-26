title: Material 3 Expressive Theme Variant
date: 2026-10-22
tags:
- Demo
language: en
variant: m3e
appearance: auto
sidebar:
    left:
        sticky: false
    right:
        sticky: false
widgets:
    -
        position: left
        type: profile
        avatar: /img/avatar.png
        author: PPOffice
        author_title: Web Developer
        location: Earth, Solar System
        follow_link: 'https://github.com/ppoffice'
        social_links:
            Github:
                icon: fab fa-github
                url: 'https://github.com/ppoffice'
            Facebook:
                icon: fab fa-facebook
                url: 'https://facebook.com'
            Twitter:
                icon: fab fa-twitter
                url: 'https://twitter.com'
            Dribbble:
                icon: fab fa-dribbble
                url: 'https://dribbble.com'
            RSS:
                icon: fas fa-rss
                url: /
    -
        position: left
        type: links
        links:
            Hexo: 'https://hexo.io'
            Bulma: 'https://bulma.io'
    -
        position: left
        type: categories
    -
        position: right
        type: recent_posts
    -
        position: right
        type: archives
    -
        position: right
        type: tags
    -
        position: right
        type: github_calendar
        username: ppoffice
cover: /gallery/covers/material-3-expressive.webp
thumbnail: /gallery/covers/material-3-expressive.webp
---

Icarus includes a variant inspired by Material 3 Expressive. It brings softly tinted surfaces,
rounded cards, pill-shaped controls, and flower-like accents to the familiar Icarus layout.
Navigation items and buttons change shape on hover or keyboard focus, while menus open with
spring-like motion.

<!-- more -->

To enable the variant, open `_config.icarus.yml` and make the following change:

{% codeblock _config.icarus.yml lang:diff %}
- variant: default
+ variant: m3e
{% endcodeblock %}

The variant can also be set for a single post or page in its front-matter, as this post does:

{% codeblock Material-3-Expressive.md lang:yaml %}
title: Material 3 Expressive Theme Variant
variant: m3e
appearance: auto
---
{% endcodeblock %}

The variant supports `appearance: light`, `dark`, and `auto`, as described in {% post_link demo/Dark-Mode "Dark Appearance" %}.
Code blocks use colors that match the surfaces of the variant.

It uses `Roboto Flex`, `Roboto Mono`, and `Noto Sans SC`, loaded from the web font CDN
(see {% post_link en/CDN-Providers "CDN Providers" %}).
Motion is reduced for visitors who prefer reduced motion in their system settings.
It should be noted that the variant uses recent web styling features that do not work correctly in some legacy browsers.

The colors, shapes, and motion of the variant are CSS variables defined at the top of
`<icarus_directory>/include/style/m3e/foundation.styl`.
For example, change `--m3-h` from its default value of `285` to shift the whole palette to another hue.

For an overview of theme options, see {% post_link en/Configuring-Theme "Configuring the Theme" %}.
