'use strict';

const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('../util/cache');

class ShareJs extends Component {
    render() {
        const { cssUrl, jsUrl } = this.props;
        return <Fragment>
            <link rel="stylesheet" href={cssUrl} />
            <div className="social-share"></div>
            <script src={jsUrl}></script>
        </Fragment>;
    }
}

module.exports = cacheComponent(ShareJs, 'share.sharejs', props => {
    return {
        cssUrl: props.cdn('social-share.js', '1.0.16', 'dist/css/share.min.css'),
        jsUrl: props.cdn('social-share.js', '1.0.16', 'dist/js/social-share.min.js')
    };
});
