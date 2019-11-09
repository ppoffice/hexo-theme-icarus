const { doc, type, defaultValue, required, requires, format } = require('../common/utils').descriptors;

const DEFAULT_WIDGETS = [
    {
        type: 'profile',
        position: 'left',
        author: 'Your name',
        author_title: 'Your title',
        location: 'Your location',
        avatar: null,
        gravatar: null,
        avatar_rounded: false,
        follow_link: 'https://github.com/ppoffice',
        social_links: {
            Github: {
                icon: 'fab fa-github',
                url: 'https://github.com/ppoffice'
            },
            Facebook: {
                icon: 'fab fa-facebook',
                url: 'https://facebook.com'
            },
            Twitter: {
                icon: 'fab fa-twitter',
                url: 'https://twitter.com'
            },
            Dribbble: {
                icon: 'fab fa-dribbble',
                url: 'https://dribbble.com'
            },
            RSS: {
                icon: 'fas fa-rss',
                url: '/'
            }
        }
    },
    {
        type: 'toc',
        position: 'left'
    },
    {
        type: 'links',
        position: 'left',
        links: {
            Hexo: 'https://hexo.io',
            PPOffice: 'https://github.com/ppoffice'
        }
    },
    {
        type: 'category',
        position: 'left'
    },
    {
        type: 'tagcloud',
        position: 'left'
    },
    {
        type: 'recent_posts',
        position: 'right'
    },
    {
        type: 'archive',
        position: 'right'
    },
    {
        type: 'tag',
        position: 'right'
    }
];

const ProfileSpec = {
    author: {
        [type]: 'string',
        [doc]: 'Author name to be shown in the profile widget',
        [defaultValue]: 'Your name'
    },
    author_title: {
        [type]: 'string',
        [doc]: 'Title of the author to be shown in the profile widget',
        [defaultValue]: 'Your title'
    },
    location: {
        [type]: 'string',
        [doc]: 'Author\'s current location to be shown in the profile widget',
        [defaultValue]: 'Your location'
    },
    avatar: {
        [type]: 'string',
        [doc]: 'Path or URL to the avatar to be shown in the profile widget',
        [defaultValue]: '/images/avatar.png'
    },
    avatar_rounded: {
        [type]: 'boolean',
        [doc]: 'Whether to show avatar image rounded or square',
        [defaultValue]: false
    },
    gravatar: {
        [type]: 'string',
        [doc]: 'Email address for the Gravatar to be shown in the profile widget',
    },
    follow_link: {
        [type]: 'string',
        [doc]: 'Path or URL for the follow button',
    },
    social_links: {
        ...require('./icon_link.spec'),
        [doc]: 'Links to be shown on the bottom of the profile widget',
    }
};

for (let key in ProfileSpec) {
    ProfileSpec[key][requires] = widget => widget.type === 'profile';
}

const LinksSpec = {
    links: {
        [type]: 'object',
        [doc]: 'Links to be shown in the links widget',
        [requires]: parent => parent.type === 'links',
        '*': {
            [type]: 'string',
            [doc]: 'Path or URL to the link',
            [required]: true
        }
    }
};

const SubscrbieEmailSpec = {
    feedburner_id: {
        [type]: 'string',
        [doc]: 'Feedburner ID',
        [required]: true,
        [requires]: parent => parent.type === 'subscribe_email'
    },
    description: {
        [type]: 'string',
        [doc]: 'Hint text under the subscription input',
        [requires]: parent => parent.type === 'subscribe_email'
    }
};

module.exports = {
    [type]: 'array',
    [doc]: 'Sidebar widget settings\nhttps://ppoffice.github.io/hexo-theme-icarus/categories/Widgets/',
    [defaultValue]: DEFAULT_WIDGETS,
    '*': {
        [type]: 'object',
        [doc]: 'Single widget settings',
        type: {
            [type]: 'string',
            [doc]: 'Widget name',
            [required]: true,
            [defaultValue]: 'profile'
        },
        position: {
            [type]: 'string',
            [doc]: 'Where should the widget be placed, left or right',
            [format]: /^(left|right)$/,
            [required]: true,
            [defaultValue]: 'left'
        },
        ...ProfileSpec,
        ...LinksSpec,
        ...SubscrbieEmailSpec
    }
}