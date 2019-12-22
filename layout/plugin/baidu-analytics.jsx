'use strict';

const { Component } = require('inferno');
const { cacheComponent } = require('../util/cache');

class BaiduAnalytics extends Component {
    render() {
        const { trackingId } = this.props;

        const js = `var _hmt = _hmt || [];
        (function() {
            var hm = document.createElement("script");
            hm.src = "//hm.baidu.com/hm.js?${trackingId}";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
        })();`;

        return <script dangerouslySetInnerHTML={{ __html: js }}></script>;
    }
}

module.exports = cacheComponent(BaiduAnalytics, 'plugin.baiduanalytics', props => {
    if (!props.head || !props.tracking_id) {
        return null;
    }
    return {
        trackingId: props.tracking_id
    };
});
