'use strict';

const { Component } = require('inferno');
const Tags = require('./widget/tags');

module.exports = class extends Component {
    render() {
        const { site } = this.props;
        // TODO
        const helper = {};

        return <Tags site={site} helper={helper} />;
    }
}