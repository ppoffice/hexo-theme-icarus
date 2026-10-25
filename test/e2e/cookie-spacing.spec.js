const { test, expect } = require('./fixtures');

for (const width of [320, 1000]) {
    for (const type of ['info', 'opt-in']) {
        test(`M3E cookie actions have room inside the rounded shell (${type}, ${width}px)`, async ({ page, visit }) => {
            await page.setViewportSize({ width, height: 844 });
            await visit('/', { variant: 'm3e' });
            await page.evaluate(type => {
                // The released CookieConsent edgeless floating layout, independent of its network SDK.
                const popup = document.createElement('div');
                popup.className = `cc-window cc-floating cc-theme-edgeless cc-type-${type}`;
                popup.style.cssText = 'position:fixed;left:16px;bottom:16px;width:min(396px, calc(100% - 32px));padding:0;z-index:10000';
                popup.innerHTML = '<div class="cc-message" style="padding:24px">This website uses cookies.</div>'
                    + '<div class="cc-compliance" style="display:flex">'
                    + (type === 'opt-in' ? '<a class="cc-btn" style="flex:1;padding:8px" role="button">Decline</a>' : '')
                    + '<a class="cc-btn" style="flex:1;padding:8px" role="button">Allow</a></div>';
                document.body.appendChild(popup);
            }, type);
            await expect(page.locator('.cc-window')).toHaveCSS('font-size', '15px');
            await expect(page.locator('.cc-message')).toHaveCSS('font-size', '15px');
            const layout = await page.locator('.cc-window').evaluate(popup => {
                const shell = popup.getBoundingClientRect();
                const buttons = [...popup.querySelectorAll('.cc-btn')].map(button => button.getBoundingClientRect());
                return { left: buttons[0].left - shell.left, right: shell.right - buttons[buttons.length - 1].right,
                    bottom: shell.bottom - buttons[0].bottom, gap: buttons.length === 2 ? buttons[1].left - buttons[0].right : null,
                    overflow: popup.scrollWidth > popup.clientWidth };
            });
            expect(layout.left).toBeCloseTo(24, 1);
            expect(layout.right).toBeCloseTo(24, 1);
            expect(layout.bottom).toBeCloseTo(24, 1);
            if (type === 'opt-in') expect(layout.gap).toBeCloseTo(12, 1);
            expect(layout.overflow).toBe(false);
        });
    }
}
