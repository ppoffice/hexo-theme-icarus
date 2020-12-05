const { Component } = require('inferno');
const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');

class AnimeJs extends Component {
    render() {
        if (this.props.head) {
            return <style dangerouslySetInnerHTML={{ __html: 'body>.footer,body>.navbar,body>.section{opacity:0}' }}></style>;
        }
        return <script src={this.props.jsUrl}></script>;

    }
}

AnimeJs.Cacheable = cacheComponent(AnimeJs, 'plugin.animejs', props => {
    const { helper, head } = props;
    return {
        head,
        jsUrl: helper.url_for('/js/animation.js')
    };
});

module.exports = AnimeJs;
