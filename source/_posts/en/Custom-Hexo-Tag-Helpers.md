title: Custom Hexo Tag Helpers
date: 2018-01-02
tags:
- Demo
toc: true
---

Apart from the tag helpers supported by Hexo natively, as described in {% post_link demo/Hexo-Built-In-Tag-Helpers %},
Icarus also offers several other useful tag helpers to customize the display of your content.

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-globe-asia mr-2"></i>This article is also available in 
<a href="{% post_path zh-CN/Custom-Hexo-Tag-Helpers %}">简体中文</a>.
</div>
</article>

<!-- more -->

<article class="message message-immersive is-primary">
<div class="message-body">
<i class="fas fa-info-circle mr-2"></i>The following tag helpers are provided by
<a href="https://github.com/ppoffice/hexo-component-inferno">ppoffice/hexo-component-inferno</a>.
Please refer to it for a complete list of supported helpers and their configuration details.
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

## Message

Message blocks are a colorful way to emphasize part of text in your post.
Its syntax is defined as follows:

```
{% message color:<color> size:<size> icon:<icon> title:<title> %}
    <content>
{% endmessage %}
```

### color

The color of message block.
It is optional.
Available values and their examples are:

{% message "title:default" %}
    A message block when `color` is not specified.
{% endmessage %}

{% message color:dark "title:dark" %}
    A `dark` message block.
{% endmessage %}

{% message color:primary "title:primary" %}
    A `primary` message block.
{% endmessage %}

{% message color:info "title:info" %}
    A `info` message block.
{% endmessage %}

{% message color:success "title:success" %}
    A `success` message block.
{% endmessage %}

{% message color:warning "title:warning" %}
    A `warning` message block.
{% endmessage %}

{% message color:danger "title:danger" %}
    A `danger` message block.
{% endmessage %}

### size

The size of message block.
It is optional.
Available values and their examples are:

{% message size:small "title:small" %}
    A `small` message block.
{% endmessage %}

{% message "title:default" %}
    A message block when `size` is not specified.
{% endmessage %}

{% message size:medium "title:medium" %}
    A `medium` message block.
{% endmessage %}

{% message size:large "title:large" %}
    A `large` message block.
{% endmessage %}

### icon

The icon shown in the message block header.
It is optional.
The value should be valid FontAwesome icon class name.
If the icon class name contains space(s), this option and its value should be wrapped with quotes.

{% message "icon:fa-brands fa-github" "title:Message block with a GitHub icon" %}
    A message with `"icon:fa-brands fa-github"` as icon.
{% endmessage %}

{% message color:success "icon:fa-brands fa-node-js" "title:Message block with a Node.js icon" %}
    A message with `"icon:fa-brands fa-node-js"` as icon.
{% endmessage %}

{% message color:danger "icon:fa-brands fa-npm" "title:Message block with an NPM icon" %}
    A message with `"icon:fa-brands fa-npm"` as icon.
{% endmessage %}

### title

Title of the message block.
It is optional.
If the title contains space(s), this option and its value should be wrapped with quotes.

{% message "title:Message block with title" %}
    A message block with a title (`"title:Message block with title"`).
{% endmessage %}

{% message %}
    A message block without a title.
{% endmessage %}

{% message color:dark %}
    A message block without a title.
{% endmessage %}

{% message color:primary %}
    A message block without a title.
{% endmessage %}

{% message color:info %}
    A message block without a title.
{% endmessage %}

{% message color:success %}
    A message block without a title.
{% endmessage %}

{% message color:warning %}
    A message block without a title.
{% endmessage %}

{% message color:danger %}
    A message block without a title.
{% endmessage %}

## Tabs

The tabs tag helper is a powerful tool to display parallel content.
Only content in the active tab can be displayed to the user at a time.
Its syntax is defined as follows:

```
{% tabs size:<size> align:<align> style:<style> %}
<!-- tab id:<tab_id> icon:<icon> title:<tab_title> active -->
<content>
<!-- endtab -->
<!-- tab id:<tab_id> icon:<icon> title:<tab_title> -->
<content>
<!-- endtab -->
...
{% endtabs %}
```

