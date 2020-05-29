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

This article covers comment plugins supported by Icarus 3.

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-globe-asia mr-2"></i>This article is also available in 
<a href="{% post_path zh-CN/Comment-Plugins %}">简体中文</a>.
</div>
</article>

<!-- more -->

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-info-circle mr-2"></i>The following comment plugins are provided by
<a href="https://github.com/ppoffice/hexo-component-inferno">ppoffice/hexo-component-inferno</a>.
Please refer to it for a complete list of supported plugins and their configuration details.
</div>
</article>

## Changyan

<article class="message message-immersive is-danger">
<div class="message-body">
<i class="fas fa-exclamation-triangle mr-2"></i>You are required to obtain an ICP license from the Chinese 
government if you are going to use Changyan. 
Refer to <a href="http://changyan.kuaizhan.com/static/help/o-beian.html">ICP Licensing</a> for more information.
</div>
</article>

**Installation Guide**

1. First, log into [Changyan](http://changyan.kuaizhan.com). Get the comment HTML code by following
   [this article](http://changyan.kuaizhan.com/static/help/index.html).

2. Copy the value of `appid` and `conf` to the corresponding settings in the theme configurations.
   For example, the following HTML code

    {% codeblock "Changyan Installation Code" lang:html >folded %}
    <!--PC版-->
    <div id="SOHUCS" sid="..."></div>
    <script charset="utf-8" type="text/javascript" src="https://cy-cdn.kuaizhan.com/upload/changyan.js" ></script>
    <script type="text/javascript">
    window.changyan.api.config({
        appid: '????appid????',
        conf: 'prod_xxxxxxxxxxxxxxxxxxxxxxx'
    });
    </script>
    {% endcodeblock %}
    
    maps to the following theme configuration:

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    comment:
        type: changyan
        app_id: ????appid????
        conf: prod_xxxxxxxxxxxxxxxxxxxxxxx
    {% endcodeblock %}


## Disqus

<div>
<strong>Installation Guide</strong><a class="tag is-success ml-2" href="{% post_path demo/comment/Disqus %}">Preview</a>
</div>

1. First, log into [Disqus](https://disqus.com/). Click the "GET STARTED" button on the 
   front page or visit [here](https://disqus.com/profile/signup/intent/) and click "I want to install Disqus 
   on my site" to create a new Disqus comment service.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/disqus-get-started.png 360 '"Get Started - Disqus" "Get Started - Disqus"' %}
   <br>

2. On the create new site page, fill in the "Website Name" and "Category", then click the "Create Site" button.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/disqus-create-site.png 360 '"Create Site - Disqus" "Create Site - Disqus"' %}
   <br>

3. Select a subscription plan if you want to.
   You can also skip this by clicking "Install Disqus" on the left.

4. Next, choose the platform where Disqus is to be installed.
   Select the "I don't see my platform listed, install manually with Universal Code" on the bottom of the page.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/disqus-select-platform.png 360 '"Select Platform - Disqus" "Select Platform - Disqus"' %}
   <br>

5. Click the "Configuration" button on the bottom of the page to skip the "Universal Code install instructions".

6. Make customizations to your Disqus service on the "Configure Disqus" page.
   Then, click the "Complete Setup" and "Dismiss Setup" buttons to finish the setup.

7. Next, click the "Edit Settings" button on the top right corner of the comment service home page.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/disqus-service-homepage.png 360 '"Comment Service Homepage - Disqus" "Comment Service Homepage - Disqus"' %}
   <br>

8. Find the value of "Shortname" on the "Configure Disqus for Your Site" page, and copy it to the comment 
   settings in the theme configurations.
   For example, the "Shortname" in the following screenshot is `my-hexo-blog-1`:

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/disqus-get-shortname.png 360 '"Configure Disqus - Disqus" "Configure Disqus - Disqus"' %}
   <br>

   which maps to the following theme configuration:

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    comment:
        type: disqus
        shortname: my-hexo-blog-1
    {% endcodeblock %}

9. (Optional) You can add `disqusId` in the front-matter of the post as the unique Disqus ID.
   Thereby, you can change the location of the post in the future without losing all your comments:

    {% codeblock source/_post/some-post.md lang:markdown %}
    title: My first post
    date: 2015-01-01 00:00:01
    disqusId: some-disqus-id
    ---
    # Hello world
    {% endcodeblock %}


##  DisqusJS

DisqusJS is an alternative for Disqus in areas where Disqus is restricted.
You can refer to [https://github.com/SukkaW/DisqusJS](https://github.com/SukkaW/DisqusJS)
for the detailed configuration process of DisqusJS.

<div>
<strong>Installation Guide</strong><a class="tag is-success ml-2" href="{% post_path demo/comment/DisqusJS %}">Preview</a>
</div>

1. Log into Disqus and visit [here](https://disqus.com/api/applications/).
   Click the "Register new application" button or "registering an application" to create a new Disqus application.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/disqusjs-api-applications.png 360 '"Applications - Disqus" "Applications - Disqus"' %}
   <br>

2. Fill in the "Label", "Description", and "Website" on the next page.
   Then, click "Register my application".

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/disqusjs-register-application.png 360 '"Register Application - Disqus" "Register Application - Disqus"' %}
   <br>

