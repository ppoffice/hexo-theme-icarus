window.addEventListener('load', function () {
    const webmentionsPromise = window.webmentionContext.webmentionsPromise;
    const webmentionCountPromise = window.webmentionContext.webmentionCountPromise;
    
    // console.log(JSON.stringify(webmentionsPromise, null, "\t"))
    webmentionsPromise && webmentionsPromise
        .then(function (data) {
            let html = '';
            // if(webmentionCountPromise && webmentionCountPromise.hasOwnProperty("count")) {
                // html += `<p>${webmentionCountPromise.count}</p>`
            // }
            // html += `<p>${webmentionCountPromise.type}</p>`
            const distinctMentions = [
                ...new Map(data.children.map((item) => [item.author.url, item])).values()].sort((a, b) => new Date(a['wm-received']) - new Date(b['wm-received']));
            const replies = distinctMentions.filter(
                (mention) => 'in-reply-to' in mention && 'content' in mention
            );
            html += `<div><p>`;

            if (distinctMentions.length > 0) {
                html += `Already ${distinctMentions.length} awesome people liked, shared or talked about this article:</p>`;
            } else {
                html += `Be the first one to share this article!`;
            }
            html += `<div className="webmention-avatars">`;
            distinctMentions.forEach(function (reply) {
                html += `<a class="avatar-wrapper" href=${reply.author.url} key=${reply.author.name}><image class="wm-avatar" loading="lazy" src=${reply.author.photo} alt=${reply.author.name} data-nimg="fill" sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw, 33vw"/></a>`;
            });
            html += `</div>`;
            if (replies && replies.length) {
                html +=  `<div class="webmention-replies">`;
                html += `<h4>Replies</h4>`;
                html += `<ul class="replies">`;
                replies.forEach(function (reply){
                    html += `<li class="reply" key=${reply.content.text}>`;
                    html += `<div>`;
                    html += `<a class="avatar-wrapper" href=${reply.author.url} key=${reply.author.name}><image class="wm-avatar" loading="lazy" src=${reply.author.photo} alt=${reply.author.name} data-nimg="fill" sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw, 33vw"/></a>`;
                    html += `</div>`;
                    html += `<div class="text">`;
                    html += `<p class="reply-author-name">${reply.author.name}</p>`;
                    html += `<p class="reply-content">${reply.content.text}</p>`;
                    html += `</div>`;
                    html += `</li>`;

                });
                html += `</ul>`;
                html += `</div>`;
            }
            document.querySelector('div.webmention-timeline').innerHTML = html;

        })
        .catch(function (ex) {
            console.error('fetch mastodon webmention error' + ex);
        });
});