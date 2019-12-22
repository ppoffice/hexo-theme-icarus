'use strict';

const crypto = require('crypto');
const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('../util/cache');

class Gitalk extends Component {
    render() {
        const {
            id,
            repo,
            owner,
            admin,
            clientId,
            clientSecret,
            createIssueManually,
            distractionFreeMode,
            jsUrl,
            cssUrl
        } = this.props;

        if (!id || !repo || !owner || !admin || !clientId || !clientSecret) {
            return <div className="notification is-danger">
                You forgot to set the <code>owner</code>, <code>admin</code>, <code>repo</code>,
                <code>client_id</code>, or <code>client_secret</code> for Gittalk.
                Please set it in <code>_config.yml</code>.
            </div>;
        }
        const js = `var gitalk = new Gitalk({
            id: '${id}',
            repo: '${repo}',
            owner: '${owner}',
            clientID: '${clientId}',
            clientSecret: '${clientSecret}',
            admin: ${JSON.stringify(admin)},
            createIssueManually: ${createIssueManually || false},
            distractionFreeMode: ${distractionFreeMode || false}
        })
        gitalk.render('comment-container')`;
        return <Fragment>
            <div id="comment-container"></div>
            <link rel="stylesheet" href={cssUrl} />
            <script src={jsUrl}></script>
            <script dangerouslySetInnerHTML={{ __html: js }}></script>
        </Fragment>;
    }
}

module.exports = cacheComponent(Gitalk, 'comment.gitalk', props => {
    // FIXME: config name change
    const id = crypto.createHash('md5').update(props.page.path).digest('hex');
    return {
        id,
        repo: props.repo,
        owner: props.owner,
        admin: props.admin,
        clientId: props.clientId,
        clientSecret: props.clientSecret,
        createIssueManually: props.createIssueManually,
        distractionFreeMode: props.distractionFreeMode,
        cssUrl: props.cdn('gitalk', '1.4.1', 'dist/gitalk.css'),
        jsUrl: props.cdn('gitalk', '1.4.1', 'dist/gitalk.min.js')
    };
});
