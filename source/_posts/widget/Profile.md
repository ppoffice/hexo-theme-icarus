title: Profile Sidebar Widget
date: 2018-10-20
categories:
- Widgets
tags:
- Getting Started
thumbnail: /gallery/thumbnails/deer.jpg
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

Icarus offers a way to showcase yourself using the profile sidebar widget. To use this widget, add the following lines to the widgets section of your `_config.yml`:

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

- If you want to [Gravatar](https://en.gravatar.com/), fill in your email in the `gravatar` field. Otherwise, leave it blank in case it overrides the avatar setting.

- The `social_links` field accepts an array of links which are either shown as a text link or icon link. The details are described in {% post_link theme/Polymorphic-Link-Settings %}.

<a style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-size:12px;line-height:1.2;display:inline-block;border-radius:3px" href="https://unsplash.com/@joeypilgrim?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge" target="_blank" rel="noopener noreferrer" title="Download free do whatever you want high-resolution photos from Joey Pilgrim"><span style="display:inline-block;padding:2px 3px"><svg xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;position:relative;vertical-align:middle;top:-1px;fill:white" viewBox="0 0 32 32"><title>unsplash-logo</title><path d="M20.8 18.1c0 2.7-2.2 4.8-4.8 4.8s-4.8-2.1-4.8-4.8c0-2.7 2.2-4.8 4.8-4.8 2.7.1 4.8 2.2 4.8 4.8zm11.2-7.4v14.9c0 2.3-1.9 4.3-4.3 4.3h-23.4c-2.4 0-4.3-1.9-4.3-4.3v-15c0-2.3 1.9-4.3 4.3-4.3h3.7l.8-2.3c.4-1.1 1.7-2 2.9-2h8.6c1.2 0 2.5.9 2.9 2l.8 2.4h3.7c2.4 0 4.3 1.9 4.3 4.3zm-8.6 7.5c0-4.1-3.3-7.5-7.5-7.5-4.1 0-7.5 3.4-7.5 7.5s3.3 7.5 7.5 7.5c4.2-.1 7.5-3.4 7.5-7.5z"></path></svg></span><span style="display:inline-block;padding:2px 3px">Joey Pilgrim</span></a>