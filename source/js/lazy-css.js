function Load() {
  var runningOnBrowser = typeof window !== "undefined";
  var isBot =
    (runningOnBrowser && !("onscroll" in window)) ||
    (typeof navigator !== "undefined" &&
      /(gle|ing|ro|msn)bot|crawl|spider|yand|duckgo/i.test(
        navigator.userAgent
      ));
  var supportsIntersectionObserver =
    runningOnBrowser && "IntersectionObserver" in window;
  if (!isBot && supportsIntersectionObserver) {
    var observer = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting) {
          observer.disconnect();
        }
      },
      { threshold: [0] }
    );
    observer.observe(document.getElementById("vcomments"));
  } else {
  }
}
