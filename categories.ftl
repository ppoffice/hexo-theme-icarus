<#include "layout/layout.ftl">
<#include "layout/common/article.ftl">
<@layout title="分类 - ${options.blog_title!}" keywords="${options.seo_keywords!}" description="${options.seo_description!}" canonical="${context!}/categories">
    <#include "layout/categories.ftl">
</@layout>