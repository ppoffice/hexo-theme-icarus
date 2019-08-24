<#include "layout/layout.ftl">
<#include "layout/common/article.ftl">
<@layout title="${post.title!} - ${options.blog_title!}" keywords="${options.seo_keywords!},${tagWords!}" description="${post.summary!}" canonical="${context!}/archives/${post.url!}">
    <@article post,'page',"post",false />
</@layout>