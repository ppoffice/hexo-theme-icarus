'use strict';

const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('../util/cache');

class BackToTop extends Component {
    render() {
        const { head, __, url_for } = this.props;

        if (head) {
            return <link rel="stylesheet" href={url_for('/css/back-to-top.css')} />;
        }
        return <Fragment>
            <a id="back-to-top" title={__('plugin.backtotop')} href="javascript:;">
                <i className="fas fa-chevron-up"></i>
            </a>
            <script src={url_for('/js/back-to-top.js')} defer={true}></script>
        </Fragment>;

    }
}

module.exports = cacheComponent(BackToTop, 'plugin.backtotop', props => {
    return {
        head: props.head,
        __: props.__,
        url_for: props.url_for,
        // for cache purpose only
        _language: props.page.lang || props.page.language || props.language
    };
});
