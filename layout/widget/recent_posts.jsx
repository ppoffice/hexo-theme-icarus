/**
 * Recent posts widget: the one of hexo-component-inferno, with the post items of the theme
 * (common/article_media).
 */
const { Component } = require('inferno');
const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');
const ArticleMedia = require('../common/article_media');

class RecentPosts extends Component {
    render() {
        const { title, posts } = this.props;

        return <div class="card widget" data-type="recent-posts">
            <div class="card-content">
                <h3 class="menu-label">{title}</h3>
                {posts.map(post => <ArticleMedia
                    thumbnail={post.thumbnail}
                    url={post.url}
                    title={post.title}
                    date={post.date}
                    dateXml={post.dateXml}
                    categories={post.categories} />)}
            </div>
        </div>;
    }
}

RecentPosts.Cacheable = cacheComponent(RecentPosts, 'widget.recentposts', props => {
    const { site, helper, widget } = props;
    // A limit left empty in the config is null, which would show no posts
    const limit = widget.limit > 0 ? widget.limit : 5;
    const { url_for, __, date_xml, date } = helper;
    if (!site.posts.length) {
        return null;
    }
    const posts = site.posts.sort('date', -1).limit(limit).map(post => ({
        url: url_for(post.link || post.path),
        title: post.title,
        date: date(post.date),
        dateXml: date_xml(post.date),
        thumbnail: post.thumbnail ? url_for(post.thumbnail) : null,
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

module.exports = RecentPosts;
