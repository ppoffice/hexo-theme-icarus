<div class="card widget">
    <div class="card-content">
        <div class="menu">
            <h3 class="menu-label">
                分类
            </h3>
            <ul class="menu-list">
                <@categoryTag method="list">
                    <#list categories as category>
                        <li>
                            <a class="level is-marginless" href="${category.fullPath!}">
                                <span class="level-start">
                                    <span class="level-item">${category.name}</span>
                                </span>
                                <span class="level-end">
                                    <span class="level-item tag">${category.postCount}</span>
                                </span>
                            </a>
                        </li>
                    </#list>
                </@categoryTag>
            </ul>
        </div>
    </div>
</div>