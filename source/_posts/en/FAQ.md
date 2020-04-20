title: FAQ
date: 2020-02-01
thumbnail: /gallery/thumbnails/vector_landscape_3.svg
---

### How do I put text instead of an image as my site's logo?

If you consider using a piece of text instead of an image as the logo of your site, you can do something like this:

{% codeblock lang:yaml _config.yml %}
logo:
    text: My Beautiful Site
{% endcodeblock %}
<!-- more -->
### How do I change the site's language?
Edit your blog's `_config.yml`(not your theme's), change the following field:

```diff
- language: en
+ language: zh-CN
```

You can find available translations under `icarus/languages` folder.

### How to add an excerpt for a post? How to display the "Read more" button?
Add `<!-- more -->` tag in your post. Post content before this tag will be marked as an excerpt and content after this tag will not show on the index page.

### Why aren't my changes deployed to the Github Pages?
Please run these commands before `hexo deploy`:

```bash
$ hexo clean
$ rm -r .deploy_git
```

### How to add meta tags for a specified post/page?

You can add meta tags for each post/page through front-matter:

```diff
title: test post
date: 2015-01-26 21:55:37
tags:
comments: false
+ meta:
+ - name="robots";content="noindex, follow"
+ - name="another-meta";value="hello world";enabled=false
```

### Does this theme support RTL(Right-to-Left) language?

Partially yes. Please refer to [Issues#234](https://github.com/ppoffice/hexo-theme-icarus/issues/234)

<a style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-size:12px;line-height:1.2;display:inline-block;border-radius:3px" href="https://www.vecteezy.com/free-vector/vector-landscapee" target="_blank" rel="noopener noreferrer" title="Vector Landscape Vectors by Vecteezy"><span style="display:inline-block;padding:2px 3px"><svg xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;position:relative;vertical-align:middle;top:-1px;fill:white" viewBox="0 0 32 32"><path d="M20.8 18.1c0 2.7-2.2 4.8-4.8 4.8s-4.8-2.1-4.8-4.8c0-2.7 2.2-4.8 4.8-4.8 2.7.1 4.8 2.2 4.8 4.8zm11.2-7.4v14.9c0 2.3-1.9 4.3-4.3 4.3h-23.4c-2.4 0-4.3-1.9-4.3-4.3v-15c0-2.3 1.9-4.3 4.3-4.3h3.7l.8-2.3c.4-1.1 1.7-2 2.9-2h8.6c1.2 0 2.5.9 2.9 2l.8 2.4h3.7c2.4 0 4.3 1.9 4.3 4.3zm-8.6 7.5c0-4.1-3.3-7.5-7.5-7.5-4.1 0-7.5 3.4-7.5 7.5s3.3 7.5 7.5 7.5c4.2-.1 7.5-3.4 7.5-7.5z"></path></svg></span><span style="display:inline-block;padding:2px 3px">Vector Landscape Vectors by Vecteezy</span></a>