(function (webmentionContext) {

    const url = window.location.href;
    const webmentionBaseUrl = "https://webmention.io"
    // const url = "https://www.owenyoung.com/en/blog/indieweb/"

    webmentionContext.webmentionsPromise = fetch(webmentionBaseUrl + "/api/mentions.jf2?target=" + encodeURIComponent(url))
        .then(function (response) {
            console.log('sucess '  + webmentionBaseUrl + "/api/mentions.jf2?target=" + url);
            return response.json();
        })
        .catch(function (ex) {
            console.error('fetch webmention error' + ex);
        });
    
    webmentionContext.webmentionCountPromise = fetch(webmentionBaseUrl + "/api/count.json?target=" + encodeURIComponent(url))
    .then(function (response) {
        console.log('sucess '  + webmentionBaseUrl + "/api/count.json?target=" + url);
        return response.json();
    })
    .catch(function (ex) {
        console.error('fetch webmention count error' + ex);
    });
    
})(window.webmentionContext);