const { Component } = require('inferno');
const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');

class Footer extends Component {
    render() {
        const {
            logo,
            logoUrl,
            siteUrl,
            siteTitle,
            siteYear,
            author,
            links,
            copyright,
            showVisitorCounter,
            visitorCounterTitle
        } = this.props;

        let footerLogo = '';
        if (logo) {
            if (logo.text) {
                footerLogo = logo.text;
            } else {
                footerLogo = <img src={logoUrl} alt={siteTitle} height="28" />;
            }
        } else {
            footerLogo = siteTitle;
        }

        return <footer class="footer">
            <div class="container">
                <div class="level">
                    <div class="level-start">
                        <a class="footer-logo is-block mb-2" href={siteUrl}>
                            {footerLogo}
                        </a>
                        <p class="is-size-7">
                            <span dangerouslySetInnerHTML={{ __html: `&copy; ${siteYear} ${author || siteTitle}` }}></span>
                            &nbsp;&nbsp;Powered by <a href="https://hexo.io/" target="_blank" rel="noopener">Hexo</a>&nbsp;&&nbsp;
                            <a href="https://github.com/ppoffice/hexo-theme-icarus" target="_blank" rel="noopener">Icarus</a>
                            {showVisitorCounter ? <br /> : null}
                            {showVisitorCounter ? <span id="busuanzi_container_site_uv"
                                dangerouslySetInnerHTML={{ __html: visitorCounterTitle }}></span> : null}
                        </p>
                        {copyright ? <p class="is-size-7" dangerouslySetInnerHTML={{ __html: copyright }}></p> : null}
                    </div>
                    <div class="level-end">
                        {Object.keys(links).length ? <div class="field has-addons">
                            {Object.keys(links).map(name => {
                                const link = links[name];
                                return <p class="control">
                                    <a class={`button is-transparent ${link.icon ? 'is-large' : ''}`} target="_blank" rel="noopener" title={name} href={link.url}>
                                        {link.icon ? <i class={link.icon}></i> : name}
                                    </a>
                                </p>;
                            })}
                        </div> : null}
                    </div>
                </div>
            </div>
        </footer>;
    }
}

module.exports = cacheComponent(Footer, 'common.footer', props => {
    const { config, helper } = props;
    const { url_for, _p, date } = helper;
    const { logo, title, author, footer, plugins } = config;

    const links = {};
    if (footer && footer.links) {
        Object.keys(footer.links).forEach(name => {
            const link = footer.links[name];
            links[name] = {
                url: url_for(typeof link === 'string' ? link : link.url),
                icon: link.icon
            };
        });
    }

    return {
        logo,
        logoUrl: url_for(logo),
        siteUrl: url_for('/'),
        siteTitle: title,
        siteYear: date(new Date(), 'YYYY'),
        author,
        links,
        copyright: footer?.copyright ?? '',
        showVisitorCounter: plugins && plugins.busuanzi === true,
        visitorCounterTitle: _p('plugin.visitor_count', '<span id="busuanzi_value_site_uv">0</span>')
    };
});
