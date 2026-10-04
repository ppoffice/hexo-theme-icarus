/**
 * Static accessibility checks of the markup rendered by this theme's own layouts on every
 * generated page. Post content (e.g. heading anchors added by the Markdown renderer) and
 * components rendered by hexo-component-inferno (licensing block, donate buttons, search box)
 * are outside this theme and not covered here.
 */
const assert = require('assert').strict;
const { getSite } = require('../support/site');

/** Accessible name of a link or button, approximating the accname algorithm for these cases. */
function accessibleName($, el) {
    const $el = $(el);
    const label = $el.attr('aria-label');
    if (label && label.trim()) {
        return label.trim();
    }
    const clone = $el.clone();
    clone.find('[aria-hidden="true"]').remove();
    const text = clone.text().trim();
    if (text) {
        return text;
    }
    return clone.find('img[alt]').map((i, img) => img.attribs.alt).get().join(' ').trim();
}

// Regions rendered by layouts in this repository.
const THEME_REGIONS = [
    '.navbar-main',
    'body > footer.footer',
    '#back-to-top',
    '.widget[data-type="profile"]',
    '.article-meta',
    '.article-tags',
    '.post-navigation',
    '.pagination',
    '.breadcrumb'
].join(', ');

describe('accessibility of the theme markup', function() {
    this.timeout(120000);
    let site;

    before(() => {
        site = getSite('default');
    });

    it('gives every link and button an accessible name', () => {
        const unnamed = [];
        site.htmlFiles().forEach(file => {
            const $ = site.$(file);
            $(THEME_REGIONS).find('a[href], button').add($('#back-to-top')).each((i, el) => {
                if (!accessibleName($, el)) {
                    unnamed.push(`${file}: ${$.html(el).slice(0, 120)}`);
                }
            });
        });
        assert.deepEqual(unnamed, []);
    });

    it('hides decorative icons inside links and buttons from assistive technology', () => {
        const exposed = [];
        site.htmlFiles().forEach(file => {
            const $ = site.$(file);
            $(THEME_REGIONS).find('a i[class*="fa-"], button i[class*="fa-"]').each((i, el) => {
                if ($(el).attr('aria-hidden') !== 'true') {
                    exposed.push(`${file}: ${$.html($(el).parent()).slice(0, 120)}`);
                }
            });
        });
        assert.deepEqual(exposed, []);
    });

    it('does not use javascript: links for controls', () => {
        site.htmlFiles().forEach(file => {
            const $ = site.$(file);
            assert.equal($(THEME_REGIONS).find('a[href^="javascript:"]').length, 0, file);
        });
    });

    it('gives every image an alt attribute', () => {
        site.htmlFiles().forEach(file => {
            const $ = site.$(file);
            $(THEME_REGIONS).find('img').each((i, el) => {
                assert.ok('alt' in el.attribs, `${file}: ${$.html(el)}`);
            });
        });
    });
});
