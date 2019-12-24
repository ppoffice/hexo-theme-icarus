const { Component } = require('inferno');
const { cacheComponent } = require('../util/cache');

class Busuanzi extends Component {
    render() {
        return <script src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js" defer={true}></script>;
    }
}

module.exports = cacheComponent(Busuanzi, 'plugin.busuanzi', props => {
    if (!props.head) {
        return null;
    }
    return {};
});
