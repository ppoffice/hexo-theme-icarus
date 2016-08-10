(function($) {
  function isFullScreen() {
    return document[!prefix ? 'fullScreen' :
        'webkit' === prefix ? 'webkitIsFullScreen' :
                     prefix + 'FullScreen'];
  }
  function cancelFullScreen() {
    return document[prefix ? prefix + 'CancelFullScreen'
                           : 'cancelFullScreen']();
  }
 
  var supported = typeof document.cancelFullScreen !== 'undefined'
    , prefixes = ['webkit', 'moz', 'o', 'ms', 'khtml']
    , prefix = ''
    , noop = function() {}
    , i
    ;
 
  if (!supported) {
    for (i = 0; prefix = prefixes[i]; i++) {
      if (typeof document[prefix + 'CancelFullScreen'] !== 'undefined') {
        supported = true;
        break;
      }
    }
  }
 
  if (supported) {
    $.fn.requestFullscreen = function() {
      return this.each(function() {
        return this[prefix ? prefix + 'RequestFullScreen'
                           : 'requestFullScreen']();
      });
    };
    $.fn.fullscreenChange = function(fn) {
      var ar = [prefix + 'fullscreenchange'].concat([].slice.call(arguments, 0))
        , $e = $(this);
      return $e.bind.apply($e, ar);
    };
    $.Fullscreen =
      { isFullscreen: isFullScreen
      , cancelFullscreen: cancelFullScreen
      };
  }
  else {
    $.fn.requestFullscreen = $.fn.fullScreenChange = noop;
    $.Fullscreen =
      { isFullscreen: function() { return false; }
      , cancelFullscreen: noop
      };
  }
})(jQuery);