(function ($) {
  /**
   * 等背景图片加载完成后再显示
   * https://www.imaegoo.com/
   */
  var dongmanImg = new Image();
  if (document.body.offsetWidth > 768) {
    dongmanImg.src = 'https://api.btstu.cn/sjbz/?lx=dongman&format=images&method=pc';
  } else {
    dongmanImg.src = 'https://api.btstu.cn/sjbz/?lx=dongman&format=images&method=mobile';
  }
  var dongmanInterval = setInterval(function () {
    if (dongmanImg.complete) {
      document.body.classList.add('ready');
      clearInterval(dongmanInterval);
    }
  }, 100);

  /**
   * 仿 CSDN 左侧栏吸底效果，设置 position 为 sticky，top 为屏幕高度减去左侧栏高度，比 CSDN 的实现更简洁。
   * https://www.imaegoo.com/
   */
  var columnLeft = $('.column-left')[0];

  function fixLeftColumnTop() {
    // if SBP return
    if ($(window).width() < 769) {
      columnLeft.style.top = null;
    } else {
      if (columnLeft) {
        columnLeft.style.top = $(window).height() - columnLeft.scrollHeight - 10 + 'px';
      } else {
        setTimeout(function () {
          columnLeft = $('.column-left')[0];
          fixLeftColumnTop();
        }, 500);
      }
    }
  }
  fixLeftColumnTop();
  $(window).resize(fixLeftColumnTop);

  function loadTwikooNewComment() {
    var twikooOrgPaths = ['/', '/api.html', '/cms.html', '/configuration.html', '/faq.html', '/link.html', '/quick-start.html'];
    var twikooNewEl = document.getElementsByClassName('twikoo-new-container');
    if (twikooNewEl.length === 0) return;
    twikoo.getRecentComments({
      envId: window.twikooEnvId,
      pageSize: 5,
      includeReply: true
    }).then(function (res) {
      var innerHTML = '';
      for (var idx1 = 0; idx1 < res.length; idx1++) {
        var item = res[idx1];
        if (!item.commentText.trim()) continue
        if (twikooOrgPaths.indexOf(item.url) !== -1) item.url = 'https://twikoo.js.org' + item.url;
        innerHTML += '<article class="media"><div class="media-content">'
          + '<p class="title twikoo-new-content"><a href="' + item.url + '#' + item.id + '">' + changeContent(item.commentText) + '</a></p>'
          + '<p class="date">' + item.nick + ' / ' + item.relativeTime + '</p>'
          + '</div></article>';
      }
      for (var idx2 = 0; idx2 < twikooNewEl.length; idx2++) {
        twikooNewEl[idx2].innerHTML = innerHTML;
      }
    }).catch(function (err) {
      console.error(err);
      twikooNewEl.innerHTML = '加载失败';
    });
  }

  // 从 butterfly 主题借鉴
  // https://github.com/jerryc127/hexo-theme-butterfly/blob/dev/layout/includes/third-party/newest-comments/twikoo-comment.pug
  function changeContent (content) {
    if (content === '') return content;
    content = content.replace(/<[^>]+>/g, ''); // remove html tag
    if (content.length > 150) {
      content = content.substring(0, 150) + '...';
    }
    return content;
  }

  loadTwikooNewComment();
}(jQuery));
