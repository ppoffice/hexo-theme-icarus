const { Component } = require('inferno');
const { cacheComponent } = require('../util/cache');

class Wechat extends Component {
    render() {
        const { title, qrcode } = this.props;
        if (!qrcode) {
            return <div class="notification is-danger">
                You forgot to set the <code>qrcode</code> for Wechat.
                Please set it in <code>_config.yml</code>.
            </div>;
        }
        return <a class="button is-success donate">
            <span class="icon is-small">
                <i class="fab fa-weixin"></i>
            </span>
            <span>{title}</span>
            <span class="qrcode"><img src={qrcode} alt={title} /></span>
        </a>;
    }
}

module.exports = cacheComponent(Wechat, 'donate.wechat', props => {
    const { donate, helper } = props;

    return {
        qrcode: helper.url_for(donate.qrcode),
        title: helper.__('donate.' + donate.type)
    };
});
