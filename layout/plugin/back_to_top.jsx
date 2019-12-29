const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('../util/cache');

class BackToTop extends Component {
    render() {
        const { title, jsUrl } = this.props;

        return <Fragment>
            <a id="back-to-top" title={title} href="javascript:;">
                <i class="fas fa-chevron-up"></i>
            </a>
            <script src={jsUrl} defer={true}></script>
        </Fragment>;

    }
}

module.exports = cacheComponent(BackToTop, 'plugin.backtotop', props => {
    const { helper, head } = props;
    if (head) {
        return null;
    }
    return {
        title: helper.__('plugin.backtotop'),
        jsUrl: helper.url_for('/js/back-to-top.js')
    };
});
