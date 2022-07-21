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
        order_by: -name
        amount:
        show_count: false
    -
        position: left
        type: followit
        description: Subscribe to get the lastest update!
        action_url: ''
        verification_code: ''
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
        index: false
---

This article covers widgets supported by Icarus 5.
To display multiple widgets at once, simply add individual widget configuration
to the `widgets` array.
They will appear in the order of their definitions.
The `type` and `position` settings are required for every widget.
Here is an example:

{% codeblock _config.icarus.yml lang:yaml %}
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

{% codeblock _config.icarus.yml lang:yaml %}
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

{% codeblock _config.icarus.yml lang:yaml %}
widgets:
    -
        type: toc
        position: left
        # Whether to number each table of contents item
        index: true
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

{% codeblock _config.icarus.yml lang:yaml %}
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

{% codeblock _config.icarus.yml lang:yaml %}
widgets:
    -
        position: right
        type: recent_posts
{% endcodeblock %}


## Archives

Use the following configuration to enable the archives widget:

{% codeblock _config.icarus.yml lang:yaml %}
widgets:
    -
        position: right
        type: archives
{% endcodeblock %}


## Categories

Use the following configuration to enable the categories widget:

{% codeblock _config.icarus.yml lang:yaml %}
widgets:
    -
        position: right
        type: categories
{% endcodeblock %}


## Tags

Use the following configuration to enable the tags widget:

{% codeblock _config.icarus.yml lang:yaml %}
widgets:
    -
        position: right
        type: tags
        order_by: name      # Optional. Order by tag name or length. Prefix with `-` to sort in descending order.
        amount: 20          # Optional. The maximum number of tags to show. Leave empty to show all.
        show_count: true    # Optional. Whether to show post count right to tag name.
{% endcodeblock %}


## Google Feedburner

<article class="message message-immersive is-danger">
<div class="message-body">
<i class="fas fa-exclamation-triangle mr-2"></i><a href="https://support.google.com/feedburner/answer/10483501" target="_blank">Google is shutting down the email subscription feature of Feedburner.</a> You can switch to <a href="#follow-it">the follow.it widget</a> or other email subscription services.
</div>
</article>

To enable Google Feedburner email subscription widget, take the following steps:

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

    {% codeblock _config.icarus.yml lang:yaml %}
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

{% codeblock _config.icarus.yml lang:yaml %}
widgets:
    -
        position: left
        type: adsense
        client_id: ca-pub-xxxxxxxx
        slot_id: xxxxxxx
{% endcodeblock %}


## follow.it

To enable [follow.it](https://follow.it) email subscription widget, take the following steps:

1. First, you need to generate the RSS feed of your Hexo site using a Hexo plugin like
   [hexo-generator-feed](https://github.com/hexojs/hexo-generator-feed).

2. Go to [follow.it](https://follow.it/ni) and enter the URL to your RSS feed file in the text input under
   "Add the follow feature to your site", e.g., `http://example.com/atom.xml`.
   Then, click "Next".

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/follow-it-enter-feed-url.png 360 '"Enter Feed URL - follow.it" "Enter Feed URL - follow.it"' %}
   <br>

3. Click the "Continue" button on the "Define the follow form’s design" page.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/follow-it-create-form.png 360 '"Create Form - follow.it" "Create Form - follow.it"' %}
   <br>

4. Search for `action=` and copy the link between double quotes after `action=`.
   Paste the action link you copied to the `action_url` setting of the widget configuration.
   After that, click "Done".

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/follow-it-copy-code.png 360 '"Copy Action URL - follow.it" "Copy Action URL - follow.it"' %}
   <br>

   {% codeblock _config.icarus.yml lang:yaml %}
   widgets:
       -
           position: left
           type: followit
           description: 
           action_url: https://api.follow.it/******
           verification_code: ''
   {% endcodeblock %}

5. Click the "Continue" button or the "Skip this" link to skip the "Pick the Follow icons you want" page and 
   "Show a pop-up for maximum conversion" page.

6. At the "Connect your feed to a follow.it account" page, enter your email address that you will use to create a follow.it
   account and manage followers in the text input.
   Then, click "Start".

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/follow-it-connect-account.png 360 '"Connect Account - follow.it" "Connect Account - follow.it"' %}
   <br>

7. You will then receive an email from follow.it.
   In that email, search for `<meta name="follow_it-verification-code" content="******"/>` and copy the `content` value
   between double quotes after `content=`.
   Paste the content value you copied to the `verification_code` setting of the widget configuration.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/follow-it-copy-verification-code.png 360 '"Copy Verification Code - follow.it" "Copy Verification Code - follow.it"' %}
   <br>

   {% codeblock _config.icarus.yml lang:yaml %}
   widgets:
       -
           position: left
           type: followit
           description: 
           action_url: https://api.follow.it/******
           verification_code: ******
   {% endcodeblock %}

8. Generate and push your site to your server.

9. Go back to follow.it and register an account using your email.

10. Go back to the first email you receive and click on the "Click here to claim it" link to claim your feed.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/follow-it-verify-claim.png 360 '"Verify Claim - follow.it" "Verify Claim - follow.it"' %}
   <br>

<article class="message message-immersive is-warning">
<div class="message-body">
<i class="fas fa-question-circle mr-2"></i>Something wrong with this article? 
Click <a href="https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/en/Widgets.md">here</a> 
to submit your revision.
</div>
</article>
