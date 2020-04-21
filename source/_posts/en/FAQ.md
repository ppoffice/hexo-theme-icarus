title: FAQ
date: 2020-02-01
thumbnail: /gallery/thumbnails/vector_landscape_3.svg
toc: true
---

The article presents some of the frequently asked questions about Icarus and their solutions.
Please also read through the [Icarus User Guide](/hexo-theme-icarus/tags/Icarus-User-Guide/), 
[Hexo documentation](https://hexo.io/docs/index.html) and 
[Icarus GitHub Issues](https://github.com/ppoffice/hexo-theme-icarus/issues?q=) if you cannot find
the answer to your question here.

<!-- more -->

<!-- <div class="notification is-success is-size-6">
This article is also available in: <a href="{% post_path zh-CN/FAQ %}">简体中文</a>.
</div> -->


## Site

<article class="message is-primary" style="font-size:1em">
<div class="message-body">
My Hexo site is not generating./There are errors when generating my site.
</div>
</article>

Icarus requires Node.js of version 8.3.0 and above, Hexo of version 4.2.0 and above, and some other
package dependencies listed in the `peerDependencies` section of the 
[`themes/icarus/package.json`](https://github.com/ppoffice/hexo-theme-icarus/blob/master/package.json)
file.
Please make sure you meet all the dependency requirements.
Also, it is possible that dependencies of the previous theme you used could interfere with Icarus.
Please remove them before you switch to Icarus.

<article class="message is-primary" style="font-size:1em">
<div class="message-body">
How do I change the language of my site?
</div>
</article>

Edit your site's `_config.yml` under the root directory, change the following setting:

{% codeblock _config.yml lang:diff %}
- language: en
+ language: <language_name>
{% endcodeblock %}

You can find available translations under the `themes/icarus/languages` directory.
The file name without file extension is the language name used in `_config.yml`.


## Layout

<article class="message is-primary" style="font-size:1em">
<div class="message-body">
How do I change the width of the page? How do I use a one/two/three-column layout in certain posts/pages?
</div>
</article>

To change the width of the page, you need to edit the style file located at `themes/icarus/include/style/responsive.styl`.
This file defines the container width under different screen sizes.
If you also want to change the column width of the widgets or the main content, please go to `themes/icarus/layout/common/widgets.jsx` and `themes/icarus/layout/layout.jsx`.
Find the CSS class names like `is-12`, `is-8-tablet`, and `is-4-widescreen`.
Change the number in these class names to the one you want.

You can refer to the [Bulma documentation](https://bulma.io/documentation/columns/sizes/) for more details on the 
column system.
Please make sure the number of widget columns and the main content column add up to 12 under the same screen size.
For example, if you change the width of the widget column to `is-3-widescreen` and you only have one widget column,
you need to make sure your main content column has a `is-9-widescreen`.

You can create a one-column layout by removing all widgets from your theme configurations.
To use a two-column layout, please move all your widgets to the same side of the page by setting their `position`
to `left` or `right`.
The three-column layout can be achieved by placing widgets on both sides of the page.

To change the layout in certain posts or pages, please refer to the 
[Icarus User Guide - Configuring the Theme](/hexo-theme-icarus/Configuration/icarus-user-guide-configuring-the-theme/#Additional-Configuration-Files-and-Priority).

<article class="message is-primary" style="font-size:1em">
<div class="message-body">
Where are the layout files for widgets/comments/share...? How do I customize built-in widgets/comments/share...?
</div>
</article>

The layout files for comment plugins, donate buttons, site search, share buttons, widgets, and some other plugins
have been moved to a separate Node.js package called [`hexo-component-inferno`](https://github.com/ppoffice/hexo-component-inferno).
In doing this, the theme developers can better reuse common components across different themes and allow users to 
override these built-in components easily.

To customize these components, you may copy the layout files from the `hexo-component-inferno` repository and place
them in the corresponding directories under the Icarus layout directory.
For example, if you want to customize the Valine comment plugin, you can copy 
[`src/view/comment/valine.jsx`](https://github.com/ppoffice/hexo-component-inferno/blob/0.2.4/src/view/comment/valine.jsx) 
from the `hexo-component-inferno` repository and place it in the `themes/icarus/layout/comment` directory.
Then, fix some of the Node.js imports in the head of the file.

{% codeblock themes/icarus/layout/comment/valine.jsx lang:diff %}
- const { cacheComponent } = require('../../util/cache');
+ const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');
{% endcodeblock %}

After that, `hexo clean` your site and regenerate the HTML files.

Similarly, you can override static files by copying them from the `hexo-component-inferno` repository and place them 
to the corresponding directory under `themes/icarus/source`.

<article class="message is-primary" style="font-size:1em">
<div class="message-body">
I changed something in the layout files. 
But why didn't the changes take effect when I refresh the page (when using <code>hexo s</code>)/when I <code>hexo generate</code>?
</div>
</article>

The layout files are cached when you start a local Hexo server with `hexo server`.
Other times some intermediate data is cached in the `db.json` or memory.
Please use `hexo clean` before `hexo server` or `hexo generate`.


## Content

<article class="message is-primary" style="font-size:1em">
<div class="message-body">
My logo/images are not showing up./My images only shows in index pages but not posts.
</div>
</article>

Please make sure you use the absolute paths of your images.
For example, if you put your images under `source/gallery/`, and your site is in a
subdirectory of your domain name like `https://ppoffice.github.io/hexo-theme-icarus`,
you should include your image like this: `/hexo-theme-icarus/gallery/<file_name>.<file_extension>`.

You can also use the Hexo `{% img %}` tag to omit the subdirectory part of your image path:
<code>&#123;% img /gallery/&lt;file_name&gt;.&lt;file_extension&gt; ... %}</code>.
Please refer to the [Hexo documentation](https://hexo.io/docs/tag-plugins#Image) for more details.

<article class="message is-primary" style="font-size:1em">
<div class="message-body">
How to add an excerpt for a post? How to display the "Read more" button?
</div>
</article>

Add `<!-- more -->` tag in your post.
Post content before this tag will be marked as an excerpt and content after this tag will not show on the index page.
You may also add custom excerpt by specifying it in the post's front-matter.

{% codeblock some-post.md lang:yaml %}
title: Some Post
date: 2020-01-01
excerpt: This is an article about ...
---
# Post content...
{% endcodeblock %}

<article class="message is-primary" style="font-size:1em">
<div class="message-body">
How do I encrypt my posts?
</div>
</article>

Please use third-party Hexo plugins like [hexo-blog-encrypt](https://github.com/MikeCoder/hexo-blog-encrypt).

<article class="message is-primary" style="font-size:1em">
<div class="message-body">
How do I use fancy elements and styling in my posts just like this one?
</div>
</article>

You can use raw HTML in your Markdown posts.
Please refer to the [Bulma documentation](https://bulma.io/documentation/) for more details on available 
elements and styles.


## Widgets and Plugins

<article class="message is-primary" style="font-size:1em">
<div class="message-body">
My page is showing red alerts, saying that some settings are not set for a plugin/widget.
How can I get rid of them?
</div>
</article>

If you don't want to enable some plugins/widgets, you can simply delete them or comment them out in the 
configurations.
For example, if you don't want to enable any comment plugin, just delete these lines:

{% codeblock themes/icarus/_config.yml lang:diff %}
- comment:
-     type: disqus
-     shortname: 
+ # comment:
+ #     type: disqus
+ #     shortname: 
{% endcodeblock %}


<div class="notification is-warning is-size-6">
Something wrong with this article? Click <a href="https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/en/FAQ.md">here</a> to submit your revision.
</div>


<a style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-size:12px;line-height:1.2;display:inline-block;border-radius:3px" href="https://www.vecteezy.com/free-vector/vector-landscapee" target="_blank" rel="noopener noreferrer" title="Vector Landscape Vectors by Vecteezy"><span style="display:inline-block;padding:2px 3px"><svg xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;position:relative;vertical-align:middle;top:-1px;fill:white" viewBox="0 0 32 32"><path d="M20.8 18.1c0 2.7-2.2 4.8-4.8 4.8s-4.8-2.1-4.8-4.8c0-2.7 2.2-4.8 4.8-4.8 2.7.1 4.8 2.2 4.8 4.8zm11.2-7.4v14.9c0 2.3-1.9 4.3-4.3 4.3h-23.4c-2.4 0-4.3-1.9-4.3-4.3v-15c0-2.3 1.9-4.3 4.3-4.3h3.7l.8-2.3c.4-1.1 1.7-2 2.9-2h8.6c1.2 0 2.5.9 2.9 2l.8 2.4h3.7c2.4 0 4.3 1.9 4.3 4.3zm-8.6 7.5c0-4.1-3.3-7.5-7.5-7.5-4.1 0-7.5 3.4-7.5 7.5s3.3 7.5 7.5 7.5c4.2-.1 7.5-3.4 7.5-7.5z"></path></svg></span><span style="display:inline-block;padding:2px 3px">Vector Landscape Vectors by Vecteezy</span></a>