<#macro layout title,keywords,description,canonical>
<#include "common/navbar.ftl">
<#include "common/widget.ftl">
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <title>${title!}</title>

    <meta name="keywords" content="${keywords!}"/>
    <meta name="description" content="${description!}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${title!}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:site_name" content="${title!}">
    <meta property="og:description" content="${description!}">
    <meta property="og:locale" content="zh">
    <meta property="og:image" content="http://ppoffice.github.io/hexo-theme-icarus/images/og_image.png">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="${title!}">
    <meta name="twitter:description" content="${description!}">
    <meta name="twitter:image" content="http://ppoffice.github.io/hexo-theme-icarus/images/og_image.png">

    <link rel="canonical" href="${canonical!}" />

    <link rel="alternative" href="${context!}/atom.xml" title="${options.blog_title!}" type="application/atom+xml">

    <@global.head />

    <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/bulma@0.7.2/css/bulma.css">
    <link rel="stylesheet" href="//use.fontawesome.com/releases/v5.4.1/css/all.css">
    <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Ubuntu:400,600|Source+Code+Pro">
    <#--<%- _css(cdn('highlight.js', '9.12.0', 'styles/' + get_config('article.highlight.theme') + '.css')) %>-->
    <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/highlight.js@9.12.0/styles/atom-one-light.css">

    <style>
        body>.footer,
        body>.navbar,
        body>.section {
            opacity: 0
        }
    </style>

    <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/lightgallery@1.6.8/dist/css/lightgallery.min.css">
    <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/justifiedGallery@3.7.0/dist/css/justifiedGallery.min.css">
    <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/outdatedbrowser@1.1.5/outdatedbrowser/outdatedbrowser.min.css">

    <script src="//cdn.jsdelivr.net/npm/pace-js@1.0.2/pace.min.js"></script>

    <link rel="stylesheet" href="${static!}/source/css/style.css">
    <link rel="stylesheet" href="${static!}/source/css/bundle.css">
</head>
<body class="is-3-column">
    <@navbar 'page' />
    <section class="section">
        <div class="container">
            <div class="columns">
                <div class="column is-8-tablet is-8-desktop is-6-widescreen has-order-2 column-main">
                    <#nested />
                </div>
                <@widget 'left' />
                <@widget 'right' />
            </div>
        </div>
    </section>
    <#include "common/footer.ftl">
    <#include "common/scripts.ftl">

<#--    <% if (has_config('search.type')) { %>-->
<#--    <%- partial('search/' + get_config('search.type')) %>-->
<#--    <% } %>-->
</body>
</html>
</#macro>