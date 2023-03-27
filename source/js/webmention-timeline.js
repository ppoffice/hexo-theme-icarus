window.addEventListener('load', function () {
    const webmentionsPromise = window.webmentionContext.webmentionsPromise;
    const mastodonContext = window.mastodonContext;
    const webmentionTimelineMessages = window.webmentionTimelineMessages;

    webmentionsPromise && webmentionsPromise
        .then(function (data) {
            let html = '';
            data.children.forEach(function (item) {
                if (!(mastodonContext && item.url.startsWith(mastodonContext.mastodonBaseUrl))) {
                    html += `<article class="media"><div class="media-content"><p class="article-meta level-left">`;

                    if (item.author && item.author.name) {
                        html += `<i class="level-item author" >`;
                        if (item.author.url) {
                            html += `<a target="_blank" href="${item.author.url}" rel="noopener">${item.author.name}</a>`;
                        }
                        else {
                            html += item.author.name;
                        }
                        html += `</i>`;
                    }
                    let publishTime = (item.published && item.published.indexOf('T') > 0) ? item.published : item['wm-received'];

                    html += `<time class="level-item" datetime="${publishTime}">${publishTime.split('T')[0]}</time></p><p class="title level-left"><i class="level-item">🔗</i><a target="_blank" href="${item.url}" rel="noopener" class="level-item">${item.url}</a></p></div></article>`;
                }
                else {
                    html += `<article class="media"><div class="media-content"><p class="title level-right"><span class="level-item">🐘</span><span class="level-item"><a target="_blank" href="${item.url}" rel="noopener">${webmentionTimelineMessages['into_the_fediverse']}</a></span></p></article></div>`;
                }

            });
            document.querySelector('div.webmention-timeline').innerHTML = html;

        })
        .catch(function (ex) {
            console.error('fetch mastodon webmention error' + ex);
        });
});