const logger = require('hexo-log')();
const { Component } = require('inferno');

module.exports = class extends Component {
    render() {
        const { config, page, helper } = this.props;
        const { __ } = helper;
        const { comment } = config;
        if (!comment || typeof comment.type !== 'string') {
            return null;
        }

        return <div class="card">
            <div class="card-content">
                <h3 class="title is-5">{__('article.comments')}</h3>
                {(() => {
                    try {
                        const Comment = require('../comment/' + comment.type);
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
