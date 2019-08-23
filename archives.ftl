<#include "layout/layout.ftl">
<#include "layout/common/article.ftl">
<@layout title="归档 - ${options.blog_title!}" keywords="${options.seo_keywords!}" description="${options.seo_description!}" canonical="${context!}/archives">
<@postTag method="archiveYear">
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
                                        <img class="thumbnail" src="${context!}/archives/${post.url!}" alt="${post.title!}">
                                    </p>
                                </a>
                            </#if>
                            <div class="media-content">
                                <div class="content">
                                    <time class="has-text-grey is-size-7 is-block is-uppercase" datetime="${post.createTime!}">${post.createTime?string('yyyy-MM-dd')}</time>
                                    <a href="${context!}/archives/${post.url!}" class="title has-link-black-ter is-size-6 has-text-weight-normal">${post.title!}</a>
                                </div>
                            </div>
                        </article>
                    </#list>
                </div>
            </div>
        </div>
    </#list>
</@postTag>
</@layout>