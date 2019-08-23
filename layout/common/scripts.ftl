<%- _js(cdn('jquery', '3.3.1', 'dist/jquery.min.js')) %>
<%- _js(cdn('moment', '2.22.2', 'min/moment-with-locales.min.js')) %>
<script>moment.locale("<%= get_config('language', 'en') %>");</script>

<script>
var IcarusThemeSettings = {
    article: {
        highlight: {
            clipboard: <%= get_config('article.highlight.clipboard', true) %>,
            fold: '<%= get_config('article.highlight.fold', true) %>'
        }
    }
};
</script>

<% if (get_config('article.highlight.clipboard')) { %>
    <%- _js(cdn('clipboard', '2.0.4', 'dist/clipboard.min.js'), true) %>
<% } %>

<% if (has_config('plugins')) { %>
    <% for (let plugin in get_config('plugins')) { %>
    <%- partial('plugin/' + plugin, { head: false, plugin: get_config('plugins')[plugin] }) %>
    <% } %>
<% } %>

<%- _js('js/main', true) %>