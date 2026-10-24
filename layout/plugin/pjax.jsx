const { Component, Fragment } = require('inferno');

class Pjax extends Component {
    render() {
        if (this.props.head) {
            return null;
        }
        const { helper } = this.props;
        const { url_for } = helper;

        return <Fragment>
            <script src={url_for('/js/pjax-core.js')}></script>
            <script src={url_for('/js/pjax.js')}></script>
        </Fragment>;
    }
}

module.exports = Pjax;
