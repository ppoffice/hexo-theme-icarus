const logger = require('hexo-log')();
const { Component } = require('inferno');
const view = require('hexo-component-inferno/lib/core/view');

module.exports = class extends Component {
    render() {
        const { config, helper } = this.props;
        const { search } = config;
        if (!search || typeof search.type !== 'string') {
            return null;
        }

        try {
            const Search = view.require('search/' + search.type);
            return <Search config={config} helper={helper} search={search} />;
        } catch (e) {
            logger.w(`Icarus cannot load search "${search.type}"`);
            return null;
        }
    }
};
