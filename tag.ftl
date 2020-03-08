<#include "layout/layout.ftl">
<#include "layout/common/article.ftl">
<@layout title="标签：${tag.name!} - ${blog_title!}" canonical="${tag.fullPath!}">
    <#include "layout/tag.ftl">
</@layout>