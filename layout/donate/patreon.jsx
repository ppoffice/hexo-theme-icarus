'use strict';

const { Component } = require('inferno');
const { cacheComponent } = require('../util/cache');

class Patreon extends Component {
    render() {
        const { type, url, __, url_for } = this.props;
        if (!url) {
            return <div className="notification is-danger">
                You forgot to set the <code>url</code> Patreon.
                Please set it in <code>_config.yml</code>.
            </div>;
        }
        return <a className="button is-danger donate" href={url_for(url)} target="_blank" rel="noopener">
            <span className="icon is-small">
                <i className="fab fa-patreon"></i>
            </span>
            <span>{__('donate.' + type)}</span>
        </a>;
    }
}

module.exports = cacheComponent(Patreon, 'donate.petreon', props => {
    return {
        type: props.type,
        url: props.url,
        __: props.__,
        url_for: props.url_for
    };
});
