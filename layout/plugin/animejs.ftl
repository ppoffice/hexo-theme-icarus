<% if (plugin !== false) { %>
    <% if (head) { %>
    <style>body>.footer,body>.navbar,body>.section{opacity:0}</style>
    <% } else { %>
    <%- _js('js/animation') %>
    <% } %>
<% } %>