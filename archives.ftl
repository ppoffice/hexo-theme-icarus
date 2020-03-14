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
            <@paginationTag method="archives" page="${posts.number}" total="${posts.totalPages}" display="3">
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
</@layout>