'use strict';

const logger = require('hexo-log');
const { Component } = require('inferno');

module.exports = class extends Component {
    render() {
        const { config, page, helper } = this.props;
        const { __ } = helper;
        const { comment } = config;
        if (!comment || typeof comment.type !== 'string') {
            return null;
        }

        return <div className="card">
            <div className="card-content">
                <h3 className="title is-5 has-text-weight-normal">{__('article.comments')}</h3>
                {(() => {
                    try {
                        const Comment = require('../comment/' + comment.type);
                        return <Comment config={config} page={page} helper={helper} comment={comment} />;
                    } catch (e) {
                        logger.warn(`Icarus cannot load comment "${comment.type}"`);
                        return null;
                    }
                })()}
            </div>
        </div>;
    }
};
