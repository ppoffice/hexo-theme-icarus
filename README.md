# Icarus

#### A MathJax Augmented Version for a [Hexo](https://github.com/hexojs/hexo) theme: [hexo-theme-icarus](https://github.com/ppoffice/hexo-theme-icarus)

![Preview](https://github.com/Shiratsuyu/Images/blob/master/hexo-theme-icarus/Preview.png)

##### The theme forks form [PPOffice](https://github.com/ppoffice).

## Revises

### Preview MathJax

Compare with [Original Edition](https://github.com/ppoffice/hexo-theme-icarus/commit/7c1b6fa0736a7791e7995f5e9e3e8744729d526e), this version can provide a better MathJax render Control. I modify the MathJax plugin option, change it only work when needed.

If you setting the `preview_mathjax`(at original edition, this option is `mathjax`) as true in the `_config.yml`, MathJax render will be presented on the index. 

![](https://github.com/Shiratsuyu/Images/blob/master/hexo-theme-icarus/config.png)

In other pages not article, like timeline or tags, MathJax renderer will not be loaded, because there are no article preview in those pages.


### Selectable MathJax mark in markdown

![](https://github.com/Shiratsuyu/Images/blob/master/hexo-theme-icarus/Article.png)

Added a MathJax toggle in markdown template. You can freedomly choose using MathJax or not at a single article. If and only if you setting the MathJax attribute as true, formulas will be rendered at the article page.

### Renderer Changed

Revised MathJax renderer as [SVG renderer](https://docs.mathjax.org/en/latest/options/output-processors/SVG.html). Default [HTML-CSS renderer] (https://docs.mathjax.org/en/latest/options/output-processors/HTML-CSS.html) will produce inconsistent results at different browser. And if using deployed MathJax not CDN, HTML-CSS denpendened font files will consumption hexo's performance result you must spend lots of time to waiting the MathJax load. 

[MathJax Issues: Rendering style error #1957](https://github.com/mathjax/MathJax/issues/1957)

### Include MathJax source code

![](https://github.com/Shiratsuyu/Images/blob/master/hexo-theme-icarus/path.png)

Sometimes CDN's state is unstable, it effected formulas be loaded correctly. the most safely way is using local source. MathJax's path is `source/js/MathJax`. You can replace or remove it if you need.

## How to Use

1. Install it as same as [Original Edition](https://github.com/ppoffice/hexo-theme-icarus/wiki/Installation).

2. Replace markdown symbol analyze in `blog-path/node_modules/marked/lib/marked.js:line 463` :

    ![](https://github.com/Shiratsuyu/Images/blob/master/hexo-theme-icarus/marked.png)
    
3. Add a MathJax mark in `blog-path/scaffolds/post.md` like this:

    ![](https://github.com/Shiratsuyu/Images/blob/master/hexo-theme-icarus/template.png)

4. Enjoy it!


