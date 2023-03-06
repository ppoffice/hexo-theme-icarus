hexo.extend.filter.register('theme_inject', function (injects) {
    // 样式文件
	injects.style.push('/source/_data/styles.styl');
})