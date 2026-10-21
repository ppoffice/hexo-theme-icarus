/**
 * The logo image of the navbar and the footer. With a dark logo (include/util/appearance.js),
 * it is shown instead of the logo for the "dark" appearance, and when the system color scheme
 * is dark for "auto".
 */
const { Component } = require('inferno');

module.exports = class extends Component {
    render() {
        const { src, darkSrc, appearance, alt } = this.props;
        if (darkSrc && appearance === 'dark') {
            return <img src={darkSrc} alt={alt} height="28" />;
        }
        const img = <img src={src} alt={alt} height="28" />;
        if (darkSrc && appearance === 'auto') {
            return <picture>
                <source srcSet={darkSrc} media="(prefers-color-scheme: dark)" />
                {img}
            </picture>;
        }
        return img;
    }
};
