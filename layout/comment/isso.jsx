const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('../util/cache');

class Isso extends Component {
    render() {
        const { url } = this.props;
        if (!url) {
            return <div class="notification is-danger">
                You forgot to set the <code>url</code> for Isso.
                Please set it in <code>_config.yml</code>.
            </div>;
        }
        return <Fragment>
            <div id="isso-thread"></div>
            <script data-isso={'//' + url} src={`//${url}/js/embed.min.js`}></script>
        </Fragment>;
    }
}

module.exports = cacheComponent(Isso, 'comment.isso', props => {
    const { comment } = props;

    return {
        url: comment.url
    };
});
