'use strict';

const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('../util/cache');

class Paypal extends Component {
    render() {
        const { title, business, currencyCode } = this.props;
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
                <span>{title}</span>
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
        business: props.business,
        currencyCode: props.currency_code,
        title: props.__('donate.' + props.type),
        url_for: props.url_for
    };
});
