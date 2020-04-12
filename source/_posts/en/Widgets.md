title: Icarus User Guide - Widgets
date: 2017-01-31
categories:
- Widgets
tags:
- Icarus User Guide
language: en
toc: true
sidebar:
    left:
        sticky: false
    right:
        sticky: true
widgets:
    -
        position: left
        type: recent_posts
    -
        position: left
        type: links
        links:
            Hexo: 'https://hexo.io'
            Bulma: 'https://bulma.io'
    -
        position: left
        type: archives
    -
        position: left
        type: categories
    -
        position: left
        type: tags
    -
        position: left
        type: subscribe_email
        description: Subscribe to get the lastest update!
        feedburner_id: ''
    -
        position: right
        type: profile
        author: hulatocat
        author_title: A GitHub Octocat
        location: GitHub Inc.
        avatar: https://octodex.github.com/images/hula_loop_octodex03.gif
        avatar_rounded: false
        gravatar:
        follow_link: 'https://octodex.github.com/hulatocat'
        social_links:
            Github:
                icon: fab fa-github
                url: 'https://github.com/'
            Icarus: 'https://github.com/ppoffice/hexo-theme-icarus'
    -
        position: right
        type: toc
---

<div class="notification is-success is-size-6">
This article is also available in: <a href="{% post_path zh-CN/Widgets %}">简体中文</a>.
</div>

This article covers some widgets supported by Icarus 3.
If you need to display multiple widgets at once, simply add individual widget configuration
to the `widgets` array.
They will appear in the order of their definition.
The `type` and `position` settings are required for every widget.
Here is an example:

{% codeblock themes/icarus/_config.yml lang:yaml %}
widgets:
    -
        type: ... # 挂件1
        position: left
        ...
    -
        type: ... # 挂件2
        position: right
        ...
{% endcodeblock %}

<!-- more -->

<div class="notification is-link is-size-6">

Most of the widgets of Icarus are provided by
[ppoffice/hexo-component-inferno](https://github.com/ppoffice/hexo-component-inferno).
Please refer to it for a complete list of supported widgets and configuration details.

</div>


## Profile

You can showcase the post author/site admin information via the profile widget.
Its configuration is list below:

{% codeblock themes/icarus/_config.yml lang:yaml %}
widgets:
    -
        position: right
        type: profile
        # Author name
        author: hulatocat
        # Title of the author
        author_title: A GitHub Octocat
        # Author location/organization
        location: GitHub Inc.
        # URL of the avatar/profile picture
        avatar: https://octodex.github.com/images/hula_loop_octodex03.gif
        # Whether to show a round clip of the avatar
        avatar_rounded: false
        # The email address of the Gravatar service(if the `avatar` is not set)
        gravatar:
        # The follow link URL
        follow_link: 'https://octodex.github.com/hulatocat'
        # Social media link URLs
        social_links:
            Github:
                icon: fab fa-github
                url: 'https://github.com/'
            Icarus: 'https://github.com/ppoffice/hexo-theme-icarus'
{% endcodeblock %}

Some notes on the configuration:

- If you wish to use [Gravatar](https://en.gravatar.com/) instead of the `avatar` setting as profile picture,
  you can fill in the Gravatar email address in `gravatar` and leave `avatar` empty;

- There two possible formats for `social_links`:

    **Icon**:

    {% codeblock social_links lang:yaml %}
    <Name of the link>:
        icon: <HTML class name of the FontAwesome5 icon>
        url: <URL of the link>
    {% endcodeblock %}

    **Text**:

    {% codeblock social_links lang:yaml %}
    <Name of the link>: <URL of the link>
    {% endcodeblock %}


## Table of Contents

To show the table of contents of the current post, please add the following widget configuration to your theme's
configuration file:

{% codeblock themes/icarus/_config.yml lang:yaml %}
widgets:
    -
        type: toc
        position: left
{% endcodeblock %}

Then, add `toc: true` to the front-matter of the post you wish to display the widget:

{% codeblock Post.md lang:yaml %}
title: A post with the table of contents
toc: true
---
Post content...
{% endcodeblock %}


## External Links

You can display a list of external sites and links to them using the external links widget.
An example of its configuration is listed below:

{% codeblock themes/icarus/_config.yml lang:yaml %}
widgets:
    -
        position: left
        type: links
        # Name and URL of the external site
        links:
            Hexo: 'https://hexo.io'
            Bulma: 'https://bulma.io'
{% endcodeblock %}


## Recent Posts

Please use the following widget configuration to enable the recent posts widget:

{% codeblock themes/icarus/_config.yml lang:yaml %}
widgets:
    -
        position: right
        type: recent_posts
{% endcodeblock %}


## Archives

Please use the following widget configuration to enable the archives widget:

{% codeblock themes/icarus/_config.yml lang:yaml %}
widgets:
    -
        position: right
        type: archives
{% endcodeblock %}


## Categories

Please use the following widget configuration to enable the categories widget:

{% codeblock themes/icarus/_config.yml lang:yaml %}
widgets:
    -
        position: right
        type: categories
{% endcodeblock %}


## Tags

Please use the following widget configuration to enable the tags widget:

{% codeblock themes/icarus/_config.yml lang:yaml %}
widgets:
    -
        position: right
        type: tags
{% endcodeblock %}


## Subscribe Email

The email subscription feature of Icarus is provided by Google Feedburner.

1. To turn on this widget, please generate the RSS feed of your Hexo site using some Hexo plugins like
   [hexo-generator-feed](https://github.com/hexojs/hexo-generator-feed).

2. Then, log into [Google Feedburner](https://feedburner.google.com) and add your RSS feed.
   Click the "My Feeds" link on the top of the page when finished.
   Click your newly added feed on the "My Feeds" page.

3. Click the "Publicize" tab and then the "Email Subscription" link on the left side of the page.
   Click the "Activate" button and find the following information in the HTML code on the "Email Subscription"
   page:

   {% codeblock Google Feedburner URL %}
   https://feedburner.google.com/fb/a/mailverify?uri=******
   {% endcodeblock %}

   Copy the ID after `uri=` (e.g., `feedforall/ABCD`) to the `feedburner_id` setting in the widget configuration.

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    widgets:
        -
            position: left
            type: subscribe_email
            # (Optional) One line of description text
            description: Subscribe to get the lastest update!
            feedburner_id: feedforall/ABCD
    {% endcodeblock %}


## Google AdSense

Please log into [Google AdSense](https://www.google.com/adsense) and create a new AD.
Then, copy the values of `data-ad-client` and `data-ad-slot` from the HTML code of the AD to
the `client_id` and `slot_id` setting of the widget respectively.
Here is an example:

{% codeblock themes/icarus/_config.yml lang:yaml %}
widgets:
    -
        position: left
        type: adsense
        client_id: ca-pub-xxxxxxxx
        slot_id: xxxxxxx
{% endcodeblock %}


<div class="notification is-warning is-size-6">
Something wrong with this article? Click <a href="https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/en/Widgets.md">here</a> to submit your revision.
</div>
