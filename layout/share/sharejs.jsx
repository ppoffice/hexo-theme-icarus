const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('../util/cache');

class ShareJs extends Component {
    render() {
        const { cssUrl, jsUrl } = this.props;
        return <Fragment>
            <link rel="stylesheet" href={cssUrl} />
            <div class="social-share"></div>
            <script src={jsUrl}></script>
        </Fragment>;
    }
}

module.exports = cacheComponent(ShareJs, 'share.sharejs', props => {
    const { helper } = props;

    return {
        cssUrl: helper.cdn('social-share.js', '1.0.16', 'dist/css/share.min.css'),
        jsUrl: helper.cdn('social-share.js', '1.0.16', 'dist/js/social-share.min.js')
    };
});
