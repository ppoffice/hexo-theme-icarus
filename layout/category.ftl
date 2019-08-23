<div class="card">
    <div class="card-content">
        <nav class="breadcrumb" aria-label="breadcrumbs">
        <ul>
            <li><a href="${context!}/categories">分类></a></li>
            <% page.parents.forEach(category => { %>
            <li><a href="<%- url_for(category.path) %>"><%= category.name %></a></li>
            <% }) %>
            <li class="is-active"><a href="#" aria-current="page">${category.name}</a></li>
        </ul>
        </nav>
    </div>
</div>
<%- partial('index', { page }) %>