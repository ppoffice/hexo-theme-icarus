title: Cyberpunk Theme Variant
date: 2026-10-21
tags:
- Demo
variant: cyberpunk
sidebar:
    left:
        sticky: false
    right:
        sticky: false
widgets:
    -
        position: left
        type: profile
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
cover: /gallery/covers/neon-city.svg
thumbnail: /gallery/covers/neon-city.svg
---

Icarus includes a second variant called Cyberpunk, for those who like dark-themed blogs.
It takes the look of a city at night from cyberpunk fiction: a dark screen lit by neon signs in yellow, cyan,
and magenta, panels framed like a heads-up display with chamfered corners, scanlines, and a neon grid running
to the horizon at the bottom of the page.
The titles of the posts glitch when you hover over them.
It should be noted that it uses recent web styling features that are not working correctly
in some legacy browsers, including Internet Explorer and legacy Microsoft Edge.

<!-- more -->

To enable the Cyberpunk theme, open `_config.icarus.yml` and make the following change:

{% codeblock _config.icarus.yml lang:diff %}
- variant: default
+ variant: cyberpunk
{% endcodeblock %}

Like other theme settings, the variant can also be set for a single post or page in its front-matter, as this
post does:

{% codeblock Cyberpunk.md lang:yaml %}
title: Cyberpunk Theme Variant
variant: cyberpunk
---
{% endcodeblock %}

The Cyberpunk variant is always dark, so the `appearance` and `article.highlight.dark_theme` settings of
the {% post_link demo/Dark-Mode "dark appearance" %} do not apply to it.
Its navigation bar and footer are dark as well, so it shows the dark version of your logo, set in `logo_dark`
(the theme's own logo switches to `/img/logo-dark.svg` by itself).

Code blocks look like terminal windows, and their code is colored with the neon palette of the variant,
whatever the theme set in `article.highlight.theme`.

The variant uses the `Oxanium` and `JetBrains Mono` fonts, which are loaded from the web font CDN
(see {% post_link en/CDN-Providers "CDN Providers" %}).

Its animations, such as the glitch of the titles and the moving grid of the footer, stop for visitors who
prefer reduced motion in the settings of their system.

If you wish to make further modifications to this theme variant, you can take a look at
`<icarus_directory>/source/css/cyberpunk.styl`.
Its colors are defined at the top of the file, such as `$neon-yellow`, `$neon-cyan`, and `$neon-pink` for the neon
lights, and `$night` for the background.
