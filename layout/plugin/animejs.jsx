const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');

// Content is only hidden (until animation.js fades it in) when JavaScript runs, the visitor
// has not asked for reduced motion, and animation.js has not failed to load.
const ANIMATING_CLASS = 'is-animating';
const HIDE_UNTIL_ANIMATED = `if (!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    document.documentElement.classList.add('${ANIMATING_CLASS}');
}`;
const HIDDEN_CSS = `html.${ANIMATING_CLASS} body>.footer,html.${ANIMATING_CLASS} body>.navbar,html.${ANIMATING_CLASS} body>.section{opacity:0}`;
const REVEAL = `document.documentElement.classList.remove('${ANIMATING_CLASS}')`;

class AnimeJs extends Component {
    render() {
        if (this.props.head) {
            return <Fragment>
                <script dangerouslySetInnerHTML={{ __html: HIDE_UNTIL_ANIMATED }}></script>
                <style dangerouslySetInnerHTML={{ __html: HIDDEN_CSS }}></style>
            </Fragment>;
        }
        return <script src={this.props.jsUrl} onerror={REVEAL}></script>;

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
