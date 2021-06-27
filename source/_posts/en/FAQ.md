title: FAQ
date: 2020-02-02
tags:
- Icarus User Guide
toc: true
cover: /gallery/covers/vector_landscape_3.svg
thumbnail: /gallery/covers/vector_landscape_3.svg
---

The article answers some frequently asked questions about Icarus.
If your question is not answered here, you can also refer to 
[Icarus User Guide](/hexo-theme-icarus/tags/Icarus-User-Guide/), 
[Hexo documentation](https://hexo.io/docs/index.html), and 
[GitHub Issues](https://github.com/ppoffice/hexo-theme-icarus/issues?q=).
Additionally, you may find help from other Icarus users on [GitHub Discussions](https://github.com/ppoffice/hexo-theme-icarus/discussions).

<!-- more -->

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-globe-asia mr-2"></i>This article is also available in 
<a href="{% post_path zh-CN/FAQ %}">简体中文</a>.
</div>
</article>


## Site

<article class="message is-primary" style="font-size:inherit">
<div class="message-body">
I can't generate my site. / I met some errors when I generate my site.
</div>
</article>

Icarus 4 runs on Node.js 12.4.0 or a newer version.
It also requires Hexo 5.0.2 or a newer version.
Apart from that, make sure you have all the Node.js dependencies installed.
You can find them in the `peerDependencies` section of the 
[`<icarus_directory>/package.json`](https://github.com/ppoffice/hexo-theme-icarus/blob/master/package.json)
file.
Also, remove all unused Node.js dependencies from your site, or they may cause strange problems to 
Icarus.

<article class="message is-primary" style="font-size:inherit">
<div class="message-body">
How do I change the language of my site?
</div>
</article>

Open the site configuration file `_config.yml` under the root directory.
Change the following setting:

{% codeblock _config.yml lang:diff %}
- language: en
+ language: <language_name>
{% endcodeblock %}

You can find all available translations under the `<icarus_directory>/languages` directory.
The `<language_name>` is the translation file name without the `.yml` extension.


## Layout

<article class="message is-primary" style="font-size:inherit">
<div class="message-body">
How do I change the page width? How do I use the one/two/three-column layout?
</div>
</article>

To change the page width, edit the style file `<icarus_directory>/include/style/responsive.styl`.
It defines the container width under different screen sizes.

To change the width of the widgets or main content, edit `<icarus_directory>/layout/common/widgets.jsx` and 
`<icarus_directory>/layout/layout.jsx`.
Find the CSS class names like `is-12`, `is-8-tablet`, and `is-4-widescreen` in these files.
The number in the class names marks the number of columns a widget or main content takes.
The screen size after the number, such as `tablet` and `widescreen`, refers to the condition when the column
sizes take effect.
Change the number in the class names such that the column count of main column and widget column(s) add up to 
12 under the same screen size.

For example, to have the main content column wider on `widescreen`, you can make the following changes:

{% codeblock &lt;icarus_directory&gt;/layout/layout.jsx lang:diff >folded %}
 <div class={classname({
     column: true,
     'order-2': true,
     'column-main': true,
     'is-12': columnCount === 1,
-    'is-8-tablet is-8-desktop is-8-widescreen': columnCount === 2,
+    'is-8-tablet is-8-desktop is-9-widescreen': columnCount === 2,
     'is-8-tablet is-8-desktop is-6-widescreen': columnCount === 3
{% endcodeblock %}

{% codeblock &lt;icarus_directory&gt;/layout/common/widgets.jsx lang:diff >folded %}
 function getColumnSizeClass(columnCount) {
     switch (columnCount) {
         case 2:
-            return 'is-4-tablet is-4-desktop is-4-widescreen';
+            return 'is-4-tablet is-4-desktop is-3-widescreen';
         case 3:
             return 'is-4-tablet is-4-desktop is-3-widescreen';
{% endcodeblock %}

You can refer to [Bulma documentation](https://bulma.io/documentation/columns/sizes/) for more details on the 
column system.

Here are some tips for creating a one/two/three-column layout:

- You can remove all widgets from your theme configurations to create a one-column layout.
- You can move all your widgets to the same side of the page to create a two-column layout.
- You can place widgets on both sides of the page to create a three-column layout.

To change the layout for a single or all posts/pages, refer to 
[Configuration Files and Priority](/hexo-theme-icarus/Configuration/icarus-user-guide-configuring-the-theme/#Configuration-Files-and-Priority).

<article class="message is-primary" style="font-size:inherit">
<div class="message-body">
Where are the layout files for widgets/comments/share...? How do I customize built-in widgets/comments/share...?
</div>
</article>

The layout files for plugins and widgets have been moved to a separate Node.js package called 
[`hexo-component-inferno`](https://github.com/ppoffice/hexo-component-inferno).
This help theme developers better reuse common components across different themes and make overriding these 
components easy for average users.

To customize these components, copy the layout files from the `hexo-component-inferno` repository and place
them in the corresponding directories under `<icarus_directory>/layout`.
For example, if you want to customize the Valine comment plugin, you can copy 
[`src/view/comment/valine.jsx`](https://github.com/ppoffice/hexo-component-inferno/blob/0.2.4/src/view/comment/valine.jsx) 
from the `hexo-component-inferno` repository to `<icarus_directory>/layout/comment/valine.jsx`.
Also, remember to fix Node.js imports like the following:

{% codeblock &lt;icarus_directory&gt;/layout/comment/valine.jsx lang:diff %}
- const { cacheComponent } = require('../../util/cache');
+ const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');
{% endcodeblock %}

Finally, `hexo clean` your site before regenerating the HTML.

Similarly, you can override static files like 
[`asset/js/insight.js`](https://github.com/ppoffice/hexo-component-inferno/blob/0.2.4/asset/js/insight.js) 
in the same way.

<article class="message is-primary" style="font-size:inherit">
<div class="message-body">
Why don't my layout changes take effect when I refresh the page (assuming I am running the 
<code>hexo server</code>?
</div>
</article>

Icarus caches the layout files when you start the local Hexo server with the `hexo server` command.
To make the layout changes take effect, restart the local server.

Other times some intermediate data may be cached by Hexo in the memory or `db.json` database.
Execute `hexo clean` before running `hexo server` or `hexo generate` should resolve this issue.


## Content

<article class="message is-primary" style="font-size:inherit">
<div class="message-body">
My images are not showing up. / My images only show in index pages but not in posts.
</div>
</article>

Make sure you use the absolute paths to your images.
For example, your site is in a subdirectory of your domain name like 
`https://ppoffice.github.io/hexo-theme-icarus` and your image `image.jpg` under `source/gallery/`.
You should include your image like this: `/hexo-theme-icarus/gallery/image.jpg`.

You can also use Hexo's <code>{% raw %}{% img %}{% endraw %}</code> tag like the following to include an 
image automatically:

```
{% img /gallery/image.jpg "Image title" %}
```

In this case, you may omit the subdirectory from your image path.
You can refer to [Hexo documentation](https://hexo.io/docs/tag-plugins#Image) for more details.

<article class="message is-primary" style="font-size:inherit">
<div class="message-body">
How to add an excerpt for a post? How to display the "Read more" button?
</div>
</article>

Put a `<!-- more -->` tag in your post.
Post content before this tag will be marked as an excerpt.
Content after this tag will not show up on index pages.

You can also specify a custom excerpt in the post's front-matter.

{% codeblock some-post.md lang:yaml %}
title: Some Post
date: 2020-01-01
excerpt: This is an article about ...
---
# Post content...
{% endcodeblock %}

<article class="message is-primary" style="font-size:inherit">
<div class="message-body">
How do I encrypt my posts?
</div>
</article>

Use third-party Hexo plugins such as [hexo-blog-encrypt](https://github.com/MikeCoder/hexo-blog-encrypt).

<article class="message is-primary" style="font-size:inherit">
<div class="message-body">
How do I use those fancy elements in this article for my posts?
</div>
</article>

Refer to [Bulma documentation](https://bulma.io/documentation/) for all available elements and styles.
Copy the HTML snippets and put them in your Markdown files directly.


## Widgets and Plugins

<article class="message is-primary" style="font-size:inherit">
<div class="message-body">
How can I get rid of those red alerts that are showing on the page and warning me of configuration value not set?
</div>
</article>

Those alerts usually show up when you miss out on some plugin or widget configurations.
If you don't want to enable a certain plugin or widget, delete it or comment it out from your theme configurations.

For example, you can disable the comment plugins by commenting out the following lines:

{% codeblock _config.icarus.yml lang:diff %}
- comment:
-     type: disqus
-     shortname: 
+ # comment:
+ #     type: disqus
+ #     shortname: 
{% endcodeblock %}


<article class="message message-immersive is-warning">
<div class="message-body">
<i class="fas fa-question-circle mr-2"></i>Something wrong with this article? 
Click <a href="https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/en/FAQ.md">here</a> 
to submit your revision.
</div>
</article>


<a style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-size:12px;line-height:1.2;display:inline-block;border-radius:3px" href="https://www.vecteezy.com/free-vector/vector-landscapee" target="_blank" rel="noopener noreferrer" title="Vector Landscape Vectors by Vecteezy"><span style="display:inline-block;padding:2px 3px"><svg xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;position:relative;vertical-align:middle;top:-1px;fill:white" viewBox="0 0 32 32"><path d="M20.8 18.1c0 2.7-2.2 4.8-4.8 4.8s-4.8-2.1-4.8-4.8c0-2.7 2.2-4.8 4.8-4.8 2.7.1 4.8 2.2 4.8 4.8zm11.2-7.4v14.9c0 2.3-1.9 4.3-4.3 4.3h-23.4c-2.4 0-4.3-1.9-4.3-4.3v-15c0-2.3 1.9-4.3 4.3-4.3h3.7l.8-2.3c.4-1.1 1.7-2 2.9-2h8.6c1.2 0 2.5.9 2.9 2l.8 2.4h3.7c2.4 0 4.3 1.9 4.3 4.3zm-8.6 7.5c0-4.1-3.3-7.5-7.5-7.5-4.1 0-7.5 3.4-7.5 7.5s3.3 7.5 7.5 7.5c4.2-.1 7.5-3.4 7.5-7.5z"></path></svg></span><span style="display:inline-block;padding:2px 3px">Vector Landscape Vectors by Vecteezy</span></a>