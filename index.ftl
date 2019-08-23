<#include "layout/layout.ftl">
<#include "layout/common/article.ftl">
<@layout title="${options.blog_title!}" keywords="${options.seo_keywords!}" description="${options.seo_description!}" canonical="${context!}">
    <#list posts.content as post>
        <@article post,true />
    </#list>
    <% if (page.total > 1) { %>
        <%- partial('common/paginator') %>
    <% } %>
</@layout>