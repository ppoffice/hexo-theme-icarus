const fs = require('fs');
const path = require('path');
const { test, expect } = require('./fixtures');

test('keeps the pending autofocus correction on PJAX back with an immediate main.js', async ({ page, visit, diagnostics }) => {
    const post = '/2024/03/01/hello-world/';
    const main = fs.readFileSync(path.join(__dirname, '../../source/js/main.js'), 'utf8');
    let visits = 0;
    await page.route('**' + post, async route => {
        const response = await route.fetch();
        let html = (await response.text()).replace('</head>', `<style>
            .navbar-main { height: 60px !important; min-height: 60px !important; }
            body > .section { min-height: 2400px; position: static; }
            body > .section > .container, body > .section > .container > .columns { position: static; }
            #back-focus { position: absolute; top: 600px; left: 20px; font-size: 16px; }
        </style></head>`).replace('<div class="columns">', '<div class="columns"><input id="back-focus" autofocus aria-label="Back focus">');
        if (++visits > 1) {
            // Execute the real page script inline on return: the zero-latency boundary where it
            // runs after Pjax autofocus but before the browser can deliver its native rAF.
            html = html.replace(/<script\b(?=[^>]*data-pjax)(?=[^>]*src="[^"]*\/js\/main\.js")[^>]*><\/script>/,
                `<script data-pjax>window.__fastMainBeforeFrame = window.__focusFrameRan === false;
                ${main}
                window.__fastMainRan = true;</script>`);
        }
        await route.fulfill({ response, body: html });
    });
    await visit(post, { variant: 'navbar-sticky' });
    await page.evaluate(() => {
        window.__noFullReload = true;
        window.scrollTo(0, 600);
    });
    expect(await page.locator('#back-focus').evaluate(input => input.getBoundingClientRect().top)).toBe(0);

    const left = page.evaluate(() => new Promise(resolve => document.addEventListener('pjax:complete', resolve, { once: true })));
    await page.locator('.navbar-start a', { hasText: 'Archives' }).click();
    await left;
    await page.evaluate(() => {
        const scrollTo = window.scrollTo.bind(window);
        window.scrollTo = (...args) => {
            scrollTo(...args);
            // Observe the real history restoration before either focus listener's rAF runs.
            const input = document.querySelector('#back-focus');
            if (args[1] === 600 && input) {
                window.__restoredInputTop = input.getBoundingClientRect().top;
            }
        };
        document.addEventListener('focusin', event => {
            if (event.target.id === 'back-focus') {
                window.__focusFrameRan = false;
                window.__focusVisible = event.target.matches(':focus-visible');
                window.__observerAtFocus = window.IcarusNavbarObserver;
                requestAnimationFrame(() => {
                    window.__focusFrameRan = true;
                });
            }
        });
    });
    const restored = page.evaluate(() => new Promise(resolve => {
        document.addEventListener('pjax:complete', () => {
            requestAnimationFrame(() => requestAnimationFrame(resolve));
        }, { once: true });
    }));
    await page.goBack();
    await restored;
    // No networkidle or synthetic frame queue: assert after two native animation frames.
    const state = await page.evaluate(() => ({
        top: document.querySelector('#back-focus').getBoundingClientRect().top,
        focused: document.activeElement.id === 'back-focus',
        focusVisible: window.__focusVisible,
        restoredTop: window.__restoredInputTop,
        mainRan: window.__fastMainRan,
        mainBeforeFrame: window.__fastMainBeforeFrame,
        observerKept: window.__observerAtFocus === window.IcarusNavbarObserver,
        noReload: window.__noFullReload
    }));
    expect(state).toEqual({
        top: 76, focused: true, focusVisible: true, restoredTop: 0,
        mainRan: true, mainBeforeFrame: true, observerKept: true, noReload: true
    });
    expect(visits).toBe(2);
    expect(diagnostics.pageErrors).toEqual([]);
});
