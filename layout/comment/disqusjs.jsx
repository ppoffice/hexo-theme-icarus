const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('../util/cache');

class DisqusJs extends Component {
    render() {
        const {
            shortname,
            apiKey,
            api,
            admin,
            adminLabel = false,
            nesting = 4,
            disqusId,
            path,
            permalink,
            pageTitle,
            siteTitle,
            jsUrl,
            cssUrl
        } = this.props;
        if (!shortname) {
            return <div class="notification is-danger">
                You forgot to set the <code>shortname</code> or <code>api_key</code> for Disqus.
                Please set it in <code>_config.yml</code>.
            </div>;
        }
        const js = `new DisqusJS({
            shortname: '${shortname}',
            apikey: '${JSON.stringify(apiKey)}',
            siteName: '${siteTitle}',
            identifier: '${disqusId || path}',
            url: '${permalink || path}',
            title: '${pageTitle}',
            api: '${api}',
            admin: '${admin}',
            adminLabel: '${adminLabel}',
            nesting: ${nesting}
        });`;
        return <Fragment>
            <link rel="stylesheet" href={cssUrl} />
            <div id="disqus_thread">
                <noscript>Please enable JavaScript to view the <a href="//disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>
            </div>
            <script src={jsUrl}></script>
            <script dangerouslySetInnerHTML={{ __html: js }}></script>
        </Fragment>;
    }
}

module.exports = cacheComponent(DisqusJs, 'comment.disqusjs', props => {
    const { config, page, helper, comment } = props;

    return {
        path: page.path,
        shortname: comment.shortname,
        apiKey: comment.api_key,
        api: comment.api,
        admin: comment.admin,
        adminLabel: comment.admin_label,
        nesting: comment.nesting,
        disqusId: page.disqusId,
        permalink: page.permalink,
        pageTitle: page.title,
        siteTitle: config.title,
        jsUrl: helper.cdn('disqusjs', '1.2.5', 'dist/disqus.js'),
        cssUrl: helper.cdn('disqusjs', '1.2.5', 'dist/disqusjs.css')
    };
});
