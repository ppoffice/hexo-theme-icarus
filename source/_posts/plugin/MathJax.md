title: MathJax Plugin
date: 2018-01-01
categories:
- Configuration
- Other Plugins
tags:
thumbnail: /gallery/math.jpg
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
For further MathJax configurations, please edit `<theme folder>/layout/plugin/scripts.ejs`:
```html
    <% if (theme.plugins.mathjax) { %>
        <!-- Edit here -->
        <script type="text/x-mathjax-config">
            MathJax.Hub.Config({ tex2jax: { inlineMath: [['$','$'], ['\\(','\\)']] } });
        </script>
        <%- js('https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML') %>
    <% } %>
```

### TeX and LaTeX input
> Please be noted that when you write Tex/LaTeX in Markdown files, you need to use escape characters to prevent certain signs from being processed by Markdown interpreter.

##### Input
```
When $a \ne 0$, there are two solutions to \\(ax^2 + bx + c = 0\\) and they are
$$x = {-b \pm \sqrt{b^2-4ac} \over 2a}.$$
```

##### Result
When $a \ne 0$, there are two solutions to \\(ax^2 + bx + c = 0\\) and they are
$$x = {-b \pm \sqrt{b^2-4ac} \over 2a}.$$

### MathML input
> Attention: please be noted that newline characters will be transformed to `<br>` tag by Markdown interpreter and this will interfere with MathML notation. Please write all MathML inline.

##### Input
```
When<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>a</mi><mo>&#x2260;</mo><mn>0</mn></math>, there are two solutions to <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>a</mi><msup><mi>x</mi><mn>2</mn></msup><mo>+</mo> <mi>b</mi><mi>x</mi><mo>+</mo> <mi>c</mi> <mo>=</mo> <mn>0</mn></math> and they are
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mi>x</mi> <mo>=</mo><mrow><mfrac><mrow><mo>&#x2212;</mo><mi>b</mi><mo>&#x00B1;</mo><msqrt><msup><mi>b</mi><mn>2</mn></msup><mo>&#x2212;</mo><mn>4</mn><mi>a</mi><mi>c</mi></msqrt></mrow><mrow> <mn>2</mn><mi>a</mi> </mrow></mfrac></mrow><mtext>.</mtext></math>
```

##### Result
When<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>a</mi><mo>&#x2260;</mo><mn>0</mn></math>, there are two solutions to <math xmlns="http://www.w3.org/1998/Math/MathML"><mi>a</mi><msup><mi>x</mi><mn>2</mn></msup><mo>+</mo> <mi>b</mi><mi>x</mi><mo>+</mo> <mi>c</mi> <mo>=</mo> <mn>0</mn></math> and they are
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mi>x</mi> <mo>=</mo><mrow><mfrac><mrow><mo>&#x2212;</mo><mi>b</mi><mo>&#x00B1;</mo><msqrt><msup><mi>b</mi><mn>2</mn></msup><mo>&#x2212;</mo><mn>4</mn><mi>a</mi><mi>c</mi></msqrt></mrow><mrow> <mn>2</mn><mi>a</mi> </mrow></mfrac></mrow><mtext>.</mtext></math>

### AsciiMath input
> Attention: please be noted that when you write AsciiMath in Markdown files, you need to use escape characters to prevent certain signs from being processed by Markdown interpreter.

##### Input
```
When \`a != 0\`, there are two solutions to \`ax^2 + bx + c = 0\` and they are<p style="text-align:center">\`x = (-b +- sqrt(b^2-4ac))/(2a) .\`</p>
```

##### Result
When \`a != 0\`, there are two solutions to \`ax^2 + bx + c = 0\` and they are<p style="text-align:center">\`x = (-b +- sqrt(b^2-4ac))/(2a) .\`</p>