const createLogger = require('hexo-log');
const { Component, Fragment } = require('inferno');
const view = require('hexo-component-inferno/lib/core/view');

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
                    return <Plugin site={site} config={config} page={page} helper={helper} plugin={plugins[name]} head={head} />;
                } catch (e) {
                    logger.w(`Icarus cannot load plugin "${name}"`);
                    return null;
                }
            })}
        </Fragment>;
    }
};
