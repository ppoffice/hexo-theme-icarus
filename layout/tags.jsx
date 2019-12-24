const { Component } = require('inferno');
const Tags = require('./widget/tags');

module.exports = class extends Component {
    render() {
        const { site, helper } = this.props;

        return <Tags site={site} helper={helper} />;
    }
};
