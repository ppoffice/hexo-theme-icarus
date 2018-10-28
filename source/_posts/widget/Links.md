title: Links Sidebar Widget
date: 2018-02-01
categories:
- Widgets
---

You can show a list of links to other websites in the sidebar by enabling the links widget. Add the following configuration to the `widgets` section in your `_config.yml` file, and you are good to go:

```yaml
-
    type: links
    position: left
    links:
        'Website name': 'http://website/url'
        Hexo: 'https://hexo.io'
        PPOffice: 'https://github.com/ppoffice'
```

One thing you should note is that the links widget only takes a list of website name and URL, and the URL is displayed on the right side of the widget.