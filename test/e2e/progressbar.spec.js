const { renderToString } = require('inferno-server');
const ProgressBar = require('hexo-component-inferno/lib/view/plugin/progressbar');
const { test, expect } = require('./fixtures');

test('real Pace paints fast Cyberpunk PJAX progress before hiding naturally', async ({ page, visit }) => {
    await visit('/', { variant: 'cyberpunk' });
    const html = renderToString(new ProgressBar({ jsUrl: '/pace.js' }).render());
    const initializer = await page.evaluate(html => {
        const template = document.createElement('template');
        template.innerHTML = html;
        document.head.appendChild(template.content.querySelector('style'));
        return template.content.querySelector('script:not([src])').textContent;
    }, html);
    await page.addScriptTag({ content: initializer });
    await page.addScriptTag({ path: require.resolve('pace-js/pace.min.js') });
    await expect(page.locator('.pace')).toHaveClass(/pace-inactive/);
    const runningAfterComplete = await page.evaluate(() => {
        document.dispatchEvent(new Event('pjax:send'));
        // A prefetched page can complete synchronously, before the first animation frame.
        document.dispatchEvent(new Event('pjax:complete'));
        return window.Pace.running;
    });
    expect(runningAfterComplete).toBe(true);
    await expect.poll(() => page.locator('.pace-progress').evaluate(bar =>
        getComputedStyle(bar.parentElement).display !== 'none' && bar.getBoundingClientRect().right > 0)).toBe(true);
    await expect(page.locator('.pace-progress')).toHaveCSS('background-color', 'rgb(252, 238, 9)');
    await expect(page.locator('.pace-progress')).toHaveCSS('height', '3px');
    await expect(page.locator('.pace')).toHaveClass(/pace-inactive/);
});
