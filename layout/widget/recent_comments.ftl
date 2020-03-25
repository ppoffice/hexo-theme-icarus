<div class="card widget">
    <div class="card-content">
        <h3 class="menu-label">
            最新评论
        </h3>
        <@commentTag method="latest" top="5">
            <#if comments?? && comments.getTotalElements() gt 0>
                 <#list comments.content as comment>
                    <article class="media">
                        <div class="media-content">
                            <div class="content">
                                <div><time class="has-text-grey is-size-7 is-uppercase" datetime="${comment.createTime!}">${comment.createTime?string('yyyy-MM-dd')}</time></div>
                                ${comment.author!} : <a href="${comment.post.fullPath!}#comment-wrapper" class="title has-link-black-ter is-size-6 has-text-weight-normal">${comment.content!}</a>
                            </div>
                        </div>
                    </article>
                </#list>
            </#if>
        </@commentTag>
    </div>
</div>