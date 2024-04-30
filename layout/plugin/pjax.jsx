const { Component, Fragment } = require('inferno');

class Pjax extends Component {
    render() {
        if (this.props.head) {
            return null;
        }
        const { helper } = this.props;
        const { url_for, cdn } = helper;

        return <Fragment>
            <script src={cdn('pjax', '0.2.8', 'pjax.min.js')}></script>
            <script src={url_for('/js/pjax.js')}></script>
        </Fragment>;
    }
}

module.exports = Pjax;
