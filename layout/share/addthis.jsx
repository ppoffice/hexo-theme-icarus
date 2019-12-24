const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('../util/cache');

class AddThis extends Component {
    render() {
        const { installUrl } = this.props;
        if (!installUrl) {
            return <div class="notification is-danger">
                You need to set <code>install_url</code> to use AddThis.
                Please set it in <code>_config.yml</code>.
            </div>;
        }
        return <Fragment>
            <div class="addthis_inline_share_toolbox"></div>
            <script src={installUrl} defer={true}></script>
        </Fragment>;
    }
}

module.exports = cacheComponent(AddThis, 'share.addthis', props => {
    const { share } = props;

    return {
        installUrl: share.install_url
    };
});
