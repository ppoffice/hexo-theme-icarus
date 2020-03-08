<div class="card widget">
    <div class="card-content">
        <div class="menu">
            <h3 class="menu-label">
                标签
            </h3>
            <div class="field is-grouped is-grouped-multiline">
                <@tagTag method="list">
                    <#list tags as tag>
                        <div class="control">
                            <a class="tags has-addons" href="${tag.fullPath!}">
                                <span class="tag">${tag.name}</span>
                                <span class="tag is-grey">${tag.postCount!}</span>
                            </a>
                        </div>
                    </#list>
                </@tagTag>
            </div>
        </div>
    </div>
</div>