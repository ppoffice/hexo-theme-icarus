const { URL } = require('url');
const { Component } = require('inferno');
const { cacheComponent } = require('../util/cache');

class Links extends Component {
    render() {
        const { title, links } = this.props;
        return <div class="card widget">
            <div class="card-content">
                <div class="menu">
                    <h3 class="menu-label">{title}</h3>
                    <ul class="menu-list">
                        {Object.keys(links).map(i => {
                            let hostname = links[i];
                            try {
                                hostname = new URL(hostname).hostname;
                            } catch (e) { }
                            return <li>
                                <a class="level is-mobile is-mobile" href={links[i]} target="_blank" rel="noopener">
                                    <span class="level-left">
                                        <span class="level-item">{i}</span>
                                    </span>
                                    <span class="level-right">
                                        <span class="level-item tag">{hostname}</span>
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
