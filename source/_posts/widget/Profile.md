title: Profile Sidebar Widget
date: 2018-02-01
categories:
- Widgets
tags:
- Getting Started
widgets:
    -
        type: profile
        position: right
        author: hulatocat
        author_title: A GitHub Octocat
        location: GitHub Inc.
        avatar: https://octodex.github.com/images/hula_loop_octodex03.gif
        gravatar: 
        follow_link: https://octodex.github.com/hulatocat
        social_links:
            Github:
                icon: fab fa-github
                url: 'http://github.com/'
            Icarus:
                icon: fas fa-palette
                url: 'http://github.com/ppoffice/hexo-theme-icarus'
---

Icarus offers a way to showcase yourself using the profile sidebar widget. To use this widget, simply add the following lines to the widgets section of your `_config.yml`:

{% codeblock lang:yaml _config.yml %}
    -
        type: profile
        position: # show in left or right sidebar
        author: # your name
        author_title: # your title
        location: # where are you
        avatar: # path or url to your avatar image
        gravatar: # your gravatar email
        follow_link: # path or url to any page you want
        social_links: # add links to your social network here
{% endcodeblock %}
<!-- more -->
There are two things that you should note:

- If you want to [Gravatar](https://en.gravatar.com/), fill in your email in the `gravatar` field. Otherwise, leave it blank or it will override the avatar setting.

- The `social_links` field accepts an array of links which are either shown as text link or icon link:
    - Text link
        ```yml
        social_links:
            Facebook: http://facebook.com
            Twitter: http://twitter.com
        ```
    - Icon link
        ```yml
        social_links:
            Facebook:
                icon: fab fa-facebook
                url: http://facebook.com
            Twitter:
                icon: fab fa-twitter
                url: http://twitter.com
        ```
        The `icon` here refers to the [Font Awesome](https://fontawesome.com/) icon class name by default, which you can find in the Font Awesome icon details page.