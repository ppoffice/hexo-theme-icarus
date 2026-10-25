const { renderToString } = require('inferno-server');
const Disqus = require('hexo-component-inferno/lib/view/comment/disqus');
const { test, expect } = require('./fixtures');

// Disqus probes a temporary anchor and walks ancestors for a non-transparent background.
// Its legacy parser accepts RGB/hex, not modern computed OKLCH colors.
const embed = `window.__disqusLoad = () => {
    window.__disqusAttempt = true;
    const thread = document.getElementById('disqus_thread');
    const link = document.createElement('a');
    link.href = '#probe';
    thread.appendChild(link);
    const anchor = getComputedStyle(link).color;
    link.remove();
    let background;
    for (let node = thread; node; node = node.parentElement) {
        background = getComputedStyle(node).backgroundColor;
        if (background !== 'rgba(0, 0, 0, 0)' && background !== 'transparent') break;
    }
    for (const color of [anchor, background]) {
        if (!/^(rgba?\\(|#)/.test(color)) throw new Error('parseColor received unparseable color: ' + color);
    }
    window.__disqusColors = { anchor, background };
    thread.replaceChildren();
};
window.__disqusLoad();`;

for (const appearance of ['light', 'dark']) {
    test(`Disqus receives legacy-compatible colors from M3E (${appearance})`, async ({ page, visit, diagnostics }) => {
        await visit('/2023/07/01/typography/', { variant: 'm3e' });
        await page.evaluate(value => document.documentElement.setAttribute('data-appearance', value), appearance);
        await page.route('**/fixture.disqus.com/embed.js', route => route.fulfill({ contentType: 'application/javascript', body: embed }));
        const html = renderToString(new Disqus({ shortname: 'fixture', path: '/test/', permalink: 'https://example.com/test/' }).render());
        const script = await page.evaluate(html => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = '<div class="card-content">' + html + '</div>';
            document.querySelector('.column-main').appendChild(card);
            return card.querySelector('script').textContent;
        }, html);
        await page.addScriptTag({ content: script });
        await expect.poll(() => page.evaluate(() => window.__disqusAttempt)).toBe(true);
        expect(diagnostics.pageErrors).toEqual([]);
        expect(await page.evaluate(() => window.__disqusColors)).toBeTruthy();
        // The real SDK clears the thread; its next reset must still see the RGB link override.
        await page.evaluate(() => window.__disqusLoad());
        expect(await page.locator('body').evaluate(el => getComputedStyle(el).color)).toContain('oklch');
    });
}
