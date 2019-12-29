const { Component } = require('inferno');
const { cacheComponent } = require('../util/cache');

class BuyMeACoffee extends Component {
    render() {
        const { title, url } = this.props;
        if (!url) {
            return <div class="notification is-danger">
                You forgot to set the <code>url</code> for &quot;Buy me a coffee&quot;.
                Please set it in <code>_config.yml</code>.
            </div>;
        }
        return <a class="button donate" href={url} style={{
            'background-color': 'rgba(255,128,62,.87)',
            'border-color': 'transparent',
            'color': 'white'
        }} target="_blank" rel="noopener">
            <span class="icon is-small">
                <i class="fas fa-coffee"></i>
            </span>
            <span>{title}</span>
        </a>;
    }
}

module.exports = cacheComponent(BuyMeACoffee, 'donate.buymeacoffee', props => {
    const { donate, helper } = props;

    return {
        url: helper.url_for(donate.url),
        title: helper.__('donate.' + donate.type)
    };
});
