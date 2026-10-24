const createLogger = require('hexo-log');
const { Component, Fragment } = require('inferno');
const view = require('hexo-component-inferno/lib/core/view');
const { renderToStaticMarkup } = require('inferno-server');
const { gateMarkup } = require('hexo-component-inferno/lib/util/consent');

// This is a declared integration boundary, not an automatic classifier of third-party resources.
const TRACKING_PLUGINS = new Set([
    'baidu_analytics', 'busuanzi', 'cnzz', 'google_analytics', 'hotjar', 'matomo',
    'statcounter', 'twitter_conversion_tracking', 'umami', 'waline_pageview'
]);

const logger = createLogger.default();

module.exports = class extends Component {
    render() {
        const { site, config, page, helper, head } = this.props;
        const { plugins = [] } = config;

        return <Fragment>
            {Object.keys(plugins).map(name => {
                // The browser notice is rendered before the navbar, not with footer plugins.
                if (!plugins[name] || name === 'outdated_browser') {
                    return null;
                }
                try {
                    let Plugin = view.require('plugin/' + name);
                    Plugin = Plugin.Cacheable ? Plugin.Cacheable : Plugin;
                    const element = <Plugin site={site} config={config} page={page} helper={helper} plugin={plugins[name]} head={head} />;
                    const consent = plugins.cookie_consent;
                    if (TRACKING_PLUGINS.has(name) && consent && ['opt-in', 'opt-out'].includes(consent.type)) {
                        const markup = renderToStaticMarkup(element);
                        if (!markup || !markup.includes('<script')) return null;
                        return <script dangerouslySetInnerHTML={{ __html: gateMarkup(name, markup, consent.type) }} />;
                    }
                    return element;
                } catch (e) {
                    logger.w(`Icarus cannot load plugin "${name}"`);
                    return null;
                }
            })}
        </Fragment>;
    }
};
