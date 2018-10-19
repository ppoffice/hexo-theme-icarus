const { version } = require('../../package.json');
const { type, required, defaultValue, description, condition } = require('./common').descriptor;
const desc = description;

const IconLink = {
    [type]: 'object',
    [desc]: 'Link icon settings',
    '*': {
        [type]: ['string', 'object'],
        [desc]: 'Path or URL to the menu item, and/or link icon class names',
        icon: {
            [required]: true,
            [type]: 'string',
            [desc]: 'Link icon class names'
        },
        url: {
            [required]: true,
            [type]: 'string',
            [desc]: 'Path or URL to the menu item'
        }
    }
};

const DEFAULT_WIDGETS = [
    {
        type: 'profile',
        position: 'left',
        author: 'Your name',
        author_title: 'Your title',
        location: 'Your location',
        avatar: null,
        gravatar: null,
        follow_link: 'http://github.com/ppoffice',
        social_links: {
            Github: {
                icon: 'fab fa-github',
                url: 'http://github.com/ppoffice'
            },
            Facebook: {
                icon: 'fab fa-facebook',
                url: 'http://facebook.com'
            },
            Twitter: {
                icon: 'fab fa-twitter',
                url: 'http://twitter.com'
            },
            Dribbble: {
                icon: 'fab fa-dribbble',
                url: 'http://dribbble.com'
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
            Github: 'https://github.com/ppoffice'
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

module.exports = {
    [type]: 'object',
    [desc]: 'Root of the configuration file',
    [required]: true,
    version: {
        [type]: 'string',
        [desc]: 'Version of the Icarus theme that is currently used',
        [required]: true,
        [defaultValue]: version
    },
    favicon: {
        [type]: 'string',
        [desc]: 'Path or URL to the website\'s icon',
        [defaultValue]: null
    },
    open_graph: {
        [type]: 'object',
        [desc]: 'Open Graph metadata (https://hexo.io/docs/helpers.html#open-graph)',
        fb_app_id: {
            [type]: 'string',
            [desc]: 'Facebook App ID',
            [defaultValue]: null
        },
        fb_admins: {
            [type]: 'string',
            [desc]: 'Facebook Admin ID',
            [defaultValue]: null
        },
        twitter_id: {
            [type]: 'string',
            [desc]: 'Twitter ID',
            [defaultValue]: null
        },
        twitter_site: {
            [type]: 'string',
            [desc]: 'Twitter site',
            [defaultValue]: null
        },
        google_plus: {
            [type]: 'string',
            [desc]: 'Google+ profile link',
            [defaultValue]: null
        }
    },
    rss: {
        [type]: 'string',
        [desc]: 'Path or URL to RSS atom.xml',
        [defaultValue]: null
    },
    logo: {
        [type]: ['string', 'object'],
        [defaultValue]: '/images/logo.svg',
        [desc]: 'Path or URL to the website\'s logo to be shown on the left of the navigation bar or footer',
        text: {
            [type]: 'string',
            [desc]: 'Text to be shown in place of the logo image'
        }
    },
    navbar: {
        [type]: 'object',
        [desc]: 'Navigation bar link settings',
        menu: {
            [type]: 'object',
            [desc]: 'Navigation bar menu links',
            [defaultValue]: {
                Home: '/',
                Archives: '/archives',
                Categories: '/categories',
                Tags: '/tags',
                About: '/about'
            },
            '*': {
                [type]: 'string',
                [desc]: 'Path or URL to the menu item'
            }
        },
        links: {
            ...IconLink,
            [desc]: 'Navigation bar links to be shown on the right',
            [defaultValue]: {
                'Download on GitHub': {
                    icon: 'fab fa-github',
                    url: 'http://github.com/ppoffice/hexo-theme-icarus'
                }
            }
        }
    },
    footer: {
        [type]: 'object',
        [description]: 'Footer section link settings',
        links: {
            ...IconLink,
            [desc]: 'Links to be shown on the right of the footer section',
            [defaultValue]: {
                'Creative Commons': {
                    icon: 'fab fa-creative-commons',
                    url: 'https://creativecommons.org/'
                },
                'Attribution 4.0 International': {
                    icon: 'fab fa-creative-commons-by',
                    url: 'https://creativecommons.org/licenses/by/4.0/'
                },
                'Download on GitHub': {
                    icon: 'fab fa-github',
                    url: 'http://github.com/ppoffice/hexo-theme-icarus'
                }
            }
        }
    },
    article: {
        [type]: 'object',
        [desc]: 'Article display settings',
        highlight: {
            [type]: 'string',
            [desc]: 'Code highlight theme (https://github.com/highlightjs/highlight.js/tree/master/src/styles)',
            [defaultValue]: 'atom-one-light'
        },
        thumbnail: {
            [type]: 'boolean',
            [desc]: 'Whether to show article thumbnail images',
            [defaultValue]: true
        },
        readtime: {
            [type]: 'boolean',
            [desc]: 'Whether to show estimate article reading time',
            [defaultValue]: true
        }
    },
    search: {
        [type]: 'object',
        [desc]: 'Search plugin settings (http://ppoffice.github.io/hexo-theme-icarus/categories/Configuration/Search-Plugins)',
        type: {
            [type]: 'string',
            [desc]: 'Name of the search plugin',
            [defaultValue]: 'insight'
        },
        cx: {
            [type]: 'string',
            [desc]: 'Google CSE cx value',
            [required]: true,
            [condition]: parent => parent.type === 'google-cse'
        }
    },
    comment: {
        [type]: 'object',
        [desc]: 'Comment plugin settings (http://ppoffice.github.io/hexo-theme-icarus/categories/Configuration/Comment-Plugins)',
        type: {
            [type]: 'string',
            [desc]: 'Name of the comment plugin',
            [defaultValue]: null
        },
        appid: {
            [type]: 'string',
            [desc]: 'Changyan comment app ID',
            [required]: true,
            [condition]: parent => parent.type === 'changyan'
        },
        conf: {
            [type]: 'string',
            [desc]: 'Changyan comment configuration ID',
            [required]: true,
            [condition]: parent => parent.type === 'changyan'
        },
        shortname: {
            [type]: 'string',
            [desc]: 'Disqus shortname',
            [required]: true,
            [condition]: parent => parent.type === 'disqus'
        },
        owner: {
            [type]: 'string',
            [desc]: 'Your GitHub ID',
            [required]: true,
            [condition]: parent => parent.type === 'gitment'
        },
        repo: {
            [type]: 'string',
            [desc]: 'The repo to store comments',
            [required]: true,
            [condition]: parent => parent.type === 'gitment'
        },
        client_id: {
            [type]: 'string',
            [desc]: 'Your client ID',
            [required]: true,
            [condition]: parent => parent.type === 'gitment'
        },
        client_secret: {
            [type]: 'string',
            [desc]: 'Your client secret',
            [required]: true,
            [condition]: parent => parent.type === 'gitment'
        },
        url: {
            [type]: 'string',
            [desc]: 'URL to your Isso comment service',
            [required]: true,
            [condition]: parent => parent.type === 'isso'
        },
        uid: {
            [type]: 'string',
            [desc]: 'LiveRe comment service UID',
            [required]: true,
            [condition]: parent => parent.type === 'livere'
        },
        app_id: {
            [type]: 'boolean',
            [desc]: 'LeanCloud APP ID',
            [required]: true,
            [condition]: parent => parent.type === 'valine'
        },
        app_key: {
            [type]: 'boolean',
            [desc]: 'LeanCloud APP key',
            [required]: true,
            [condition]: parent => parent.type === 'valine'
        },
        notify: {
            [type]: 'boolean',
            [desc]: 'Enable email notification when someone comments',
            [defaultValue]: false,
            [condition]: parent => parent.type === 'valine'
        },
        verify: {
            [type]: 'boolean',
            [desc]: 'Enable verification code service',
            [defaultValue]: false,
            [condition]: parent => parent.type === 'valine'
        },
        placeholder: {
            [type]: 'boolean',
            [desc]: 'Placeholder text in the comment box',
            [defaultValue]: 'Say something...',
            [condition]: parent => parent.type === 'valine'
        }
    },
    share: {
        [type]: 'object',
        [desc]: 'Share plugin settings (http://ppoffice.github.io/hexo-theme-icarus/categories/Configuration/Share-Plugins)',
        type: {
            [type]: 'string',
            [desc]: 'Share plugin name',
            [defaultValue]: null
        },
        install_url: {
            [type]: 'string',
            [desc]: 'URL to the share plugin script provided by share plugin service provider',
            [required]: true,
            [condition]: parent => parent.type === 'sharethis' || parent.type === 'addthis'
        }
    },
    widgets: {
        [type]: 'array',
        [desc]: 'Sidebar widget settings',
        [defaultValue]: DEFAULT_WIDGETS,
        '*': {
            [type]: 'object',
            [desc]: 'Single widget settings',
            type: {
                [type]: 'string',
                [desc]: 'Widget name',
                [required]: true,
                [defaultValue]: 'profile'
            },
            position: {
                [type]: 'string',
                [desc]: 'Where should the widget be placed, left or right',
                [required]: true,
                [defaultValue]: 'left'
            },
            author: {
                [type]: 'string',
                [desc]: 'Author name to be shown in the profile widget',
                [condition]: parent => parent.type === 'profile',
                [defaultValue]: 'Your name'
            },
            author_title: {
                [type]: 'string',
                [desc]: 'Title of the author to be shown in the profile widget',
                [condition]: parent => parent.type === 'profile',
                [defaultValue]: 'Your title'
            },
            location: {
                [type]: 'string',
                [desc]: 'Author\'s current location to be shown in the profile widget',
                [condition]: parent => parent.type === 'profile',
                [defaultValue]: 'Your location'
            },
            avatar: {
                [type]: 'string',
                [desc]: 'Path or URL to the avatar to be shown in the profile widget',
                [condition]: parent => parent.type === 'profile',
                [defaultValue]: '/images/avatar.png'
            },
            gravatar: {
                [type]: 'string',
                [desc]: 'Email address for the Gravatar to be shown in the profile widget',
                [condition]: parent => parent.type === 'profile'
            },
            follow_link: {
                [type]: 'string',
                [desc]: 'Path or URL for the follow button',
                [condition]: parent => parent.type === 'profile'
            },
            social_links: {
                ...IconLink,
                [desc]: 'Links to be shown on the bottom of the profile widget',
                [condition]: parent => parent.type === 'profile'
            },
            links: {
                [type]: 'object',
                [desc]: 'Links to be shown in the links widget',
                [condition]: parent => parent.type === 'links',
                '*': {
                    [type]: 'string',
                    [desc]: 'Path or URL to the link',
                    [required]: true
                }
            }
        }
    },
    plugins: {
        [type]: 'object',
        [desc]: 'Other plugin settings',
        gallery: {
            [type]: 'boolean',
            [desc]: 'Enable the lightGallery and Justified Gallery plugins',
            [defaultValue]: true
        },
        'outdated-browser': {
            [type]: 'boolean',
            [desc]: 'Enable the Outdated Browser plugin',
            [defaultValue]: true
        },
        animejs: {
            [type]: 'boolean',
            [desc]: 'Enable page animations',
            [defaultValue]: true
        },
        mathjax: {
            [type]: 'boolean',
            [desc]: 'Enable the MathJax plugin',
            [defaultValue]: true
        },
        'google-analytics': {
            [type]: ['boolean', 'object'],
            [desc]: 'Google Analytics plugin settings (http://ppoffice.github.io/hexo-theme-icarus/2018/01/01/plugin/Analytics/#Google-Analytics)',
            tracking_id: {
                [type]: 'string',
                [desc]: 'Google Analytics tracking id',
                [defaultValue]: null
            }
        },
        'baidu-analytics': {
            [type]: ['boolean', 'object'],
            [desc]: 'Baidu Analytics plugin settings (http://ppoffice.github.io/hexo-theme-icarus/2018/01/01/plugin/Analytics/#Baidu-Analytics)',
            tracking_id: {
                [type]: 'string',
                [desc]: 'Baidu Analytics tracking id',
                [defaultValue]: null
            }
        }
    },
    providers: {
        [type]: 'object',
        [desc]: 'CDN provider settings',
        cdn: {
            [type]: 'string',
            [desc]: 'Name or URL of the JavaScript and/or stylesheet CDN provider',
            [defaultValue]: 'cdnjs'
        },
        fontcdn: {
            [type]: 'string',
            [desc]: 'Name or URL of the webfont CDN provider',
            [defaultValue]: 'google'
        },
        iconcdn: {
            [type]: 'string',
            [desc]: 'Name or URL of the webfont Icon CDN provider',
            [defaultValue]: 'fontawesome'
        }
    }
};