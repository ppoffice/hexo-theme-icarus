(function (webmentionContext) {

    const url = window.location.href;
    const webmentionBaseUrl = "https://webmention.io"

    webmentionContext.webmentionsPromise = fetch(webmentionBaseUrl + "/api/mentions.jf2?target=" + encodeURIComponent(url))
        .then(function (response) {
            console.error('sucess '  + url);
            return response.json();
        })
        .catch(function (ex) {
            console.error('fetch webmention error' + ex);
        });
})(window.webmentionContext);