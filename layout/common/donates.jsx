const logger = require('hexo-log')();
const { Component } = require('inferno');

module.exports = class extends Component {
    render() {
        const { config, helper } = this.props;
        const { __ } = helper;
        const { donate = [] } = config;
        if (!Array.isArray(donate) || !donate.length) {
            return null;
        }
        return <div class="card">
            <div class="card-content">
                <h3 class="menu-label has-text-centered">{__('donate.title')}</h3>
                <div class="buttons is-centered">
                    {donate.map(service => {
                        const type = service.type;
                        if (typeof type === 'string') {
                            try {
                                const Donate = require('../donate/' + type);
                                return <Donate helper={helper} donate={service} />;
                            } catch (e) {
                                logger.w(`Icarus cannot load donate button "${type}"`);
                            }
                        }
                        return null;
                    })}
                </div>
            </div>
        </div>;
    }
};
