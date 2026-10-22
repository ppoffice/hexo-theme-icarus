/**
 * Fixture site variants. Each entry is merged on top of test/fixtures/site:
 *   site:  overrides for the Hexo _config.yml
 *   theme: overrides for _config.icarus.yml (arrays replace, objects merge);
 *          `false` removes the file so the theme generates its default configuration
 *   files: extra files to write, keyed by path relative to the site root
 */

/**
 * Posts named comments-<name>, published on consecutive days of May 2024, each with its comment
 * configuration (null for the one of the theme configuration), more front-matter, and links to
 * every post of the list.
 */
function commentPosts(posts) {
    const url = i => `/2024/05/0${i + 1}/comments-${posts[i][0]}/`;
    const links = posts.map(([name], i) => `- [${name}](${url(i)})`).join('\n');
    return Object.fromEntries(posts.map(([name, comment, frontMatter = {}], i) => {
        const fields = Object.assign({ title: `Comments ${name}`, date: `2024-05-0${i + 1} 10:00:00`, appearance: 'auto', comment }, frontMatter);
        const lines = Object.entries(fields).filter(([, value]) => value !== null)
            .map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`);
        return [`source/_posts/comments-${name}.md`, ['---', ...lines, '---', `A post with ${name} comments.`, '', links, ''].join('\n')];
    }));
}

// The fixture has 2 top-level categories, 5 tags and 9 months of posts.
const AMOUNT_WIDGETS = [
    { position: 'left', type: 'categories', amount: 1 },
    { position: 'left', type: 'tags', amount: 3 },
    { position: 'right', type: 'archives', amount: 3 }
];

module.exports = {
    // The base fixture as-is.
    'default': {},

    // No theme configuration at all: the theme must generate one and build with it.
    'generated-config': {
        theme: false
    },

    'cyberpunk': {
        theme: { variant: 'cyberpunk' }
    },

    // Dark colors following the system color scheme, or always.
    'appearance-auto': {
        theme: { appearance: 'auto' }
    },

    'appearance-dark': {
        theme: { appearance: 'dark' }
    },

    // A logo of the site, with a dark version.
    'appearance-auto-custom-logo': {
        theme: { appearance: 'auto', logo: '/img/avatar.png', logo_dark: '/img/og_image.png' }
    },

    // A light site with a dark post and an "auto" post (front-matter), navigated with PJAX.
    'appearance-per-page': {
        theme: { plugins: { pjax: true } },
        files: {
            'source/_posts/dark-appearance.md': [
                '---',
                'title: Dark Appearance',
                'date: 2024-04-02 10:00:00',
                'appearance: dark',
                '---',
                'A post with a dark appearance. Next: [the auto post](/2024/04/01/auto-appearance/).',
                '',
                '```js',
                'const dark = true;',
                '```',
                ''
            ].join('\n'),
            'source/_posts/auto-appearance.md': [
                '---',
                'title: Auto Appearance',
                'date: 2024-04-01 10:00:00',
                'appearance: auto',
                '---',
                'A post following the system color scheme. Back to [the dark post](/2024/04/02/dark-appearance/)',
                'or [a light post](/2024/02/20/code-blocks/).',
                '',
                '```js',
                'const auto = true;',
                '```',
                ''
            ].join('\n')
        }
    },

    // The "auto" appearance for posts only, from a layout configuration file.
    'appearance-posts-auto': {
        files: { '_config.post.yml': 'appearance: auto\n' }
    },

    // The cyberpunk variant is always dark and ignores the appearance setting.
    'cyberpunk-appearance-dark': {
        theme: { variant: 'cyberpunk', appearance: 'dark' }
    },

    'pjax': {
        theme: { plugins: { pjax: true } }
    },

    // PJAX with a comment provider and analytics plugins, whose scripts the browser tests stub.
    'pjax-comment-analytics': {
        theme: {
            comment: {
                type: 'gitalk',
                client_id: 'fixture-client-id',
                client_secret: 'fixture-client-secret',
                repo: 'fixture-comments',
                owner: 'fixture-owner',
                admin: ['fixture-owner']
            },
            plugins: {
                pjax: true,
                matomo: { url: 'https://matomo.example.com/', site_id: 1 },
                umami: { website_id: 'fixture-umami' }
            }
        }
    },

    // PJAX with a post for each comment provider whose client the browser tests stub: Giscus from
    // the theme configuration, the others from the front-matter. The posts follow the system color
    // scheme (appearance: auto), except the light Giscus post, and link to each other. The Waline
    // page view counter, with its own server, is stubbed too.
    'pjax-comments': {
        theme: {
            comment: {
                type: 'giscus',
                repo: 'fixture-owner/fixture-comments',
                repoId: 'fixture-repo-id',
                category: 'Comments',
                categoryId: 'fixture-category-id',
                mapping: 'pathname',
                theme: 'light',
                darkTheme: 'dark_dimmed'
            },
            plugins: { pjax: true, waline_pageview: { server_url: 'https://waline.example.com' } }
        },
        files: commentPosts([
            ['giscus', null],
            ['giscus-light', null, { appearance: null }],
            ['utterances', { type: 'utterances', repo: 'fixture-owner/fixture-comments', issue_term: 'pathname', dark_theme: 'photon-dark' }],
            ['beaudar', { type: 'beaudar', repo: 'fixture-owner/fixture-comments', branch: 'main', issue_term: 'title', dark_theme: 'icy-dark' }],
            ['waline', { type: 'waline', server_url: 'https://waline.example.com' }],
            ['artalk', { type: 'artalk', server: 'https://artalk.example.com', site: 'Icarus Fixture' }],
            ['cusdis', { type: 'cusdis', app_id: 'fixture-app-id', lang: 'zh-cn' }]
        ])
    },

    // The Waline page view counter with the server of the Waline comments.
    'waline-pageview': {
        theme: {
            comment: { type: 'waline', server_url: 'https://waline.example.com' },
            plugins: { waline_pageview: true }
        }
    },

    // Valine, which the theme and hexo-component-inferno warn about.
    'comment-valine': {
        theme: { comment: { type: 'valine', app_id: 'fixture', app_key: 'fixture' } }
    },

    // Some packages from another CDN provider or URL than the rest.
    'cdn-overrides': {
        theme: {
            plugins: { pjax: true },
            providers: {
                cdn: 'jsdelivr',
                cdn_overrides: {
                    'jquery': 'cdnjs',
                    'highlight.js': 'unpkg',
                    'clipboard': 'https://static.example.com/js/clipboard.min.js'
                }
            }
        }
    },

    'animejs': {
        theme: { plugins: { animejs: true } }
    },

    'zh-CN': {
        site: { language: 'zh-CN' }
    },

    'vi': {
        site: { language: 'vi' }
    },

    // A language the theme has no translation for.
    'unsupported-language': {
        site: { language: 'nl' }
    },

    // The table of contents is the only widget of the right column.
    'toc-only-right': {
        theme: {
            widgets: [
                { position: 'left', type: 'profile', author: 'Fixture Author' },
                { position: 'right', type: 'toc', index: true, collapsed: false, depth: 3 }
            ]
        }
    },

    // Widgets showing some of their entries, with a link to the page of all of them.
    'widget-amount': {
        theme: { widgets: AMOUNT_WIDGETS }
    },

    'widget-amount-zh-CN': {
        site: { language: 'zh-CN' },
        theme: { widgets: AMOUNT_WIDGETS }
    },

    'one-column': {
        theme: { widgets: [] }
    },

    // `widgets: null` in _config.icarus.yml must also disable the widgets of the theme
    // directory's _config.yml, which Hexo merges array items into rather than replacing.
    'no-widgets-over-theme-dir': {
        theme: { widgets: null },
        files: {
            'themes/icarus/_config.yml': 'widgets:\n  - position: left\n    type: profile\n    author: Theme Dir Author\n  - position: right\n    type: recent_posts\n'
        }
    },

    // A layout configuration file disabling all widgets on posts only.
    'no-widgets-on-posts': {
        files: { '_config.post.yml': 'widgets: null\n' }
    },

    // Every plugin enabled, with placeholder IDs.
    'all-plugins': {
        theme: {
            plugins: {
                animejs: true,
                back_to_top: true,
                baidu_analytics: { tracking_id: 'fixture' },
                bing_webmaster: { tracking_id: 'fixture' },
                busuanzi: true,
                cnzz: { id: 'fixture', web_id: 'fixture' },
                cookie_consent: { type: 'info', theme: 'edgeless', static: false, position: 'bottom-left', policyLink: 'https://example.com/' },
                gallery: true,
                google_analytics: { tracking_id: 'G-FIXTURE' },
                hotjar: { site_id: 'fixture' },
                katex: true,
                mathjax: true,
                matomo: { url: 'https://matomo.example.com', site_id: 7, disable_cookies: true },
                outdated_browser: true,
                pjax: true,
                progressbar: true,
                statcounter: { project: 'fixture', security: 'fixture' },
                twitter_conversion_tracking: { pixel_id: 'fixture' },
                umami: { website_id: 'fixture-umami', domains: 'example.com' },
                waline_pageview: { server_url: 'https://waline.example.com' }
            }
        }
    }
};
