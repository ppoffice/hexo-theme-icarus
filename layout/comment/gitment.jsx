'use strict';

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
            clientSecret
        } = this.props;

        if (!id || !repo || !owner || !clientId || !clientSecret) {
            return <div className="notification is-danger">
                You forgot to set the <code>owner</code>, <code>repo</code>, <code>client_id</code>,
                or <code>client_secret</code> for Gitment.
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
    const id = crypto.createHash('md5').update(props.page.path).digest('hex');
    return {
        id,
        repo: props.repo,
        owner: props.owner,
        clientId: props.client_id,
        clientSecret: props.client_secret
    };
});
