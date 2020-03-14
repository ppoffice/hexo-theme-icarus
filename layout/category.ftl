<div class="card">
    <div class="card-content">
        <nav class="breadcrumb" aria-label="breadcrumbs">
        <ul>
            <li><a href="${categories_url!}">分类></a></li>
            <li class="is-active"><a href="#" aria-current="page">${category.name}</a></li>
        </ul>
        </nav>
    </div>
</div>
<#list posts.content as post>
    <@article post,'index','null',true />
</#list>
<#if posts.getTotalPages() gt 0>
    <div class="card card-transparent">
        <nav class="pagination is-centered" role="navigation" aria-label="pagination">
            <@paginationTag method="categoryPosts" page="${posts.number}" total="${posts.totalPages}" display="3" slug="${category.slug!}">
                <div class="pagination-previous<#if pagination.hasPrev><#else > is-invisible is-hidden-mobile</#if>">
                    <a class="is-flex-grow has-text-black-ter" href="${pagination.prevPageFullPath!}">上一页</a>
                </div>
                <div class="pagination-next<#if pagination.hasNext><#else > is-invisible is-hidden-mobile</#if>">
                    <a class="is-flex-grow has-text-black-ter" href="${pagination.nextPageFullPath!}">下一页</a>
                </div>
                <ul class="pagination-list is-hidden-mobile">
                    <#list pagination.rainbowPages as number>
                        <#if number.isCurrent>
                            <li><a class="pagination-link is-current" href="${number.fullPath!}">${number.page!}</a></li>
                        <#else>
                            <li><a class="pagination-link has-text-black-ter" href="${number.fullPath!}">${number.page!}</a></li>
                        </#if>
                    </#list>
                </ul>
            </@paginationTag>
        </nav>
    </div>
</#if>