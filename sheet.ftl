<#include "layout/layout.ftl">
<#include "layout/common/article.ftl">
<@layout title="${sheet.title} - ${options.blog_title!}" keywords="${options.seo_keywords!}" description="${options.seo_description!}" canonical="${context!}/s/${sheet.url!}">
    <@article sheet,'page',false />
</@layout>