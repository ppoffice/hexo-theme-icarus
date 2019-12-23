'use strict';

const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('../util/cache');

class Valine extends Component {
    render() {
        const { appId, appKey, notify, verify, placeholder } = this.props;
        if (!appId || !appKey) {
            return <div className="notification is-danger">
                You forgot to set the <code>app_id</code> or <code>app_key</code> for Valine.
                Please set it in <code>_config.yml</code>.
            </div>;
        }
        const js = `new Valine({
            el: '#valine-thread' ,
            notify: ${notify},
            verify: ${verify},
            app_id: '${appId}',
            app_key: '${appKey}',
            placeholder: '${placeholder}'
        });`;
        return <Fragment>
            <div id="valine-thread" className="content"></div>
            <script src="//cdn1.lncld.net/static/js/3.0.4/av-min.js"></script>
            <script src='//unpkg.com/valine/dist/Valine.min.js'></script>
            <script dangerouslySetInnerHTML={{ __html: js }}></script>
        </Fragment>;
    }
}

module.exports = cacheComponent(Valine, 'comment.valine', props => {
    const { comment } = props;

    return {
        appId: comment.app_id,
        appKey: comment.app_key,
        notify: comment.notify,
        verify: comment.verify,
        placeholder: comment.placeholder
    };
});
