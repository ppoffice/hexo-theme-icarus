function get_count(url) {
    const webmentionBaseUrl = "https://webmention.io"

    const cnt = fetch(`https://webmention.io/api/count.json?target=` + encodeURIComponent(url))
    .then(function (response) {
        return response.json();
    })
    .catch(function (ex){
        console.error('featch mention count error' + ex);
     }); 
     return cnt
}