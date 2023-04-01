window.addEventListener('load', function () {
    const webmentionsPromise = window.webmentionContext.webmentionsPromise;
    let html = '';
    html +=`<div>`
    html +=`<p>你有对这篇文章写<a href="https://indieweb.org/responses">回应</a>吗? 你可以在这里提交你的文章网址或推特链接（文章或推特内容需要包含这篇文章的地址，点击这里了解 <a href="https://indieweb.org/Webmention">Webmention</a>）：</p></br>`
    html +=`<form action="https://webmention.io/blog.xiang578.com/webmention" class="form-webmention" method="post" target="_blank"><input type="url" name="source" id="form-webmention-source" placeholder="你的文章网址或推特链接" required=""> <input type="hidden" name="target" value="${window.location.href}"> <input type="submit" value="Send Webmention" class="form-webmention-btn"></form></br>`
    html +=`</div>`
    webmentionsPromise && webmentionsPromise
        .then(function (data) {
            
            const distinctMentions = [
                ...new Map(data.children.map((item) => [item.author.url, item])).values()].sort((a, b) => new Date(a['wm-received']) - new Date(b['wm-received']));

            html += `<div><p>`;

            if (distinctMentions.length > 0) {
                html += `已经有 ${distinctMentions.length} 朋友喜欢、分享或讨论这篇文章:</p>`;
            }
            html += `<div className="webmention-avatars">`;
            distinctMentions.forEach(function (reply) {
                html += `<a class="avatar-wrapper" href=${reply.author.url} key=${reply.author.name}><image class="wm-avatar" loading="lazy" src=${reply.author.photo != "" ? reply.author.photo: "/img/avatar.png"} data-nimg="fill" sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw, 33vw"/></a>`;
            });
            html += `</div>`;

            const replies = distinctMentions.filter(
                (mention) => ('in-reply-to' in mention || 'mention-of' in mention)&& 'content' in mention
            );
            if (replies && replies.length) {
                html +=  `<div class="webmention-replies">`;
                html += `</br><h3>引用或评论（${replies.length}）</h3>`;
                html += `<ul class="replies">`;
                replies.forEach(function (reply){
                    html += `<li class="reply" key=${reply["wm-id"]}>`;
                    html += `<div>`;
                    html += `<a class="avatar-wrapper" href=${reply.author.url} key=${reply.author.name}><image class="wm-avatar" loading="lazy" src=${reply.author.photo != "" ? reply.author.photo: "/img/avatar.png"} alt=${reply.author.name} data-nimg="fill" sizes="(max-width: 768px) 100vw,(max-width: 1200px) 50vw, 33vw"/></a>`;
                    html += `</div>`;
                    html += `<div class="text">`;
                    html += `<p class="reply-author-name"><a href=${reply.url} target="_blank">${reply.author.name}</a></p>`;
                    html += `<p class="reply-content">${reply.content.text.slice(0, 200)}</p>`;
                    html += `</div>`;
                    html += `</li>`;

                });
                html += `</ul>`;
                html += `</div>`;
            }
            document.querySelector('div.webmention-timeline').innerHTML = html;
        })
        .catch(function (ex) {
            console.error('fetch webmention error' + ex);
        });
});