const { Component } = require('inferno');
const OutdatedBrowser = require('hexo-component-inferno/lib/view/plugin/outdated_browser');
const { getAppearance } = require('../../include/util/appearance');

module.exports = class extends Component {
    render() {
        const { config, head } = this.props;
        const requiredFeatures = [
            ['display', 'flex'],
            ['object-fit', 'cover'],
            ['color', 'var(--hexo-component-probe)']
        ];
        if (getAppearance(config) !== 'light') {
            requiredFeatures.push(['selector', ':where(*)']);
        }
        if (config.variant === 'm3e') {
            requiredFeatures.push(
                ['color', 'oklch(0.5 0.17 285)'],
                ['color', 'color-mix(in oklab, black, white)']
            );
        }
        return <OutdatedBrowser.Cacheable head={head} requiredFeatures={requiredFeatures} />;
    }
};
