<#include "layout/layout.ftl">
<#include "layout/common/article.ftl">
<@layout title="${post.title!} - ${blog_title!}" canonical="${post.fullPath!}">
    <@article post,'page',"post",false />
</@layout>