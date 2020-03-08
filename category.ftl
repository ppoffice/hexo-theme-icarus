<#include "layout/layout.ftl">
<#include "layout/common/article.ftl">
<@layout title="分类：${category.name!} - ${blog_title!}" canonical="${category.fullPath!}">
    <#include "layout/category.ftl">
</@layout>
