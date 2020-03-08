<#include "layout/layout.ftl">
<#include "layout/common/article.ftl">
<@layout title="${sheet.title} - ${blog_title!}" canonical="${sheet.fullPath!}">
    <@article sheet,'page',"sheet",false />
</@layout>