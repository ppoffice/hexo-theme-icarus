const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('../util/cache');

class KaTeX extends Component {
    render() {
        const { cssUrl, jsUrl, autoRenderUrl } = this.props;

        const js = `document.addEventListener("DOMContentLoaded", function() {
            document.querySelectorAll('[role="article"] > .content').forEach(function(element) {
                renderMathInElement(element);
            });
        });`;

        return <Fragment>
            <link rel="stylesheet" href={cssUrl} />
            <script src={jsUrl} defer={true}></script>
            <script src={autoRenderUrl} defer={true}></script>
            <script dangerouslySetInnerHTML={{ __html: js }}></script>
        </Fragment>;
    }
}

module.exports = cacheComponent(KaTeX, 'plugin.katex', props => {
    const { head, helper } = props;
    if (head) {
        return null;
    }
    return {
        jsUrl: helper.cdn('katex', '0.11.1', 'dist/katex.min.js'),
        cssUrl: helper.cdn('katex', '0.11.1', 'dist/katex.min.css'),
        autoRenderUrl: helper.cdn('katex', '0.11.1', 'dist/contrib/auto-render.min.js')
    };
});