### Tab Container

A tab container has the following options:

#### size

Size of the tabs.
It is optional.
Available values and their examples are:

<div class="example-tab-container">
{% tabs size:small %}
<!-- tab id:tab_size_small_1 "title:Tab 1" active -->
This is tab 1 of a `small` tab container.
<!-- endtab -->
<!-- tab id:tab_size_small_2 "title:Tab 2" -->
This is tab 2 of a `small` tab container.
<!-- endtab -->
{% endtabs %}
</div>

<div class="example-tab-container">
{% tabs %}
<!-- tab id:tab_size_default_1 "title:Tab 1" active -->
This is tab 1 of a tab container when `size` is not specified.
<!-- endtab -->
<!-- tab id:tab_size_default_2 "title:Tab 2" -->
This is tab 2 of a tab container when `size` is not specified.
<!-- endtab -->
{% endtabs %}
</div>

<div class="example-tab-container">
{% tabs size:medium %}
<!-- tab id:tab_size_medium_1 "title:Tab 1" active -->
This is tab 1 of a `medium` tab container.
<!-- endtab -->
<!-- tab id:tab_size_medium_2 "title:Tab 2" -->
This is tab 2 of a `medium` tab container.
<!-- endtab -->
{% endtabs %}
</div>

<div class="example-tab-container">
{% tabs size:large %}
<!-- tab id:tab_size_large_1 "title:Tab 1" active -->
This is tab 1 of a `large` tab container.
<!-- endtab -->
<!-- tab id:tab_size_large_2 "title:Tab 2" -->
This is tab 2 of a `large` tab container.
<!-- endtab -->
{% endtabs %}
</div>

#### align

Alignment of the tab buttons.
It is optional.
Available values and their examples are:

<div class="example-tab-container">
{% tabs %}
<!-- tab id:tab_align_default_1 "title:Tab 1" active -->
This is tab 1 of a tab container when `align` is not specified.
<!-- endtab -->
<!-- tab id:tab_align_default_2 "title:Tab 2" -->
This is tab 2 of a tab container when `align` is not specified.
<!-- endtab -->
{% endtabs %}
</div>

<div class="example-tab-container">
{% tabs align:centered %}
<!-- tab id:tab_align_centered_1 "title:Tab 1" active -->
This is tab 1 of a `centered` tab container.
<!-- endtab -->
<!-- tab id:tab_align_centered_2 "title:Tab 2" -->
This is tab 2 of a `centered` tab container.
<!-- endtab -->
{% endtabs %}
</div>

<div class="example-tab-container">
{% tabs align:right %}
<!-- tab id:tab_align_right_1 "title:Tab 1" active -->
This is tab 1 of a `right` tab container.
<!-- endtab -->
<!-- tab id:tab_align_right_2 "title:Tab 2" -->
This is tab 2 of a `right` tab container.
<!-- endtab -->
{% endtabs %}
</div>

<div class="example-tab-container">
{% tabs align:fullwidth %}
<!-- tab id:tab_align_fullwidth_1 "title:Tab 1" active -->
This is tab 1 of a `fullwidth` tab container.
<!-- endtab -->
<!-- tab id:tab_align_fullwidth_2 "title:Tab 2" -->
This is tab 2 of a `fullwidth` tab container.
<!-- endtab -->
{% endtabs %}
</div>

#### style

Style of the tab buttons.
It is optional.
Additionally, you can combine the style with `fullwidth` alignment.
Available values and their examples are:

<div class="example-tab-container">
{% tabs style:boxed %}
<!-- tab id:tab_style_boxed_1 "title:Tab 1" active -->
This is tab 1 of a `boxed` tab container.
<!-- endtab -->
<!-- tab id:tab_style_boxed_2 "title:Tab 2" -->
This is tab 2 of a `boxed` tab container.
<!-- endtab -->
{% endtabs %}
</div>

<div class="example-tab-container">
{% tabs style:toggle %}
<!-- tab id:tab_style_toggle_1 "title:Tab 1" active -->
This is tab 1 of a `toggle` tab container.
<!-- endtab -->
<!-- tab id:tab_style_toggle_2 "title:Tab 2" -->
This is tab 2 of a `toggle` tab container.
<!-- endtab -->
{% endtabs %}
</div>

