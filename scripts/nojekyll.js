/**
* .nojekyll Generator
* @description Prevent vendor folder from ignored by GitHub
*/

hexo.extend.generator.register('nojekyll', function (locals) {
    return {
        path: '.nojekyll',
        data: ''
    }
});