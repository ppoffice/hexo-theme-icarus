'use strict';

const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('../util/cache');

class ShareJs extends Component {
    render() {
        const { cdn } = this.props;
        return <Fragment>
            <link rel="stylesheet" href={cdn('social-share.js', '1.0.16', 'dist/css/share.min.css')} />
            <div class="social-share"></div>
            <script src={cdn('social-share.js', '1.0.16', 'dist/js/social-share.min.js')}></script>
        </Fragment>;
    }
}

module.exports = cacheComponent(ShareJs, 'share.sharejs', props => {
    return {
        cdn: props.cdn,
        // for cache purpose only
        _providers: props.providers.cdn
    };
});
