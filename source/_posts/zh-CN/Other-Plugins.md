title: Icarus用户指南 - 其他插件
date: 2016-01-01
categories:
- Plugins
- Other
tags:
- Icarus用户指南
language: zh-CN
toc: true
plugins:
    animejs: true
    back_to_top: true
    cookie_consent:
        type: info
        theme: classic
        static: false
        position: bottom
        policyLink: 'https://www.cookiesandyou.com/'
    gallery: true
    mathjax: true
    outdated_browser: true
    pjax: true
    prefetch: true
    progressbar: true
providers:
    cdn: loli
    fontcdn: loli
    iconcdn: loli
---

本文介绍Icarus 6支持的其他插件的安装配置。

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-globe-americas mr-2"></i>本文同时提供以下语言的翻译：<a href="{% post_path en/Other-Plugins %}">English</a>。
</div>
</article>

<!-- more -->

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-info-circle mr-2"></i>下面的插件由<a href="https://github.com/ppoffice/hexo-component-inferno">ppoffice/hexo-component-inferno</a>提供，完整的支持插件列表和配置详情以其为准。
</div>
</article>

## 画廊

**安装指南**

Icarus的画廊插件同时包含了[lightGallery](https://sachinchoolur.github.io/lightGallery/)与
[Justified Gallery](https://miromannino.github.io/Justified-Gallery/)两种插件。
画廊插件默认开启：Icarus生成的配置文件中`plugins` > `gallery`的值为`true`。
如果你的配置文件中没有这一项，请添加它来启用插件。
若要禁用画廊插件，请将其设置为`false`。

{% codeblock _config.icarus.yml lang:yaml %}
plugins:
    gallery: true
{% endcodeblock %}

此外，若要使用Justified Gallery，请将你的图片包裹在`<div class="justified-gallery">`与`</div>`的HTML标签对中。
并且如果你使用的是Markdown语法来引用图片的话，请在HTML标签和Markdown之间添加空行。
例如，下方画廊预览的Markdown代码为：

{% codeblock "Justified-Gallery-Markdown.md" lang:markdown >folded %}
<div class="justified-gallery">

![Elephant](/gallery/animals/elephant.jpeg)
![Dog](/gallery/animals/dog.jpeg)
![Birds](/gallery/animals/birds.jpeg)
![Fox](/gallery/animals/fox.jpeg)
![Horse](/gallery/animals/horse.jpeg)
![Leopard](/gallery/animals/leopard.jpeg)

</div>
{% endcodeblock %}

同样，我们也可使用纯HTML来创建Justified Gallery。
这种情况下HTML标签之间就不需要添加空行了：

{% codeblock "Justified-Gallery-HTML.md" lang:html >folded %}
<div class="justified-gallery">
<img src="/gallery/animals/elephant.jpeg" alt="Elephant" />
<img src="/gallery/animals/dog.jpeg" alt="Dog" />
<img src="/gallery/animals/birds.jpeg" alt="Birds" />
<img src="/gallery/animals/fox.jpeg" alt="Fox" />
<img src="/gallery/animals/horse.jpeg" alt="Horse" />
<img src="/gallery/animals/leopard.jpeg" alt="Leopard" />
</div>
{% endcodeblock %}

注意，Markdown渲染器会自动在Markdown图片的路径前加上站点的`root`，但不会处理HTML的`<img>`标签。
如果你的站点位于子目录下（`_config.yml`中的`root`不是`/`），HTML图片的`src`需要你自己写上子目录，Markdown图片的路径则不要写。
例如本站的配置是`root: /hexo-theme-icarus/`，所以HTML写法要用`/hexo-theme-icarus/gallery/animals/elephant.jpeg`，
而Markdown写法用的是`/gallery/animals/elephant.jpeg`。


**效果预览**

下面是Justified Gallery实现的图片网格。
你也可以点击其中的任意图片查看lightGallery的全图展示效果。

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-info-circle mr-2"></i>下面的图片来源于<a href="https://www.pexels.com">pexels.com</a>。
</div>
</article>

<div class="justified-gallery">

![Elephant](/gallery/animals/elephant.jpeg)
![Dog](/gallery/animals/dog.jpeg)
![Birds](/gallery/animals/birds.jpeg)
![Fox](/gallery/animals/fox.jpeg)
![Horse](/gallery/animals/horse.jpeg)
![Leopard](/gallery/animals/leopard.jpeg)

</div>


## KaTeX

**安装指南**

你可以使用KaTeX插件来渲染\\(\TeX\\)数学公式。
若要启用KaTeX插件，请将主题配置中`plugins` > `katex`的值设置为`true`。

{% codeblock _config.icarus.yml lang:yaml %}
plugins:
    katex: true
{% endcodeblock %}

请使用`\\(`和`\\)`包裹你的行内公式，使用`$$`或`\\[`与`\\]`标签对包裹块状公式。
例如：

{% codeblock Some-Post.md lang:markdown >folded %}
这是一个行内公式：\\(ax^2+bx+c=0\\)。

这是一个块状公式：
$$\displaystyle \frac{1}{\Bigl(\sqrt{\phi \sqrt{5}}-\phi\Bigr) e^{\frac25 \pi}} = 
1+\frac{e^{-2\pi}} {1+\frac{e^{-4\pi}} {1+\frac{e^{-6\pi}} 
{1+\frac{e^{-8\pi}} {1+\cdots} } } }$$

这是另一个块状公式：
\\[f(x) = \int_{-\infty}^\infty\hat f(\xi)e^{2 \pi i \xi x}d\xi\\]
{% endcodeblock %}

有时你的\\(\TeX\\)语法会被错认为Markdown语法而导致公式渲染异常。
例如，下面的公式不会渲染成功，因为其中包含多个`_`(下划线)而被Markdown渲染器错误地当成Markdown的斜体语法：

{% codeblock Some-Post.md lang:tex %}
$$
\hat{x}_{k}=\hat{x}_{k}^{-}+K_{t}\left(y_{k}\right)
$$
{% endcodeblock %}

在这种情况下，你可以选择转义每个可能导致歧义的字符：

{% codeblock Some-Post.md lang:tex %}
$$
\hat{x}\_{k}=\hat{x}\_{k}^{-}+K\_{t}\left(y\_{k}\right)
$$
{% endcodeblock %}

或是简单地将整个公式用一个额外的HTML标签对包裹起来：

{% codeblock Some-Post.md lang:tex %}
<div>
$$
\hat{x}_{k}=\hat{x}_{k}^{-}+K_{t}\left(y_{k}\right)
$$
</div>
{% endcodeblock %}


## MathJax

**安装指南**

你可以使用MathJax插件来渲染\\(\TeX\\)或MathML数学公式。
若要启用MathJax插件，请将主题配置中`plugins` > `mathjax`的值设置为`true`。

{% codeblock _config.icarus.yml lang:yaml %}
plugins:
    mathjax: true
{% endcodeblock %}

当使用\\(\TeX\\)语法时，请使用`$`或`\\(`与`\\)`包裹行内公式，`$$`或`\\[`与`\\]`标签对包裹块状公式。
或者使用\\(\LaTeX\\)环境。例如：

{% codeblock Tex-Example.md lang:markdown >folded %}
这是一个行内公式：\\(ax^2+bx+c=0\\)。这是另一个行内公式：$ax^2+bx+c>0$。

这是一个块状公式：
$$\displaystyle \frac{1}{\Bigl(\sqrt{\phi \sqrt{5}}-\phi\Bigr) e^{\frac25 \pi}} = 
1+\frac{e^{-2\pi}} {1+\frac{e^{-4\pi}} {1+\frac{e^{-6\pi}} 
{1+\frac{e^{-8\pi}} {1+\cdots} } } }$$

这是另一个块状公式：
\\[f(x) = \int_{-\infty}^\infty\hat f(\xi)e^{2 \pi i \xi x}d\xi\\]

或者使用\\(\LaTeX\\)环境：
\\begin{equation}
A =
\\begin{bmatrix}
  a & b \\\\
  c & c
\\end{bmatrix}
\\end{equation}
{% endcodeblock %}

或者直接使用MathML语法。例如：

{% codeblock MathML-Example.md lang:html >folded %}
当
<math xmlns="http://www.w3.org/1998/Math/MathML">
    <mi>a</mi>
    <mo>≠</mo>
    <mn>0</mn>
</math>，
方程
<math xmlns="http://www.w3.org/1998/Math/MathML">
    <mi>a</mi>
    <msup>
        <mi>x</mi>
        <mn>2</mn>
    </msup>
    <mo>+</mo>
    <mi>b</mi>
    <mi>x</mi>
    <mo>+</mo>
    <mi>c</mi>
    <mo>=</mo>
    <mn>0</mn>
</math> 
有两个解，它们是
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
    <mi>x</mi>
    <mo>=</mo>
    <mrow>
        <mfrac>
            <mrow>
                <mo>-</mo>
                <mi>b</mi>
                <mo>±</mo>
                <msqrt>
                    <msup>
                        <mi>b</mi>
                        <mn>2</mn>
                    </msup>
                    <mo>-</mo>
                    <mn>4</mn>
                    <mi>a</mi>
                    <mi>c</mi>
                </msqrt>
            </mrow>
            <mrow>
                <mn>2</mn>
                <mi>a</mi>
            </mrow>
        </mfrac>
    </mrow>
    <mtext>.</mtext>
</math>
{% endcodeblock %}

有时你的\\(\TeX\\)语法会被错认为Markdown语法而导致公式渲染异常。
请参照[KaTeX](#KaTeX)一节来查看解决方案。

**效果预览(\\(\TeX\\) & \\(\LaTeX\\))**

这是一个行内公式：\\(ax^2+bx+c=0\\)。这是另一个行内公式：$ax^2+bx+c>0$。

这是一个块状公式：
$$\displaystyle \frac{1}{\Bigl(\sqrt{\phi \sqrt{5}}-\phi\Bigr) e^{\frac25 \pi}} = 
1+\frac{e^{-2\pi}} {1+\frac{e^{-4\pi}} {1+\frac{e^{-6\pi}} 
{1+\frac{e^{-8\pi}} {1+\cdots} } } }$$

这是另一个块状公式：
\\[f(x) = \int_{-\infty}^\infty\hat f(\xi)e^{2 \pi i \xi x}d\xi\\]

或者使用\\(\LaTeX\\)环境：
\\begin{equation}
A =
\\begin{bmatrix}
  a & b \\\\
  c & c
\\end{bmatrix}
\\end{equation}

**效果预览(MathML)**

当
<math xmlns="http://www.w3.org/1998/Math/MathML">
    <mi>a</mi>
    <mo>≠</mo>
    <mn>0</mn>
</math>，
方程
<math xmlns="http://www.w3.org/1998/Math/MathML">
    <mi>a</mi>
    <msup>
        <mi>x</mi>
        <mn>2</mn>
    </msup>
    <mo>+</mo>
    <mi>b</mi>
    <mi>x</mi>
    <mo>+</mo>
    <mi>c</mi>
    <mo>=</mo>
    <mn>0</mn>
</math>
有两个解，它们是
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
    <mi>x</mi>
    <mo>=</mo>
    <mrow>
        <mfrac>
            <mrow>
                <mo>-</mo>
                <mi>b</mi>
                <mo>±</mo>
                <msqrt>
                    <msup>
                        <mi>b</mi>
                        <mn>2</mn>
                    </msup>
                    <mo>-</mo>
                    <mn>4</mn>
                    <mi>a</mi>
                    <mi>c</mi>
                </msqrt>
            </mrow>
            <mrow>
                <mn>2</mn>
                <mi>a</mi>
            </mrow>
        </mfrac>
    </mrow>
    <mtext>.</mtext>
</math>


## Cookie同意提示

**安装指南**

你可以通过启用Cookie同意提示插件来向你的访客展示Cookie同意对话框。
请参考[下载Cookie Consent](https://www.osano.com/cookieconsent/download/)和[Cookie Consent插件文档](https://www.osano.com/cookieconsent/documentation/about-cookie-consent/)来了解每个配置项的细节。
你也可以通过注释掉配置的方式来禁用Cookie同意对话框。

{% codeblock _config.icarus.yml lang:yaml %}
plugins:
    cookie_consent:
        # 同意对话框类型。可以为"info"，"opt-in"，或"opt-out"
        type: info
        # 弹出框主题。可以为"block"，"edgeless"，或"classic"
        theme: edgeless
        # 是否使弹出框固定，不随页面滚动而滚动
        static: false
        # 弹出框在屏幕上的位置
        position: bottom-left
        # 你网站的Cookie协议的URL
        policyLink: 'https://www.cookiesandyou.com/'
{% endcodeblock %}


## 浏览器升级提醒 (Outdated Browser)

**安装指南**

你可以使用浏览器升级提醒(Outdated Browser)插件来检测你的网站访客使用的老旧浏览器，并提醒他们升级浏览器。
若要启用此插件，请将主题配置中`plugins` > `outdated_browser`的值设置为`true`。
点击[此处](https://bestvpn.org/outdatedbrowser/en)即可预览插件开启效果。

{% codeblock _config.icarus.yml lang:yaml %}
plugins:
    outdated_browser: true
{% endcodeblock %}


## 网页载入动画

**安装指南**

Icarus默认启用网页载入动画。
若需禁止载入动画，请在你的主题配置中将`plugins` > `animejs`设置为`false`。

{% codeblock _config.icarus.yml lang:yaml %}
plugins:
    animejs: false
{% endcodeblock %}

另外，若需禁用网页载入进度条，请在你的主题配置中将`plugins` > `progressbar`设置为`false`。

{% codeblock _config.icarus.yml lang:yaml %}
plugins:
    progressbar: false
{% endcodeblock %}


## 回到顶部按钮

**安装指南**

访客向下滚动页面后，Icarus会显示一个按钮，点击即可回到页面顶部。
此按钮默认开启：Icarus生成的配置文件中`plugins` > `back_to_top`的值为`true`。
若需隐藏此按钮，请在你的主题配置中将其设置为`false`。

{% codeblock _config.icarus.yml lang:yaml %}
plugins:
    back_to_top: false
{% endcodeblock %}


## PJAX

**安装指南**

开启[PJAX](https://github.com/MoOx/pjax)后，点击站内其他页面的链接时不会重新加载整个网页。
Icarus会在后台获取新页面，只替换导航栏、正文和侧边栏等发生变化的部分，让页面之间的切换更快、更流畅。
PJAX默认开启：Icarus生成的配置文件中`plugins` > `pjax`的值为`true`。
如果你的配置文件中没有这一项，请添加它来启用PJAX。
若需禁用PJAX，请在你的主题配置中将其设置为`false`。

{% codeblock _config.icarus.yml lang:yaml %}
plugins:
    pjax: true
{% endcodeblock %}

关于PJAX需要注意的是：

- 评论区会和正文一起被替换，评论插件的脚本也会重新运行，因此每个新页面都会加载自己的评论。
- MathJax会重新渲染新页面中的数学公式。
- 页面切换后，网站统计插件的脚本不会重新运行，以免同一次访问被统计两次。
  <a href="{% post_path zh-CN/Web-Analytics-Plugins %}#Matomo">Matomo</a>、<a href="{% post_path zh-CN/Web-Analytics-Plugins %}#Umami">Umami</a>、不蒜子和<a href="{% post_path zh-CN/Web-Analytics-Plugins %}#Waline浏览量统计">Waline浏览量统计</a>会自行统计访客切换到的页面。
  其他统计服务如果不能自行跟踪页面的变化，可能只会统计访客打开的第一个页面。


## 预取

**安装指南**

Icarus可以在访客的鼠标停留在站内链接上时，或在触摸屏上触碰链接时，预先获取链接指向的页面，让访客点击后页面打开得更快。
若需启用，请在你的主题配置中将`plugins` > `prefetch`设置为`true`。
`delay`是鼠标需要在链接上停留多少毫秒才预取页面（默认为65），这样鼠标划过一排链接时不会把它们全部预取。

{% codeblock _config.icarus.yml lang:yaml %}
plugins:
    prefetch: true
    # 或者使用其他延迟：
    # prefetch:
    #     delay: 100
{% endcodeblock %}

关于预取需要注意的是：

- 只会预取站内的页面，不会预取指向其他站点的链接、下载链接，以及图片、订阅源等文件。
  如要排除某个链接，请给它加上`data-no-prefetch`属性。
- 访客的浏览器开启了省流量模式或处于2G网络时，不会预取任何页面。
- 开启PJAX时，切换到该页面会使用预取的页面。
  未开启PJAX时，支持Speculation Rules的浏览器会在跳转时使用预取的页面；
  其他浏览器则通过`<link rel="prefetch">`预取，只有在你的主机允许缓存该页面时才会使用它。


<article class="message message-immersive is-warning">
<div class="message-body">
<i class="fas fa-question-circle mr-2"></i>文章内容有误？请点击<a href="https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/zh-CN/Other-Plugins.md">此处</a>提交修改。
</div>
</article>
