'use strict';

const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('../util/cache');

class BackToTop extends Component {
    render() {
        const { head, title, url_for } = this.props;

        if (head) {
            return <link rel="stylesheet" href={url_for('/css/back-to-top.css')} />;
        }
        return <Fragment>
            <a id="back-to-top" title={title} href="javascript:;">
                <i className="fas fa-chevron-up"></i>
            </a>
            <script src={url_for('/js/back-to-top.js')} defer={true}></script>
        </Fragment>;

    }
}

module.exports = cacheComponent(BackToTop, 'plugin.backtotop', props => {
    return {
        head: props.head,
        title: props.__('plugin.backtotop'),
        url_for: props.url_for
    };
});
