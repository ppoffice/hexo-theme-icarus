hexo.extend.filter.register('theme_inject', function (injects) {
    // 样式文件
	injects.style.push('/source/_data/styles.styl');
})

hexo.extend.injector.register('head_begin', '<link rel="stylesheet" href="https://cdn.staticfile.org/lxgw-wenkai-screen-webfont/1.6.0/lxgwwenkaiscreen.css">', 'default');