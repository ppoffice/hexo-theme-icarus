<#macro layout title,canonical>
<#include "common/navbar.ftl">
<#include "common/widget.ftl">
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <title>${title!}</title>

    <meta name="keywords" content="${meta_keywords!}"/>
    <meta name="description" content="${meta_description!}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${title!}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:site_name" content="${title!}">
    <meta property="og:description" content="${meta_description!}">
    <meta property="og:locale" content="zh">
    <meta property="og:image" content="${user.avatar!}">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="${title!}">
    <meta name="twitter:description" content="${meta_description!}">
    <meta name="twitter:image" content="${user.avatar!}">

    <link rel="canonical" href="${canonical!}" />

    <link rel="alternative" href="${atom_url!}" title="${blog_title!}" type="application/atom+xml">

    <@global.head />

    <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/bulma@0.7.5/css/bulma.min.css">
    <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.4.1/css/all.min.css">
    <link rel="stylesheet" href="//fonts.loli.net/css?family=Ubuntu:400,600|Source+Code+Pro">
    <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/highlight.js@9.12.0/styles/atom-one-light.css">

    <style>
        body>.footer,
        body>.navbar,
        body>.section {
            opacity: 0
        }
    </style>

    <#if is_post?? || is_sheet??>
        <style>
            .content code .number{
                background-color: transparent;
                border-radius: 0;
                display: unset;
                font-size: .85em;
                margin-right: 0;
                padding:0;
                vertical-align: unset;
            }
        </style>
    </#if>

    <#if is_post?? || is_sheet??>
        <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/lightgallery@1.6.8/dist/css/lightgallery.min.css">
        <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/justifiedGallery@3.7.0/dist/css/justifiedGallery.min.css">
    </#if>
    <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/outdatedbrowser@1.1.5/outdatedbrowser/outdatedbrowser.min.css">

    <script src="//cdn.jsdelivr.net/npm/pace-js@1.0.2/pace.min.js"></script>

    <link rel="stylesheet" href="${theme_base!}/source/css/style.css">
    <link rel="stylesheet" href="${theme_base!}/source/css/bundle.css">

    <#if post??>
        <link rel="stylesheet" type="text/css" href="${theme_base!}/source/lib/prism/css/prism-${settings.code_pretty!'Default'}.css" />
        <script type="text/javascript" src="${theme_base!}/source/lib/prism/js/prism.js"></script>
    </#if>
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

    <#include "search/local.ftl">
</body>
</html>
</#macro>