3. After creating the application, go to the "Settings" tab of the application, fill in the domain name 
   of your Hexo site, e.g., ppoffice.github.io, in the "Domains" field.
   Then, click the "Save Changes" button on the bottom of the page.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/disqusjs-application-settings.png 360 '"Application Settings - Disqus" "Application Settings - Disqus"' %}
   <br>

4. Click the "Details" link on the current page to go to the home page of the current application.
   Copy the "API Key" in the "OAuth Settings" section to the corresponding setting in the theme
   configurations.

   For example, the "API Key" in the following screenshot:

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/disqusjs-api-key.png 360 '"Application Details - Disqus" "Application Details - Disqus"' %}
   <br>
   
   maps to the following theme configuration:

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    comment:
        type: disqusjs
        shortname: my-hexo-blog-1
        api_key: xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        api: https://disqus.skk.moe/disqus/     # Optional
        admin: ppoffice                         # Optional
        admin_label: Admin                      # Optional
        nesting: 4                              # Optional
    {% endcodeblock %}

5. To learn more about DisqusJS and its configuration, visit 
   [SukkaW/DisqusJS documentation](https://github.com/SukkaW/DisqusJS) or 
   [hexo-component-inferno](https://github.com/ppoffice/hexo-component-inferno/blob/0.2.1/src/schema/comment/disqusjs.json).


##  Facebook

<article class="message message-immersive is-danger">
<div class="message-body">
<i class="fas fa-exclamation-triangle mr-2"></i>Some AD blockers may block this comment plugin. Use it with caution. 
</div>
</article>

<div>
<strong>Installation Guide</strong><a class="tag is-success ml-2" href="{% post_path demo/comment/Facebook %}">Preview</a>
</div>

1. To enable Facebook comment, set the `type` of `comment` to `facebook`:

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    comment:
        type: facebook
    {% endcodeblock %}


## Gitalk

<div>
<strong>Installation Guide</strong><a class="tag is-success ml-2" href="{% post_path demo/comment/Gitalk %}">Preview</a>
</div>

1. Log into GitHub and [click here](https://github.com/settings/applications/new) to register a new OAuth
   application.
   Fill in the "Application name", "Homepage URL", and "Application description".
   Then, type in the root URL of your Hexo site in the "Authorization callback URL" field.
   Click the "Register application" button to go to the application details page.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/gitalk-register-application.png 360 '"Register OAuth Application - GitHub" "Register OAuth Application - GitHub"' %}
   <br>

2. Copy the values of "Client ID" and "Client Secret" to the corresponding settings in the theme configurations.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/gitalk-application-settings.png 360 '"OAuth Application Settings - GitHub" "OAuth Application Settings - GitHub"' %}
   <br>

   For example, the following "Client ID" and "Client Secret":

    {% codeblock GitHub OAuth Application %}
    Client ID
    xxxxxxxxxxxxxxxxxxxx
    Client Secret
    xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    {% endcodeblock %}

   maps the following Gitalk configuration:

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
   [hexo-component-inferno](https://github.com/ppoffice/hexo-component-inferno/blob/0.2.1/src/schema/comment/disqusjs.json).


## Gitment

<article class="message message-immersive is-danger">
<div class="message-body">
<i class="fas fa-exclamation-triangle mr-2"></i>The maintenance of Gitment seems to be discontinued.
You can choose Gitalk or utterances as an alternative GitHub Issue-based comment system.
</div>
</article>

**Installation Guide**

1. Follow the steps in the Gitalk section to register a GitHub OAuth application.

2. Copy the values of "Client ID" and "Client Secret" to the corresponding settings in the theme configurations.

   Here is an example of the Gitment configuration:

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

3. For more details on the above configuration, refer to 
   [Gitment documentation](https://github.com/imsun/gitment) or
   [hexo-component-inferno](https://github.com/ppoffice/hexo-component-inferno/blob/0.2.1/src/schema/comment/gitment.json).


## Isso

Isso is a valid choice if you wish to set up a self-hosted social comment system
instead of relying on third-party ones.
However, unlike the other services, Isso requires a web host for running the Isso server.

**Installation Guide**

1. Follow the [Isso documentation](https://posativ.org/isso/docs/install/) to install and run the Isso server.

2. Fill in the HTTP URL of Isso server to the corresponding setting in the theme configurations.
   For example, if your service URL is `https://posativ.org/isso/api/`, you will have the following 
   comment configuration:

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    comment:
        type: isso
        url: posativ.org/isso/api
    {% endcodeblock %}


## LiveRe

<article class="message message-immersive is-danger">
<div class="message-body">
<i class="fas fa-exclamation-triangle mr-2"></i>Some AD blockers may block this comment plugin. Use it with caution. 
</div>
</article>

<div>
<strong>Installation Guide</strong><a class="tag is-success ml-2" href="{% post_path demo/comment/LiveRe %}">Preview</a>
</div>

1. First, log into [LiveRe](https://livere.com/).
   Click "Install" on the navigation bar to go to the installation page.

2. Select the free "City" tier on the installation page and click the "Install Now" button.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/livere-select-plan.png 360 '"Select Plan - LiveRe" "Select Plan - LiveRe"' %}
   <br>

3. Fill in the "Site URL", "Name of website", and "Choose site category" on the "Get LiveRe City code"
   page. Check "I have check the advertising terms..." and click the "Get code" button to be redirected to
   the LiveRe HTML code page.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/livere-configure-service.png 360 '"Configure Service - LiveRe" "Configure Service - LiveRe"' %}
   <br>

4. Copy the value inside the quotes of `data-uid="..."` to the corresponding setting in the theme configurations.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/livere-get-code.png 360 '"Get Code - LiveRe" "Get Code - LiveRe"' %}
   <br>

   For example, the LiveRe code below:

   {% codeblock "LiveRe Installation Code" lang:html >folded %}
   <!-- LiveRe City install code -->
   <div id="lv-container" data-id="city" data-uid="ABCD1234O0OxxxxXXXX000==">
      <script type="text/javascript">
      (function(d, s) {
         var j, e = d.getElementsByTagName(s)[0];

         if (typeof LivereTower === 'function') { return; }

         j = d.createElement(s);
         j.src = 'https://cdn-city.livere.com/js/embed.dist.js';
         j.async = true;

         e.parentNode.insertBefore(j, e);
      })(document, 'script');
      </script>
   <noscript> Please activate JavaScript for write a comment in LiveRe</noscript>
   </div>
   <!-- completed City install code -->
   {% endcodeblock %}

   maps to the following theme configuration:

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    comment:
        type: livere
        uid: ABCD1234O0OxxxxXXXX000==
    {% endcodeblock %}


## utterances

<div>
<strong>Installation Guide</strong><a class="tag is-success ml-2" href="{% post_path demo/comment/Utterances %}">Preview</a>
</div>

1. Prepare a public GitHub repository.

2. Go to [GitHub Apps - utterances](https://github.com/apps/utterances) and click "Install".

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/utterances-github-app.png 360 '"GitHub App Page - utterances" "GitHub App Page - utterances"' %}
   <br>

3. (Optional) Select the user to install utterances to on the next page if you also have organizations under your account.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/utterances-select-user.png 360 '"Select User - utterances" "Select User - utterances"' %}
   <br>

4. On the next page, you can choose to install utterances to "All repositories" or "Only select repositories".
   Then, click the "Install" button.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/utterances-select-repo.png 360 '"Select Repository - utterances" "Select Repository - utterances"' %}
   <br>

5. You will be redirected to the [utterances official site](https://utteranc.es/) if the installation completes.
   You can review each configuration option and customize your utterances setup.

6. When finished, move to the "Enable utterances" and copy the attribute values from the utterances HTML code
   to the corresponding settings in your theme configurations.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/utterances-get-code.png 360 '"Get Code - utterances" "Get Code - utterances"' %}
   <br>

   For example, the utterances code below:

   {% codeblock "utterances Installation Code" lang:html >folded %}
   <script src="https://utteranc.es/client.js"
         repo="Your-GitHub-Username/Your-Public-Repo-Name"
         issue-term="pathname"
         theme="github-light"
         crossorigin="anonymous"
         async>
   </script>
   {% endcodeblock %}

   maps to the following theme configuration:

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
<strong>Installation Guide</strong><a class="tag is-success ml-2" href="{% post_path demo/comment/Valine %}">Preview</a>
</div>

1. Create a LeanCloud application following the [Quickstart guide](https://valine.js.org/quickstart.html).

2. Copy the "App ID" and "App Key" of your LeanCloud application to the corresponding settings in the theme 
   configurations.
   In addition, you can refer to the [Config Reference](https://valine.js.org/configuration.html) to find out the 
   details and possible values of the optional settings.
   Here is an example configuration:

    {% codeblock themes/icarus/_config.yml lang:yaml %}
    comment:
        type: valine
        app_id: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        app_key: xxxxxxxxxxxxxxxxxxxxxx
        placeholder: ""                 # Optional
        avatar: mm                      # Optional
        avatar_force: false             # Optional
        meta: ["nick", "mail", "link"]  # Optional
        page_size: 10                   # Optional
        lang: zh-CN                     # Optional
        visitor: false                  # Optional
        highlight: true                 # Optional
        record_ip: false                # Optional
        server_urls:                    # Optional
        emoji_cdn:                      # Optional
        emoji_maps:                     # Optional
        enable_qq: false                # Optional
        required_fields: []             # Optional
    {% endcodeblock %}


<article class="message message-immersive is-warning">
<div class="message-body">
<i class="fas fa-question-circle mr-2"></i>Something wrong with this article? 
Click <a href="https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/en/Comment-Plugins.md">here</a> 
to submit your revision.
</div>
</article>
