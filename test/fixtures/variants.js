/**
 * Fixture site variants. Each entry is merged on top of test/fixtures/site:
 *   site:  overrides for the Hexo _config.yml
 *   theme: overrides for _config.icarus.yml (arrays replace, objects merge);
 *          `false` removes the file so the theme generates its default configuration
 *   files: extra files to write, keyed by path relative to the site root
 */
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
                umami: { website_id: 'fixture-umami', domains: 'example.com' }
            }
        }
    }
};
