const { Component, Fragment } = require('inferno');
const { sri } = require('../../include/util/sri');

class Pjax extends Component {
    render() {
        if (this.props.head) {
            return null;
        }
        const { helper, config } = this.props;
        const { url_for, cdn } = helper;

        return <Fragment>
            <script src={cdn('pjax', '0.2.8', 'pjax.min.js')} {...sri(config, 'pjax', '0.2.8', 'pjax.min.js')}></script>
            <script src={url_for('/js/pjax.js')}></script>
        </Fragment>;
    }
}

module.exports = Pjax;
