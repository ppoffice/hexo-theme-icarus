title: MathJax Plugin
date: 2016-01-31 00:00:02
categories:
- Plugins
- General
tags:
thumbnail: /gallery/thumbnails/math.jpg
---

<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mi>f</mi><mrow><mo>(</mo><mi>a</mi><mo>)</mo></mrow></mrow><mo>=</mo><mrow><mfrac><mn>1</mn><mrow><mn>2</mn><mi>&#x3C0;</mi><mi>i</mi></mrow></mfrac><msub><mo>&#x222E;</mo><mrow><mi>&#x3B3;</mi></mrow></msub><mfrac><mrow><mi>f</mi><mo>(</mo><mi>z</mi><mo>)</mo></mrow><mrow><mi>z</mi><mo>&#x2212;</mo><mi>a</mi></mrow></mfrac><mi>d</mi><mi>z</mi></mrow></math>

### Configuration

To enable MathJax support, just set `plugins.mathjax = true` in your theme `_config.yml` file.

```yml
# Plugins
plugins:
    ...
    mathjax: true # options: true, false
```
<!-- more -->
For further MathJax configurations, please edit `&lt;theme folder&gt;/layout/plugin/mathjax.ejs`:

```js
document.addEventListener('DOMContentLoaded', function () {
    MathJax.Hub.Config({
        // Edit here
    });
});
```

### TeX and LaTeX input
> **Attention**: Please be noted that when you write Tex/LaTeX in Markdown files, you need to use escape characters to prevent certain signs from being processed by Markdown interpreter.

##### Input
```
When $a \ne 0$, there are two solutions to \\(ax^2 + bx + c = 0\\) and they are
$$x = {-b \pm \sqrt{b^2-4ac} \over 2a}.$$
```

##### Result
When $a \ne 0$, there are two solutions to \\(ax^2 + bx + c = 0\\) and they are
$$x = {-b \pm \sqrt{b^2-4ac} \over 2a}.$$

### MathML input
> **Attention**: please be noted that newline characters may be transformed to `<br>` tag by Markdown interpreter and this will interfere with MathML notation. Please write all MathML inline.

##### Input
```
When<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>a</mi><mo>&#x2260;</mo><mn>0</mn></math>, there are two solutions to <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>a</mi><msup><mi>x</mi><mn>2</mn></msup><mo>+</mo> <mi>b</mi><mi>x</mi><mo>+</mo> <mi>c</mi> <mo>=</mo> <mn>0</mn></math> and they are
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mi>x</mi> <mo>=</mo><mrow><mfrac><mrow><mo>&#x2212;</mo><mi>b</mi><mo>&#x00B1;</mo><msqrt><msup><mi>b</mi><mn>2</mn></msup><mo>&#x2212;</mo><mn>4</mn><mi>a</mi><mi>c</mi></msqrt></mrow><mrow> <mn>2</mn><mi>a</mi> </mrow></mfrac></mrow><mtext>.</mtext></math>
```

##### Result
When<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>a</mi><mo>&#x2260;</mo><mn>0</mn></math>, there are two solutions to <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>a</mi><msup><mi>x</mi><mn>2</mn></msup><mo>+</mo> <mi>b</mi><mi>x</mi><mo>+</mo> <mi>c</mi> <mo>=</mo> <mn>0</mn></math> and they are
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mi>x</mi> <mo>=</mo><mrow><mfrac><mrow><mo>&#x2212;</mo><mi>b</mi><mo>&#x00B1;</mo><msqrt><msup><mi>b</mi><mn>2</mn></msup><mo>&#x2212;</mo><mn>4</mn><mi>a</mi><mi>c</mi></msqrt></mrow><mrow> <mn>2</mn><mi>a</mi> </mrow></mfrac></mrow><mtext>.</mtext></math>

### AsciiMath input
> **Attention**: please be noted that when you write AsciiMath in Markdown files, you need to use escape characters to prevent certain signs from being processed by Markdown interpreter.

##### Input
```
When \`a != 0\`, there are two solutions to \`ax^2 + bx + c = 0\` and they are<p style="text-align:center">\`x = (-b +- sqrt(b^2-4ac))/(2a) .\`</p>
```

##### Result
When \`a != 0\`, there are two solutions to \`ax^2 + bx + c = 0\` and they are<p style="text-align:center">\`x = (-b +- sqrt(b^2-4ac))/(2a) .\`</p>

<a style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-size:12px;line-height:1.2;display:inline-block;border-radius:3px" href="https://unsplash.com/@jeshoots?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge" target="_blank" rel="noopener noreferrer" title="Download free do whatever you want high-resolution photos from JESHOOTS.COM"><span style="display:inline-block;padding:2px 3px"><svg xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;position:relative;vertical-align:middle;top:-1px;fill:white" viewBox="0 0 32 32"><title>unsplash-logo</title><path d="M20.8 18.1c0 2.7-2.2 4.8-4.8 4.8s-4.8-2.1-4.8-4.8c0-2.7 2.2-4.8 4.8-4.8 2.7.1 4.8 2.2 4.8 4.8zm11.2-7.4v14.9c0 2.3-1.9 4.3-4.3 4.3h-23.4c-2.4 0-4.3-1.9-4.3-4.3v-15c0-2.3 1.9-4.3 4.3-4.3h3.7l.8-2.3c.4-1.1 1.7-2 2.9-2h8.6c1.2 0 2.5.9 2.9 2l.8 2.4h3.7c2.4 0 4.3 1.9 4.3 4.3zm-8.6 7.5c0-4.1-3.3-7.5-7.5-7.5-4.1 0-7.5 3.4-7.5 7.5s3.3 7.5 7.5 7.5c4.2-.1 7.5-3.4 7.5-7.5z"></path></svg></span><span style="display:inline-block;padding:2px 3px">JESHOOTS.COM</span></a>