const { Component } = require('inferno');
const { cacheComponent } = require('../util/cache');

class ProgressBar extends Component {
    render() {
        const { jsUrl } = this.props;

        return <script src={jsUrl}></script>;
    }
}

module.exports = cacheComponent(ProgressBar, 'plugin.progressbar', props => {
    const { head, helper } = props;
    if (!head) {
        return null;
    }
    return {
        jsUrl: helper.cdn('pace-js', '1.0.2', 'pace.min.js')
    };
});
