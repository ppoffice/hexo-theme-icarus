const logger = require('hexo-log')();
const { Component, Fragment } = require('inferno');
const view = require('hexo-component-inferno/lib/core/view');

module.exports = class extends Component {
    render() {
        const { site, config, page, helper, head } = this.props;
        const { plugins = [] } = config;

        return <Fragment>
            {Object.keys(plugins).map(name => {
                // plugin is not enabled
                if (!plugins[name]) {
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
