title: Hexo Built-in Tag Helpers
date: 2016-07-08 20:07:55
categories:
- Configuration
- Posts
tags:
- Getting Started
toc: true
---

{% quote %}
The following content is directly copied from <a href="https://hexo.io/docs/tag-plugins.html">Hexo official documentation</a>
{% endquote %}

Tag plugins are different from post tags. They are ported from Octopress and provide a useful way for you to quickly add specific content to your posts.
<!-- more -->
## Block Quote

Perfect for adding quotes to your post, with optional author, source and title information.

**Alias:** quote

```
{% blockquote [author[, source]] [link] [source_link_title] %}
content
{% endblockquote %}
```

### Examples

**No arguments. Plain blockquote.**

```
{% blockquote %}
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque hendrerit lacus ut purus iaculis feugiat. Sed nec tempor elit, quis aliquam neque. Curabitur sed diam eget dolor fermentum semper at eu lorem.
{% endblockquote %}
```

{% blockquote %}
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque hendrerit lacus ut purus iaculis feugiat. Sed nec tempor elit, quis aliquam neque. Curabitur sed diam eget dolor fermentum semper at eu lorem.
{% endblockquote %}

**Quote from a book**

```
{% blockquote David Levithan, Wide Awake %}
Do not just seek happiness for yourself. Seek happiness for all. Through kindness. Through mercy.
{% endblockquote %}
```

{% blockquote David Levithan, Wide Awake %}
Do not just seek happiness for yourself. Seek happiness for all. Through kindness. Through mercy.
{% endblockquote %}

**Quote from Twitter**

```
{% blockquote @DevDocs https://twitter.com/devdocs/status/356095192085962752 %}
NEW: DevDocs now comes with syntax highlighting. http://devdocs.io
{% endblockquote %}
```

{% blockquote @DevDocs https://twitter.com/devdocs/status/356095192085962752 %}
NEW: DevDocs now comes with syntax highlighting. http://devdocs.io
{% endblockquote %}

**Quote from an article on the web**

```
{% blockquote Seth Godin http://sethgodin.typepad.com/seths_blog/2009/07/welcome-to-island-marketing.html Welcome to Island Marketing %}
Every interaction is both precious and an opportunity to delight.
{% endblockquote %}
```

{% blockquote Seth Godin http://sethgodin.typepad.com/seths_blog/2009/07/welcome-to-island-marketing.html Welcome to Island Marketing %}
Every interaction is both precious and an opportunity to delight.
{% endblockquote %}

## Code Block

Useful feature for adding code snippets to your post.

**Alias:** code

```
{% codeblock [title] [lang:language] [url] [link text] %}
code snippet
{% endcodeblock %}
```

### Examples

**A plain code block**

```
{% codeblock %}
alert('Hello World!');
{% endcodeblock %}
```

{% codeblock %}
alert('Hello World!');
{% endcodeblock %}

**Specifying the language**

```
{% codeblock lang:objc %}
[rectangle setX: 10 y: 10 width: 20 height: 20];
{% endcodeblock %}
```

{% codeblock lang:objc %}
[rectangle setX: 10 y: 10 width: 20 height: 20];
{% endcodeblock %}

**Adding a caption to the code block**

```
{% codeblock Array.map %}
array.map(callback[, thisArg])
{% endcodeblock %}
```

{% codeblock Array.map %}
array.map(callback[, thisArg])
{% endcodeblock %}

**Adding a caption and a URL**

```
{% codeblock _.compact http://underscorejs.org/#compact Underscore.js %}
_.compact([0, 1, false, 2, '', 3]);
=> [1, 2, 3]
{% endcodeblock %}
```

{% codeblock _.compact http://underscorejs.org/#compact Underscore.js %}
_.compact([0, 1, false, 2, '', 3]);
=> [1, 2, 3]
{% endcodeblock %}

## Backtick Code Block

This is identical to using a code block, but instead uses three backticks to delimit the block.

````
``` [language] [title] [url] [link text]
code snippet
```
````

## Pull Quote

{% pullquote %}
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi semper auctor nulla, a mollis nibh congue luctus. Mauris
sagittis dui sit amet scelerisque gravida. Proin porttitor convallis libero.
{% endpullquote %}

To add pull quotes to your posts:

```
{% pullquote [CSS class] %}
content
{% endpullquote %}
```

## jsFiddle

To embed a jsFiddle snippet:

```
{% jsfiddle shorttag [tabs] [skin] [width] [height] %}
```

{% jsfiddle zx2xyzea js,html,css,result light 100% 400 %}

## Gist

To embed a Gist snippet:

```
{% gist gist_id [filename] %}
```

{% gist defunkt/2059 %}

## iframe

To embed an iframe:

```
{% iframe url [width] [height] %}
```

{% iframe https://hexo.io 100% 400 %}

## Image

Inserts an image with specified size.

```
{% img [class names] /path/to/image [width] [height] [title text [alt text]] %}
```

{% img /gallery/desert.jpg 100% 100% '"Desert" "Desert"' %}

## Link

Inserts a link with `target="_blank"` attribute.

```
{% link text url [external] [title] %}
```

{% link Hexo.io https://hexo.io true Hexo.io %}

## Include Code

Inserts code snippets in `source/downloads/code` folder.

```
{% include_code [title] [lang:language] path/to/file %}
```

{% include_code Example lang:javascript example.js %}

## YouTube

Inserts a YouTube video.

```
{% youtube video_id %}
```

{% youtube yaqe1qesQ8c %}

## Vimeo

Inserts a Vimeo video.

```
{% vimeo video_id %}
```

{% vimeo 191822120 %}

## Include Posts

Include links to other posts.

```
{% post_path slug %}
{% post_link slug [title] %}
```

## Include Assets

Include post assets.

```
{% asset_path slug %}
{% asset_img slug [title] %}
{% asset_link slug [title] %}
```

## Raw

If certain content is causing processing issues in your posts, wrap it with the `raw` tag to avoid rendering errors.

```
{% raw %}
content
{% endraw %}
```

## Post Excerpt

Use text placed before the `<!-- more -->` tag as an excerpt for the post.

**Examples:**

```
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
<!-- more -->
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
```
