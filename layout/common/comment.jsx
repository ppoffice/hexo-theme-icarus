const createLogger = require('hexo-log');
const { Component } = require('inferno');
const view = require('hexo-component-inferno/lib/core/view');

const logger = createLogger.default();

module.exports = class extends Component {
    render() {
        const { config, page, helper } = this.props;
        const { __, url_for } = helper;
        let { comment } = config;
        if (!comment || typeof comment.type !== 'string') {
            return null;
        }
        // Without page_key, Artalk uses the path of the URL when it is initialized. PJAX only
        // changes the URL after running the scripts of the new page, which initialize Artalk right
        // away once its library is loaded, so the comments of the previous page would be shown.
        if (comment.type === 'artalk' && !comment.page_key) {
            comment = Object.assign({}, comment, { page_key: url_for(page.path) });
        }

        return <div class="card" id="comments">
            <div class="card-content">
                <h3 class="title is-5">{__('article.comments')}</h3>
                {(() => {
                    try {
                        let Comment = view.require('comment/' + comment.type);
                        Comment = Comment.Cacheable ? Comment.Cacheable : Comment;
                        return <Comment config={config} page={page} helper={helper} comment={comment} />;
                    } catch (e) {
                        logger.w(`Icarus cannot load comment "${comment.type}"`);
                        return null;
                    }
                })()}
            </div>
        </div>;
    }
};
