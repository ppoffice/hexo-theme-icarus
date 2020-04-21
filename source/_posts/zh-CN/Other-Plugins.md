title: Icarus用户指南 - 其他插件
date: 2016-01-01
categories:
- Plugins
- Other
tags:
- Icarus用户指南
language: zh-CN
toc: true
providers:
    cdn: loli
    fontcdn: loli
    iconcdn: loli
---

<div class="notification is-success is-size-6">
本文同时提供以下语言的翻译：<a href="{% post_path en/Other-Plugins %}">English</a>。
</div>

本文介绍Icarus 3支持的其他插件的安装配置。

<!-- more -->

<div class="notification is-link is-size-6">

部分下述插件由[ppoffice/hexo-component-inferno](https://github.com/ppoffice/hexo-component-inferno)
提供，它们的配置请以其为准。

</div>


## 画廊

**安装指南**

Icarus的画廊插件同时包含了[lightGallery](https://sachinchoolur.github.io/lightGallery/)与
[Justified Gallery](https://miromannino.github.io/Justified-Gallery/)两种插件。
若要启用画廊插件，请将主题配置中`plugins` > `gallery`的值设置为`true`。

{% codeblock themes/icarus/_config.yml lang:yaml %}
plugins:
    gallery: true
{% endcodeblock %}

另外，若要使用Justified Gallery，请将你的多个图片包裹在`<div class="justified-gallery">`与`</div>`的HTML标签对中。
并且如果你使用的是Markdown语法来引用图片的话，请在HTML标签和Markdown之间添加空行。
例如下方的效果预览的Markdown代码为：

{% codeblock "Justified-Gallery-Markdown.md" lang:markdown >folded %}
<div class="justified-gallery">

![Elephant](/hexo-theme-icarus/gallery/animals/elephant.jpeg)
![Dog](/hexo-theme-icarus/gallery/animals/dog.jpeg)
![Birds](/hexo-theme-icarus/gallery/animals/birds.jpeg)
![Fox](/hexo-theme-icarus/gallery/animals/fox.jpeg)
![Horse](/hexo-theme-icarus/gallery/animals/horse.jpeg)
![Leopard](/hexo-theme-icarus/gallery/animals/leopard.jpeg)

</div>
{% endcodeblock %}

同样，我们也可使用纯HTML来实现Justified Gallery，这样标签之间就不需要添加空行了：

{% codeblock "Justified-Gallery-HTML.md" lang:html >folded %}
<div class="justified-gallery">
<img src="/hexo-theme-icarus/gallery/animals/elephant.jpeg" alt="Elephant" />
<img src="/hexo-theme-icarus/gallery/animals/dog.jpeg" alt="Dog" />
<img src="/hexo-theme-icarus/gallery/animals/birds.jpeg" alt="Birds" />
<img src="/hexo-theme-icarus/gallery/animals/fox.jpeg" alt="Fox" />
<img src="/hexo-theme-icarus/gallery/animals/horse.jpeg" alt="Horse" />
<img src="/hexo-theme-icarus/gallery/animals/leopard.jpeg" alt="Leopard" />
</div>
{% endcodeblock %}


**效果预览**

下面是Justified Gallery实现的多图片网格化展示。点击其中的任意可另外查看lightGallery的全图展示效果。

> 下面的图片来源于<a href="https://www.pexels.com">pexel.com</a>

<div class="justified-gallery">

![Elephant](/hexo-theme-icarus/gallery/animals/elephant.jpeg)
![Dog](/hexo-theme-icarus/gallery/animals/dog.jpeg)
![Birds](/hexo-theme-icarus/gallery/animals/birds.jpeg)
![Fox](/hexo-theme-icarus/gallery/animals/fox.jpeg)
![Horse](/hexo-theme-icarus/gallery/animals/horse.jpeg)
![Leopard](/hexo-theme-icarus/gallery/animals/leopard.jpeg)

</div>


## KaTeX

**安装指南**

你可以使用KaTeX插件来渲染\\(\TeX\\)数学公式。若要启用KaTeX插件，请将主题配置中`plugins` > `katex`的值设置为`true`。

{% codeblock themes/icarus/_config.yml lang:yaml %}
plugins:
    katex: true
{% endcodeblock %}

在使用时，请使用`\\(`和`\\)`包裹行内公式，`$$`或`\\[`与`\\]`标签对包裹块状公式。例如：

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
例如，下面的公式不会渲染成功，因为其中包含多个`_`(下划线)而被Markdown渲染器错误的认成Markdown的斜体字语法。

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

或是简单的将整个公式用一个HTML标签包裹起来：

{% codeblock Some-Post.md lang:tex %}
<div>
$$
\hat{x}_{k}=\hat{x}_{k}^{-}+K_{t}\left(y_{k}\right)
$$
</div>
{% endcodeblock %}


## MathJax

**安装指南**

你可以使用MathJax插件来渲染\\(\TeX\\)，MathML，或AsciiMath数学公式。若要启用MathJax插件，请将主题配置中`plugins` > `mathjax`的值设置为`true`。

{% codeblock themes/icarus/_config.yml lang:yaml %}
plugins:
    mathjax: true
{% endcodeblock %}

当使用\\(\TeX\\)语法时，请使用`$`或`\\(`与`\\)`包裹行内公式，`$$`或`\\[`与`\\]`标签对包裹块状公式。或者使用\\(\LaTeX\\)环境。例如：

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

同样MathJax也支持AsciiMath，公式使用<code>\\`</code>包裹。

{% codeblock AsciiMath-Example.md lang:markdown >folded %}
当\`a != 0\`，方程\`ax^2 + bx + c = 0\`有两个解，它们是<p style="text-align:center">\`x = (-b +- sqrt(b^2-4ac))/(2a)\`.</p>
{% endcodeblock %}

有时你的\\(\TeX\\)语法会被错认为Markdown语法而导致公式渲染异常。
请参照[KaTeX](#KaTeX)一节来解决此问题。

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

**效果预览(AsciiMath)**

当\`a != 0\`，方程\`ax^2 + bx + c = 0\`有两个解，它们是<p style="text-align:center">\`x = (-b +- sqrt(b^2-4ac))/(2a)\`.</p>


## 浏览器升级提醒 (Outdated Browser)

**安装指南**

你可以开启浏览器升级提醒(Outdated Browser)来提醒使用老旧浏览器的网站访客升级浏览器。
若要启用此插件，请将主题配置中`plugins` > `outdated_browser`的值设置为`true`。
点击[此处](https://bestvpn.org/outdatedbrowser/en)即可预览插件开启效果。

{% codeblock themes/icarus/_config.yml lang:yaml %}
plugins:
    outdated_browser: true
{% endcodeblock %}


## 网页载入动画

**安装指南**

Icarus默认启用网页载入动画，若需禁止载入动画，请将`plugins` > `animejs`的值设置为`false`。

{% codeblock themes/icarus/_config.yml lang:yaml %}
plugins:
    animejs: false
{% endcodeblock %}

另外，若需隐藏网页载入进度条，请将`plugins` > `progressbar`的值设置为`false`。

{% codeblock themes/icarus/_config.yml lang:yaml %}
plugins:
    progressbar: false
{% endcodeblock %}


<div class="notification is-warning is-size-6">
文章内容有误？请点击<a href="https://github.com/ppoffice/hexo-theme-icarus/edit/site/source/_posts/zh-CN/Other-Plugins.md">此处</a>提交修改。
</div>
