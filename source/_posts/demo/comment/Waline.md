title: Waline Comment Plugin
date: 2015-01-01
tags:
- Demo
comment:
    type: waline
    server_url: https://icarus-waline-comment.vercel.app
    path: window.location.pathname
    lang: en-US
    visitor: false
    emoji:
        - 'https://cdn.jsdelivr.net/gh/walinejs/emojis/weibo'
    dark: auto
    meta:
        - nick
        - mail
        - link
    required_meta:
    login: 'enable'
    word_limit: 0
    page_size: 10
    upload_image: false
    highlight: true
    math: false
    copyright: true
    locale:
        placeholder: 'Comment here...'
---

<article class="message message-immersive is-warning">
<div class="message-body">
<i class="fas fa-exclamation-triangle mr-2"></i>This page is for demonstration only.
Please report your issues with this plugin to 
<a href="https://github.com/ppoffice/hexo-component-inferno">ppoffice/hexo-component-inferno</a>.
</div>
</article>
