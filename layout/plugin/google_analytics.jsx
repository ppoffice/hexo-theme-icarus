const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('../util/cache');

class GoogleAnalytics extends Component {
    render() {
        const { trackingId } = this.props;

        const js = `window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
    
        gtag('config', '${trackingId}');`;

        return <Fragment>
            <script src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`} async={true}></script>
            <script dangerouslySetInnerHTML={{ __html: js }}></script>
        </Fragment>;
    }
}

module.exports = cacheComponent(GoogleAnalytics, 'plugin.googleanalytics', props => {
    const { head, plugin } = props;
    if (!head || !plugin.tracking_id) {
        return null;
    }
    return {
        trackingId: plugin.tracking_id
    };
});
