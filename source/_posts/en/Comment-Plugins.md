title: Icarus User Guide - Comment Plugins
date: 2025-09-23
categories:
- Plugins
- Comment
tags:
- Icarus User Guide
language: en
toc: true
---

This article covers comment plugins supported by Icarus.

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

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-moon mr-2"></i><a href="#Artalk">Artalk</a>, <a href="#Beaudar">Beaudar</a>,
<a href="#Cusdis">Cusdis</a>, <a href="#Giscus">Giscus</a>, <a href="#utterances">utterances</a>, and
<a href="#Waline">Waline</a> follow the dark appearance of the page: when the comments load on a page that
looks dark, that is, with <code>appearance: dark</code>, or with <code>appearance: auto</code> while the
visitor's system uses a dark color scheme (see the <code>appearance</code> setting in
<a href="{% post_path en/Configuring-Theme %}">Theme Configuration</a>), they use their dark theme.
The settings that change this are described in their sections below.
</div>
</article>

## Artalk

Artalk is a self-hosted comment system.
Like Isso and Twikoo, it requires you to run the Artalk server yourself before Icarus can use it.

**Installation Guide**

1. Follow the [Artalk documentation](https://artalk.js.org/) to deploy the Artalk server, and add your site to it.

2. Fill in the URL of your Artalk server and the name of your site on the server in the theme configurations:

    {% codeblock _config.icarus.yml lang:yaml %}
    comment:
        type: artalk
        server: https://artalk.example.com  # Required. URL of your Artalk server
        site: My Blog                       # Optional. Name of the site on the Artalk server
        locale: en                          # Optional. Language of Artalk, e.g., en, zh-CN, or auto
        # dark_mode: auto                   # Optional. true, false, or auto. Follows the appearance of the page if not set
    {% endcodeblock %}

3. Notes:
   - Without `dark_mode`, Artalk follows the appearance of the page: it looks dark with `appearance: dark`,
     and follows the color scheme of the visitor's system with `appearance: auto`.
     Set `dark_mode` to `true`, `false`, or `auto` (follow the color scheme of the system) to override it.
   - Artalk identifies the comments of a page by its path.
     You can set `page_key` to another unique identifier of a page in its front-matter, for example to keep the
     comments when you move the page.
     Since the front-matter replaces the whole `comment` setting, copy the other comment settings there as well.
   - Icarus loads version 2.9.1 of the Artalk client from the CDN, so use a version of the Artalk server that works
     with it.
   - See the [Artalk client configuration](https://artalk.js.org/guide/frontend/config.html) for more details on
     these settings.


## Beaudar

Beaudar is a Chinese fork of utterances that keeps the comments in GitHub issues.
Its setup is similar to that of [utterances](#utterances).

**Installation Guide**

1. Prepare a public GitHub repository, and install the Beaudar GitHub App on it by following the
   [Beaudar documentation](https://github.com/beaudar/beaudar).

2. Fill in the repository and other settings in the theme configurations:

    {% codeblock _config.icarus.yml lang:yaml %}
    comment:
        type: beaudar
        repo: Your-GitHub-Username/Your-Public-Repo-Name
        issue_term: pathname        # Required if issue_number is not set
        # issue_number: 100         # Required if issue_term is not set
        branch: main                # Optional. Branch of the repository that has beaudar.json
        label: some-issue-label     # Optional
        theme: github-light         # Optional, default: github-light. Used when the page looks light
        dark_theme: github-dark     # Optional, default: github-dark. Used when the page looks dark
    {% endcodeblock %}

3. Notes:
   - Set exactly one of `issue_term` (e.g., `pathname`, `url`, or `title`) and `issue_number`.
     Setting both fails the configuration check.
   - `theme` is used when the page looks light, e.g., `github-light`, `github-dark`, or `preferred-color-scheme`.
     `dark_theme` is used when the page looks dark, i.e., with `appearance: dark`, or with `appearance: auto`
     while the visitor's system uses a dark color scheme.
     Its values include `github-dark`, `github-dark-orange`, `classic-dark`, `dark-blue`, `icy-dark`, and `photon-dark`.


## Changyan

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

    {% codeblock _config.icarus.yml lang:yaml %}
    comment:
        type: changyan
        app_id: ????appid????
        conf: prod_xxxxxxxxxxxxxxxxxxxxxxx
    {% endcodeblock %}


## Cusdis

Cusdis is a lightweight comment system.
You can use the service on [cusdis.com](https://cusdis.com/) or host the Cusdis server yourself.

**Installation Guide**

1. Sign up for [Cusdis](https://cusdis.com/), or deploy your own Cusdis server by following the
   [Cusdis documentation](https://cusdis.com/doc).
   Then, add your website on the dashboard.

2. Copy the value of `data-app-id` in the embed code of your website on the dashboard to the corresponding
   setting in the theme configurations.
   For example, the following embed code:

    {% codeblock "Cusdis Embed Code" lang:html >folded %}
    <div id="cusdis_thread"
      data-host="https://cusdis.com"
      data-app-id="xxxxxxxxxxxxxxxx"
      data-page-id="..."
      data-page-url="..."
      data-page-title="..."
    ></div>
    <script async defer src="https://cusdis.com/js/cusdis.es.js"></script>
    {% endcodeblock %}

    maps to the following theme configuration:

    {% codeblock _config.icarus.yml lang:yaml %}
    comment:
        type: cusdis
        app_id: xxxxxxxxxxxxxxxx    # Required
        host: https://cusdis.com    # Optional, default: https://cusdis.com. The URL of your server if you host Cusdis yourself
        lang: zh-cn                 # Optional. Language of Cusdis, e.g., zh-cn, zh-tw, es, or fi. Uses English if not set
        # theme: auto               # Optional. light, dark, or auto. Follows the appearance of the page if not set
    {% endcodeblock %}

3. Notes:
   - Icarus fills in the page ID, URL, and title of each page by itself.
   - Without `theme`, Cusdis follows the appearance of the page.
     Set `theme` to `light`, `dark`, or `auto` (follow the color scheme of the visitor's system) to override it.
     Leave `theme` out instead of leaving it empty, since an empty value fails the configuration check.


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

    {% codeblock _config.icarus.yml lang:yaml %}
    comment:
        type: disqus
        shortname: my-hexo-blog-1
    {% endcodeblock %}

9. (Optional) You can add `disqusId` in the front-matter of the post as the unique Disqus ID.
   Thereby, you can change the location of the post in the future without losing all your comments:

    {% codeblock source/_posts/some-post.md lang:markdown %}
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

    {% codeblock _config.icarus.yml lang:yaml %}
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
   [hexo-component-inferno](https://github.com/ppoffice/hexo-component-inferno/blob/HEAD/src/schema/comment/disqusjs.json).


## Giscus

A comments system powered by [GitHub Discussions](https://docs.github.com/en/discussions).

<div>
<strong>Installation Guide</strong><a class="tag is-success ml-2" href="{% post_path demo/comment/Giscus %}">Preview</a>
</div>

1. Prepare a public GitHub repository.

2. Go to [GitHub Apps - giscus](https://github.com/apps/giscus) and click "Install".

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/giscus-github-app.png 360 '"GitHub App Page - giscus" "GitHub App Page - giscus"' %}
   <br>

3. (Optional) Select the user to install giscus to on the next page if you also have organizations under your account.

   <!-- {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/giscus-select-user.png 360 '"Select User - giscus" "Select User - giscus"' %} -->
   <br>

4. On the next page, you can choose to install giscus to "All repositories" or "Only select repositories".
   Then, click the "Install" button.

   <!-- {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/giscus-select-repo.png 360 '"Select Repository - giscus" "Select Repository - giscus"' %} -->
   <br>

5. You will be redirected to the [giscus official site](https://giscus.app) if the installation completes.
   You can review each configuration option and customize your giscus setup.

6. When finished, move to the "Enable giscus" and copy the attribute values from the giscus HTML code
   to the corresponding settings in your theme configurations.

   {% img "box px-0 py-0 ml-auto mr-auto" /gallery/screenshots/giscus-get-code.png 360 '"Get Code - giscus" "Get Code - giscus"' %}
   <br>

   For example, the giscus code below:

   {% codeblock "giscus Installation Code" lang:html >folded %}
   <script src="https://giscus.app/client.js"
         data-repo="usr/repo"
         data-repo-id="X_xxxxxxxxxx"
         data-category="Announcements"
         data-category-id="XXX_xxxxxxxxxxxxxxxx"
         data-mapping="pathname"
         data-strict="0"
         data-reactions-enabled="0"
         data-emit-metadata="0"
         data-input-position="top"
         data-theme="noborder_light"
         data-lang="en"
         data-loading="lazy"
         crossorigin="anonymous"
         async>
   </script>
   {% endcodeblock %}

   maps to the following theme configuration:

    {% codeblock _config.icarus.yml lang:yaml %}
    comment:
        type: giscus
        repo: usr/repo                   # Required
        repoId: X_xxxxxxxxxx             # Required
        category: Announcements          # Optional, default: Announcements
        categoryId: XXX_xxxxxxxxxxxxxxxx # Required
        mapping: pathname                # Optional, default: pathname
        strict: false                    # Optional
        reactionsEnabled: false          # Optional
        emitMetadata: false              # Optional
        inputPosition: top               # Optional, default: top
        theme: noborder_light            # Optional, default: noborder_light. Used when the page looks light
        darkTheme: noborder_dark         # Optional, default: noborder_dark. Used when the page looks dark
        lang: en                         # Optional, default: en
        lazy: true                       # Optional, default: false
    {% endcodeblock %}

7. Notes:
   - `theme` is used when the page looks light, and `darkTheme` is used when the page looks dark, i.e., with
     `appearance: dark`, or with `appearance: auto` while the visitor's system uses a dark color scheme.
     If you copy `data-theme` from the giscus code, put a light theme in `theme` and a dark one in `darkTheme`.
   - To use your own giscus theme, set `theme` to `custom` and `customThemeCss` to the URL of the theme's CSS file.
     The custom theme is used whether the page looks light or dark, and `darkTheme` is ignored.
   - If `mapping` is `specific` or `number`, also set `term` to the search term or the number of the discussion,
     e.g., `mapping: number` with `term: 1`.
     Otherwise, a notice asking you to set `term` is shown in place of the comments.


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

   maps to the following Gitalk configuration:

    {% codeblock _config.icarus.yml lang:yaml %}
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
        language: zh-CN                 # Optional
    {% endcodeblock %}

3. You can review the description and possible values of the above configuration at 
   [Gitalk documentation](https://github.com/gitalk/gitalk) or 
   [hexo-component-inferno](https://github.com/ppoffice/hexo-component-inferno/blob/HEAD/src/schema/comment/gitalk.json).


## Isso

Isso is a valid choice if you wish to set up a self-hosted social comment system
instead of relying on third-party ones.
However, unlike the other services, Isso requires a web host for running the Isso server.

**Installation Guide**

1. Follow the [Isso documentation](https://posativ.org/isso/docs/install/) to install and run the Isso server.

2. Fill in the HTTP URL of Isso server to the corresponding setting in the theme configurations.
   For example, if your service URL is `https://posativ.org/isso/api/`, you will have the following 
   comment configuration:

    {% codeblock _config.icarus.yml lang:yaml %}
    comment:
        type: isso
        url: posativ.org/isso/api
    {% endcodeblock %}


## LiveRe

<article class="message message-immersive is-danger">
<div class="message-body">
<i class="fas fa-exclamation-triangle mr-2"></i>Some ad blockers may block this comment plugin. Use it with caution.
</div>
</article>

**Installation Guide**

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

    {% codeblock _config.icarus.yml lang:yaml %}
    comment:
        type: livere
        uid: ABCD1234O0OxxxxXXXX000==
    {% endcodeblock %}


## Twikoo

Twikoo is a self-hosted comment system based on cloud functions.
Unlike other third-party comment services, the Twikoo backend needs to be deployed to a cloud
environment before being configured and used by Icarus.

<div>
<strong>Installation Guide</strong><a class="tag is-success ml-2" href="{% post_path demo/comment/Twikoo %}">Preview</a>
</div>

1. Follow the [Twikoo documentation](https://twikoo.js.org/en/) to deploy the Twikoo cloud function
   to a cloud service provider of your choice.

2. Fill in the `env_id` of your deployment to the corresponding setting in the theme configurations.
   It is the environment ID if you deploy Twikoo to Tencent CloudBase, or the URL of your deployment if you
   deploy it to Vercel or host it yourself, e.g., `https://your-twikoo.vercel.app`.

    {% codeblock _config.icarus.yml lang:yaml %}
    comment:
        type: twikoo
        env_id: xxxxxxxx         # Required. Environment ID, or the URL of your deployment
        region: ap-guangzhou     # Optional. Region of Tencent CloudBase
        lang: zh-CN              # Optional. Defaults to the language of the page or the site
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

    {% codeblock _config.icarus.yml lang:yaml %}
    comment:
        type: utterances
        repo: Your-GitHub-Username/Your-Public-Repo-Name
        issue_term: pathname        # Required if issue_number is not set
        # issue_number: 100         # Required if issue_term is not set. Maps the page to a GitHub issue you create yourself
        label: some-issue-label     # Optional
        theme: github-light         # Optional, default: github-light. Used when the page looks light
        dark_theme: github-dark     # Optional, default: github-dark. Used when the page looks dark
    {% endcodeblock %}

7. Notes:
   - Set exactly one of `issue_term` and `issue_number`.
     Setting both fails the configuration check.
     To map each post to its own issue by number, set `issue_number` in the front-matter of the post, together
     with the other comment settings, since the front-matter replaces the whole `comment` setting.
   - `theme` is used when the page looks light, and `dark_theme` is used when the page looks dark, i.e., with
     `appearance: dark`, or with `appearance: auto` while the visitor's system uses a dark color scheme.
     Both can be `github-light`, `github-dark`, `github-dark-orange`, `icy-dark`, `dark-blue`, or `photon-dark`.


## Valine

<div>
<strong>Installation Guide</strong><a class="tag is-success ml-2" href="{% post_path demo/comment/Valine %}">Preview</a>
</div>

<br>

<article class="message message-immersive is-danger">
<div class="message-body">
<i class="fas fa-exclamation-triangle mr-2"></i>Valine is deprecated since hexo-component-inferno 4.2.0,
and a warning is printed when you generate your site with it.
LeanCloud, where Valine stores the comments, shuts down on January 12, 2027.
Besides, Valine exposes the stored comments to anyone with your public App ID and App Key:
the commenters' email addresses are always exposed, and their IP addresses are exposed as well if you set
<code>record_ip: true</code>
(<a href="https://github.com/ppoffice/hexo-theme-icarus/issues/788" target="_blank" rel="noopener">ppoffice/hexo-theme-icarus#788</a>).
Please use <a href="#Waline">Waline</a>, <a href="#Twikoo">Twikoo</a>, or another comment system instead.
</div>
</article>

1. Create a LeanCloud application following the [Quickstart guide](https://valine.js.org/quickstart.html).

2. Copy the "App ID" and "App Key" of your LeanCloud application to the corresponding settings in the theme 
   configurations.
   In addition, you can refer to the [Config Reference](https://valine.js.org/configuration.html) to find out the 
   details and possible values of the optional settings.
   Here is an example configuration:

    {% codeblock _config.icarus.yml lang:yaml %}
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


## Waline

<div>
<strong>Installation Guide</strong><a class="tag is-success ml-2" href="{% post_path demo/comment/Waline %}">Preview</a>
</div>

1. Create a LeanCloud application and a Vercel project following the [Get Started](https://waline.js.org/en/guide/get-started.html) guide.
   Note that LeanCloud shuts down on January 12, 2027 (see [Valine](#Valine)), so if you set up Waline now, store
   the comments in another database supported by Waline.

2. Copy the "Server URL" of your Vercel project to the corresponding setting in the theme configurations.
   It is usually something like `https://your-domain.vercel.app`.
   In addition, you can refer to the [Client Configuration](https://waline.js.org/en/reference/client.html) to find out more
   details and possible values of the optional settings.
   Here is an example configuration:

    {% codeblock _config.icarus.yml lang:yaml %}
    comment:
        type: waline
        server_url: https://your-domain.vercel.app
        path: window.location.pathname                # Optional. A path like /posts/hello/, or a JavaScript expression
        lang: en-US                                   # Optional
        locale:                                       # Optional
            placeholder: 'Comment here...'
        emoji:                                        # Optional
            - '//unpkg.com/@waline/emojis@1.0.1/weibo'
        # dark: auto                                  # Optional. Follows the appearance of the page if not set
        meta: ["nick", "mail", "link"]                # Optional
        required_meta: []                             # Optional
        login: enable                                 # Optional
        word_limit: 0                                 # Optional
        page_size: 10                                 # Optional
        image_uploader: false                         # Optional. Set to true to disable image uploading
        highlighter: false                            # Optional. Set to true to disable code highlighting
        tex_renderer: false                           # Optional. Set to true to disable TeX rendering
        search: false                                 # Optional. Set to true to disable image search
        pageview: false                               # Optional. Do not enable it with the waline_pageview plugin
        comment: false                                # Optional
        copyright: true                               # Optional
    {% endcodeblock %}

   Since hexo-component-inferno 4.2.0, the `image_uploader`, `highlighter`, `tex_renderer`, and `search` settings
   turn off Waline features:
   setting one of them to `true` disables the feature (Icarus passes `false` for it to Waline), while leaving it
   empty or setting it to `false` keeps Waline's default behavior for that feature.
   Note that hexo-component-inferno 4.1.0 worked the other way round: `true` kept the feature, and `false` or
   leaving the setting out disabled it.
   Also since hexo-component-inferno 4.2.0, `path` can be a fixed path starting with `/`, such as `/posts/hello/`.
   Any other value is used as a JavaScript expression, and it defaults to `window.location.pathname`.

   Without `dark`, Waline follows the appearance of the page: it looks dark with `appearance: dark`, and follows
   the color scheme of the visitor's system with `appearance: auto`.
   Set `dark` to `true`, `false`, `auto` (follow the color scheme of the system), or a CSS selector that turns on
   the dark mode when it matches an ancestor of Waline to override it.

   The `pageview` setting counts and shows the page views with the Waline comments.
   Icarus also provides a `waline_pageview` plugin, which counts the page views with the Waline server and shows
   them in the post header (see [Web Analytics Plugins]({% post_path en/Web-Analytics-Plugins %})).
   Enable only one of them: with both, each view is counted twice, and a warning is printed when you generate
   your site.


<article class="message message-immersive is-warning">
<div class="message-body">
<i class="fas fa-question-circle mr-2"></i>Something wrong with this article? 
Click <a href="https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/en/Comment-Plugins.md">here</a> 
to submit your revision.
</div>
</article>
