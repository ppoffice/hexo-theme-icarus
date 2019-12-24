const { Component } = require('inferno');
const gravatrHelper = require('hexo-util').gravatar;
const { cacheComponent } = require('../util/cache');

class Profile extends Component {
    renderSocialLinks(links) {
        if (!links.length) {
            return null;
        }
        return <div class="level is-mobile">
            {links.map(link => {
                return <a class="level-item button is-white is-marginless"
                    target="_blank" rel="noopener" title={link.name} href={link.url}>
                    {'icon' in link ? <i class={link.icon}></i> : link.name}
                </a>;
            })}
        </div>;
    }

    render() {
        const {
            avatar,
            avatarRounded,
            author,
            authorTitle,
            location,
            counter,
            followLink,
            followTitle,
            socialLinks
        } = this.props;
        return <div class="card widget">
            <div class="card-content">
                <nav class="level">
                    <div class="level-item has-text-centered" style="flex-shrink: 1">
                        <div>
                            <figure class="image is-128x128 has-mb-6">
                                <img class={avatarRounded ? 'is-rounded' : ''} src={avatar} alt={author} />
                            </figure>
                            {author ? <p class="is-size-4 is-block">{author}</p> : null}
                            {authorTitle ? <p class="is-size-6 is-block">{authorTitle}</p> : null}
                            {location ? <p class="is-size-6 is-flex is-flex-center has-text-grey">
                                <i class="fas fa-map-marker-alt has-mr-7"></i>
                                <span>{location}</span>
                            </p> : null}
                        </div>
                    </div>
                </nav>
                <nav class="level is-mobile">
                    <div class="level-item has-text-centered is-marginless">
                        <div>
                            <p class="heading">{counter.post.title}</p>
                            <a href={counter.post.url}>
                                <p class="title has-text-weight-normal">{counter.post.count}</p>
                            </a>
                        </div>
                    </div>
                    <div class="level-item has-text-centered is-marginless">
                        <div>
                            <p class="heading">{counter.category.title}</p>
                            <a href={counter.category.url}>
                                <p class="title has-text-weight-normal">{counter.category.count}</p>
                            </a>
                        </div>
                    </div>
                    <div class="level-item has-text-centered is-marginless">
                        <div>
                            <p class="heading">{counter.tag.title}</p>
                            <a href={counter.tag.url}>
                                <p class="title has-text-weight-normal">{counter.tag.count}</p>
                            </a>
                        </div>
                    </div>
                </nav>
                {followLink ? <div class="level">
                    <a class="level-item button is-link is-rounded" href={followLink} target="_blank" rel="noopener">{followTitle}</a>
                </div> : null}
                {this.renderSocialLinks(socialLinks)}
            </div>
        </div>;
    }
}

module.exports = cacheComponent(Profile, 'widget.profile', props => {
    const { site, helper, widget } = props;
    const {
        avatar,
        gravatar,
        avatar_rounded = false,
        author = props.config.author,
        author_title,
        location,
        follow_link,
        social_links
    } = widget;
    const { url_for, _p, __ } = helper;

    function getAvatar() {
        if (gravatar) {
            return gravatrHelper(gravatar, 128);
        }
        if (avatar) {
            return url_for(avatar);
        }
        return url_for('/images/avatar.png');
    }

    const postCount = site.posts.length;
    const categoryCount = site.categories.filter(category => category.length).length;
    const tagCount = site.tags.filter(tag => tag.length).length;

    const socialLinks = Object.keys(social_links).map(name => {
        const link = social_links[name];
        if (typeof link === 'string') {
            return {
                name,
                url: url_for(link)
            };
        }
        return {
            name,
            url: url_for(link.name),
            icon: link.icon
        };
    });

    return {
        avatar: getAvatar(),
        avatarRounded: avatar_rounded,
        author,
        authorTitle: author_title,
        location,
        counter: {
            post: {
                count: postCount,
                title: _p('common.post', postCount),
                url: url_for('/archives')
            },
            category: {
                count: categoryCount,
                title: _p('common.category', categoryCount),
                url: url_for('/categories')
            },
            tag: {
                count: tagCount,
                title: _p('common.tag', tagCount),
                url: url_for('/tags')
            }
        },
        followLink: url_for(follow_link),
        followTitle: __('widget.follow'),
        socialLinks
    };
});
