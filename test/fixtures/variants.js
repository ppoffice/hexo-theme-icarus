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

/**
 * A post with code blocks to fold with a preview of their first lines (article.highlight.fold_preview):
 * a long block marked >folded, a long block, and a short block that fits in its preview.
 */
function foldPreviewPost() {
    const lines = (name, count) => Array.from({ length: count }, (_, i) => `const ${name}${i + 1} = ${i + 1};`);
    return {
        'source/_posts/fold-preview.md': [
            '---',
            'title: Fold Preview',
            'date: 2024-06-01 10:00:00',
            '---',
            'A long folded code block:',
            '',
            '```js Long folded >folded',
            ...lines('folded', 8),
            '```',
            '',
            'A long code block:',
            '',
            '```js Long unfolded',
            ...lines('unfolded', 8),
            '```',
            '',
            'A short code block:',
            '',
            '```js Short >folded',
            ...lines('short', 2),
            '```',
            ''
        ].join('\n')
    };
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

    'm3e': {
        theme: {
            variant: 'm3e', appearance: 'auto',
            donates: [{ type: 'alipay', qrcode: '/img/avatar.png' }]
        },
        files: {
            'source/_posts/m3e-light.md': '---\ntitle: M3E Light\ndate: 2024-05-01 12:00:00\nthumbnail: /img/avatar.png\ncategories: [[Guides, CSS]]\nappearance: light\n---\nAlways light.',
            'source/_posts/m3e-dark.md': '---\ntitle: M3E Dark\ndate: 2024-05-02 12:00:00\nappearance: dark\n---\nAlways dark.',
            'source/_posts/m3e-components.md': [
                '---', 'title: M3E Components', 'date: 2024-05-03 12:00:00', 'toc: true', 'tags: [code]',
                'widgets:', '  - type: tags', '    position: left', '    show_count: false',
                '  - type: toc', '    position: left', '    index: false', '    collapsed: false',
                '  - type: categories', '    position: left',
                '  - type: followit', '    position: left', '    action_url: https://example.com/subscribe',
                '---', '## Components',
                '<a class="tag is-success" href="/about/">Preview</a>',
                '<a class="tag is-warning" href="/about/">Warning</a>',
                '<a class="tag is-danger" href="/about/">Danger</a>',
                '<div class="justified-gallery" style="position:relative;height:180px">',
                '<a href="/img/avatar.png" style="position:absolute;width:240px;height:160px">',
                '<img src="/img/avatar.png" alt="Gallery image" style="width:240px;height:160px">',
                '<div class="caption" style="position:absolute;bottom:0;width:100%">Justified caption</div></a></div>',
                '<div class="gallery-item"><a href="/img/avatar.png"><img src="/img/avatar.png" alt="Image"><p class="caption">Gallery caption</p></a></div>',
                '', '> A quieter quotation with a [source](/about/).', '',
                '## Another section', '', 'An unnumbered TOC heading.', '',
                '### First child', '', 'A nested heading.', '', '### Second child', '', 'Another nested heading.'
            ].join('\n')
        }
    },

    'm3e-animation': {
        theme: { variant: 'm3e', plugins: { animejs: true } }
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

    // A default site with a cyberpunk post (front-matter), navigated with PJAX.
    'variant-per-page': {
        theme: { plugins: { pjax: true } },
        files: {
            'source/_posts/cyberpunk-variant.md': [
                '---',
                'title: Cyberpunk Variant',
                'date: 2024-04-03 10:00:00',
                'variant: cyberpunk',
                '---',
                'A post in the cyberpunk variant. Back to [a default post](/2024/03/01/hello-world/).',
                ''
            ].join('\n')
        }
    },

    // A navbar staying at the top of the window at all widths (navbar.sticky), navigated with PJAX,
    // with a dark post, a cyberpunk post and a post whose navbar scrolls away (front-matter, which
    // replaces the navbar configuration).
    'navbar-sticky': {
        theme: { navbar: { sticky: true }, plugins: { pjax: true } },
        files: Object.fromEntries([
            ['sticky-dark', '2024-04-09', 'appearance: dark'],
            ['sticky-cyberpunk', '2024-04-08', 'variant: cyberpunk'],
            ['sticky-off', '2024-04-07', 'navbar: {"menu": {"Home": "/", "Archives": "/archives"}}']
        ].map(([name, date, frontMatter]) => [`source/_posts/${name}.md`, [
            '---',
            `title: Navbar ${name}`,
            `date: ${date} 10:00:00`,
            frontMatter,
            '---',
            `A post with the ${name} navbar. Read [section 12 of the long post](/2023/08/01/long-toc/#Section-12),`,
            'or [the posts with other navbars](/2024/04/09/sticky-dark/), [cyberpunk](/2024/04/08/sticky-cyberpunk/)',
            'and [off](/2024/04/07/sticky-off/).',
            ''
        ].join('\n')]))
    },

    // A navbar staying at the top of the window on mobile screens only.
    'navbar-sticky-mobile': {
        theme: { navbar: { sticky: 'mobile' } }
    },

    // A site without math plugins, navigated with PJAX, with a MathJax post and two KaTeX posts
    // (front-matter, which replaces the plugins of the site).
    'pjax-math': {
        theme: { plugins: { pjax: true } },
        files: Object.fromEntries([
            ['mathjax', '2024-04-06', 'mathjax: true', '/2024/04/05/katex-1/'],
            ['katex-1', '2024-04-05', 'katex: true', '/2024/04/04/katex-2/'],
            ['katex-2', '2024-04-04', 'katex: true', '/2024/04/06/mathjax/']
        ].map(([name, date, plugin, next]) => [`source/_posts/${name}.md`, [
            '---',
            `title: Math ${name}`,
            `date: ${date} 10:00:00`,
            // The plugins of the site, and the math plugin
            'plugins:',
            '    back_to_top: true',
            '    pjax: true',
            `    ${plugin}`,
            '---',
            `The ${name} formula: $$a^2 + b^2 = c^2$$`,
            ...name.startsWith('katex') ? [
                '',
                'Inline: \\\\(\\frac{a}{b}\\\\) and \\\\(\\ce{H2O}\\\\).',
                '',
                '$$\\ce{2H2 + O2 -> 2H2O}$$',
                '',
                '`\\(not rendered\\)` and $not math$.',
                '',
                '\\\\(\\href{javascript:alert(1)}{unsafe}\\\\)'
            ] : [
                '',
                'Inline: \\\\(\\frac{a}{b}\\\\).',
                '',
                '<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>x</mi><mo>+</mo><mn>1</mn></math>',
                '',
                '$$\\require{cancel}\\cancel{x} + \\mathfrak{A}$$'
            ],
            '',
            `[Next](${next}) or [home](/).`,
            ''
        ].join('\n')]))
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

    // Folded code blocks with a preview of their first lines, navigated with PJAX, and in the dark
    // appearance or the cyberpunk variant.
    'fold-preview': {
        theme: { article: { highlight: { fold_preview: 3 } }, plugins: { pjax: true } },
        files: foldPreviewPost()
    },

    'fold-preview-dark': {
        theme: { appearance: 'dark', article: { highlight: { fold_preview: 3 } } },
        files: foldPreviewPost()
    },

    'fold-preview-cyberpunk': {
        theme: { variant: 'cyberpunk', article: { highlight: { fold_preview: 3 } } },
        files: foldPreviewPost()
    },

    // Pages prefetched on hover, by the browser without PJAX, and by pjax.js with it.
    'prefetch': {
        theme: { plugins: { prefetch: { delay: 0 } } }
    },

    'pjax-prefetch': {
        theme: { plugins: { pjax: true, prefetch: true } }
    },

    // URLs relative to each page (`../../css/default.css`), which differ between pages at different
    // depths, navigated with PJAX.
    'pjax-relative-link': {
        site: { relative_link: true },
        theme: { plugins: { pjax: true } }
    },

    // The outdated notice, navigated with PJAX, with a dark post and a cyberpunk post (front-matter).
    // The posts of the fixture date from 2024 and earlier: outdated after 365 days.
    'outdated-notice': {
        theme: { plugins: { pjax: true }, article: { outdated_notice: { enable: true, days: 365 } } },
        files: {
            'source/_posts/outdated-dark.md': [
                '---',
                'title: Outdated Dark',
                'date: 2024-04-07 10:00:00',
                'appearance: dark',
                '---',
                'An outdated post with a dark appearance. Next: [the cyberpunk post](/2024/04/08/outdated-cyberpunk/).',
                ''
            ].join('\n'),
            'source/_posts/outdated-cyberpunk.md': [
                '---',
                'title: Outdated Cyberpunk',
                'date: 2024-04-08 10:00:00',
                'variant: cyberpunk',
                '---',
                'An outdated post in the cyberpunk variant. Back to [the dark post](/2024/04/07/outdated-dark/).',
                ''
            ].join('\n'),
            'source/_posts/outdated-off.md': [
                '---',
                'title: Outdated Off',
                'date: 2024-04-09 10:00:00',
                'outdated_notice: false',
                '---',
                'An old post without the outdated notice.',
                ''
            ].join('\n')
        }
    },

    // PJAX with a comment provider and analytics plugins, whose scripts the browser tests stub.
    'pjax-comment-analytics': {
        theme: {
            comment: {
                type: 'gitalk',
                client_id: 'fixture-client-id',
                proxy: 'https://gitalk.example.com',
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
            ['cusdis', { type: 'cusdis', app_id: 'fixture-app-id', lang: 'zh-cn' }],
            ['giscus-cyberpunk', null, { variant: 'cyberpunk', appearance: 'light' }]
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

    'browser-notice': {
        theme: { plugins: { outdated_browser: true, pjax: true } },
        files: {
            'source/_posts/browser-m3e.md': [
                'title: Browser notice M3E',
                'date: 2024-06-01 12:00:00',
                'variant: m3e',
                'appearance: dark',
                '---',
                '[Disable the notice](/2024/06/02/browser-off/) or [home](/).'
            ].join('\n'),
            'source/_posts/browser-off.md': [
                'title: Browser notice disabled',
                'date: 2024-06-02 12:00:00',
                'plugins:',
                '  back_to_top: true',
                '  pjax: true',
                '  outdated_browser: false',
                '---',
                '[M3E](/2024/06/01/browser-m3e/) or [home](/).'
            ].join('\n')
        }
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
