<#macro navbar layout>
<nav class="navbar navbar-main">
    <div class="container">
        <div class="navbar-brand is-flex-center">
            <a class="navbar-item navbar-logo" href="${context!}">
                <#if options.blog_logo?? && options.blog_logo!=''>
                    <img src="${options.blog_logo!}" alt="${options.blog_title!}" height="28">
                <#else>
                    ${options.blog_title!}
                </#if>
            </a>
        </div>
        <div class="navbar-menu">
            <@menuTag method="list">
                <#if menus?? && menus?size gt 0>
                    <div class="navbar-start">
                        <#list menus?sort_by('priority') as menu>
                            <a class="navbar-item" href="${menu.url}" target="${menu.target!}">${menu.name}</a>
                        </#list>
                    </div>
                </#if>
            </@menuTag>
            <div class="navbar-end">
                <% if (has_config('navbar.links')) { %>
                    <% let links = get_config('navbar.links'); %>
                    <% for (let name in links) {
                            let link = links[name]; %>
                    <a class="navbar-item" target="_blank" title="<%= name %>" href="<%= url_for(typeof(link) === 'string' ? link : link.url) %>">
                        <% if (typeof(link) === 'string') { %>
                        <%= name %>
                        <% } else { %>
                        <i class="<%= link.icon %>"></i>
                        <% } %>
                    </a>
                    <% } %>
                <% } %>
                <% if (get_config('toc') === true && has_widget('toc') && (page.layout === 'page' || page.layout === 'post')) { %>
                <a class="navbar-item is-hidden-tablet catalogue" title="<%= _p('widget.catalogue', Infinity) %>" href="javascript:;">
                    <i class="fas fa-list-ul"></i>
                </a>
                <% } %>
                <% if (has_config('search.type')) { %>
                <a class="navbar-item search" title="<%= __('search.search') %>" href="javascript:;">
                    <i class="fas fa-search"></i>
                </a>
                <% } %>
            </div>
        </div>
    </div>
</nav>
</#macro>