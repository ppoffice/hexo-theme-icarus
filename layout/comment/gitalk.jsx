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
            return <div class="notification is-danger">
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
    const { helper, comment } = props;

    // FIXME: config name change
    const id = crypto.createHash('md5').update(props.page.path).digest('hex');
    return {
        id,
        repo: comment.repo,
        owner: comment.owner,
        admin: comment.admin,
        clientId: comment.clientId,
        clientSecret: comment.clientSecret,
        createIssueManually: comment.createIssueManually,
        distractionFreeMode: comment.distractionFreeMode,
        cssUrl: helper.cdn('gitalk', '1.4.1', 'dist/gitalk.css'),
        jsUrl: helper.cdn('gitalk', '1.4.1', 'dist/gitalk.min.js')
    };
});
