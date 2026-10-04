/**
 * Subresource Integrity for the CDN files loaded by the theme's own layouts.
 *
 * Integrity is only added for CDNs that serve npm package files unmodified (jsDelivr's /npm/
 * endpoint and unpkg). cdnjs and custom CDN templates may serve differently built files, and a
 * wrong hash would block the file, so nothing is added for them.
 *
 * test/unit/sri.test.js checks every hash against the npm package of that exact version and
 * that every library loaded by the layouts has one.
 */
const HASHES = {
    'jquery@3.7.1/dist/jquery.min.js': 'sha384-1H217gwSVyLSIfaLxHbE7dRb3v4mYCKbpQvzx0cegeju1MVsGrX5xXxAvs/HgeFs',
    'clipboard@2.0.11/dist/clipboard.min.js': 'sha384-J08i8An/QeARD9ExYpvphB8BsyOj3Gh2TSh1aLINKO3L0cMSH2dN3E22zFoXEi0Q',
    'pjax@0.2.8/pjax.min.js': 'sha384-PX09VH9WyqnmDCYeEn/EPioJLSHIfqN8Z6j9jG19dDOMYisDt4wxZ0U/yGXbNo6h'
};

const NPM_MIRRORS = ['jsdelivr', 'unpkg'];

/**
 * Attributes to spread on the <script>/<link> that loads cdn(name, version, filename).
 * @returns {{ integrity?: string, crossorigin?: string }}
 */
function sri(config, name, version, filename) {
    const providers = config && typeof config.providers === 'object' && config.providers ? config.providers : {};
    const cdn = providers.cdn || 'jsdelivr';
    const hash = HASHES[`${name}@${version}/${filename}`];
    if (!hash || !NPM_MIRRORS.includes(cdn)) {
        return {};
    }
    return { integrity: hash, crossorigin: 'anonymous' };
}

module.exports = { sri, HASHES };
