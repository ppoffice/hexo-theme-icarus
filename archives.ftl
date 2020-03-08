<#include "layout/layout.ftl">
<#include "layout/common/article.ftl">
<@layout title="归档 - ${blog_title!}" canonical="${archives_url!}">
<#list archives as archive>
    <div class="card widget">
        <div class="card-content">
            <h3 class="tag is-link">
                ${archive.year?c}
            </h3>
            <div class="timeline">
                <#list archive.posts as post>
                    <article class="media">
                        <#if post.thumbnail?? && post.thumbnail!=''>
                            <a href="${post.thumbnail}" class="media-left">
                                <p class="image is-64x64">
                                    <img class="thumbnail" src="${post.fullPath!}" alt="${post.title!}">
                                </p>
                            </a>
                        </#if>
                        <div class="media-content">
                            <div class="content">
                                <time class="has-text-grey is-size-7 is-block is-uppercase" datetime="${post.createTime!}">${post.createTime?string('yyyy-MM-dd')}</time>
                                <a href="${post.fullPath!}" class="title has-link-black-ter is-size-6 has-text-weight-normal">${post.title!}</a>
                            </div>
                        </div>
                    </article>
                </#list>
            </div>
        </div>
    </div>
</#list>
<#if posts.getTotalPages() gt 0>
    <div class="card card-transparent">
        <nav class="pagination is-centered" role="navigation" aria-label="pagination">
            <div class="pagination-previous<#if posts.number gt 0><#else > is-invisible is-hidden-mobile</#if>">
                <a class="is-flex-grow has-text-black-ter" href="${prePageFullPath!}">上一页</a>
            </div>
            <div class="pagination-next<#if posts.getTotalPages() gt posts.number+1><#else > is-invisible is-hidden-mobile</#if>">
                <a class="is-flex-grow has-text-black-ter" href="${nextPageFullPath!}">下一页</a>
            </div>
            <ul class="pagination-list is-hidden-mobile">
                <#list rainbow as r>
                    <#if r == posts.number+1>
                        <li><a class="pagination-link is-current" href="${context!}/page/${posts.number+1}">${posts.number+1}</a></li>
                    <#else>
                        <li><a class="pagination-link has-text-black-ter" href="${context!}/page/${r}">${r}</a></li>
                    </#if>
                </#list>
            </ul>
        </nav>
    </div>
</#if>
</@layout>