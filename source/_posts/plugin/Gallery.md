title: Gallery Plugin
date: 2016-01-31 00:00:01
categories:
- Plugins
- General
---

You can create a gallery by just adding photos in the post, and enable the gallery plugin in the `_config.yml`:

```yml
plugins:
    gallery: true
```
<!-- more -->

Furthermore, you can also use Justified Gallery to display you photos in a grid:

{% codeblock lang:html HTML + Markdown %}
&lt;div class="justified-gallery"&gt;
&lt;!-- Need an empty line here for the following markdown to be rendered -->
![Elephant](/hexo-theme-icarus/gallery/animals/elephant.jpeg)
![Dog](/hexo-theme-icarus/gallery/animals/dog.jpeg)
![Birds](/hexo-theme-icarus/gallery/animals/birds.jpeg)
![Cat](/hexo-theme-icarus/gallery/animals/cat.jpeg)
![Fox](/hexo-theme-icarus/gallery/animals/fox.jpeg)
![Horse](/hexo-theme-icarus/gallery/animals/horse.jpeg)
![Leopard](/hexo-theme-icarus/gallery/animals/leopard.jpeg)
&lt;/div&gt;
{% endcodeblock %}

{% quote %}
The following photos come from <a href="https://www.pexels.com">pexel.com</a>
{% endquote %}

<div class="justified-gallery">

![Elephant](/hexo-theme-icarus/gallery/animals/elephant.jpeg)
![Dog](/hexo-theme-icarus/gallery/animals/dog.jpeg)
![Birds](/hexo-theme-icarus/gallery/animals/birds.jpeg)
![Cat](/hexo-theme-icarus/gallery/animals/cat.jpeg)
![Fox](/hexo-theme-icarus/gallery/animals/fox.jpeg)
![Horse](/hexo-theme-icarus/gallery/animals/horse.jpeg)
![Leopard](/hexo-theme-icarus/gallery/animals/leopard.jpeg)
</div>