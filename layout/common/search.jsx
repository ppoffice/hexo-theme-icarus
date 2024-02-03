const createLogger = require('hexo-log');
const { Component } = require('inferno');
const view = require('hexo-component-inferno/lib/core/view');

const logger = createLogger.default();

module.exports = class extends Component {
    render() {
        const { config, helper } = this.props;
        const { search } = config;
        if (!search || typeof search.type !== 'string') {
            return null;
        }

        try {
            let Search = view.require('search/' + search.type);
            Search = Search.Cacheable ? Search.Cacheable : Search;
            return <Search config={config} helper={helper} search={search} />;
        } catch (e) {
            logger.w(`Icarus cannot load search "${search.type}"`);
            return null;
        }
    }
};
