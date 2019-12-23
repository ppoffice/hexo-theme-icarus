'use strict';

const { Component } = require('inferno');
const Categories = require('./widget/categories');

module.exports = class extends Component {
    render() {
        const { site, page } = this.props;
        // TODO
        const helper = {};

        return <Categories site={site} page={page} helper={helper} />;
    }
}