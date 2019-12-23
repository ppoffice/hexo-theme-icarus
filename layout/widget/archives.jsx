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
            <div className="card-content">
                <div className="menu">
                    <h3 className="menu-label">{title}</h3>
                    <ul className="menu-list">
                        {items.map(archive => <li>
                            <a className="level is-marginless" href={archive.url}>
                                <span className="level-start">
                                    <span className="level-item">{archive.name}</span>
                                </span>
                                {showCount ? <span className="level-end">
                                    <span className="level-item tag">{archive.count}</span>
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
    const {
        site,
        config,
        page,
        helper,
        type = 'monthly',
        order = -1,
        show_count = true,
        format = null
    } = props;
    const { url_for, _p } = helper;
    const posts = site.posts.sort('date', order);
    if (!posts.length) {
        return null;
    }

    const language = page.lang || page.language || config.language;

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
        const name = date.format(format || type === 'monthly' ? 'MMMM YYYY' : 'YYYY');
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
        showCount: show_count
    };
});
