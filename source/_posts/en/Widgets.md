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
        description: Subscribe to get the latest updates!
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

This article covers widgets supported by Icarus 6.
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
Please refer to it for a complete list of supported widgets and their configuration details.
</div>
</article>


## Sidebar Layout

Widgets with `position: left` are placed in the left sidebar, and those with `position: right` in the right
sidebar.
A page has two columns when only one of the sidebars has widgets, and three columns when both of them do.
In the three-column layout, the right sidebar is only shown on wide screens (1280px and wider).
On smaller screens, its widgets are moved to the bottom of the left sidebar.

To disable all widgets, set `widgets` to `null` in your theme configurations.
Like other theme settings, `widgets` can also be set in the layout configuration files (`_config.post.yml` and
`_config.page.yml`) or in the front-matter of a post or page, so you can turn off widgets only for some pages:

{% codeblock _config.icarus.yml lang:yaml %}
widgets: null
{% endcodeblock %}


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
        # URL or path of the avatar/profile picture
        avatar: https://octodex.github.com/images/hula_loop_octodex03.gif
        # Whether to show a round clip of the avatar
        avatar_rounded: false
        # Email address of your Gravatar account. Takes precedence over `avatar` when set
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

- If `author` is not set, the `author` in the site configuration file `_config.yml` is shown instead.

- If you wish to use [Gravatar](https://en.gravatar.com/) as your profile picture, fill in the Gravatar email
  address in the `gravatar` setting.
  When `gravatar` is set, it is used even if `avatar` is also set.
  If neither of them is set, the default avatar of Icarus (`/img/avatar.png`) is shown.

- There are two acceptable formats for `social_links`:

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
        index: true         # Optional. Whether to number each table of contents item. Defaults to `true`.
        collapsed: true     # Optional. Whether to hide the sub-headings of the sections that are not being read. Defaults to `true`.
        depth: 3            # Optional. The number of heading levels to show. Defaults to `3`.
{% endcodeblock %}

Then, add `toc: true` to the front-matter of your post or page:

{% codeblock Post.md lang:yaml %}
title: A post with the table of contents
toc: true
---
Post content...
{% endcodeblock %}

Some notes on the table of contents widget:

- The widget is only shown on posts and pages that have `toc: true` in their front-matter.
  On other pages, it takes no space, and its sidebar is removed if it has no other widgets.
- `depth` counts the heading levels that the post actually uses, starting from the highest one.
  For example, with `depth: 2`, a post whose headings start at `##` shows its `##` and `###` headings.
- While your visitors read the post, the entry of the current section is highlighted and kept in view in the
  table of contents.
- On mobile phones, the widget is hidden from the page.
  Instead, a button in the navigation bar opens the table of contents on top of the page.


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

The hostname of each site is shown next to its name.
To hide it for a site, write the site as an object with the `link` and `hide_hostname` settings:

{% codeblock _config.icarus.yml lang:yaml %}
widgets:
    -
        position: left
        type: links
        links:
            Hexo: 'https://hexo.io'
            Bulma:
                link: 'https://bulma.io'
                hide_hostname: true
{% endcodeblock %}


## Recent Posts

Use the following configuration to enable the recent posts widget:

{% codeblock _config.icarus.yml lang:yaml %}
widgets:
    -
        position: right
        type: recent_posts
        limit: 5            # Optional. The number of recent posts to show. Defaults to 5.
{% endcodeblock %}


## Archives

Use the following configuration to enable the archives widget:

{% codeblock _config.icarus.yml lang:yaml %}
widgets:
    -
        position: right
        type: archives
        group_by: monthly   # Optional. Group the archives by month (`monthly`) or by year (`yearly`). Defaults to `monthly`.
        order: -1           # Optional. `-1` to show the newest archives first, or `1` to show the oldest first. Defaults to `-1`.
        format:             # Optional. Moment.js format of the archive names. Defaults to `MMMM YYYY` (monthly) or `YYYY` (yearly).
        amount: 10          # Optional. The maximum number of archives to show. Leave empty to show all.
        show_count: true    # Optional. Whether to show the number of posts of each archive. Defaults to `true`.
{% endcodeblock %}

If `amount` is set and there are more archives than that, a "More" link to the archive page is added to the
end of the list.
The `show_count` setting requires hexo-component-inferno 4.2.0 or later.


## Categories

Use the following configuration to enable the categories widget:

{% codeblock _config.icarus.yml lang:yaml %}
widgets:
    -
        position: right
        type: categories
        order_by: name      # Optional. Order by category name (`name`) or number of posts (`length`). Defaults to `name`.
        order: 1            # Optional. `1` for ascending order, or `-1` for descending order. Defaults to `1`.
        depth: 0            # Optional. Levels of categories to show, e.g., `1` for top-level categories only. `0` or empty shows all levels.
        show_current: false # Optional. Whether to highlight the categories of the current post. Defaults to `false`.
        amount: 10          # Optional. The maximum number of top-level categories to show. Leave empty to show all.
        show_count: true    # Optional. Whether to show the number of posts of each category. Defaults to `true`.
{% endcodeblock %}

If `amount` is set and there are more top-level categories than that, a "More" link to the categories page is
added to the end of the list.
The `order_by`, `depth`, `show_current`, and `show_count` settings require hexo-component-inferno 4.2.0 or later.


## Tags

Use the following configuration to enable the tags widget:

{% codeblock _config.icarus.yml lang:yaml %}
widgets:
    -
        position: right
        type: tags
        order_by: name      # Optional. Order by tag name (`name`) or number of posts (`length`). Prefix with `-` to sort in descending order. Defaults to `name`.
        amount: 20          # Optional. The maximum number of tags to show. Leave empty to show all.
        show_count: true    # Optional. Whether to show the number of posts right to each tag name. Defaults to `true`.
{% endcodeblock %}

If `amount` is set and there are more tags than that, a "More" link to the tags page is added to the end of the
list.


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
   In that email, search for `<meta name="follow.it-verification-code" content="******"/>` and copy the `content` value
   between double quotes after `content=`.
   Paste the content value you copied to the `verification_code` setting of the widget configuration.
   Icarus adds a verification meta tag with this code to the `<head>` of your pages.

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


<article class="message message-immersive is-warning">
<div class="message-body">
<i class="fas fa-question-circle mr-2"></i>Something wrong with this article? 
Click <a href="https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/en/Widgets.md">here</a> 
to submit your revision.
</div>
</article>
