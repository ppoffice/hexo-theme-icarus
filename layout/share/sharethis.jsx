const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('../util/cache');

class ShareThis extends Component {
    render() {
        const { installUrl } = this.props;
        if (!installUrl) {
            return <div class="notification is-danger">
                You need to set <code>install_url</code> to use ShareThis.
                Please set it in <code>_config.yml</code>.
            </div>;
        }
        return <Fragment>
            <div class="sharethis-inline-share-buttons"></div>
            <script src={installUrl} defer={true}></script>
        </Fragment>;
    }
}

module.exports = cacheComponent(ShareThis, 'share.sharethis', props => {
    const { share } = props;

    return {
        installUrl: share.install_url
    };
});
