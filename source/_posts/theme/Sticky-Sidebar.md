title: Make a Sidebar Sticky When Page Scrolls
date: 2018-10-16 00:00:00
categories:
- Configuration
- Theme
sidebar:
    right:
        sticky: true
widgets:
    -
        type: profile
        position: right
        author: PPOffice
        author_title: Web Developer
        location: Earth, Solar System
        avatar: 
        gravatar: 
        follow_link: 'http://github.com/ppoffice'
        social_links:
            Github:
                icon: fab fa-github
                url: 'http://github.com/ppoffice'
            Facebook:
                icon: fab fa-facebook
                url: 'http://facebook.com'
            Twitter:
                icon: fab fa-twitter
                url: 'http://twitter.com'
            Dribbble:
                icon: fab fa-dribbble
                url: 'http://dribbble.com'
            RSS:
                icon: fas fa-rss
                url: /
    -
        type: links
        position: right
        links:
            Hexo: 'https://hexo.io'
            Bulma: 'https://bulma.io'
    -
        type: recent_posts
        position: left
    -
        type: archives
        position: left
    -
        type: categories
        position: left
    -
        type: tags
        position: left
---
Sometimes you may want your sidebar's position to stay fixed when other parts of your page scrolls. This can be done via the `sticky` option of the sidebar in the theme's `_config.yml`. You can set any of the sidebar or even both of them to `sticky`.

```yaml
sidebar:
    left:
        sticky: false
    right:
        sticky: true
```
<!-- more -->
<div style="height:2000px;background:#fafafa;color:#777;text-align:center;">
<br>
<p>This is some really long content.</p>
</div>