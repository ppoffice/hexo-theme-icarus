title: 自定义Hexo标签插件
date: 2018-01-02
tags:
- Demo
language: zh-CN
toc: true
providers:
    cdn: loli
    fontcdn: loli
    iconcdn: loli
---

除了{% post_link demo/Hexo-Built-In-Tag-Helpers %}中描述的Hexo原生支持的标签插件以外，Icarus也提供其他
几个用来定制内容显示的有用的标签插件。

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-globe-americas mr-2"></i>本文同时提供以下语言的翻译：<a href="{% post_path en/Custom-Hexo-Tag-Helpers %}">English</a>。
</div>
</article>

<!-- more -->

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-info-circle mr-2"></i>下面的标签插件由<a href="https://github.com/ppoffice/hexo-component-inferno">ppoffice/hexo-component-inferno</a>提供，完整的支持插件列表和配置详情以其为准。
</div>
</article>

<style>
.example-tab-container {
  margin: 0 0 20px 0;
  padding: 10px 20px 20px 20px;
  border-radius: 6px;
  box-shadow: 0 0.5em 0.75em -0.125em rgba(10,10,10,0.1), 0 0px 0 1px rgba(10,10,10,0.02);
}
</style>

## 消息

五颜六色的消息块可以用来强调你文章中的部分文本。
它的语法定义如下：

```
{% message color:<颜色> size:<大小> icon:<图标> title:<标题> %}
    <内容>
{% endmessage %}
```

### color

此选项定义消息块的颜色。
其为可选项。
它可用的配置值与示例如下：

{% message "title:default" %}
    一个没有设置颜色的代码块。
{% endmessage %}

{% message color:dark "title:dark" %}
    一个深色(`dark`)的代码块。
{% endmessage %}

{% message color:primary "title:primary" %}
    一个主题色(`primary`)的代码块。
{% endmessage %}

{% message color:info "title:info" %}
    一个提示色(`info`)的代码块。
{% endmessage %}

{% message color:success "title:success" %}
    一个成功色(`success`)的代码块。
{% endmessage %}

{% message color:warning "title:warning" %}
    一个警示色(`warning`)的代码块。
{% endmessage %}

{% message color:danger "title:danger" %}
    一个危险色(`danger`)的代码块。
{% endmessage %}

### size

此选项定义消息块的大小。
其为可选项。
它可用的配置值与示例如下：

{% message size:small "title:small" %}
    一个小(`small`)的代码块。
{% endmessage %}

{% message "title:default" %}
    一个没有设置大小的代码块。
{% endmessage %}

{% message size:medium "title:medium" %}
    一个中等大小(`small`)的代码块。
{% endmessage %}

{% message size:large "title:large" %}
    一个大(`small`)的代码块。
{% endmessage %}

### icon

此选项定义显示在消息块头部的图标。
其为可选项。
它的值应为FontAwesome的图标class name。
如果图标的class name含有空格，则配置名与配置值需要用引号包裹住。

{% message "icon:fa-brands fa-github" "title:一个有着GitHub图标的消息块" %}
    一个有着GitHub图标(`"icon:fa-brands fa-github"`)的消息块。
{% endmessage %}

{% message color:success "icon:fa-brands fa-node-js" "title:一个有着Node.js图标的消息块" %}
    一个有着Node.js图标(`"icon:fa-brands fa-node-js"`)的消息块。
{% endmessage %}

{% message color:danger "icon:fa-brands fa-npm" "title:一个有着NPM图标的消息块" %}
    一个有着NPM图标(`"icon:fa-brands fa-npm"`)的消息块。
{% endmessage %}

### title

此选项定义消息块的标题。
其为可选项。
如果标题含有空格，则配置名与配置值需要用引号包裹住。

{% message "title:有标题的消息块" %}
    有标题的消息块(`"title:有标题的消息块"`)。
{% endmessage %}

{% message %}
    没有标题的消息块。
{% endmessage %}

{% message color:dark %}
    没有标题的消息块。
{% endmessage %}

{% message color:primary %}
    没有标题的消息块。
{% endmessage %}

{% message color:info %}
    没有标题的消息块。
{% endmessage %}

{% message color:success %}
    没有标题的消息块。
{% endmessage %}

{% message color:warning %}
    没有标题的消息块。
{% endmessage %}

{% message color:danger %}
    没有标题的消息块。
{% endmessage %}

## 标签页

标签页是一个功能强大的用于展示平行内容的标签插件。
同一时间内，只有活动的标签页内容才能展示给用户。
它的语法定义如下：

