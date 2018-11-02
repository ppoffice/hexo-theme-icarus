title: Speed up Your Site with Custom CDN
date: 2018-10-16
toc: true
categories:
- Configuration
- Theme
tags:
- Advanced Topics
---

Using a right CDN provider can speed up page loading process of your viewers. Icarus allows you to specify the CDN provider of third-party static libraries you want to use.

### Built-in CDN providers
Currently, you can choose between these built-in providers:

- **General CDNs**
    - CDN.js (cdnjs)
    - jsDelivr (jsdelivr)
    - Unpkg (unpkg)
- **Font CDNs**
    - Google Fonts (google)
- **Icon Font CDNs**
    - Font Awesome (fontawesome)

<!-- more -->

The default CDN settings are:

```yml
providers:
    cdn: jsdelivr
    fontcdn: google
    iconcdn: fontawesome
```

### Custom CDN providers
Additionally, you can also use custom CDN providers by putting their URLs in the configuration file. For **general CDNs**, you should provide a URL format string with the following format:

```
https://some.cdn.domain.name/${package}/${version}/${filename}
```

You need to replace the actual package name, version of the package and relative file path with `${package}`, `${version}`, and `${filename}` placeholders. For example, a JavaScript library with the following URL

```
https://unpkg.com/d3@5.7.0/dist/d3.min.js
```

can be generalized to this

```
https://unpkg.com/${package}@${version}/${filename}
```

You should know that CDN providers may adopt different URL schemes where the package name and file path for a library are not exactly the same. For example, the `moment.js` library has the URL like this on CDN.js:

```
https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.js
```

while has the following URL on Unpkg:

```
https://unpkg.com/moment@2.22.2/min/moment.min.js
```

Therefore, you should be aware of the URL format of your custom CDN provider. By default, Icarus will try to pass in the parameter just like they would be for an npm repository (e.g., `moment@2.22.2/min/moment.min.js`). This npm scheme is used by jsDelivr and Unpkg. Otherwise, if you are using a CDN.js like provider, please prepend `[cdnjs]` to its format string:

```
[cdnjs]https://some.cdn.domain.name/${package}/${version}/${filename}
```

For **font CDN**, you can pass in the URL of a Google Font mirror or compatible webfont CDN. Icarus depends on the `Ubuntu` and `Source Code Pro` fonts, so make sure your CDN provides those. The URL should have two placeholders for font type (`icon` or `font`) and font name:

```
https://some.google.font.mirror/${type}?family=${fontname}
```

For **icon CDN**, you can pass in the URL to a custom Font Awesome CDN. No placeholders are required. The provided custom CDN should at lease have Font Awesome 5 icons as some of them are used in this theme.

```
https://custom.fontawesome.mirror/some.stylesheet.css
```

All of the above should be put in the `provider` section of theme configuration file:

```yml
providers:
    cdn: 'https://some.cdn.domain.name/${package}/${version}/${filename}'
    fontcdn: 'https://some.google.font.mirror/${type}?family=${fontname}'
    iconcdn: 'https://custom.fontawesome.mirror/some.stylesheet.css'
```

### CDN helper functions
Three helper functions have been defined to help developers include third-party libraries easily with custom CDN support. You can check them out in `includes/helpers/cdn.js` under the Icarus theme folder.
