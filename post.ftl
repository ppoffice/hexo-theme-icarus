<#include "layout/layout.ftl">
<#include "layout/common/article.ftl">
<@layout title="${options.blog_title!}" keywords="${options.seo_keywords!}" description="${options.seo_description!}" canonical="${context!}">
    <@article post,false />
</@layout>