const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');

class BackToTop extends Component {
    render() {
        const { title, jsUrl } = this.props;

        return <Fragment>
            <button type="button" id="back-to-top" title={title} aria-label={title}>
                <i class="fas fa-chevron-up" aria-hidden="true"></i>
            </button>
            <script data-pjax src={jsUrl} defer></script>
        </Fragment>;

    }
}

BackToTop.Cacheable = cacheComponent(BackToTop, 'plugin.backtotop', props => {
    const { helper, head } = props;
    if (head) {
        return null;
    }
    return {
        title: helper.__('plugin.backtotop'),
        jsUrl: helper.url_for('/js/back_to_top.js')
    };
});

module.exports = BackToTop;
