const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('../util/cache');

class ChangeYan extends Component {
    render() {
        const { appId, conf, path } = this.props;
        if (!appId || !conf) {
            return <div class="notification is-danger">
                You forgot to set the <code>app_id</code> or <code>conf</code> for Changyan.
                Please set it in <code>_config.yml</code>.
            </div>;
        }
        const js = `window.changyan.api.config({appid: '${appId}',conf: '${conf}'});`;
        return <Fragment>
            <div id="SOHUCS" sid={path}></div>
            <script charset="utf-8" src="https://changyan.sohu.com/upload/changyan.js"></script>
            <script dangerouslySetInnerHTML={{ __html: js }}></script>
        </Fragment>;
    }
}

module.exports = cacheComponent(ChangeYan, 'comment.changyan', props => {
    const { comment, page } = props;

    return {
        appId: comment.app_id,
        conf: comment.conf,
        path: page.path
    };
});
