const crypto = require('crypto');
const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('../util/cache');

class Gitment extends Component {
    render() {
        const {
            id,
            repo,
            owner,
            clientId,
            clientSecret,
            perPage = 20,
            maxCommentHeight = 250
        } = this.props;

        if (!id || !repo || !owner || !clientId || !clientSecret) {
            return <div class="notification is-danger">
                You forgot to set the <code>owner</code>, <code>repo</code>, <code>clientId</code>,
                or <code>clientSecret</code> for Gitment.
                Please set it in <code>_config.yml</code>.
            </div>;
        }
        const js = `var gitment = new Gitment({
            id: '${id}',
            repo: '${repo}',
            owner: '${owner}',
            oauth: {
                client_id: '${clientId}',
                client_secret: '${clientSecret}',
            },
            perPage: ${perPage},
            maxCommentHeight: ${maxCommentHeight}
        })
        gitment.render('comment-container')`;
        return <Fragment>
            <div id="comment-container"></div>
            <link rel="stylesheet" href="https://imsun.github.io/gitment/style/default.css" />
            <script src="https://imsun.github.io/gitment/dist/gitment.browser.js"></script>
            <script dangerouslySetInnerHTML={{ __html: js }}></script>
        </Fragment>;
    }
}

module.exports = cacheComponent(Gitment, 'comment.gitment', props => {
    const { comment } = props;

    const id = crypto.createHash('md5').update(props.page.path).digest('hex');
    return {
        id,
        repo: comment.repo,
        owner: comment.owner,
        clientId: comment.client_id,
        clientSecret: comment.client_secret,
        perPage: comment.per_page,
        maxCommentHeight: comment.max_comment_height
    };
});
