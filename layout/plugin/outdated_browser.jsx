const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('../util/cache');

class OutdatedBrowser extends Component {
    render() {
        const { head, jsUrl, cssUrl } = this.props;

        const js = `document.addEventListener("DOMContentLoaded", function () {
            outdatedBrowser({
                bgColor: '#f25648',
                color: '#ffffff',
                lowerThan: 'object-fit' // display on IE11 or below
            });
        });`;

        if (head) {
            return <link rel="stylesheet" href={cssUrl} />;
        }
        return <Fragment>
            <div id="outdated">
                <h6>Your browser is out-of-date!</h6>
                <p>
                    Update your browser to view this website correctly.&npsb;
                    <a id="btnUpdateBrowser" href="http://outdatedbrowser.com/">Update my browser now </a>
                </p>
                <p class="last"><a href="#" id="btnCloseUpdateBrowser" title="Close">&times;</a></p>
            </div>
            <script src={jsUrl} async={true}></script>
            <script dangerouslySetInnerHTML={{ __html: js }}></script>
        </Fragment>;

    }
}

module.exports = cacheComponent(OutdatedBrowser, 'plugin.outdatedbrowser', props => {
    const { head, helper } = props;
    return {
        head,
        cssUrl: helper.cdn('outdatedbrowser', '1.1.5', 'outdatedbrowser/outdatedbrowser.min.css'),
        jsUrl: helper.cdn('outdatedbrowser', '1.1.5', 'outdatedbrowser/outdatedbrowser.min.js')
    };
});
