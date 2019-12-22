'use strict';

const { Component } = require('inferno');
const { cacheComponent } = require('../util/cache');

class Alipay extends Component {
    render() {
        const { type, qrcode, __, url_for } = this.props;
        if (!qrcode) {
            return <div className="notification is-danger">
                You forgot to set the <code>qrcode</code> for Alipay.
                Please set it in <code>_config.yml</code>.
            </div>;
        }
        return <a className="button is-info donate">
            <span className="icon is-small">
                <i className="fab fa-alipay"></i>
            </span>
            <span>{__('donate.' + type)}</span>
            <span className="qrcode"><img src={url_for(qrcode)} alt={__('donate.' + type)} /></span>
        </a>;
    }
}

module.exports = cacheComponent(Alipay, 'donate.alipay', props => {
    return {
        type: props.type,
        qrcode: props.qrcode,
        __: props.__,
        url_for: props.url_for,
        // for cache purpose only
        _language: props.page.lang || props.page.language || props.language
    };
});
