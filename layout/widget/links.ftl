<@linkTag method="list">
    <#if links?? && links?size gt 0>
        <div class="card widget">
            <div class="card-content">
                <div class="menu">
                <h3 class="menu-label">
                    链接
                </h3>
                <ul class="menu-list">
                    <#list links as link>
                        <li>
                            <a class="level is-mobile" href="${link.url!}" target="_blank">
                                <span class="level-left">
                                    <span class="level-item">${link.name}</span>
                                </span>
                                <span class="level-right">
                                    <span class="level-item tag">${link.url!}</span>
                                </span>
                            </a>
                        </li>
                    </#list>
                </ul>
                </div>
            </div>
        </div>
    </#if>
</@linkTag>
