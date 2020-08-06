/**
 * Register the Hexo helper functions for resolving the URL of static files of JavaScript libraries,
 * web fonts, and FontAwesome icon fonts.
 * @module hexo/helper/cdn
 */

/**
 * @private
 */
const PROVIDERS = {
    LIBRARY: {
        cdnjs: '[cdnjs]https://cdnjs.cloudflare.com/ajax/libs/${ package }/${ version }/${ filename }',
        loli: '[cdnjs]https://cdnjs.loli.net/ajax/libs/${ package }/${ version }/${ filename }',
        jsdelivr: 'https://cdn.jsdelivr.net/npm/${ package }@${ version }/${ filename }',
        unpkg: 'https://unpkg.com/${ package }@${ version }/${ filename }'
    },
    FONT: {
        host: '/css/font/font.css',
        google: 'https://fonts.googleapis.com/${ type }?family=${ fontname }',
        loli: 'https://fonts.loli.net/${ type }?family=${ fontname }'
    },
    ICON: {
        host: '/css/font/fontawesome/css/all.min.css',
        loli: 'https://cdnjs.loli.net/ajax/libs/font-awesome/5.12.0/css/all.min.css',
        jsdeliver: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.12.0/css/all.min.css',
        fontawesome: 'https://use.fontawesome.com/releases/v5.12.0/css/all.css'
    }
};

/**
 * Convert npm library path to CDN.js path
 * @private
 */
const CDNJS_FIXTURES = {
    'moment': (ver, fname) => [
        'moment.js', ver, fname.startsWith('min/') ? fname.substr(4) : fname
    ],
    'outdatedbrowser': (ver, fname) => [
        'outdated-browser', ver, fname.startsWith('outdatedbrowser/') ? fname.substr(16) : fname
    ],
    'highlight.js': (ver, fname) => [
        'highlight.js', ver, fname.endsWith('.css') && fname.indexOf('.min.') === -1
            ? fname.substr(0, fname.length - 4) + '.min.css' : fname
    ],
    'mathjax': (ver, fname) => [
        'mathjax', ver, (() => {
            fname = fname.startsWith('unpacked/') ? fname.substr(9) : fname;
            return fname.indexOf('.min.') > -1 ? fname.replace(/\.min\./gi, '.') : fname;
        })()
    ],
    'katex': (ver, fname) => [
        'KaTeX', ver, fname
    ],
    'pace-js': (ver, fname) => [
        'pace', ver, fname
    ],
    'clipboard': (ver, fname) => [
        'clipboard.js', ver, fname
    ],
    // disqusjs is not hosted on CDN.js
    'disqusjs': (ver, fname) => []
};

const UNPKG_FIXTURES = {
    'mathjax': (ver, fname) => [
        'mathjax', ver, fname.indexOf('.min.') > -1 ? fname.replace(/\.min\./gi, '.') : fname
    ],
    'disqusjs': (ver, fname) => [
        'disqusjs', ver, fname.indexOf('.min.') > -1 ? fname.replace(/\.min\./gi, '.') : fname
    ]
};

/**
 * Register the Hexo helper functions for resolving the URL of static files of JavaScript libraries,
 * web fonts, and FontAwesome icon fonts.
 *
 * @param {Hexo} hexo The Hexo instance.
 * @example
 * // Use the function below to resolve the CDN URL JavaScript library static files in your view files
 * cdn('jquery', '3.3.1', 'dist/jquery.min.js');
 * // -> https://cdn.jsdelivr.net/npm/jquery@3.3.1/dist/jquery.min.js
 *
 * // Use the function below to resolve the CDN URL web font files
 * fontcdn('Ubuntu:400,600|Source+Code+Pro', 'css');
 * // -> https://fonts.googleapis.com/css?family=Ubuntu:400,600|Source+Code+Pro
 *
 * // Use the function below to insert FontAwesome icon font CSS URL.
 * iconcdn();
 * // -> https://use.fontawesome.com/releases/v5.12.0/css/all.css
 */
module.exports = function(hexo) {
    function applyFixture(fixture, _package, version, filename) {
        if (Object.prototype.hasOwnProperty.call(fixture, _package)) {
            const result = fixture[_package](version, filename);
            // package is not hosted on the given CDN
            if (!result.length) {
                throw new Error();
            }
            return result;
        }
        return [_package, version, filename];
    }

    hexo.extend.helper.register('cdn', function(_package, version, filename) {
        const { cdn = 'jsdelivr' } = typeof this.config.providers === 'object' ? this.config.providers : {};
        let _cdn = cdn;
        if (_cdn in PROVIDERS.LIBRARY) {
            _cdn = PROVIDERS.LIBRARY[_cdn];
        }
        // cdn.js does not follow a GitHub npm style like jsdeliver and unpkg do. Patch it!
        if (_cdn.startsWith('[cdnjs]')) {
            if (_cdn.startsWith('[cdnjs]')) {
                _cdn = _cdn.substr(7);
            }
            try {
                [_package, version, filename] = applyFixture(CDNJS_FIXTURES, _package, version, filename);
                if (filename.startsWith('dist/')) {
                    filename = filename.substr(5);
                }
            } catch (e) {
                _cdn = PROVIDERS.LIBRARY.jsdelivr;
            }
        } else if (cdn === 'unpkg') {
            try {
                [_package, version, filename] = applyFixture(UNPKG_FIXTURES, _package, version, filename);
            } catch (e) {
                _cdn = PROVIDERS.LIBRARY.jsdelivr;
            }
        }
        return _cdn.replace(/\${\s*package\s*}/gi, _package)
            .replace(/\${\s*version\s*}/gi, version)
            .replace(/\${\s*filename\s*}/gi, filename);
    });

    hexo.extend.helper.register('fontcdn', function(fontName, type = 'css') {
        let { fontcdn = 'google' } = typeof this.config.providers === 'object' ? this.config.providers : {};
        if (fontcdn in PROVIDERS.FONT) {
            fontcdn = PROVIDERS.FONT[fontcdn];
        }
        return fontcdn.replace(/\${\s*fontname\s*}/gi, fontName)
            .replace(/\${\s*type\s*}/gi, type);
    });

    hexo.extend.helper.register('iconcdn', function() {
        let { iconcdn = 'fontawesome' } = typeof this.config.providers === 'object' ? this.config.providers : {};
        if (iconcdn in PROVIDERS.ICON) {
            iconcdn = PROVIDERS.ICON[iconcdn];
        }
        return iconcdn;
    });
};
