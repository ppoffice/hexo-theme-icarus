<#macro widget position>
<div class="column is-4-tablet is-4-desktop is-3-widescreen <#if position=='right'>is-hidden-touch is-hidden-desktop-only</#if> <#if position == 'left'>has-order-1<#else>has-order-3</#if> column-${position} <%= sticky_class(position) %>">
    <#if position == 'left'>
        <#include "../widget/profile.ftl">
        <#include "../widget/links.ftl">
        <#include "../widget/category.ftl">
        <#include "../widget/tagcloud.ftl">
    </#if>
    <#if position == 'right'>
        <#include "../widget/recent_posts.ftl">
        <#include "../widget/archive.ftl">
        <#include "../widget/tag.ftl">
    </#if>
    <#if position == 'left'>
        <div class="column-right-shadow is-hidden-widescreen">
            <#include "../widget/recent_posts.ftl">
            <#include "../widget/archive.ftl">
            <#include "../widget/tag.ftl">
        </div>
    </#if>
</div>
</#macro>