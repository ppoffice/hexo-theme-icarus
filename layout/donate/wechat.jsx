'use strict';

const { Component } = require('inferno');
const { cacheComponent } = require('../util/cache');

class Wechat extends Component {
    render() {
        const { title, qrcode, url_for } = this.props;
        if (!qrcode) {
            return <div className="notification is-danger">
                You forgot to set the <code>qrcode</code> for Wechat.
                Please set it in <code>_config.yml</code>.
            </div>;
        }
        return <a className="button is-info donate">
            <span className="icon is-small">
                <i className="fab fa-weixin"></i>
            </span>
            <span>{title}</span>
            <span className="qrcode"><img src={url_for(qrcode)} alt={title} /></span>
        </a>;
    }
}

module.exports = cacheComponent(Wechat, 'donate.wechat', props => {
    const { donate, helper } = props;

    return {
        qrcode: donate.qrcode,
        title: helper.__('donate.' + donate.type),
        url_for: helper.url_for
    };
});
