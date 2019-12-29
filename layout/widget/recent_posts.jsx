const { Component } = require('inferno');
const { cacheComponent } = require('../util/cache');
const ArticleMedia = require('../common/article-media');

class RecentPosts extends Component {
    render() {
        const { title, posts } = this.props;

        return <div class="card widget">
            <div class="card-content">
                <h3 class="menu-label">{title}</h3>
                {posts.map(post => {
                    return <ArticleMedia
                        thumbnail={post.thumbnail}
                        url={post.url}
                        title={post.title}
                        date={post.date}
                        dateXml={post.dateXml}
                        categories={post.categories} />;
                })}
            </div>
        </div>;
    }
}

module.exports = cacheComponent(RecentPosts, 'widget.recentposts', props => {
    const { site, helper } = props;
    const { has_thumbnail, get_thumbnail, url_for, __, date_xml, date } = helper;
    if (!site.posts.length) {
        return null;
    }
    const posts = site.posts.sort('date', -1).limit(5).map(post => ({
        url: url_for(post.link || post.path),
        title: post.title,
        date: date(post.date),
        dateXml: date_xml(post.date),
        thumbnail: has_thumbnail(post) ? get_thumbnail(post) : null,
        categories: post.categories.map(category => ({
            name: category.name,
            url: url_for(category.path)
        }))
    }));
    return {
        posts,
        title: __('widget.recents')
    };
});
