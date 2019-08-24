<#include "layout/layout.ftl">
<#include "layout/common/article.ftl">
<@layout title="链接 - ${options.blog_title!}" keywords="${options.seo_keywords!}" description="${options.seo_description!}" canonical="${context!}/links">
    <#include "layout/widget/links.ftl">
</@layout>