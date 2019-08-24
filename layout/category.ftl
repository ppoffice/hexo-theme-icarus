<div class="card">
    <div class="card-content">
        <nav class="breadcrumb" aria-label="breadcrumbs">
        <ul>
            <li><a href="${context!}/categories">分类></a></li>
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
            <div class="pagination-previous<#if posts.number gt 0><#else > is-invisible is-hidden-mobile</#if>">
                <#if posts.number == 1>
                    <a class="is-flex-grow has-text-black-ter" href="${context!}/categories/${category.slugName!}">上一页</a>
                <#else>
                    <a class="is-flex-grow has-text-black-ter" href="${context!}/categories/${category.slugName!}/page/${posts.number}">上一页</a>
                </#if>
            </div>
            <div class="pagination-next<#if posts.getTotalPages() gt posts.number+1><#else > is-invisible is-hidden-mobile</#if>">
                <a class="is-flex-grow has-text-black-ter" href="${context!}/categories/${category.slugName!}/page/${posts.number+2}">下一页</a>
            </div>
            <ul class="pagination-list is-hidden-mobile">
                <#list rainbow as r>
                    <#if r == posts.number+1>
                        <li><a class="pagination-link is-current" href="${context!}/categories/${category.slugName!}/page/${posts.number+1}">${posts.number+1}</a></li>
                    <#else>
                        <li><a class="pagination-link has-text-black-ter" href="${context!}/categories/${category.slugName!}/page/${r}">${r}</a></li>
                    </#if>
                </#list>
            </ul>
        </nav>
    </div>
</#if>