title: Gallery Example
date: 2015-01-26 21:55:37
photos:
- https://www.hdwallpapers.net/previews/starry-night-over-corsica-986.jpg
- https://www.hdwallpapers.net/previews/water-plant-close-up-979.jpg
- https://www.hdwallpapers.net/previews/winter-day-at-yosemite-national-park-971.jpg
- https://www.hdwallpapers.net/previews/vatnajokull-national-park-iceland-899.jpg
tags:
---
To add a photo gallery placeholder to your post, just add the following lines to your front-matter:
```yml
photos:
- https://www.hdwallpapers.net/previews/starry-night-over-corsica-986.jpg
- https://www.hdwallpapers.net/previews/water-plant-close-up-979.jpg
- ...
```
<!-- more -->
and enable `lightgallery` plugin in your `_config.yml`:
```diff
# Plugins
plugins:
+   lightgallery: true # options: true, false
    google_analytics: # enter the tracking ID for your Google Analytics
    ...
```

You can also add photos between text to create another gallery like this:

![Lion](https://www.hdwallpapers.net/previews/lion-453.jpg)

or this:

![Red Panda](https://www.hdwallpapers.net/previews/red-panda-523.jpg)