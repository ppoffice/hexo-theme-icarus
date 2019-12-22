'use strict';

const { Component } = require('inferno');
const { cacheComponent } = require('../util/cache');

class Wechat extends Component {
    render() {
        const { type, qrcode, __, url_for } = this.props;
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
            <span>{__('donate.' + type)}</span>
            <span className="qrcode"><img src={url_for(qrcode)} alt={__('donate.' + type)} /></span>
        </a>;
    }
}

module.exports = cacheComponent(Wechat, 'donate.wechat', props => {
    return {
        type: props.type,
        qrcode: props.qrcode,
        __: props.__,
        url_for: props.url_for
    };
});