<div class="example-tab-container">
{% tabs style:toggle-rounded %}
<!-- tab id:tab_style_toggle_rounded_1 "title:Tab 1" active -->
This is tab 1 of a `toggle-rounded` tab container.
<!-- endtab -->
<!-- tab id:tab_style_toggle_rounded_2 "title:Tab 2" -->
This is tab 2 of a `toggle-rounded` tab container.
<!-- endtab -->
{% endtabs %}
</div>

<div class="example-tab-container">
{% tabs align:fullwidth style:boxed %}
<!-- tab id:tab_style_boxed_fullwidth_1 "title:Tab 1" active -->
This is tab 1 of a `fullwidth` `boxed` tab container.
<!-- endtab -->
<!-- tab id:tab_style_boxed_fullwidth_2 "title:Tab 2" -->
This is tab 2 of a `fullwidth` `boxed` tab container.
<!-- endtab -->
{% endtabs %}
</div>

<div class="example-tab-container">
{% tabs align:fullwidth style:toggle %}
<!-- tab id:tab_style_toggle_fullwidth_1 "title:Tab 1" active -->
This is tab 1 of a `fullwidth` `toggle` tab container.
<!-- endtab -->
<!-- tab id:tab_style_toggle_fullwidth_2 "title:Tab 2" -->
This is tab 2 of a `fullwidth` `toggle` tab container.
<!-- endtab -->
{% endtabs %}
</div>

<div class="example-tab-container">
{% tabs align:fullwidth style:toggle-rounded %}
<!-- tab id:tab_style_toggle_rounded_fullwidth_1 "title:Tab 1" active -->
This is tab 1 of a `fullwidth` `toggle-rounded` tab container.
<!-- endtab -->
<!-- tab id:tab_style_toggle_rounded_fullwidth_2 "title:Tab 2" -->
This is tab 2 of a `fullwidth` `toggle-rounded` tab container.
<!-- endtab -->
{% endtabs %}
</div>

### Tab

A tab has the following options:

#### id

The unique identifier of the tab element.
It is required.
An ID of a tab should be unique across the entire page so that Icarus can location the right tab
content to show or hide.

#### active

Whether the current tab element is shown.
It is optional.
Only one tab can be active at a time for a tab group.

#### icon

The icon shown in the tab button.
It is optional.
The value should be valid FontAwesome icon class name.
If the icon class name contains space(s), this option and its value should be wrapped with quotes.

<div class="example-tab-container">
{% tabs %}
<!-- tab id:tab_icon_1 "icon:fa-brands fa-github" "title:GitHub" active -->
This tab has an icon of `"icon:fa-brands fa-github"`.
<!-- endtab -->
<!-- tab id:tab_icon_2 "icon:fa-brands fa-node-js" "title:Node.js" -->
This tab has an icon of `"icon:fa-brands fa-node-js"`.
<!-- endtab -->
{% endtabs %}
</div>

<div class="example-tab-container">
{% tabs align:fullwidth style:toggle-rounded %}
<!-- tab id:tab_boxed_icon_1 "icon:fa-brands fa-github" "title:GitHub" active -->
This tab has an icon of `"icon:fa-brands fa-github"`.
<!-- endtab -->
<!-- tab id:tab_boxed_icon_2 "icon:fa-brands fa-node-js" "title:Node.js" -->
This tab has an icon of `"icon:fa-brands fa-node-js"`.
<!-- endtab -->
{% endtabs %}
</div>

#### title

Title of the tab button.
It is required.
If the title contains space(s), this option and its value should be wrapped with quotes.

<div class="example-tab-container">
{% tabs style:toggle %}
<!-- tab id:tab_title_boxed_1 "title:Tab with title" active -->
This tab has a title (`"title:Tab with title"`).
<!-- endtab -->
<!-- tab id:tab_title_boxed_2 "title:Tab also with title" -->
This tab also has a title (`"title:Tab also with title"`).
<!-- endtab -->
{% endtabs %}
</div>
