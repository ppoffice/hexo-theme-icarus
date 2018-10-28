title: Polymorphic Link Settings
slug: Polymorphic-Link-Settings
date: 2018-10-22 19:23:57
thumbnail: /gallery/thumbnails/flower.jpg
categories:
- Configuration
- Theme
footer:
    links:
        Creative Commons: 'https://creativecommons.org/'
        Attribution 4.0 International: 'https://creativecommons.org/licenses/by/4.0/'
        Download on GitHub:
            icon: fab fa-github
            url: 'http://github.com/ppoffice/hexo-theme-icarus'
---

You may already notice that Icarus allows you to put icon links on the right of the navigation bar, the bottom of the profile widget, and the right side of the footer with the following format:

<!-- more -->

```yml
footer:
    links:
        'Creative Commons':
            icon: fab fa-creative-commons
            url: 'https://creativecommons.org/'
        'Attribution 4.0 International':
            icon: fab fa-creative-commons-by
            url: 'https://creativecommons.org/licenses/by/4.0/'
```

In the above link format, you need to specify the name of the link (e.g., Creative Commons), as well as the icon class name (e.g., Font Awesome class name) and link URL. However, Icarus also accept pure text links with a link name and URL in the format below:

```yml
footer:
    links:
        'Creative Commons': 'https://creativecommons.org/'
        'Attribution 4.0 International': 'https://creativecommons.org/licenses/by/4.0/'
```

<a style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-size:12px;line-height:1.2;display:inline-block;border-radius:3px" href="https://unsplash.com/@evieshaffer?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge" target="_blank" rel="noopener noreferrer" title="Download free do whatever you want high-resolution photos from Evie Shaffer"><span style="display:inline-block;padding:2px 3px"><svg xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;position:relative;vertical-align:middle;top:-1px;fill:white" viewBox="0 0 32 32"><title>unsplash-logo</title><path d="M20.8 18.1c0 2.7-2.2 4.8-4.8 4.8s-4.8-2.1-4.8-4.8c0-2.7 2.2-4.8 4.8-4.8 2.7.1 4.8 2.2 4.8 4.8zm11.2-7.4v14.9c0 2.3-1.9 4.3-4.3 4.3h-23.4c-2.4 0-4.3-1.9-4.3-4.3v-15c0-2.3 1.9-4.3 4.3-4.3h3.7l.8-2.3c.4-1.1 1.7-2 2.9-2h8.6c1.2 0 2.5.9 2.9 2l.8 2.4h3.7c2.4 0 4.3 1.9 4.3 4.3zm-8.6 7.5c0-4.1-3.3-7.5-7.5-7.5-4.1 0-7.5 3.4-7.5 7.5s3.3 7.5 7.5 7.5c4.2-.1 7.5-3.4 7.5-7.5z"></path></svg></span><span style="display:inline-block;padding:2px 3px">Evie Shaffer</span></a>
