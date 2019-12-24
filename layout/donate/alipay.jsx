const { Component } = require('inferno');
const { cacheComponent } = require('../util/cache');

class Alipay extends Component {
    render() {
        const { title, qrcode, url_for } = this.props;
        if (!qrcode) {
            return <div class="notification is-danger">
                You forgot to set the <code>qrcode</code> for Alipay.
                Please set it in <code>_config.yml</code>.
            </div>;
        }
        return <a class="button is-info donate">
            <span class="icon is-small">
                <i class="fab fa-alipay"></i>
            </span>
            <span>{title}</span>
            <span class="qrcode"><img src={url_for(qrcode)} alt={title} /></span>
        </a>;
    }
}

module.exports = cacheComponent(Alipay, 'donate.alipay', props => {
    const { donate, helper } = props;

    return {
        qrcode: donate.qrcode,
        title: helper.__('donate.' + donate.type),
        url_for: helper.url_for
    };
});
