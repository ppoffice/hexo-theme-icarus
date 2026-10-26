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
        prefer_remote_conf: false           # Optional. Prefer the settings on the Artalk server when true
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
   - Use an Artalk server compatible with client 2.10.0.
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

Gitalk keeps the comments in the issues or discussions of a GitHub repository.
Visitors sign in through a GitHub App and a Gitalk proxy that you deploy yourself.

<div>
<strong>Installation Guide</strong><a class="tag is-success ml-2" href="{% post_path demo/comment/Gitalk %}">Preview</a>
</div>

1. Log into GitHub and [click here](https://github.com/settings/apps/new) to create a new GitHub App.
   To create the App under an organization, go to "Developer settings" in the settings of the organization instead.
   Fill in the "GitHub App name" and "Homepage URL".
   Leave the "Callback URL" empty for now, and uncheck "Active" under "Webhook".
   Under "Repository permissions", set "Issues" to "Read and write" if you keep the comments in issues,
   or "Discussions" to "Read and write" if you keep them in discussions.
   Then, click the "Create GitHub App" button.

2. On the App settings page, write down the "App ID" and "Client ID".
   Click "Generate a new client secret" and "Generate a private key" to get the client secret and the private key.

3. Deploy the Gitalk proxy to Cloudflare Workers or Tencent CloudBase by following the
   [Gitalk proxy guide](https://github.com/gitalk/gitalk/blob/main/packages/gitalk-deploy/README.md).
   Fill in the App ID, Client ID, client secret, and private key from the last step in its `.env` file.
   Set `GITALK_ALLOWED_ORIGINS` to the origin of your Hexo site, e.g., `https://ppoffice.github.io`.
   Write down the proxy URL printed after the deployment, e.g., `https://my-gitalk.octocat.workers.dev`.

4. Go back to the App settings page.
   Set the "Callback URL" to the proxy URL followed by `/oauth/callback`, e.g.,
   `https://my-gitalk.octocat.workers.dev/oauth/callback`, and save the changes.

5. Prepare a public GitHub repository for the comments.
   If you keep the comments in discussions, turn on "Discussions" in the settings of the repository and make sure
   it has at least one discussion category.

6. Open `https://github.com/apps/<app-slug>/installations/new`, where `<app-slug>` is the last part of the public
   URL of your App.
   Choose "Only select repositories", select the repository from the last step, and click the "Install" button.

7. Copy the Client ID and the proxy URL to the corresponding settings in the theme configurations.
   For example, the following Client ID and proxy URL:

    {% codeblock "GitHub App and Gitalk Proxy" %}
    Client ID
    Iv23lixxxxxxxxxxxxxx
    Proxy URL
    https://my-gitalk.octocat.workers.dev
    {% endcodeblock %}

   maps to the following theme configuration:

    {% codeblock _config.icarus.yml lang:yaml %}
    comment:
        type: gitalk
        client_id: Iv23lixxxxxxxxxxxxxx
        proxy: https://my-gitalk.octocat.workers.dev
        repo: Some-of-Your-GitHub-Repo  # Name of the repository, without the owner
        owner: you_github_name
        admin:
            - you_github_name
        backend: issues                 # Optional, default: issues. Set to discussions to keep the comments in discussions
        category: General               # Optional. Name or slug of the discussion category for new discussions
        per_page: 10                    # Optional, default: 10. At most 100
        distraction_free_mode: false    # Optional
        pager_direction: last           # Optional, default: last. last or first
        create_issue_manually: true     # Optional, default: true
        enable_hotkey: true             # Optional, default: true. Submit a comment with Cmd or Ctrl + Enter
        language: zh-CN                 # Optional
    {% endcodeblock %}

8. Notes:
   - Gitalk follows the appearance of the page: it looks dark with `appearance: dark`, and follows the color
     scheme of the visitor's system with `appearance: auto`.
   - The client secret and the private key belong to the proxy.
     Do not put them in the theme configurations.
   - With `create_issue_manually: true`, an admin creates the issue or discussion of each page by signing in on
     that page and clicking the button that Gitalk shows.
   - To use an existing issue or discussion for the comments of a page, set `number` to its number in the
     front-matter of the page.
     Since the front-matter replaces the whole `comment` setting, copy the other comment settings there as well.
   - You can review the description and possible values of the above configuration at
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

<div>
<strong>Installation Guide</strong><a class="tag is-success ml-2" href="{% post_path demo/comment/LiveRe %}">Preview</a>
</div>

1. Sign in to [LiveRe Admin](https://admin.livere.org/) and add your site.
   Fill in the name and the URL of your site, and verify your email address.

2. Copy the installation code of your site from LiveRe Admin.

3. Copy the value of `client-id` in the code to the corresponding setting in the theme configurations.
   For example, the LiveRe code below:

   {% codeblock "LiveRe Installation Code" lang:html %}
   <livere-comment client-id="AbCdEfGhIjKlMnOpQrSt"></livere-comment>
   <script type="module" src="https://www.livere.org/livere-widget.js"></script>
   {% endcodeblock %}

   maps to the following theme configuration:

    {% codeblock _config.icarus.yml lang:yaml %}
    comment:
        type: livere
        client_id: AbCdEfGhIjKlMnOpQrSt
    {% endcodeblock %}

   If you use the legacy LiveRe City code, set `uid` to the value of its `data-uid` attribute instead.


## Twikoo

Twikoo is a self-hosted comment system based on cloud functions.
Unlike other third-party comment services, the Twikoo backend needs to be deployed to a cloud
environment before being configured and used by Icarus.

<div>
<strong>Installation Guide</strong><a class="tag is-success ml-2" href="{% post_path demo/comment/Twikoo %}">Preview</a>
</div>

1. Follow the [Twikoo documentation](https://twikoo.js.org/en/) to deploy the Twikoo cloud function
   to a cloud service provider of your choice.
   Icarus loads version 2.0.17 of the Twikoo client, so deploy a Twikoo backend of the same version.

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

1. Deploy the Waline server to Vercel following the [Get Started](https://waline.js.org/en/guide/get-started/) guide.
   Note that LeanCloud shuts down on January 12, 2027 (see [Valine](#Valine)), so if you set up Waline now, store
   the comments in another database supported by Waline.

2. Copy the "Server URL" of your Vercel project to the corresponding setting in the theme configurations.
   It is usually something like `https://your-domain.vercel.app`.
   In addition, you can refer to the [Client Configuration](https://waline.js.org/en/reference/client/props.html) to find out more
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
        emoji:                                        # Optional. Set to false to disable emoji
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

   The `image_uploader`, `highlighter`, `tex_renderer`, and `search` settings turn off Waline features:
   setting one of them to `true` disables the feature (Icarus passes `false` for it to Waline), while leaving it
   empty or setting it to `false` keeps Waline's default behavior for that feature.
   `path` can be a fixed path starting with `/`, such as `/posts/hello/`.
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
