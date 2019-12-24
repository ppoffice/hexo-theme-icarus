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
            {category.children.length ? <ul>{this.renderList(category.children, showCount)}</ul> : null}
        </li>);
    }

    render() {
        const {
            title,
            showCount,
            categories
        } = this.props;

        return <div class="card widget">
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
    const {
        page,
        helper,
        categories = props.site.categories,
        orderBy = 'name',
        order = 1,
        show_current = false,
        show_count = true
    } = props;
    const { url_for, _p } = helper;

    if (!categories || !categories.length) {
        return null;
    }

    let depth = 0;
    try {
        depth = parseInt(props.depth, 10);
    } catch (e) { }

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
            if (show_current && page) {
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
        showCount: show_count,
        categories: hierarchicalList(0),
        title: _p('common.category', Infinity)
    };
});
