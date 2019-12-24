const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('../util/cache');

class Hotjar extends Component {
    render() {
        const { siteId } = this.props;

        const js = `(function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:${siteId},hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`;

        return <Fragment>
            <script dangerouslySetInnerHTML={{ __html: js }}></script>
        </Fragment>;
    }
}

module.exports = cacheComponent(Hotjar, 'plugin.hotjar', props => {
    const { head, plugin } = props;
    if (!head || !plugin.site_id) {
        return null;
    }
    return {
        siteId: plugin.site_id
    };
});
