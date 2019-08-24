<#include "layout/layout.ftl">
<#include "layout/common/article.ftl">
<@layout title="分类：${category.name!} - ${options.blog_title!}" keywords="${options.seo_keywords!}" description="${options.seo_description!}" canonical="${context!}/categories/${category.slugName!}">
    <#include "layout/category.ftl">
</@layout>
