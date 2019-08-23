<#macro article post,index>
<div class="card">
    <#if post.thumbnail?? && post.thumbnail!=''>
    <div class="card-image">
        <#if index>
            <a href="${context!}/archives/${post.url!}"
                <img class="thumbnail" src="${post.thumbnail!}" alt="${post.title!}">
            </a>
        <#else>
            <span class="image is-7by1">
                <img class="thumbnail" src="${post.thumbnail!}" alt="${post.title!}">
            </span>
        </#if>
    </div>
    </#if>
    <div class="card-content article <%= post.hasOwnProperty('direction') ? post.direction : '' %>">
<#--        <% if (post.layout != 'page') { %>-->
<#--        <div class="level article-meta is-size-7 is-uppercase is-mobile is-overflow-x-auto">-->
<#--            <div class="level-left">-->
<#--                <time class="level-item has-text-grey" datetime="<%= date_xml(post.date) %>"><%= date(post.date) %></time>-->
<#--                <% if (post.categories && post.categories.length) { %>-->
<#--                <div class="level-item">-->
<#--                <%- list_categories(post.categories, {-->
<#--                    class: 'has-link-grey ',-->
<#--                    show_count: false,-->
<#--                    style: 'none',-->
<#--                    separator: '&nbsp;/&nbsp;'-->
<#--                }) %>-->
<#--                </div>-->
<#--                <% } %>-->
<#--                <% if (!has_config('article.readtime') || get_config('article.readtime') === true) { %>-->
<#--                <span class="level-item has-text-grey">-->
<#--                    <% const words = word_count(post._content); %>-->
<#--                    <% const time = duration((words / 150.0) * 60, 'seconds') %>-->
<#--                    <%= `${ time.locale(get_config('language', 'en')).humanize() } ${ __('article.read')} (${ __('article.about') } ${ words } ${ __('article.words') })` %>-->
<#--                </span>-->
<#--                <% } %>-->
<#--                <% if (!index && (has_config('plugins.busuanzi') ? get_config('plugins.busuanzi') : false)) { %>-->
<#--                <span class="level-item has-text-grey" id="busuanzi_container_page_pv">-->
<#--                    <i class="far fa-eye"></i>-->
<#--                    <%- _p('plugin.visit', '<span id="busuanzi_value_page_pv">0</span>') %>-->
<#--                </span>-->
<#--                <% } %>-->
<#--            </div>-->
<#--        </div>-->
<#--        <% } %>-->
        <h1 class="title is-size-3 is-size-4-mobile has-text-weight-normal">
            <#if index>
                <a class="has-link-black-ter" href="${context!}/archives/${post.url!}">${post.title!}</a>
            <#else>
                ${post.title!}
            </#if>
        </h1>
        <div class="content">
            <#if index && post.summary?? && post.summary!=''>
                ${post.summary!}
            <#else>
                ${post.formatContent!}
            </#if>
        </div>
        <#if !index && tags?? && (tags?size gt 0)>
            <div class="level is-size-7 is-uppercase">
                <div class="level-start">
                    <div class="level-item">
                        <span class="is-size-6 has-text-grey has-mr-7">#</span>
                        <#list tags as tag>
                            <a class="has-link-grey -link" href="${context!}/tags/${tag.slugName!}">${tag.name!}</a>
                        </#list>
                    </div>
                </div>
            </div>
        </#if>
        <#if index && post.summary?? && post.summary!=''>
        <div class="level is-mobile">
            <div class="level-start">
                <div class="level-item">
                <a class="button is-size-7 is-light" href="${context!}/archives/${post.url!}#more">阅读更多</a>
                </div>
            </div>
        </div>
        </#if>
        <% if (!index && has_config('share.type')) { %>
        <%- partial('share/' + get_config('share.type')) %>
        <% } %>
    </div>
</div>

<% const services = has_config('donate') ? get_config('donate') : []; %>
<% if (!index && services.length > 0) { %>
<div class="card">
    <div class="card-content">
        <h3 class="menu-label has-text-centered"><%= __('donate.title') %></h3>
        <div class="buttons is-centered">
            <% for (let service of services) {
                const type = get_config_from_obj(service, 'type');
                if (type !== null) { %>
                <%- partial('donate/' + type, { type, service }) %>
                <% }
            } %>
        </div>
    </div>
</div>
<% } %>

<#if !index && nextPost?? && prePost??>
    <div class="card card-transparent">
        <div class="level post-navigation is-flex-wrap is-mobile">
            <#if prePost??>
            <div class="level-start">
                <a class="level level-item has-link-grey article-nav-prev" href="${context!}/archives/${prePost.url}">
                    <i class="level-item fas fa-chevron-left"></i>
                    <span class="level-item">上一篇</span>
                </a>
            </div>
            </#if>
            <#if nextPost??>
            <div class="level-end">
                <a class="level level-item has-link-grey article-nav-next" href="${context!}/archives/${nextPost.url}">
                    <span class="level-item">下一篇</span>
                    <i class="level-item fas fa-chevron-right"></i>
                </a>
            </div>
            </#if>
        </div>
    </div>
</#if>

<#if !index>
    <div class="card">
        <div class="card-content">
            <h3 class="title is-5 has-text-weight-normal">评论</h3>
            <%- partial('comment/' + get_config('comment.type')) %>
            <@global.comment post,"post" />
        </div>
    </div>
</#if>
</#macro>