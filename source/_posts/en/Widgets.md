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

This article covers widgets supported by Icarus 3.
To display multiple widgets at once, simply add individual widget configuration
to the `widgets` array.
They will appear in the order of their definitions.
The `type` and `position` settings are required for every widget.
Here is an example:

{% codeblock themes/icarus/_config.yml lang:yaml %}
widgets:
    -
        type: ... # Widget 1
        position: left
        ...
    -
        type: ... # Widget 2
        position: right
        ...
{% endcodeblock %}

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-globe-asia mr-2"></i>This article is also available in 
<a href="{% post_path zh-CN/Widgets %}">简体中文</a>.
</div>
</article>

<!-- more -->

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-info-circle mr-2"></i>The following widgets are provided by
<a href="https://github.com/ppoffice/hexo-component-inferno">ppoffice/hexo-component-inferno</a>.
Please refer to it for a complete list of supported plugins and their configuration details.
</div>
</article>


## Profile

You can showcase the post author/site admin information via the profile widget.
Its configuration is listed below:

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

- If you wish to use [Gravatar](https://en.gravatar.com/) instead of `avatar` as your profile picture,
  fill in the Gravatar email address in the `gravatar` setting and leave `avatar` empty;

- There two acceptable formats for `social_links`:

    **Icon**:

    {% codeblock social_links lang:yaml %}
    <link_name>:
        icon: <fontawesome_icon_class_name>
        url: <link_url>
    {% endcodeblock %}

    **Text**:

    {% codeblock social_links lang:yaml %}
    <link_name>: <link_url>
    {% endcodeblock %}


## Table of Contents

To show the table of contents of the current post, add the following widget configuration to your theme
configurations:

{% codeblock themes/icarus/_config.yml lang:yaml %}
widgets:
    -
        type: toc
        position: left
{% endcodeblock %}

Then, add `toc: true` to the front-matter of your post:

{% codeblock Post.md lang:yaml %}
title: A post with the table of contents
toc: true
---
Post content...
{% endcodeblock %}


## External Links

You can display a list of external sites with the external links widget.
An example configuration is listed below:

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

Use the following configuration to enable the recent posts widget:

{% codeblock themes/icarus/_config.yml lang:yaml %}
widgets:
    -
        position: right
        type: recent_posts
{% endcodeblock %}


## Archives

Use the following configuration to enable the archives widget:

{% codeblock themes/icarus/_config.yml lang:yaml %}
widgets:
    -
        position: right
        type: archives
{% endcodeblock %}


## Categories

Use the following configuration to enable the categories widget:

{% codeblock themes/icarus/_config.yml lang:yaml %}
widgets:
    -
        position: right
        type: categories
{% endcodeblock %}


## Tags

Use the following configuration to enable the tags widget:

{% codeblock themes/icarus/_config.yml lang:yaml %}
widgets:
    -
        position: right
        type: tags
{% endcodeblock %}


## Subscribe Email

The email subscription feature of Icarus is provided by Google Feedburner.
To enable this widget, take the following steps:

1. First, you need to generate the RSS feed of your Hexo site using a Hexo plugin like
   [hexo-generator-feed](https://github.com/hexojs/hexo-generator-feed).

2. Then, go to [Google Feedburner](https://feedburner.google.com), log into your Google account,
   and add your RSS feed by typing in the RSS feed address to the input box and click "Next".

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/feedburner-homepage.png 360 '"Homepage - Feedburner" "Homepage - Feedburner"' %}
   <br>

3. Next, fill in the "Feed Title" on the next page.
   Click "Next" to continue customizing your feed or click "Skip directly to feed management" to
   finish.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/feedburner-add-feed.png 360 '"Add Feed - Feedburner" "Add Feed - Feedburner"' %}
   <br>

4. When finished adding the feed, click the "My Feeds" link on the top of the page.
   Click your newly added feed on the "My Feeds" page.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/feedburner-feed-list.png 360 '"Feed List - Feedburner" "Feed List - Feedburner"' %}
   <br>

5. Switch to the "Publicize" tab and click the "Email Subscription" link on the left side of the page.
   Enable "Email Subscription" by clicking the "Activate" button.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/feedburner-activate-email.png 360 '"Activate Email Subscription - Feedburner" "Activate Email Subscription - Feedburner"' %}
   <br>

6. Find the following information in the HTML code on the "Email Subscription"
   page:

   {% codeblock Google Feedburner URL %}
   https://feedburner.google.com/fb/a/mailverify?uri=******
   {% endcodeblock %}

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/feedburner-get-code.png 360 '"Get Code - Feedburner" "Get Code - Feedburner"' %}
   <br>

   Copy the ID after `uri=` (e.g., `feedforall/ABCD`) to the `feedburner_id` setting of the widget configuration:

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

Create a new AD on [Google AdSense](https://www.google.com/adsense).
Then, copy the values of `data-ad-client` and `data-ad-slot` from the AD HTML code to
the `client_id` and `slot_id` setting of the widget configuration, respectively.
Here is an example:

{% codeblock themes/icarus/_config.yml lang:yaml %}
widgets:
    -
        position: left
        type: adsense
        client_id: ca-pub-xxxxxxxx
        slot_id: xxxxxxx
{% endcodeblock %}


<article class="message message-immersive is-warning">
<div class="message-body">
<i class="fas fa-question-circle mr-2"></i>Something wrong with this article? 
Click <a href="https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/en/Widgets.md">here</a> 
to submit your revision.
</div>
</article>
