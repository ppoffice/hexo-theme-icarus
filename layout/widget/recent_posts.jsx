'use strict';

const { Component } = require('inferno');
const { cacheComponent } = require('../util/cache');

class RecentPosts extends Component {
    render() {
        const { title, thumbnail, posts } = this.props;

        return <div className="card widget">
            <div className="card-content">
                <h3 className="menu-label">{title}</h3>
                {posts.map(post => {
                    const categories = [];
                    post.categories.forEach((category, i) => {
                        categories.push(<a className="has-link-grey" href={category.url}>{category.name}</a>);
                        if (i < post.categories.length - 1) {
                            categories.push('/');
                        }
                    });
                    return <article className="media">
                        {thumbnail ? <a href={post.url} className="media-left">
                            <p className="image is-64x64">
                                <img className="thumbnail" src={post.thumbnail} alt={post.title} />
                            </p>
                        </a> : null}
                        <div className="media-content">
                            <div className="content">
                                <div><time className="has-text-grey is-size-7 is-uppercase" datetime={post.dateXml}>{post.date}</time></div>
                                <a href={post.url} className="title has-link-black-ter is-size-6 has-text-weight-normal">{post.title}</a>
                                <p className="is-size-7 is-uppercase">{categories}</p>
                            </div>
                        </div>
                    </article>;
                })}
            </div>
        </div>;
    }
}

module.exports = cacheComponent(RecentPosts, 'widget.recentposts', props => {
    const { site, config, helper } = props;
    const { get_thumbnail, url_for, __, date_xml, date } = helper;
    if (!site.posts.length) {
        return null;
    }
    const thumbnail = config.article && config.article.thumbnail;
    const posts = site.posts.sort('date', -1).limit(5).map(post => ({
        url: url_for(post.permalink || post.link || post.path),
        title: post.title,
        date: date(post.date),
        dateXml: date_xml(post.date),
        thumbnail: thumbnail ? get_thumbnail(post) : null,
        // TODO: check if categories work
        categories: post.categories.map(category => ({
            name: category.name,
            url: url_for(category.path)
        }))
    }));
    return {
        posts,
        thumbnail,
        title: __('widget.recents')
    };
});
