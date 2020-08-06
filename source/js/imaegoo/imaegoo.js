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
}(jQuery));
