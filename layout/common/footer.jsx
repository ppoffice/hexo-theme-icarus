'use strict';

const { Component } = require('inferno');
const { cacheComponent } = require('../util/cache');

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
            showVisitorCounter,
            visitorCounterTitle
        } = this.props;

        return <footer className="footer">
            <div className="container">
                <div className="level">
                    <div className="level-start has-text-centered-mobile">
                        <a className="footer-logo is-block has-mb-6" href={siteUrl}>
                            {logo && logo.text ? logo.text : <img src={logoUrl} alt={siteTitle} height="28" />}
                        </a>
                        <p className="is-size-7">
                            <span dangerouslySetInnerHTML={{ __html: `&copy; ${siteYear} ${author || siteTitle}` }}></span>
                            Powered by <a href="https://hexo.io/" target="_blank" rel="noopener">Hexo</a> &
                            <a href="https://github.com/ppoffice/hexo-theme-icarus" target="_blank" rel="noopener">Icarus</a>
                            {showVisitorCounter ? <br /> : null}
                            {showVisitorCounter ? <span id="busuanzi_container_site_uv"
                                dangerouslySetInnerHTML={{ __html: visitorCounterTitle }}></span> : null}
                        </p>
                    </div>
                    <div className="level-end">
                        {Object.keys(links).length ? <div className="field has-addons is-flex-center-mobile has-mt-5-mobile is-flex-wrap is-flex-middle">
                            {Object.keys(links).map(name => {
                                const link = links[name];
                                return <p className="control">
                                    <a className={`button is-white ${link.icon ? 'is-large' : ''}`} target="_blank" rel="noopener" title={name} href={link.url}>
                                        {link.icon ? name : <i className={link.icon}></i>}
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
    const { config, helper } = this.props;
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
        showVisitorCounter: plugins && plugins.busuanzi === true,
        visitorCounterTitle: _p('plugin.visitor', '<span id="busuanzi_value_site_uv">0</span>')
    };
});
