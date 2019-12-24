const logger = require('hexo-log')();
const { Component } = require('inferno');

module.exports = class extends Component {
    render() {
        const { config, page, helper } = this.props;
        const { share } = config;
        if (!share || typeof share.type !== 'string') {
            return null;
        }

        try {
            const Share = require('../share/' + share.type);
            return <Share config={config} page={page} helper={helper} share={share} />;
        } catch (e) {
            logger.w(`Icarus cannot load share button "${share.type}"`);
            return null;
        }
    }
};