```
{% tabs size:<大小> align:<对齐> style:<样式> %}
<!-- tab id:<标签ID> icon:<图标> title:<标签标题> active -->
<标签内容>
<!-- endtab -->
<!-- tab id:<标签ID> icon:<图标> title:<标签标题> -->
<标签内容>
<!-- endtab -->
...
{% endtabs %}
```

### 标签容器

一个标签容器有着以下选项：

#### size

此选项定义标签页的大小。
其为可选项。
它可用的配置值与示例如下：

<div class="example-tab-container">
{% tabs size:small %}
<!-- tab id:tab_size_small_1 "title:第一页" active -->
这是一个小(`small`)标签页容器的第一页。
<!-- endtab -->
<!-- tab id:tab_size_small_2 "title:第二页" -->
这是一个小(`small`)标签页容器的第二页。
<!-- endtab -->
{% endtabs %}
</div>

<div class="example-tab-container">
{% tabs %}
<!-- tab id:tab_size_default_1 "title:第一页" active -->
这是一个没有指定大小的标签页容器的第一页。
<!-- endtab -->
<!-- tab id:tab_size_default_2 "title:第二页" -->
这是一个没有指定大小的标签页容器的第二页。
<!-- endtab -->
{% endtabs %}
</div>

<div class="example-tab-container">
{% tabs size:medium %}
<!-- tab id:tab_size_medium_1 "title:第一页" active -->
这是一个中等大小(`medium`)标签页容器的第一页。
<!-- endtab -->
<!-- tab id:tab_size_medium_2 "title:第二页" -->
这是一个中等大小(`medium`)标签页容器的第一页。
<!-- endtab -->
{% endtabs %}
</div>

<div class="example-tab-container">
{% tabs size:large %}
<!-- tab id:tab_size_large_1 "title:第一页" active -->
这是一个大(`large`)标签页容器的第一页。
<!-- endtab -->
<!-- tab id:tab_size_large_2 "title:第二页" -->
这是一个大(`large`)标签页容器的第二页。
<!-- endtab -->
{% endtabs %}
</div>

#### align

此选项定义标签页按钮的对齐方式。
其为可选项。
它可用的配置值与示例如下：

<div class="example-tab-container">
{% tabs %}
<!-- tab id:tab_align_default_1 "title:第一页" active -->
这是一个没有指定对齐方式的标签页容器的第一页。
<!-- endtab -->
<!-- tab id:tab_align_default_2 "title:第二页" -->
这是一个没有指定对齐方式的标签页容器的第二页。
<!-- endtab -->
{% endtabs %}
</div>

<div class="example-tab-container">
{% tabs align:centered %}
<!-- tab id:tab_align_centered_1 "title:第一页" active -->
这是一个居中对齐的(`centered`)标签页容器的第一页。
<!-- endtab -->
<!-- tab id:tab_align_centered_2 "title:第二页" -->
这是一个居中对齐的(`centered`)标签页容器的第二页。
<!-- endtab -->
{% endtabs %}
</div>

<div class="example-tab-container">
{% tabs align:right %}
<!-- tab id:tab_align_right_1 "title:第一页" active -->
这是一个右对齐的(`centered`)标签页容器的第一页。
<!-- endtab -->
<!-- tab id:tab_align_right_2 "title:第二页" -->
这是一个右对齐的(`centered`)标签页容器的第二页。
<!-- endtab -->
{% endtabs %}
</div>

<div class="example-tab-container">
{% tabs align:fullwidth %}
<!-- tab id:tab_align_fullwidth_1 "title:第一页" active -->
这是一个全宽的(`fullwidth`)标签页容器的第一页。
<!-- endtab -->
<!-- tab id:tab_align_fullwidth_2 "title:第二页" -->
这是一个全宽的(`fullwidth`)标签页容器的第二页。
<!-- endtab -->
{% endtabs %}
</div>

#### style

此选项定义标签页按钮的样式。
其为可选项。
此外你可以将样式与全宽(`fullwidth`)对齐方式结合。
它可用的配置值与示例如下：

<div class="example-tab-container">
{% tabs style:boxed %}
<!-- tab id:tab_style_boxed_1 "title:第一页" active -->
这是一个盒状(`boxed`)标签页容器的第一页。
<!-- endtab -->
<!-- tab id:tab_style_boxed_2 "title:第二页" -->
这是一个盒状(`boxed`)标签页容器的第二页。
<!-- endtab -->
{% endtabs %}
</div>

<div class="example-tab-container">
{% tabs style:toggle %}
<!-- tab id:tab_style_toggle_1 "title:第一页" active -->
这是一个拨动开关状(`toggle`)标签页容器的第一页。
<!-- endtab -->
<!-- tab id:tab_style_toggle_2 "title:第二页" -->
这是一个拨动开关状(`toggle`)标签页容器的第二页。
<!-- endtab -->
{% endtabs %}
</div>

