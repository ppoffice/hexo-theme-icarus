<script src="//cdn.jsdelivr.net/npm/jquery@3.3.1/dist/jquery.min.js"></script>

<script>
var IcarusThemeSettings = {
    article: {
        highlight: {
            clipboard: !0,
            fold: "unfolded"
        }
    }
};
</script>

<#if settings.highlight_clipboard!true>
    <script src="//cdn.jsdelivr.net/npm/clipboard@2.0.4/dist/clipboard.min.js" defer></script>
</#if>

<#include "../plugin/gallery.ftl">
<#include "../plugin/outdated-browser.ftl">
<#include "../plugin/mathjax.ftl">
<#include "../plugin/back-to-top.ftl">


<script src="${static!}/source/js/bundle.js"></script>