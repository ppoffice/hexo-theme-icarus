const logger = require('hexo-log')();
const { Component, Fragment } = require('inferno');

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
                    const Plugin = require('../plugin/' + name);
                    return <Plugin site={site} config={config} page={page} helper={helper} plugin={plugins[name]} head={head} />;
                } catch (e) {
                    logger.w(`Icarus cannot load plugin "${name}"`);
                    return null;
                }
            })}
        </Fragment>;
    }
};
