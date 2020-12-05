const logger = require('hexo-log')();
const { Component } = require('inferno');
const view = require('hexo-component-inferno/lib/core/view');

module.exports = class extends Component {
    render() {
        const { config, helper } = this.props;
        const { __ } = helper;
        const { donates = [] } = config;
        if (!Array.isArray(donates) || !donates.length) {
            return null;
        }
        return <div class="card">
            <div class="card-content">
                <h3 class="menu-label has-text-centered">{__('donate.title')}</h3>
                <div class="buttons is-centered">
                    {donates.map(service => {
                        const type = service.type;
                        if (typeof type === 'string') {
                            try {
                                let Donate = view.require('donate/' + type);
                                Donate = Donate.Cacheable ? Donate.Cacheable : Donate;
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
