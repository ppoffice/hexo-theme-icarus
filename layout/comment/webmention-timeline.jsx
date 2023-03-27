/**
 * Webmastodon comment JSX component.
 * @module layout/comment/webmastodon
 */
const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');

class WebmentionTimeline extends Component {

    render() {
        
        const { helper } = this.props;
        const { __ } = helper;
        return <Fragment>
            <div class="card">
                <div class="card-content">
                    <h2 class="title is-5">长短波</h2>    
                    <div class="timeline webmention-timeline">
                        <script src={helper.url_for('/js/webmention-timeline.js')}></script>
                    </div>
                </div>
            </div>


        </Fragment>


    }
}


module.exports = WebmentionTimeline;
