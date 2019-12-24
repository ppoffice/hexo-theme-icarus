const { Component } = require('inferno');
const Categories = require('./widget/categories');

module.exports = class extends Component {
    render() {
        const { site, page, helper } = this.props;

        return <Categories site={site} page={page} helper={helper} />;
    }
};
