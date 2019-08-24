<#macro widget position>
<div class="column is-4-tablet is-4-desktop is-3-widescreen <#if position=='right'>is-hidden-touch is-hidden-desktop-only</#if> <#if position == 'left'>has-order-1<#else>has-order-3</#if> column-${position} <%= sticky_class(position) %>">
    <#if position == 'left'>
        <#if settings.sidebar_profile!true>
            <#include "../widget/profile.ftl">
        </#if>
        <#if settings.sidebar_categories!true>
            <#include "../widget/category.ftl">
        </#if>
        <#if settings.sidebar_tagcloud!true>
            <#include "../widget/tagcloud.ftl">
        </#if>
        <#if settings.sidebar_links!true>
            <#include "../widget/links.ftl">
        </#if>
    </#if>
    <#if position == 'right'>
        <#if settings.sidebar_recentpost!true>
            <#include "../widget/recent_posts.ftl">
        </#if>
        <#if settings.sidebar_recentcomment!true>
            <#include "../widget/recent_comments.ftl">
        </#if>
<#--        <#include "../widget/archive.ftl">-->
        <#if settings.sidebar_tags!true>
            <#include "../widget/tag.ftl">
        </#if>
    </#if>
    <#if position == 'left'>
        <div class="column-right-shadow is-hidden-widescreen">
            <#if settings.sidebar_recentpost!true>
                <#include "../widget/recent_posts.ftl">
            </#if>
            <#if settings.sidebar_recentcomment!true>
                <#include "../widget/recent_comments.ftl">
            </#if>
<#--            <#include "../widget/archive.ftl">-->
            <#if settings.sidebar_tags!true>
                <#include "../widget/tag.ftl">
            </#if>
        </div>
    </#if>
</div>
</#macro>