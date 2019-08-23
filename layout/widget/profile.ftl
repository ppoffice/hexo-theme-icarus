<div class="card widget">
    <div class="card-content">
        <nav class="level">
            <div class="level-item has-text-centered" style="flex-shrink: 1">
                <div>
                    <#if (settings.profile_avatar_type!'avatar_square')=='avatar_rounded'>
                        <figure class="image is-128x128 has-mb-6">
                            <img class="is-rounded" src="${user.avatar!}" alt="${user.nickname!}">
                        </figure>
                    <#else>
                        <img class="image is-128x128 has-mb-6" src="${user.avatar!}" alt="${user.nickname!}">
                    </#if>
                    <p class="is-size-4 is-block">
                        ${user.nickname!}
                    </p>
                    <p class="is-size-6 is-block">
                        ${user.description!}
                    </p>
                    <#if settings.profile_location?? && settings.profile_location!=''>
                    <p class="is-size-6 is-flex is-flex-center has-text-grey">
                        <i class="fas fa-map-marker-alt has-mr-7"></i>
                        <span>${settings.profile_location!}</span>
                    </p>
                    </#if>
                </div>
            </div>
        </nav>
        <nav class="level is-mobile">
            <div class="level-item has-text-centered is-marginless">
                <div>
                    <p class="heading">
                        文章
                    </p>
                    <p class="title has-text-weight-normal">
                        <@postTag method="count">${count}</@postTag>
                    </p>
                </div>
            </div>
            <div class="level-item has-text-centered is-marginless">
                <div>
                    <p class="heading">
                        分类
                    </p>
                    <p class="title has-text-weight-normal">
                        <@categoryTag method="count">${count}</@categoryTag>
                    </p>
                </div>
            </div>
            <div class="level-item has-text-centered is-marginless">
                <div>
                    <p class="heading">
                        标签
                    </p>
                    <p class="title has-text-weight-normal">
                        <@tagTag method="count">${count}</@tagTag>
                    </p>
                </div>
            </div>
        </nav>
        <div class="level">
            <a class="level-item button is-link is-rounded" href="${settings.profile_follow_url!'${context!}'}" target="_blank">关注我</a>
        </div>
<#--        <% const socialLinks = get_config_from_obj(widget, 'social_links'); %>-->
<#--        <% if (socialLinks !== null) { %>-->
<#--        <div class="level is-mobile">-->
<#--            <% for (let name in socialLinks) {-->
<#--                    let link = socialLinks[name]; %>-->
<#--            <a class="level-item button is-white is-marginless" target="_blank"-->
<#--                title="<%= name %>" href="<%= url_for(typeof(link) === 'string' ? link : link.url) %>">-->
<#--                <% if (typeof(link) === 'string') { %>-->
<#--                <%= name %>-->
<#--                <% } else { %>-->
<#--                <i class="<%= link.icon %>"></i>-->
<#--                <% } %>-->
<#--            </a>-->
<#--            <% } %>-->
<#--        </div>-->
<#--        <% } %>-->
    </div>
</div>