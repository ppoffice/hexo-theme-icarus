title: Icarus User Guide - Comment Plugins
date: 2017-01-31
categories:
- Plugins
- Comment
tags:
- Icarus User Guide
language: en
toc: true
---

<div class="notification is-success is-size-6">
This article is also available in: <a href="{% post_path zh-CN/Comment-Plugins %}">简体中文</a>.
</div>

This article covers some comment plugins supported by Icarus 3.

<!-- more -->

<div class="notification is-link is-size-6">

The comment plugins of Icarus are provided by
[ppoffice/hexo-component-inferno](https://github.com/ppoffice/hexo-component-inferno).
Please refer to it for a complete list of supported plugins and their configurations.

</div>

## Changyan

**Installation Guide**

1. First, register and log into [Changyan](http://changyan.kuaizhan.com). Get the comment HTML code by following
   [this article](http://changyan.kuaizhan.com/static/help/index.html).

2. Copy the value of `appid` and `conf` to the corresponding settings in the theme's configuration file.
   For example, the following HTML code

    ```html
    <!--PC版-->
    <div id="SOHUCS" sid="..."></div>
    <script charset="utf-8" type="text/javascript" src="https://cy-cdn.kuaizhan.com/upload/changyan.js" ></script>
    <script type="text/javascript">
    window.changyan.api.config({
        appid: '????appid????',
        conf: 'prod_xxxxxxxxxxxxxxxxxxxxxxx'
    });
    </script>
    ```
    
    can be mapped to the following theme configuration

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    comment:
        type: changyan
        app_id: ????appid????
        conf: prod_xxxxxxxxxxxxxxxxxxxxxxx
    {% endcodeblock %}

3. Additionally, you are required to obtain an ICP license from the Chinese government if you are going to
   use Changyan. Please refer to [ICP Licensing](http://changyan.kuaizhan.com/static/help/o-beian.html) for
   details.


## Disqus

<div>
<strong>Installation Guide</strong>
<a class="tag is-success" style="margin-left:.8em" href="{% post_path demo/comment/Disqus %}">Preview</a>
</div>

1. First, register and log into [Disqus](https://disqus.com/). Click the "GET STARTED" button on the 
   front page or visit [here](https://disqus.com/profile/signup/intent/) and click "I want to install Disqus 
   on my site" to create a new Disqus comment service.

2. On the create new site page, fill in the "Website Name" and "Category", then click the "Create Site" button.

3. Next, select the platform where Disqus is to be installed.
   Select the "I don't see my platform listed, install manually with Universal Code" on the bottom of the page.

4. Click the "Configuration" button on the bottom of the page to skip the "Universal Code install instructions"
   page.
   Fill in the right configuration for Disqus on the "Configure Disqus" page.
   Then, click the "Complete Setup" and "Dismiss Setup" buttons to finish setup.

5. Finally, click the "Edit Settings" button on the top right corner of the comment service home page.
   Find the value of "Shortname" and copy it to the comment settings in the theme's configuration file 
   (`comment` > `shortname`).
   For example, the "Shortname" in the following screenshot is `test-usildmkxo`

   ![General Settings - Disqus Admin](/hexo-theme-icarus/gallery/screenshots/disqus-general-settings.png)

   which can be mapped into the following theme configuration:

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    comment:
        type: disqus
        shortname: test-usildmkxo
    {% endcodeblock %}

6. (Optional) You can add `disqusId` in the front-matter of the post as the unique Disqus ID.
   By doing this, you can change the location of the post without losing all your comments.

    {% codeblock source/_post/some-post.md lang:markdown %}
    title: My first post
    date: 2015-01-01 00:00:01
    disqusId: some-disqus-id
    ---
    # Hello world
    {% endcodeblock %}


##  DisqusJS

DisqusJS is a Disqus alternative in areas where Disqus is restricted.
You can refer to [https://github.com/SukkaW/DisqusJS](https://github.com/SukkaW/DisqusJS)
for detailed configration process of DisqusJS.

<div>
<strong>Installation Guide</strong>
<a class="tag is-success" style="margin-left:.8em" href="{% post_path demo/comment/DisqusJS %}">Preview</a>
</div>

1. Log into Disqus and visit [here](https://disqus.com/api/applications/).
   Click the "Register new application" button or "registering an application" to create a new Disqus application.

2. Fill in the "Label", "Description", and "Website" on the next page.
   Then, click "Register my application".

3. After creating the application, go to the "Settings" tab of the application, fill in the domain name 
   of your Hexo site, e.g., ppoffice.github.io, in the "Domains" field.
   Then, click the "Save Changes" button on the bottom of the page.

4. Click the "Details" link on the current page to go to the home page of current application.
   Copy the "API Key" in the "OAuth Settings" section to the corresponding setting in the theme's 
   configuration file (`comment` > `api_key`). Here is an example:

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    comment:
        type: disqusjs
        shortname: test-usildmkxo
        api_key: xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        api: https://disqus.skk.moe/disqus/     # Optional
        admin: ppoffice                         # Optional
        admin_label: Admin                      # Optional
        nesting: 4                              # Optional
    {% endcodeblock %}

5. Please read through [SukkaW/DisqusJS documentation](https://github.com/SukkaW/DisqusJS) or 
   [the configuration description](https://github.com/ppoffice/hexo-component-inferno/blob/0.2.1/src/schema/comment/disqusjs.json)
   from the hexo-component-inferno project.


##  Facebook

<div class="notification is-warning is-size-6">
This comment plugin may be blocked by some ad blocking browser extensions.
Please use with caution.
</div>

<div>
<strong>Installation Guide</strong>
<a class="tag is-success" style="margin-left:.8em" href="{% post_path demo/comment/Facebook %}">Preview</a>
</div>

1. The configuration of Facebook comment plugin is relatively simple.
   You only need to set the `type` of the `comment` to `facebook`.

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    comment:
        type: facebook
    {% endcodeblock %}


## Gitalk

<div>
<strong>Installation Guide</strong>
<a class="tag is-success" style="margin-left:.8em" href="{% post_path demo/comment/Gitalk %}">Preview</a>
</div>

1. Log into GitHub and [click here](https://github.com/settings/applications/new) to register a new OAuth
   application.
   Then, fill in the "Application name", "Homepage URL", and "Application description".
   Finally, type in the root URL of your Hexo site in the "Authorization callback URL" field.

2. Click the "Register application" button to go to the application details page.
   Copy the values of "Client ID" and "Client Secret" to the corresponding settings in the theme's 
   configuration file.
   For example, the following Client ID and Client Secret

    {% codeblock GitHub OAuth Application %}
    Client ID
    xxxxxxxxxxxxxxxxxxxx
    Client Secret
    xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    {% endcodeblock %}

   can be mapped into the following Gitalk configuration

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    comment:
        type: gitalk
        client_id: xxxxxxxxxxxxxxxxxxxx
        client_secret: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        repo: Some-of-Your-GitHub-Repo
        owner: you_github_name
        admin:
            - you_github_name
        per_page: 20                    # Optional
        distraction_free_mode: false    # Optional
        pager_direction: last           # Optional
        create_issue_manually: false    # Optional
        proxy:                          # Optional
        flip_move_options:              # Optional
        enable_hotkey: true             # Optional
    {% endcodeblock %}

3. You can review the description and possible values of the above configuration at 
   [Gitalk documentation](https://github.com/gitalk/gitalk) or 
   [the configuration description](https://github.com/ppoffice/hexo-component-inferno/blob/0.2.1/src/schema/comment/disqusjs.json)
   from the hexo-component-inferno project.


## Gitment

<div class="notification is-warning is-size-6">
The maintenance of Gitment seems to be discontinued.
You can choose Gitalk or utterances as an alternative GitHub Issue-based comment system.
</div>

**Installation Guide**

1. Please following the steps in the Gitalk section to register a GitHub OAuth application and copy
   the values of Client ID and Client Secret to the corresponding settings in the theme's configuration file.
   Here is an example of the Gitment configuration

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    comment:
        type: gitment
        owner: you_github_name
        repo: Some-of-Your-GitHub-Repo
        client_id: xxxxxxxxxxxxxxxxxxxx
        client_secret: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        theme: gitment.defaultTheme     # Optional
        per_page: 20                    # Optional
        max_comment_height: 250         # Optional
    {% endcodeblock %}

2. Please refer to the [Gitment documentation](https://github.com/imsun/gitment) or
   [the configuration description](https://github.com/ppoffice/hexo-component-inferno/blob/0.2.1/src/schema/comment/gitment.json)
   from the hexo-component-inferno project for detailed information of the above configuration and possible values.


## Isso

Isso is a valid choice if you wish to set up a self-hosted social comment system
instead of relying on the third-party services.
However, unlike the third-party services, Isso requires a web server for running Isso server.

**Installation Guide**

1. Please following the [Isso documentation](https://posativ.org/isso/docs/install/) for installing and 
   running the Isso server.

2. Fill in the HTTP URL of Isso server to the corresponding setting in the theme's configuration file.
   For example, if your service URL is https://posativ.org/isso/api/, you will have the following 
   comment configuration

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    comment:
        type: isso
        url: posativ.org/isso/api
    {% endcodeblock %}


## LiveRe

<div class="notification is-warning is-size-6">
This comment plugin may be blocked by some ad blocking browser extensions.
Please use with caution.
</div>

<div>
<strong>Installation Guide</strong>
<a class="tag is-success" style="margin-left:.8em" href="{% post_path demo/comment/LiveRe %}">Preview</a>
</div>

1. First, register and log into [LiveRe](https://livere.com/).
   Click "Install" on the navigation bar to go to the installation page.

2. Select Free "City" tier on the installation page and click the "Install Now" button.
   Fill in the "Site URL", "Name of website", and "Choose site category" on the "Get LiveRe City code"
   page. Check "I have check the advertising terms..." and click the "Get code" button to be redirected to
   the LiveRe HTML code page.

3. Copy the value inside the quotes of `data-uid="..."` to the corresponding setting in the theme's configuration
   file.
   For example, the LiveRe code below

   ![LiveRe - Install](/hexo-theme-icarus/gallery/screenshots/livere-code.png)

   can be mapped to the following theme configuration

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    comment:
        type: livere
        uid: ABCD1234O0OxxxxXXXX000==
    {% endcodeblock %}


## Utterances

<div>
<strong>Installation Guide</strong>
<a class="tag is-success" style="margin-left:.8em" href="{% post_path demo/comment/Utterances %}">Preview</a>
</div>

1. Prepare a public GitHub repository.

2. Go to [GitHub Apps - utterances](https://github.com/apps/utterances) to install utterances to the repository
   above.
   Click the "Configure" button and select the user to install utterances to on the next page.
   On the installation page, you can choose to install it to "All repositories" or "Only select repositories".
   Then, click the "Install" button.

3. When the installation completes successfully, you will be redirected to the 
   [utterances official site](https://utteranc.es/).
   You can review the description of each configuration option and fill in the correct values in the theme's
   configuration file.
   Here is an example configuration of utterances

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    comment:
        type: utterances
        repo: Your-GitHub-Username/Your-Public-Repo-Name
        issue_term: pathname        # Required if issue_number is not set
        issue_number: 100           # Required if issue_term is not set. Every post can be mapped to a separate, manually-created GitHub issue.
        label: some-issue-label     # Optional
        theme: github-light         # Optional
    {% endcodeblock %}


## Valine

<div>
<strong>Installation Guide</strong>
<a class="tag is-success" style="margin-left:.8em" href="{% post_path demo/comment/Valine %}">Preview</a>
</div>

1. Create a LeanCloud application following the [Quick start guide](https://valine.js.org/quickstart.html) of Valine.

2. Copy the App ID and App Key of your LeanCloud application to the corresponding settings in the theme's configuration
   file.
   You can also refer to the [Config Reference](https://valine.js.org/configuration.html) of Valine to fill in the 
   correct values of optional settings.
   Here is an example configuration

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    comment:
        type: valine
        app_id: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        app_key: xxxxxxxxxxxxxxxxxxxxxx
        placeholder: ""                 # Optional
        notify: false                   # Optional
        verify: false                   # Optional
        avatar:                         # Optional
        avatar_force: false             # Optional
        meta: ["nick", "mail", "link"]  # Optional
        page_size: 10                   # Optional
        visitor: false                  # Optional
        highlight: true                 # Optional
        record_ip: false                # Optional
    {% endcodeblock %}


<div class="notification is-warning is-size-6">
Something wrong with this article? Click <a href="https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/en/Comment-Plugins.md">here</a> to submit your revision.
</div>
