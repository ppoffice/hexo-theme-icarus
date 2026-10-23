const { Component } = require('inferno');
const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');

class Prefetch extends Component {
    render() {
        const { jsUrl, delay } = this.props;
        // Not data-pjax: the script runs once, and its listeners on the document keep working on
        // the pages switched in by PJAX.
        return <script src={jsUrl} data-delay={delay} defer></script>;
    }
}

Prefetch.Cacheable = cacheComponent(Prefetch, 'plugin.prefetch', props => {
    const { helper, plugin, head } = props;
    if (head) {
        return null;
    }
    const { delay } = typeof plugin === 'object' && plugin ? plugin : {};
    return {
        jsUrl: helper.url_for('/js/prefetch.js'),
        delay: Number.isInteger(delay) && delay >= 0 ? delay : 65
    };
});

module.exports = Prefetch;
