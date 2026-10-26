title: Getting Started with Icarus
date: 2026-10-24
tags:
- Getting Started
- Icarus User Guide
language: en
cover: /gallery/covers/getting-started-en.webp
thumbnail: /gallery/covers/getting-started-en.webp
---

Welcome to the Icarus documentation site!
Icarus is a simple, delicate, and modern theme for the static site generator Hexo.
It strives to be elegant in design while simple and straightforward to use.
Its versatile and flexible configuration system enables power users to lay out their sites to the finest details.
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
Icarus 6.6 requires Hexo 7.1.1 or a newer version (Hexo 7 or Hexo 8) and Node.js 14 or a newer version.
Note that Hexo 8 itself requires Node.js 20.19 or a newer version.
To install Icarus, take one of the following approaches:
 
{% tabs align:left style:boxed %}
<!-- tab id:install-source 'icon:fas fa-file-code' 'title:Install from source' -->
Download the source code tarball from the GitHub and extract it to the `themes/icarus` directory of your Hexo
site.
The directory must be named `icarus`, the same as the theme name you set in the site configuration below.
Alternatively, you can use Git to clone the Icarus repository to the `themes` directory:

{% codeblock "Git Bash/Shell" %}
git clone https://github.com/ppoffice/hexo-theme-icarus.git themes/icarus -b <version number> --depth 1
{% endcodeblock %}

Replace `<version number>` with the version you want, such as `-b 6.6.0`.
The version tags of Icarus do not have a `v` prefix.
You can omit `-b <version number>` to get the latest development version of Icarus.
Leave `--depth 1` out if you want to download full Git commit history of Icarus as well.
Furthermore, you can install Icarus as a Git submodule with the following command:

{% codeblock "Git Bash/Shell" %}
git submodule add https://github.com/ppoffice/hexo-theme-icarus.git themes/icarus
{% endcodeblock %}

When installed from source, Icarus uses the Node.js packages of your site, so you also need to install its
dependencies, including the `hexo-renderer-inferno` renderer, in the root directory of your site.
You don't have to look them up yourself: Icarus checks its dependencies every time you run a `hexo` command
(see the next steps), lists the missing ones, and prints the command to install them, for example:

{% codeblock "Shell" %}
$ hexo clean
INFO  === Checking package dependencies ===
ERROR Package bulma-stylus is not installed.
ERROR Package hexo-component-inferno is not installed.
ERROR Package hexo-renderer-inferno is not installed.
...
ERROR Please install the missing dependencies in your Hexo site root directory:
ERROR npm install --save bulma-stylus@0.8.0 hexo-component-inferno@^4.1.0 hexo-renderer-inferno@^1.0.2 ...
ERROR or:
ERROR yarn add bulma-stylus@0.8.0 hexo-component-inferno@^4.1.0 hexo-renderer-inferno@^1.0.2 ...
{% endcodeblock %}

Run the printed `npm install` (or `yarn add`) command in the root directory of your site, not in
`themes/icarus`.
Hexo only loads renderers, such as `hexo-renderer-inferno`, that are listed in the `package.json` of your
site.
<!-- endtab -->

<!-- tab active id:install-npm 'icon:fas fa-cubes' 'title:Install via NPM' -->
To install Icarus as a node package via NPM, run the following command
from the root of your Hexo site:

{% codeblock "Shell" %}
npm install -S hexo-theme-icarus hexo-renderer-inferno
{% endcodeblock %}

The other dependencies of Icarus are installed along with it.
`hexo-renderer-inferno` is installed explicitly because Hexo only loads renderers that are listed in the
`package.json` of your site.
<!-- endtab -->
{% endtabs %}

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

The first time you run a `hexo` command with Icarus, it creates the theme configuration file
`_config.icarus.yml` in the root directory of your site, with every option and its description.
Edit this file to configure the theme, as described in {% post_link en/Configuring-Theme %}.

To learn more about the theme, widgets, and plugins, check out the 
[Icarus User Guide](/hexo-theme-icarus/tags/Icarus-User-Guide/).
You can also refer to the source code of this site for more examples.
It is in the [`site` branch](https://github.com/ppoffice/hexo-theme-icarus/tree/site) of the Icarus repository 
on GitHub.
Additionally, you may find help from other Icarus users on [GitHub Discussions](https://github.com/ppoffice/hexo-theme-icarus/discussions).

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
