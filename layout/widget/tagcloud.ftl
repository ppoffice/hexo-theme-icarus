<@tagTag method="list">
    <#if tags?? && tags?size gt 0>
        <div class="card widget">
            <div class="card-content">
                <h3 class="menu-label">
                    标签云
                </h3>
                <#list tags as tag>
                    <a href="${tag.fullPath!}" style="font-size:${tag.postCount+tag.name?length+tag.slug?length}px">${tag.name!}</a>
                </#list>
            </div>
        </div>
    </#if>
</@tagTag>