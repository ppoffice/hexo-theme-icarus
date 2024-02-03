const createLogger = require('hexo-log');
const { Component } = require('inferno');
const view = require('hexo-component-inferno/lib/core/view');

const logger = createLogger.default();

module.exports = class extends Component {
    render() {
        const { config, page, helper } = this.props;
        const { share } = config;
        if (!share || typeof share.type !== 'string') {
            return null;
        }

        try {
            let Share = view.require('share/' + share.type);
            Share = Share.Cacheable ? Share.Cacheable : Share;
            return <Share config={config} page={page} helper={helper} share={share} />;
        } catch (e) {
            logger.w(`Icarus cannot load share button "${share.type}"`);
            return null;
        }
    }
};
