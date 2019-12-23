'use strict';

const { Component } = require('inferno');
const Article = require('./common/article');

module.exports = class extends Component {
    render() {
        const { page } = this.props;
        // TODO
        const helper = {};
        const config = {};

        return <Article config={config} page={page} helper={helper} index={false} />;
    }
}