/**
* Thumbnail Helper
* @description Get the thumbnail url from a post
* @example
*     <%- thumbnail(post) %>
*/
hexo.extend.helper.register(
  'thumbnail',
  ({ thumbnail, banner }) => thumbnail || banner || ''
);
