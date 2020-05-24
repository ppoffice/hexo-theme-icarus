<p align="center" class="mb-2">
<img class="not-gallery-item" height="48" src="https://ppoffice.github.io/hexo-theme-icarus/img/logo.svg">
<br> A simple, delicate, and modern theme for the static site generator Hexo.
<br>
<a href="https://ppoffice.github.io/hexo-theme-icarus/">Preview</a> |
<a href="https://ppoffice.github.io/hexo-theme-icarus/categories/">Documentation</a> |
<a href="https://gitter.im/hexo-theme-icarus/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge">Chat on Gitter</a>
<br>
</p>

![Icarus](https://ppoffice.github.io/hexo-theme-icarus/gallery/preview.png?1 "Icarus Preview")

### :cd: Installation

Download & extract or `git clone` Icarus from GitHub to your blog's theme folder, and that's it!

```shell
$ git clone https://github.com/ppoffice/hexo-theme-icarus.git themes/icarus
$ hexo s // start a live server
```

Once started, Icarus will remind you of any missing dependencies to install.
And it will create a theme configuration file (`_config.yml`) if it is not there.

### :gift: Features

**Cyberpunk Theme Variant**

Tap into the future cyber world with the newly added Cyberpunk theme variant.
Inspired by [Cyberpunk 2077](https://www.cyberpunk.net).

![Icarus Cyberpunk](https://ppoffice.github.io/hexo-theme-icarus/gallery/screenshots/cyberpunk.png "Icarus Cyberpunk")

**Extensive Plugin Support**

Icarus includes plentiful search, comment, sharing and other plugins out of the box that makes your
blog feature-rich and powerful.

<table>
  <tr>
    <th><a href="https://ppoffice.github.io/hexo-theme-icarus/categories/Plugins/Comment/">Comment</a></th>
    <th><a href="https://ppoffice.github.io/hexo-theme-icarus/categories/Plugins/Donation/">Donation</a></th>
    <th><a href="https://ppoffice.github.io/hexo-theme-icarus/categories/Plugins/Search/">Search</a></th>
    <th><a href="https://ppoffice.github.io/hexo-theme-icarus/categories/Plugins/Share/">Share</a></th>
    <th><a href="https://ppoffice.github.io/hexo-theme-icarus/categories/Widgets/">Widgets</a></th>
    <th><a href="https://ppoffice.github.io/hexo-theme-icarus/categories/Plugins/">Other Plugins</a></th>
  </tr>
  <tr>
    <td>Changyan</td>
    <td>Alipay</td>
    <td>Insight</td>
    <td>AddThis</td>
    <td>Google AdSense</td>
    <td>Baidu Analytics</td>
  </tr>
  <tr>
    <td>Disqus</td>
    <td>Buy Me A Coffee</td>
    <td>Algolia</td>
    <td>AddToAny</td>
    <td>Archives</td>
    <td>BuSuanZi Vistor Counter</td>
  </tr>
  <tr>
    <td>DisqusJS</td>
    <td>Patreon</td>
    <td>Google CSE</td>
    <td>Baidu Share</td>
    <td>Categories</td>
    <td>CNZZ Analytics</td>
  </tr>
  <tr>
    <td>Facebook</td>
    <td>Paypal</td>
    <td>Baidu</td>
    <td>Share.js</td>
    <td>External Site Links</td>
    <td>Light and Justified Gallery</td>
  </tr>
  <tr>
    <td>Gitalk</td>
    <td>Wechat</td>
    <td></td>
    <td>ShareThis</td>
    <td>Recent Posts</td>
    <td>Google Analytics</td>
  </tr>
  <tr>
    <td>Gitment</td>
    <td></td>
    <td></td>
    <td></td>
    <td>Google Feedburner</td>
    <td>Hotjar User Feedback</td>
  </tr>
  <tr>
    <td>Isso</td>
    <td></td>
    <td></td>
    <td></td>
    <td>Author Profile</td>
    <td>KaTex</td>
  </tr>
  <tr>
    <td>LiveRe</td>
    <td></td>
    <td></td>
    <td></td>
    <td>Tags</td>
    <td>MathJax</td>
  </tr>
  <tr>
    <td>Utterances</td>
    <td></td>
    <td></td>
    <td></td>
    <td>Table of Contents</td>
    <td>Outdated Browser Detection</td>
  </tr>
  <tr>
    <td>Valine</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td>Page Loading Animations<br></td>
  </tr>
</table>

**Rich Code Highlight Theme Choices**

Icarus directly import stylesheets from the [highlight.js](https://highlightjs.org/) package and makes more than
90 code highlight themes available to you.

<table>
    <tr>
        <th>Atom One Light</th>
        <th>Monokai</th>
        <th>Kimbie Dark</th>
    </tr>
    <tr>
        <td><img width="266" src="https://ppoffice.github.io/hexo-theme-icarus/gallery/code-highlight/atom-one-light.png?2"></td>
        <td><img width="266" src="https://ppoffice.github.io/hexo-theme-icarus/gallery/code-highlight/monokai.png?2"></td>
        <td><img width="266" src="https://ppoffice.github.io/hexo-theme-icarus/gallery/code-highlight/kimbie-dark.png?2"></td>
    </tr>
</table>

**Flexible Theme Configuration**

Icarus allows you to configure your site on a per-page or per-layout basis.

<div>
<table>
    <tr>
        <th>_config.yml</th>
        <th>post.md</th>
        <th>_config.page.yml</th>
    </tr>
    <tr>
        <td>
<pre>widgets:
  - type: profile
    position: left
  - type: recent_posts
    position: right</pre>
        </td>
        <td>
<pre>widgets:
  - type: profile
    position: left
  - type: recent_posts
    position: left</pre>
        </td>
        <td>
<pre>widgets: null
 
 
 
</pre>
        </td>
    </tr>
    <tr>
        <td><img width="266" src="https://ppoffice.github.io/hexo-theme-icarus/gallery/screenshots/default-config.png"></td>
        <td><img width="266" src="https://ppoffice.github.io/hexo-theme-icarus/gallery/screenshots/post-config.png"></td>
        <td><img width="266" src="https://ppoffice.github.io/hexo-theme-icarus/gallery/screenshots/layout-config.png"></td>
    </tr>
</table>
</div>

**Responsive Layout**

Give your audiences best viewing experience with Icarus's mobile-friendly responsive layout.

![Responsive Layout](https://ppoffice.github.io/hexo-theme-icarus/gallery/responsive.png)

### :hammer: Development

This project is built with

- [Hexo](https://hexo.io/)
- [Inferno.js](https://infernojs.org/)
- [Stylus](https://stylus-lang.com/)
- [Bulma](https://bulma.io/)

Please refer to the [documentation](https://ppoffice.github.io/hexo-theme-icarus/categories/) and 
[contributing guide](https://github.com/ppoffice/hexo-theme-icarus/blob/master/CONTRIBUTING.md) for implementation details.

### :tada: Contribute

If you feel like to help us build a better Icarus, you can

:black_nib: [Submit a tutorial](https://github.com/ppoffice/hexo-theme-icarus/new/site/source/_posts) |
:earth_asia: [Add a translation](https://github.com/ppoffice/hexo-theme-icarus/tree/master/languages) |
:triangular_flag_on_post: [Report a bug](https://github.com/ppoffice/hexo-theme-icarus/issues/new) |
:electric_plug: [Suggest a new feature](https://github.com/ppoffice/hexo-theme-icarus/pulls)

### :memo: License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/ppoffice/hexo-theme-icarus/blob/master/LICENSE) file for details.
