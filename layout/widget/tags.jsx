'use strict';

const { Component } = require('inferno');
const { cacheComponent } = require('../util/cache');

class Tags extends Component {
    render() {
        const {
            tags,
            title,
            showCount
        } = this.props;

        return <div className="card widget">
            <div className="card-content">
                <div className="menu">
                    <h3 className="menu-label">{title}</h3>
                    <div className="field is-grouped is-grouped-multiline">
                        {tags.map(tag => <div className="control">
                            <a className="tags has-addons" href={tag.url}>
                                <span className="tag">{tag.name}</span>
                                {showCount ? <span className="tag is-grey">{tag.count}</span> : null}
                            </a>
                        </div>)}
                    </div>
                </div>
            </div>
        </div>;
    }
}

module.exports = cacheComponent(Tags, 'widget.tags', props => {
    // adapted from hexo/lib/plugins/helper/list_tags.js
    const {
        helper,
        orderBy = 'name',
        order = 1,
        amount,
        show_count = true
    } = props;
    let tags = props.tags || props.site.tags;
    const { url_for, _p } = helper;

    if (!tags || !tags.length) {
        return null;
    }

    tags = tags.sort(orderBy, order).filter(tag => tag.length);
    if (amount) {
        tags = tags.limit(amount);
    }

    return {
        showCount: show_count,
        title: _p('common.tag', Infinity),
        tags: tags.map(tag => ({
            name: tag.name,
            count: tag.length,
            url: url_for(tag.path)
        }))
    };
});
