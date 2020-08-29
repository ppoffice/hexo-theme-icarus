title: Getting Started with Icarus
date: 2020-04-01
tags:
- Getting Started
- Icarus User Guide
language: en
cover: /gallery/covers/vector_landscape_1.svg
thumbnail: /gallery/covers/vector_landscape_1.svg
---

Welcome to the Icarus documentation site!
Icarus is a simple, delicate, and modern theme for the static site generator Hexo.
It strives to be elegant in design while simple and straightforward to use.
Its versatile and flexible configuration system enables power users lay out their sites to the finest details.
Icarus also offers a wide range of plugins and widgets to meet your various customization and optimization 
needs.
Moreover, its refreshed implementation enables better IDE support and third-party integration, which 
open to a sea of improvement possibilities.

<!-- more -->

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-globe-asia mr-2"></i>This article is also available in 
<a href="{% post_path zh-CN/Getting-Started %}">简体中文</a>.
</div>
</article>

Before you continue to the installation of Icarus, take some time to review the 
[Hexo documentation](https://hexo.io).
To install Icarus, take one of the following approaches:

<div class="tabs is-boxed my-3">
  <ul class="mx-0 my-0">
    <li class="is-active">
      <a href="#install-source">
        <span class="icon is-small"><i class="fas fa-file-code" aria-hidden="true"></i></span>
        <span>Install from source</span>
      </a>
    </li>
    <li>
      <a href="#install-npm">
        <span class="icon is-small"><i class="fas fa-cubes" aria-hidden="true"></i></span>
        <span>Install via NPM</span>
      </a>
    </li>
  </ul>
</div>
<div id="install-source" class="tab-content">
  Download the source code tarball from the GitHub and extract it to your Hexo site's theme 
  directory.
  Alternatively, you can use Git to clone the Icarus repository to the `themes` directory:

  {% codeblock "Git Bash/Shell" %}
  git clone https://github.com/ppoffice/hexo-theme-icarus.git themes/icarus -b <version number> --depth 1
  {% endcodeblock %}

  You can omit `-b <version number>` to get the latest development version of Icarus.
  Leave `--depth 1` out if you want to download full Git commit history of Icarus as well.
  Furthermore, you can install Icarus as a Git submodule with the following command:

  {% codeblock "Git Bash/Shell" %}
  git submodule add https://github.com/ppoffice/hexo-theme-icarus.git themes/icarus
  {% endcodeblock %}
</div>

<div id="install-npm" class="tab-content is-hidden">
  To install Icarus as a node package via NPM, run the following command
  from the root of your Hexo site:

  {% codeblock "Shell" %}
  npm install -S hexo-theme-icarus
  {% endcodeblock %}
</div>

<hr>

Next, activate Icarus in your site's `_config.yml` file:

{% codeblock _config.yml lang:yaml %}
theme: icarus
{% endcodeblock %}

or use the `hexo` command to change the theme to Icarus:

{% codeblock "Shell" %}
hexo config theme icarus
{% endcodeblock %}

Finally, use the following command to start the Hexo local server and begin composing!

{% codeblock "Shell" %}
hexo server
{% endcodeblock %}

To learn more about the theme, widgets, and plugins, check out the 
[Icarus User Guide](/hexo-theme-icarus/tags/Icarus-User-Guide/).
You can also refer to the source code of this site for more examples.
It is in the [`site` branch](https://github.com/ppoffice/hexo-theme-icarus/tree/site) of the Icarus repository 
on GitHub.
Additionally, you may find help from other Icarus users on [Gitter](https://gitter.im/hexo-theme-icarus/).

**Additional Resources**

Here are some other resources that you may find useful to further customize your site.
You can also submit your Icarus tutorial through [this link](https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/en/Getting-Started.md).

<div class="menu-list is-size-6">
<a href="https://hexo.io/docs/index.html"><i class="fas fa-bookmark mr-2"></i> Hexo documentation</a>
</div>

<br>

<article class="message message-immersive is-warning">
<div class="message-body">
<i class="fas fa-question-circle mr-2"></i>Something wrong with this article? 
Click <a href="https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/en/Getting-Started.md">here</a> 
to submit your revision.
</div>
</article>

<a style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-size:12px;line-height:1.2;display:inline-block;border-radius:3px" href="https://www.vecteezy.com/free-vector/vector-landscape" target="_blank" rel="noopener noreferrer" title="Vector Landscape Vectors by Vecteezy"><span style="display:inline-block;padding:2px 3px"><svg xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;position:relative;vertical-align:middle;top:-1px;fill:white" viewBox="0 0 32 32"><path d="M20.8 18.1c0 2.7-2.2 4.8-4.8 4.8s-4.8-2.1-4.8-4.8c0-2.7 2.2-4.8 4.8-4.8 2.7.1 4.8 2.2 4.8 4.8zm11.2-7.4v14.9c0 2.3-1.9 4.3-4.3 4.3h-23.4c-2.4 0-4.3-1.9-4.3-4.3v-15c0-2.3 1.9-4.3 4.3-4.3h3.7l.8-2.3c.4-1.1 1.7-2 2.9-2h8.6c1.2 0 2.5.9 2.9 2l.8 2.4h3.7c2.4 0 4.3 1.9 4.3 4.3zm-8.6 7.5c0-4.1-3.3-7.5-7.5-7.5-4.1 0-7.5 3.4-7.5 7.5s3.3 7.5 7.5 7.5c4.2-.1 7.5-3.4 7.5-7.5z"></path></svg></span><span style="display:inline-block;padding:2px 3px">Vector Landscape Vectors by Vecteezy</span></a>
