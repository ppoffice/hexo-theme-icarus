const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('../util/cache');

class Valine extends Component {
    render() {
        const {
            appId,
            appKey,
            notify,
            verify,
            placeholder,
            avatar = 'mm',
            avatarForce = false,
            meta = ['nick', 'mail', 'link'],
            pageSize = 10,
            visitor = false,
            highlight = true,
            recordIp = false,
            jsUrl
        } = this.props;
        if (!appId || !appKey) {
            return <div class="notification is-danger">
                You forgot to set the <code>app_id</code> or <code>app_key</code> for Valine.
                Please set it in <code>_config.yml</code>.
            </div>;
        }
        const js = `new Valine({
            el: '#valine-thread' ,
            notify: ${notify},
            verify: ${verify},
            appId: '${appId}',
            appKey: '${appKey}',
            placeholder: '${placeholder}',
            avatar: '${avatar}',
            avatarForce: ${avatarForce},
            meta: ${JSON.stringify(meta)},
            pageSize: ${pageSize},
            visitor: ${visitor},
            highlight: ${highlight},
            recordIP: ${recordIp}
        });`;
        return <Fragment>
            <div id="valine-thread" class="content"></div>
            <script src="//cdn1.lncld.net/static/js/3.0.4/av-min.js"></script>
            <script src={jsUrl}></script>
            <script dangerouslySetInnerHTML={{ __html: js }}></script>
        </Fragment>;
    }
}

module.exports = cacheComponent(Valine, 'comment.valine', props => {
    const { comment, helper } = props;

    return {
        appId: comment.app_id,
        appKey: comment.app_key,
        notify: comment.notify,
        verify: comment.verify,
        placeholder: comment.placeholder,
        avatar: comment.avatar,
        avatarForce: comment.avatar_force,
        meta: comment.meta,
        pageSize: comment.page_size,
        visitor: comment.visitor,
        highlight: comment.highlight,
        recordIp: comment.record_ip,
        jsUrl: helper.cdn('valine', '1.3.10', 'dist/Valine.min.js')
    };
});
