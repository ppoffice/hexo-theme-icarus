---
title: Typography
date: 2023-07-01 10:00:00
updated: 2023-07-01 10:00:00
toc: true
tags:
  - code
---
A post using most content elements, with code blocks and a table of contents.

<!-- more -->

## Text

Body text with **strong text**, *emphasis*, `inline code`, a [link](/about/) and an
[external link](https://example.com/).

> A blockquote with a [link](/about/).

- A list item
- Another list item
  1. A nested, numbered item

---

## Code

```js Captioned example
// A comment
function greet(name) {
    return `Hello, ${name}!`;
}
```

```python
def answer():
    return 42
```

## Table and message

| Name | Value |
| --- | --- |
| Alpha | 1 |
| Beta | 2 |

{% message color:info title:"A message" %}
The body of an info message, with a [link](/about/).
{% endmessage %}
