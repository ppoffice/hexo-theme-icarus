<div class="card widget">
    <div class="card-content">
        <h3 class="menu-label">
            最新文章
        </h3>
        <@postTag method="latest" top="5">
            <#list posts as post>
                <article class="media">
                    <#if post.thumbnail?? && post.thumbnail!=''>
                        <a href="${post.fullPath!}" class="media-left">
                            <p class="image is-64x64">
                                <img class="thumbnail" src="${post.thumbnail!}" alt="${post.title!}">
                            </p>
                        </a>
                    </#if>
                    <div class="media-content">
                        <div class="content">
                            <div><time class="has-text-grey is-size-7 is-uppercase" datetime="${post.createTime!}">${post.createTime?string('yyyy-MM-dd')}</time></div>
                            <a href="${post.fullPath!}" class="title has-link-black-ter is-size-6 has-text-weight-normal">${post.title!}</a>
                        </div>
                    </div>
                </article>
            </#list>
        </@postTag>
    </div>
</div>