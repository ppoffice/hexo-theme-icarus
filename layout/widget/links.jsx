'use strict';

const { URL } = require('url');
const { Component } = require('inferno');
const { cacheComponent } = require('../util/cache');

class Links extends Component {
    render() {
        const { title, links } = this.props;
        return <div className="card widget">
            <div className="card-content">
                <div className="menu">
                    <h3 className="menu-label">{title}</h3>
                    <ul className="menu-list">
                        {Object.keys(links).map(i => {
                            let hostname = links[i];
                            try {
                                hostname = new URL(hostname).hostname;
                            } catch (e) { }
                            return <li>
                                <a className="level is-mobile" href="<%- links[i] %>" target="_blank" rel="noopener">
                                    <span className="level-left">
                                        <span className="level-item">{i}</span>
                                    </span>
                                    <span className="level-right">
                                        <span className="level-item tag">{hostname}</span>
                                    </span>
                                </a>
                            </li>;
                        })}
                    </ul>
                </div>
            </div>
        </div>;
    }
}

module.exports = cacheComponent(Links, 'widget.links', props => {
    const { helper, widget } = props;
    if (!Object.keys(widget.links).length) {
        return null;
    }
    return {
        title: helper.__('widget.links'),
        links: widget.links
    };
});
