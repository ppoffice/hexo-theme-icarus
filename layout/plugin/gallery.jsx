'use strict';

const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('../util/cache');

class Gallery extends Component {
    render() {
        const { head, cdn, url_for } = this.props;
        if (head) {
            return <Fragment>
                <link rel="stylesheet" href={cdn('lightgallery', '1.6.8', 'dist/css/lightgallery.min.css')} />
                <link rel="stylesheet" href={cdn('justifiedGallery', '3.7.0', 'dist/css/justifiedGallery.min.css')} />
            </Fragment>;
        }
        return <Fragment>
            <script src={cdn('lightgallery', '1.6.8', 'dist/js/lightgallery.min.js')} defer={true}></script>
            <script src={cdn('justifiedGallery', '3.7.0', 'dist/js/jquery.justifiedGallery.min.js')} defer={true}></script>
            <script src={url_for('/js/gallery.js')} defer={true}></script>
        </Fragment>;

    }
}

module.exports = cacheComponent(Gallery, 'plugin.gallery', props => {
    return {
        head: props.head,
        cdn: props.cdn,
        url_for: props.url_for,
        // for cache purpose only
        _providers: props.providers.cdn
    };
});
