<footer class="footer">
    <div class="container">
        <div class="level">
            <div class="level-start has-text-centered-mobile">
                <a class="footer-logo is-block has-mb-6" href="${context!}">
                    <#if options.blog_logo?? && options.blog_logo!=''>
                        <img src="${options.blog_logo!}" alt="${options.blog_title!}" height="28">
                    <#else>
                        ${options.blog_title!}
                    </#if>
                </a>
                <p class="is-size-7">
                    &copy; ${.now?string('yyyy')} ${user.nickname!}&nbsp;
                    Powered by <a href="https://halo.run/" target="_blank">Halo</a> & <a
                            href="https://github.com/halo-dev/halo-theme-icarus" target="_blank">Icarus</a>
                    <br />
                    <@global.footer />
                </p>
            </div>
            <div class="level-end">
                <div class="field has-addons is-flex-center-mobile has-mt-5-mobile is-flex-wrap is-flex-middle">
                    ${settings.links_footer!}
                </div>
            </div>
        </div>
    </div>
</footer>