<#include "layout/layout.ftl">
<#include "layout/common/article.ftl">
<@layout title="标签：${tag.name!} - ${options.blog_title!}" keywords="${options.seo_keywords!}" description="${options.seo_description!}" canonical="${context!}/tags/${tag.slugName!}">
    <#include "layout/tag.ftl">
</@layout>