'use strict';

const { Component } = require('inferno');
const { cacheComponent } = require('../util/cache');

class Archives extends Component {
    render() {
        const {
            items,
            title,
            showCount
        } = this.props;

        return <div className="card widget">
            <div class="card-content">
                <div class="menu">
                    <h3 class="menu-label">{title}</h3>
                    <ul class="menu-list">
                        {items.map(archive => <li>
                            <a class="level is-marginless" href={archive.url}>
                                <span class="level-start">
                                    <span class="level-item">{archive.name}</span>
                                </span>
                                {showCount ? <span class="level-end">
                                    <span class="level-item tag">{archive.count}</span>
                                </span> : null}
                            </a>
                        </li>)}
                    </ul>
                </div>
            </div>
        </div>;
    }
}

module.exports = cacheComponent(Archives, 'widget.archives', props => {
    // adapted from hexo/lib/plugins/helper/list_archives.js
    const { config, page, type = 'monthly', order = -1, url_for, _p } = props;
    const posts = props.site.posts.sort('date', order);
    if (!posts.length) {
        return null;
    }

    const language = page.lang || page.language || config.language;
    const format = props.format || type === 'monthly' ? 'MMMM YYYY' : 'YYYY';
    const showCount = Object.prototype.hasOwnProperty.call(props, 'show_count') ? props.show_count : true;

    const data = [];
    let length = 0;

    posts.forEach(post => {
        // Clone the date object to avoid pollution
        let date = post.date.clone();

        if (config.timezone) {
            date = date.tz(config.timezone);
        }
        if (language) {
            date = date.locale(language);
        }

        const year = date.year();
        const month = date.month() + 1;
        const name = date.format(format);
        const lastData = data[length - 1];

        if (!lastData || lastData.name !== name) {
            length = data.push({
                name,
                year,
                month,
                count: 1
            });
        } else {
            lastData.count++;
        }
    });

    const link = item => {
        let url = `${config.archive_dir}/${item.year}/`;

        if (type === 'monthly') {
            if (item.month < 10) url += '0';
            url += `${item.month}/`;
        }

        return url_for(url);
    };

    return {
        items: data.map(item => ({
            name: item.name,
            count: item.count,
            url: link(item)
        })),
        title: _p('common.archive', Infinity),
        showCount
    };
});
