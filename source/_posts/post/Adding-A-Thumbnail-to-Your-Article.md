title: Adding a Thumbnail to Your Article
date: 2016-07-08 20:07:55
categories:
- Configuration
- Posts
tags:
- Getting Started
---
You can add thumbnail images to your posts in two steps. First, make sure the thumbnail is enabled in the theme's configuration file:

{% codeblock _config.yml lang:yaml %}
article:
    thumbnail: true
{% endcodeblock %}

Then, provide an URL or path to the image file in the front-matter of your post:

{% codeblock post.md lang:yaml %}
title: Getting Started with Icarus
thumbnail: /gallery/desert.jpg
---
Post content...
{% endcodeblock %}

### About thumbnail image path

The image path you put in the front-matter needs to be the relative path to the source directory of your website. For example, if you want to use the following image as a thumbnail:

```
<your blog>/source/gallery/image.jpg
```

You need to use the following as the image path:

```
/gallery/image.jpg
```

Also, it is recommended that you put all the images under a dedicated asset folder that is separated from the `_posts` folder.