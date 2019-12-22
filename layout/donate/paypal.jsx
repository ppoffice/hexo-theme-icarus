'use strict';

const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('../util/cache');

class Paypal extends Component {
    render() {
        const { type, business, currencyCode, __ } = this.props;
        if (!business || !currencyCode) {
            return <div className="notification is-danger">
                You forgot to set the <code>business</code> or <code>currency_code</code> for Paypal.
                Please set it in <code>_config.yml</code>.
            </div>;
        }
        return <Fragment>
            <a className="button is-warning donate" onclick="document.getElementById('paypal-donate-form').submit()">
                <span className="icon is-small">
                    <i className="fab fa-paypal"></i>
                </span>
                <span>{__('donate.' + type)}</span>
            </a>
            <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank" rel="noopener" id="paypal-donate-form">
                <input type="hidden" name="cmd" value="_donations" />
                <input type="hidden" name="business" value={business} />
                <input type="hidden" name="currency_code" value={currencyCode} />
            </form>
        </Fragment>;
    }
}

module.exports = cacheComponent(Paypal, 'donate.paypal', props => {
    return {
        type: props.type,
        business: props.business,
        currencyCode: props.currency_code,
        __: props.__,
        url_for: props.url_for
    };
});
