### How do I change the site's language?
Edit your blog's `_config.yml`(not your theme's), change the following field:

```diff
- language: en
+ language: zh-CN
```

You can find available translation under `icarus/languages` folder.

### How to add excerpt for a post?
Add `<!-- more -->` tag in your post. Post content before this tag will be marked as excerpt.

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