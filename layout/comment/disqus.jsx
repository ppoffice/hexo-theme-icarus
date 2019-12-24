const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('../util/cache');

class Disqus extends Component {
    render() {
        const { shortname, disqusId, path, permalink } = this.props;
        if (!shortname) {
            return <div class="notification is-danger">
                You forgot to set the <code>shortname</code> for Disqus.
                Please set it in <code>_config.yml</code>.
            </div>;
        }
        const js = `var disqus_config = function () {
            this.page.url = '${permalink}';
            this.page.identifier = '${disqusId || path}';
        };
        (function() {
            var d = document, s = d.createElement('script');  
            s.src = '//' + '${shortname}' + '.disqus.com/embed.js';
            s.setAttribute('data-timestamp', +new Date());
            (d.head || d.body).appendChild(s);
        })();`;
        return <Fragment>
            <div id="disqus_thread">
                <noscript>Please enable JavaScript to view the <a href="//disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>
            </div>
            <script dangerouslySetInnerHTML={{ __html: js }}></script>
        </Fragment>;
    }
}

module.exports = cacheComponent(Disqus, 'comment.disqus', props => {
    const { comment, page } = props;

    return {
        path: page.path,
        shortname: comment.shortname,
        disqusId: page.disqusId,
        permalink: page.permalink
    };
});
