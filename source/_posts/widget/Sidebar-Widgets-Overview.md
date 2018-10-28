title: Sidebar Widgets Overview
date: 2016-02-02
categories:
- Widgets
---

With the brand-new widget configuration scheme, you can place any widgets on either side of the page and set up them fair easily. Icarus reads the list of widgets that are enabled from `_config.yml` and displays them in the order they are defined. The following widgets are supported in Icarus 2.0.0:

- Archives (archive)
- Categories (category)
- Links (links)
- Profiles (profile)
- Recent Posts (recent_posts)
- Tags (tag)
- Tag Cloud (tagcloud)
- Table of Content / Catalogue (toc)
<!-- more -->

The enabled widgets are defined as an array. Each widget has two mandatory fields in common: `type` and `position`. The `type` field specific what widget is enabled and can be one of the `(name)` above. The position can be either `left` or `right`, which tells on which side will the widget be placed.

```yml
widgets:
    -
        type: category
        position: left
    -
        type: tagcloud
        position: left
    -
        type: recent_posts
        position: right
    -
        type: archive
        position: right
    -
        type: tag
        position: right
```

Most of these widgets do not take any extra configurations. However, for those who do, please refer to the [documentation](/hexo-theme-icarus/categories/Widgets/).