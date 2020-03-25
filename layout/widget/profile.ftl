<div class="card widget">
    <div class="card-content">
        <nav class="level">
            <div class="level-item has-text-centered" style="flex-shrink: 1">
                <div>
                    <figure class="image is-128x128 has-mb-6">
                        <img class="${((settings.profile_avatar_type!'avatar_square')=='avatar_rounded')?string('is-rounded','')}" src="${user.avatar!}" alt="${user.nickname!}">
                    </figure>
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
            <a class="level-item button is-link is-rounded" href="${settings.profile_follow_url!'${blog_url!}'}" target="_blank">关注我</a>
        </div>
        <div class="level is-mobile">
            <#if settings.social_github?? && settings.social_github!=''>
                <a class="level-item button is-white is-marginless" target="_blank" title="Github" href="https://github.com/${settings.social_github}">
                    <i class="fab fa-github"></i>
                </a>
            </#if>
            <#if settings.social_qq?? && settings.social_qq!=''>
                <a class="level-item button is-white is-marginless" target="_blank" title="QQ" href="tencent://message/?uin=${settings.social_qq}&Site=&Menu=yes">
                    <i class="fab fa-qq"></i>
                </a>
            </#if>
            <#if settings.social_weibo?? && settings.social_weibo!=''>
                <a class="level-item button is-white is-marginless" target="_blank" title="Weibo" href="https://weibo.com/${settings.social_weibo}">
                    <i class="fab fa-weibo"></i>
                </a>
            </#if>
            <#if settings.social_twitter?? && settings.social_twitter!=''>
                <a class="level-item button is-white is-marginless" target="_blank" title="Twitter" href="https://twitter.com/${settings.social_twitter}">
                    <i class="fab fa-twitter"></i>
                </a>
            </#if>
            <#if settings.social_facebook?? && settings.social_facebook!=''>
                <a class="level-item button is-white is-marginless" target="_blank" title="Facebook" href="https://www.facebook.com/${settings.social_facebook}">
                    <i class="fab fa-facebook"></i>
                </a>
            </#if>
            <#if settings.social_email?? && settings.social_email!=''>
                <a class="level-item button is-white is-marginless" target="_blank" title="Email" href="mailto:${settings.social_email}">
                    <i class="fas fa-envelope"></i>
                </a>
            </#if>
            <#if settings.social_telegram?? && settings.social_telegram!=''>
                <a class="level-item button is-white is-marginless" target="_blank" title="Telegram" href="https://t.me/${settings.social_telegram}">
                    <i class="fab fa-telegram"></i>
                </a>
            </#if>
            <a class="level-item button is-white is-marginless" target="_blank" title="RSS" href="${atom_url!}">
                <i class="fas fa-rss"></i>
            </a>
        </div>
    </div>
</div>