<div class="example-tab-container">
{% tabs style:toggle-rounded %}
<!-- tab id:tab_style_toggle_rounded_1 "title:第一页" active -->
这是一个圆角拨动开关状(`toggle-rounded`)标签页容器的第一页。
<!-- endtab -->
<!-- tab id:tab_style_toggle_rounded_2 "title:第二页" -->
这是一个圆角拨动开关状(`toggle-rounded`)标签页容器的第二页。
<!-- endtab -->
{% endtabs %}
</div>

<div class="example-tab-container">
{% tabs align:fullwidth style:boxed %}
<!-- tab id:tab_style_boxed_fullwidth_1 "title:第一页" active -->
这是一个全宽(`fullwidth`)盒状(`boxed`)标签页容器的第一页。
<!-- endtab -->
<!-- tab id:tab_style_boxed_fullwidth_2 "title:第二页" -->
这是一个全宽(`fullwidth`)盒状(`boxed`)标签页容器的第二页。
<!-- endtab -->
{% endtabs %}
</div>

<div class="example-tab-container">
{% tabs align:fullwidth style:toggle %}
<!-- tab id:tab_style_toggle_fullwidth_1 "title:第一页" active -->
这是一个全宽(`fullwidth`)拨动开关状(`toggle`)标签页容器的第一页。
<!-- endtab -->
<!-- tab id:tab_style_toggle_fullwidth_2 "title:第二页" -->
这是一个全宽(`fullwidth`)拨动开关状(`toggle`)标签页容器的第二页。
<!-- endtab -->
{% endtabs %}
</div>

<div class="example-tab-container">
{% tabs align:fullwidth style:toggle-rounded %}
<!-- tab id:tab_style_toggle_rounded_fullwidth_1 "title:第一页" active -->
这是一个全宽(`fullwidth`)圆角拨动开关状(`toggle-rounded`)标签页容器的第一页。
<!-- endtab -->
<!-- tab id:tab_style_toggle_rounded_fullwidth_2 "title:第二页" -->
这是一个全宽(`fullwidth`)圆角拨动开关状(`toggle-rounded`)标签页容器的第二页。
<!-- endtab -->
{% endtabs %}
</div>

### Tab

一个标签页有如下选项：

#### id

此选项为标签页元素的独特标识符(ID)。
此项为必填项。
一个标签页ID应当在整个页面内为独一无二的，这样Icarus才能定位、显示、和隐藏正确的标签页内容。

#### active

此选项标记当前的标签页是否默认显示。
此项为选填项。
同一时刻一个标签组中只有一个标签页可以标记为活动(`active`)标签页。

#### icon

此选项定义标签按钮中显示的图标。
此项为选填项。
它的值应为FontAwesome图标的class name。
如果图标的class name含有空格，则配置名与配置值需要用引号包裹住。

<div class="example-tab-container">
{% tabs %}
<!-- tab id:tab_icon_1 "icon:fa-brands fa-github" "title:GitHub" active -->
这个标签页的图标(`icon`)为`"icon:fa-brands fa-github"`。
<!-- endtab -->
<!-- tab id:tab_icon_2 "icon:fa-brands fa-node-js" "title:Node.js" -->
这个标签页的图标(`icon`)为`"icon:fa-brands fa-node-js"`。
<!-- endtab -->
{% endtabs %}
</div>

<div class="example-tab-container">
{% tabs align:fullwidth style:toggle-rounded %}
<!-- tab id:tab_boxed_icon_1 "icon:fa-brands fa-github" "title:GitHub" active -->
这个标签页的图标(`icon`)为`"icon:fa-brands fa-github"`。
<!-- endtab -->
<!-- tab id:tab_boxed_icon_2 "icon:fa-brands fa-node-js" "title:Node.js" -->
这个标签页的图标(`icon`)为`"icon:fa-brands fa-node-js"`。
<!-- endtab -->
{% endtabs %}
</div>

#### title

此选项定义标签按钮的标题。
其为可选项。
如果标题含有空格，则配置名与配置值需要用引号包裹住。

<div class="example-tab-container">
{% tabs style:toggle %}
<!-- tab id:tab_title_boxed_1 "title:有标题的标签页" active -->
这个标签页的标题(`title`)为(`"title:有标题的标签页"`)。
<!-- endtab -->
<!-- tab id:tab_title_boxed_2 "title:另一个有标题的标签页" -->
这个标签页的标题(`title`)为(`"title:另一个有标题的标签页"`)。
<!-- endtab -->
{% endtabs %}
</div>
