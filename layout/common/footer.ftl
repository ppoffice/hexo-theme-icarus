<footer class="footer">
    <div class="container">
        <div class="level">
            <div class="level-start has-text-centered-mobile">
                <a class="footer-logo is-block has-mb-6" href="${context!}">
                    <#if options.blog_logo?? && options.blog_logo!=''>
                        <img src="${options.blog_logo!}" alt="${options.blog_title!}" height="28">
                    <#else>
                        ${options.blog_title!}
                    </#if>
                </a>
                <p class="is-size-7">
                &copy; ${.now?string('yyyy')} ${user.nickname!}&nbsp;
                Powered by <a href="https://halo.run/" target="_blank">Halo</a> & <a
                        href="https://github.com/halo-dev/halo-theme-icarus" target="_blank">Icarus</a>
                </p>
            </div>
            <div class="level-end">
<#--            <% if (has_config('footer.links')) { %>-->
<#--                <div class="field has-addons is-flex-center-mobile has-mt-5-mobile is-flex-wrap is-flex-middle">-->
<#--                <% let links = get_config('footer.links'); %>-->
<#--                <% for (let name in links) {-->
<#--                        let link = links[name]; %>-->
<#--                <p class="control">-->
<#--                    <a class="button is-white <%= typeof(link) !== 'string' ? 'is-large' : '' %>" target="_blank" title="<%= name %>" href="<%= url_for(typeof(link) === 'string' ? link : link.url) %>">-->
<#--                        <% if (typeof(link) === 'string') { %>-->
<#--                        <%= name %>-->
<#--                        <% } else { %>-->
<#--                        <i class="<%= link.icon %>"></i>-->
<#--                        <% } %>-->
<#--                    </a>-->
<#--                </p>-->
<#--                <% } %>-->
<#--                </div>-->
<#--            <% } %>-->
            </div>
        </div>
    </div>
</footer>