/**
 * Recent posts widget JSX component.
 * @module view/widget/recent_posts
 */
const { Component } = require('inferno');
const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');
const ArticleMedia = require('hexo-component-inferno/lib/view/common/article_media');

/**
 * Recent posts widget JSX component.
 *
 * @example
 * <RecentPosts
 *     title="Widget title"
 *     posts={[
 *         {
 *             url: '/url/to/post',
 *             title: 'Post title',
 *             date: '******',
 *             dateXml: '******',
 *             thumbnail: '/path/to/thumbnail',
 *             categories: [{ name: 'Category name', url: '/path/to/category' }]
 *         }
 *     ]} />
 */
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

/**
 * Cacheable recent posts widget JSX component.
 * <p>
 * This class is supposed to be used in combination with the <code>locals</code> hexo filter
 * ({@link module:hexo/filter/locals}).
 *
 * @see module:util/cache.cacheComponent
 * @example
 * <RecentPosts.Cacheable
 *     site={{ posts: {...} }}
 *     helper={{
 *         has_thumbnail: function() {...},
 *         get_thumbnail: function() {...},
 *         url_for: function() {...},
 *         __: function() {...},
 *         date_xml: function() {...},
 *         date: function() {...}
 *     }}
 *     limit={5} />
 */
RecentPosts.Cacheable = cacheComponent(RecentPosts, 'widget.recentposts', props => {
    const { site, helper, limit = 5 } = props;
    const { has_thumbnail, get_thumbnail, url_for, __, date_xml, date } = helper;
    if (!site.posts.length) {
        return null;
    }
    const posts = site.posts.sort('date', -1).limit(limit).map(post => ({
        url: url_for(post.link || post.path),
        title: post.title,
        date: date(post.date),
        dateXml: date_xml(post.date),
        thumbnail: get_thumbnail(post),
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
