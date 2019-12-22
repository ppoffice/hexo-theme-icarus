'use strict';

const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('../util/cache');

class Gallery extends Component {
    render() {
        const { head, lightGallery, justifiedGallery, url_for } = this.props;
        if (head) {
            return <Fragment>
                <link rel="stylesheet" href={lightGallery.cssUrl} />
                <link rel="stylesheet" href={justifiedGallery.cssUrl} />
            </Fragment>;
        }
        return <Fragment>
            <script src={lightGallery.jsUrl} defer={true}></script>
            <script src={justifiedGallery.jsUrl} defer={true}></script>
            <script src={url_for('/js/gallery.js')} defer={true}></script>
        </Fragment>;

    }
}

module.exports = cacheComponent(Gallery, 'plugin.gallery', props => {
    return {
        head: props.head,
        url_for: props.url_for,
        lightGallery: {
            jsUrl: props.cdn('lightgallery', '1.6.8', 'dist/js/lightgallery.min.js'),
            cssUrl: props.cdn('lightgallery', '1.6.8', 'dist/css/lightgallery.min.css')
        },
        justifiedGallery: {
            jsUrl: props.cdn('justifiedGallery', '3.7.0', 'dist/js/jquery.justifiedGallery.min.js'),
            cssUrl: props.cdn('justifiedGallery', '3.7.0', 'dist/css/justifiedGallery.min.css')
        }
    };
});
