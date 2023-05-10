hexo.extend.filter.register('theme_inject', function (injects) {
    // 样式文件
	injects.style.push('/source/_data/styles.styl');
})

hexo.extend.injector.register('head_begin', '<link rel="stylesheet" href="https://cdn.staticfile.org/lxgw-wenkai-screen-webfont/1.6.0/lxgwwenkaiscreen.css">', 'default');

hexo.extend.injector.register('head_begin', '<script async defer data-website-id="7e782528-455f-4f0a-acc5-01ec7ed759ff" src="https://analytics.umami.is/script.js"></script>', 'default');

hexo.extend.injector.register('head_begin', '<script async src="<script async src="http://124.221.237.70:3000/script.js" data-website-id="0bf958fd-ca98-4a54-b1c0-bf3384802fcc"></script>', 'default');

hexo.extend.injector.register('head_begin', '<link rel="webmention" href="https://webmention.io/blog.xiang578.com/webmention" /> <link rel="pingback" href="https://webmention.io/blog.xiang578.com/xmlrpc" />', 'default');
hexo.extend.injector.register('head_begin', '<link title="Follow me on Twitter" rel="me" href="https://twitter.com/xiang578"/>', 'default');