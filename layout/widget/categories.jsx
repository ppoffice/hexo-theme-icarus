'use strict';

const { Component } = require('inferno');
const { cacheComponent } = require('../util/cache');

class Categories extends Component {
    renderList(categories, showCount) {
        return categories.map(category => <li>
            <a class="level is-marginless" href={category.url}>
                <span class="level-start">
                    <span class="level-item">{category.name}</span>
                </span>
                {showCount ? <span class="level-end">
                    <span class="level-item tag">{category.count}</span>
                </span> : null}
            </a>
            {category.children.length ? <ul>{this.renderList(category.children)}</ul> : null}
        </li>);
    }

    render() {
        const {
            title,
            showCount,
            categories
        } = this.props;

        return <div className="card widget">
            <div class="card-content">
                <div class="menu">
                    <h3 class="menu-label">{title}</h3>
                    <ul class="menu-list">
                        {this.renderList(categories, showCount)}
                    </ul>
                </div>
            </div>
        </div>;
    }
}

module.exports = cacheComponent(Categories, 'widget.categories', props => {
    // adapted from hexo/lib/plugins/helper/list_categories.js
    const categories = props.categories || props.site.categories;
    if (!categories.length) {
        return null;
    }
    const { orderBy = 'name', order = 1, page, url_for, _p } = props;
    const depth = props.depth ? parseInt(props.depth, 10) : 0;
    const showCurrent = props.show_current || false;
    const showCount = Object.prototype.hasOwnProperty.call(props, 'show_count') ? props.show_count : true;

    function prepareQuery(parent) {
        const query = {};

        if (parent) {
            query.parent = parent;
        } else {
            query.parent = { $exists: false };
        }

        return categories.find(query).sort(orderBy, order).filter(cat => cat.length);
    }

    function hierarchicalList(level, parent) {
        return prepareQuery(parent).map((cat, i) => {
            let children = [];
            if (!depth || level + 1 < depth) {
                children = hierarchicalList(level + 1, cat._id);
            }

            let isCurrent = false;
            if (showCurrent && page) {
                for (let j = 0; j < cat.length; j++) {
                    const post = cat.posts.data[j];
                    if (post && post._id === page._id) {
                        isCurrent = true;
                        break;
                    }
                }
                // special case: category page
                isCurrent = isCurrent || (page.base && page.base.startsWith(cat.path));
            }

            return {
                children,
                isCurrent,
                name: cat.name,
                count: cat.length,
                url: url_for(cat.path)
            };
        });
    }

    return {
        showCount,
        categories: hierarchicalList(0),
        title: _p('common.category', Infinity)
    };
});
