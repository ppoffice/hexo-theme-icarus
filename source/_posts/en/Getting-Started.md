title: Getting Started with Icarus
date: 2020-01-01
thumbnail: /gallery/thumbnails/desert.jpg
tags:
- Getting Started
- Icarus User Guide
language: en
---
A simple, delicate, and modern theme for the static site generator Hexo. 
It allows you to set up a single or multiple-column (up to three column) blog with its versatile layout configuration. 
Additionally, it offers plentiful plugins and pluggable widgets so that you can enable the features you want in no time. 
And with the all-new API designing, Icarus makes the development of this theme painless for developers and users.

<!-- more -->

<div class="notification is-success is-size-6">
This article is also available in: <a href="{% post_path zh-CN/Getting-Started %}">简体中文</a>.
</div>

To set up Icarus in your blog, please download the tarball from the GitHub and extract it to your Hexo blog's theme 
directory.
Alternatively, you can run the following command:

{% codeblock "Git Bash/Shell" %}
git clone https://github.com/ppoffice/hexo-theme-icarus.git themes/icarus -b <version number> --depth 1
{% endcodeblock %}

You may omit the `-b <version number>` to get the latest development version of Icarus.
You may also leave `--depth 1` out if you want to download full Git history if Icarus as well.
Furthermore, you can install Icarus as a Git submodule by executing the following command:

{% codeblock "Git Bash/Shell" %}
git submodule add https://github.com/ppoffice/hexo-theme-icarus.git themes/icarus
{% endcodeblock %}

Next, replace the theme setting in your blog's `_config.yml` file:

{% codeblock _config.yml lang:yaml %}
theme: icarus
{% endcodeblock %}

or use the `hexo` CLI to change the theme setting:

{% codeblock "Shell" %}
hexo config theme icarus
{% endcodeblock %}

Finally, use the following command to start the Hexo local server and begin composing!

{% codeblock "Shell" %}
hexo s
{% endcodeblock %}

You can check out the [Icarus User Guide](/hexo-theme-icarus/tags/Icarus-User-Guide/) article series to learn more
about Icarus and its configuration.
Also, you can refer to the source code of this site for more examples by fetching the 
[`site` branch](https://github.com/ppoffice/hexo-theme-icarus/tree/site) of Icarus from GitHub.


<div class="notification is-warning is-size-6">
Something wrong with this article? Click <a href="https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/en/Getting-Started.md">here</a> to submit your revision.
</div>

<a style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-size:12px;line-height:1.2;display:inline-block;border-radius:3px" href="https://unsplash.com/@yazi0413?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge" target="_blank" rel="noopener noreferrer" title="Download free do whatever you want high-resolution photos from Chandler Chen"><span style="display:inline-block;padding:2px 3px"><svg xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;position:relative;vertical-align:middle;top:-1px;fill:white" viewBox="0 0 32 32"><title>unsplash-logo</title><path d="M20.8 18.1c0 2.7-2.2 4.8-4.8 4.8s-4.8-2.1-4.8-4.8c0-2.7 2.2-4.8 4.8-4.8 2.7.1 4.8 2.2 4.8 4.8zm11.2-7.4v14.9c0 2.3-1.9 4.3-4.3 4.3h-23.4c-2.4 0-4.3-1.9-4.3-4.3v-15c0-2.3 1.9-4.3 4.3-4.3h3.7l.8-2.3c.4-1.1 1.7-2 2.9-2h8.6c1.2 0 2.5.9 2.9 2l.8 2.4h3.7c2.4 0 4.3 1.9 4.3 4.3zm-8.6 7.5c0-4.1-3.3-7.5-7.5-7.5-4.1 0-7.5 3.4-7.5 7.5s3.3 7.5 7.5 7.5c4.2-.1 7.5-3.4 7.5-7.5z"></path></svg></span><span style="display:inline-block;padding:2px 3px">Chandler Chen</span></a>
