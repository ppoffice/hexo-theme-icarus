'use strict';

const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('../util/cache');

class Mathjax extends Component {
    render() {
        const { cdn } = this.props;

        const js = `document.addEventListener('DOMContentLoaded', function () {
            MathJax.Hub.Config({
                'HTML-CSS': {
                    matchFontHeight: false
                },
                SVG: {
                    matchFontHeight: false
                },
                CommonHTML: {
                    matchFontHeight: false
                },
                tex2jax: {
                    inlineMath: [
                        ['$','$'],
                        ['\\(','\\)']
                    ]
                }
            });
        });`;

        return <Fragment>
            <script src={cdn('mathjax', '2.7.5', 'unpacked/MathJax.js?config=TeX-MML-AM_CHTML')} async={true}></script>
            <script dangerouslySetInnerHTML={{ __html: js }}></script>
        </Fragment>;
    }
}

module.exports = cacheComponent(Mathjax, 'plugin.mathjax', props => {
    if (props.head) {
        return null;
    }
    return {
        cdn: props.cdn,
        // for cache purpose only
        _providers: props.providers.cdn
    };
});
