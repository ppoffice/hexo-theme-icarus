const { Component, Fragment } = require('inferno');

class Webmention extends Component {
    render() {

        const { helper, plugin, head } = this.props;
        const baseUrl = "https://webmention.io";

        return <Fragment>

            <script dangerouslySetInnerHTML={{
                __html: `var webmentionContext = { baseUrl:'${baseUrl}'}; `}} >
            </script>
            <script src={helper.url_for('/js/webmention.js')}>

            </script>

        </Fragment>;

    }
}


module.exports = Webmention;