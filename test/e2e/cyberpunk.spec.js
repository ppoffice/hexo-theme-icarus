const { test, expect } = require('./fixtures');
const { renderToString } = require('inferno-server');
const ProgressBar = require('hexo-component-inferno/lib/view/plugin/progressbar');

test.describe('cyberpunk variant', () => {
    for (const urlPath of ['/', '/2024/03/01/hello-world/', '/2024/02/20/code-blocks/', '/archives/']) {
        test(`${urlPath} loads cleanly`, async ({ page, visit, diagnostics }) => {
            await visit(urlPath, { variant: 'cyberpunk' });
            await expect(page.locator('link[href="/css/cyberpunk.css"]')).toHaveCount(1);
            await expect(page.locator('.column-main')).toBeVisible();
            expect(diagnostics.pageErrors).toEqual([]);
            expect(diagnostics.failedRequests).toEqual([]);
        });
    }

    test('applies the variant colors to the navbar and footer', async ({ page, visit }) => {
        await visit('/', { variant: 'cyberpunk' });
        const background = selector => page.locator(selector).evaluate(el => getComputedStyle(el).backgroundColor);
        const navbar = await background('.navbar-main');
        expect(navbar).not.toBe('rgb(255, 255, 255)');
        expect(await background('body > footer.footer')).toBe(navbar);
    });

    test('shows yellow reading progress as the article scrolls, independently of Pace', async ({ page, visit }) => {
        await visit('/2023/07/01/typography/', { variant: 'cyberpunk' });
        const progress = () => page.locator('body').evaluate(el => {
            const style = getComputedStyle(el, '::after');
            return { scale: new DOMMatrixReadOnly(style.transform).a, color: style.backgroundColor,
                position: style.position, height: style.height };
        });
        await page.evaluate(() => scrollTo(0, 0));
        await expect.poll(async () => (await progress()).scale).toBe(0);
        await page.evaluate(() => scrollTo(0, (document.documentElement.scrollHeight - innerHeight) / 2));
        await expect.poll(async () => Math.abs((await progress()).scale - .5)).toBeLessThan(.02);
        await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
        await expect.poll(async () => (await progress()).scale).toBe(1);
        expect(await progress()).toMatchObject({ color: 'rgb(252, 238, 9)', position: 'fixed', height: '3px' });
        await expect(page.locator('.pace')).toHaveCount(0);
        await visit('/', { variant: 'cyberpunk' });
        expect(await page.locator('body').evaluate(el => getComputedStyle(el, '::after').content)).toBe('none');
    });

    test('matches dropdown text glow to primary navigation in hover, focus and active states', async ({ page, visit }) => {
        await page.setViewportSize({ width: 1600, height: 1000 });
        await visit('/', { variant: 'cyberpunk' });
        const primary = page.locator('.navbar-start > a.navbar-item:not(.is-active)').first();
        const activePrimary = page.locator('.navbar-start > a.navbar-item.is-active');
        const trigger = page.locator('.navbar-start .navbar-link');
        const submenu = page.locator('.navbar-dropdown a.navbar-item').first();
        const glow = el => [getComputedStyle(el).color, getComputedStyle(el).textShadow];
        await primary.hover();
        await expect(primary).toHaveCSS('text-shadow', 'rgba(2, 215, 242, 0.6) 0px 0px 4px, rgba(2, 215, 242, 0.35) 0px 0px 14px');
        const hovered = await primary.evaluate(glow);
        await trigger.click();
        await submenu.hover();
        await expect.poll(() => submenu.evaluate(glow)).toEqual(hovered);
        await expect(submenu).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
        await page.mouse.move(0, 900);
        await trigger.focus();
        await page.keyboard.press('Tab');
        await expect(submenu).toBeFocused();
        expect(await submenu.evaluate(el => el.matches(':focus-visible'))).toBe(true);
        await expect.poll(() => submenu.evaluate(glow)).toEqual(hovered);
        await submenu.evaluate(el => el.classList.add('is-active'));
        const active = await activePrimary.evaluate(glow);
        await expect.poll(() => submenu.evaluate(glow)).toEqual(active);
        await expect(submenu).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
        await submenu.hover();
        await expect.poll(() => submenu.evaluate(glow)).toEqual(active);
    });

    test('keeps Pace yellow even when the plugin inserts its fallback CSS after the theme', async ({ page, visit }) => {
        await visit('/', { variant: 'cyberpunk' });
        const html = renderToString(new ProgressBar({ jsUrl: '/pace.js' }).render());
        const css = await page.evaluate(html => {
            const template = document.createElement('template');
            template.innerHTML = html;
            return template.content.querySelector('style').textContent;
        }, html);
        await page.addStyleTag({ content: css });
        await page.evaluate(() => {
            const pace = document.createElement('div');
            pace.className = 'pace pace-active';
            pace.innerHTML = '<div class="pace-progress" style="transform:translate3d(50%,0,0)"></div>';
            document.body.appendChild(pace);
        });
        await expect(page.locator('.pace-progress')).toHaveCSS('background-color', 'rgb(252, 238, 9)');
        await expect(page.locator('.pace-progress')).toHaveCSS('height', '3px');
        await expect(page.locator('.pace-progress')).toBeVisible();
    });

    test('uses body text color for ShareThis totals regardless of generated SDK IDs', async ({ page, visit }) => {
        await visit('/2024/03/01/hello-world/', { variant: 'cyberpunk' });
        await page.addStyleTag({ content: '#st-5 .st-total,#st-19 .st-total{color:#555} .sharethis-inline-share-buttons .st-btn{color:#fff}' });
        await page.locator('.article .content').evaluate(content => {
            for (const id of ['st-5', 'st-19']) {
                const share = document.createElement('div');
                share.id = id;
                share.className = 'sharethis-inline-share-buttons';
                share.innerHTML = '<div class="st-total"><span>123</span> shares</div><div class="st-btn">Share</div>';
                content.appendChild(share);
            }
        });
        const bodyColor = await page.locator('body').evaluate(el => getComputedStyle(el).color);
        for (const id of ['st-5', 'st-19']) {
            await expect(page.locator(`#${id} .st-total`)).toHaveCSS('color', bodyColor);
            await expect(page.locator(`#${id} .st-total span`)).toHaveCSS('color', bodyColor);
            await expect(page.locator(`#${id} .st-btn`)).toHaveCSS('color', 'rgb(255, 255, 255)');
        }
    });

    test('uses UI fonts for online preview tag links without changing numeric tags', async ({ page, visit }) => {
        await visit('/2024/03/01/hello-world/', { variant: 'cyberpunk' });
        await page.locator('.article .content').evaluate(content => {
            const link = document.createElement('a');
            link.className = 'tag is-success';
            link.id = 'online-preview';
            link.href = '#preview';
            link.textContent = '在线预览';
            content.appendChild(link);
            const count = document.createElement('span');
            count.className = 'tag';
            count.id = 'numeric-tag';
            count.textContent = '123';
            content.appendChild(count);
        });
        const family = await page.locator('body').evaluate(el => getComputedStyle(el).fontFamily);
        await expect(page.locator('#online-preview')).toHaveCSS('font-family', family);
        await page.locator('#online-preview').hover();
        await expect(page.locator('#online-preview')).toHaveCSS('font-family', family);
        expect(await page.locator('#numeric-tag').evaluate(el => getComputedStyle(el).fontFamily)).toContain('JetBrains Mono');
    });

    test('gives regular and immersive messages distinct stronger semantic fills', async ({ page, visit }) => {
        await visit('/2023/07/01/typography/', { variant: 'cyberpunk' });
        await page.locator('.article .content').evaluate(content => {
            for (const color of ['info', 'warning', 'success', 'dark']) {
                for (const immersive of [false, true]) {
                    const message = document.createElement('article');
                    message.id = `message-${color}-${immersive}`;
                    message.className = `message is-${color}` + (immersive ? ' message-immersive' : '');
                    message.innerHTML = '<div class="message-body">A message with a <a href="#message">link</a>.</div>';
                    content.appendChild(message);
                }
            }
        });
        for (const [color, rgb] of [['info', '2, 215, 242'], ['warning', '255, 142, 60'],
            ['success', '0, 255, 65'], ['dark', '127, 130, 173']]) {
            await expect(page.locator(`#message-${color}-true`)).toHaveCSS('background-color', `rgba(${rgb}, 0.14)`);
            await expect(page.locator(`#message-${color}-false`)).toHaveCSS('background-color', `rgba(${rgb}, 0.12)`);
        }
    });

    test('frames cookie consent with chamfered cyan edges and yellow HUD corners', async ({ page, visit }) => {
        await visit('/', { variant: 'cyberpunk' });
        await page.evaluate(() => {
            const popup = document.createElement('div');
            popup.className = 'cc-window cc-floating cc-theme-edgeless';
            popup.style.cssText = 'position:fixed;left:16px;bottom:16px;width:min(360px,calc(100% - 32px));padding:24px;z-index:10000';
            popup.innerHTML = '<div class="cc-message">This website uses cookies.</div><div class="cc-compliance"><a class="cc-btn" role="button" tabindex="0">Got it</a></div>';
            popup.querySelector('.cc-btn').addEventListener('click', () => { popup.dataset.clicked = 'true'; });
            document.body.appendChild(popup);
        });
        for (const width of [320, 1440]) {
            await page.setViewportSize({ width, height: 900 });
            const frame = await page.locator('.cc-window').evaluate(el => {
                const outer = getComputedStyle(el, '::before');
                const inner = getComputedStyle(el, '::after');
                return { position: getComputedStyle(el).position, outerClip: outer.clipPath,
                    innerClip: inner.clipPath, edge: outer.backgroundColor, fill: inner.backgroundColor,
                    overflow: el.scrollWidth > el.clientWidth };
            });
            expect(frame.position).toBe('fixed');
            expect(frame.outerClip).toContain('polygon(');
            expect(frame.innerClip).toContain('polygon(');
            expect(frame.edge).toBe('rgb(2, 215, 242)');
            expect(frame.fill).toBe('rgb(13, 12, 29)');
            expect(frame.outerClip).toContain('100% 100%, 0px 100%');
            expect(frame.overflow).toBe(false);
            const corner = await page.locator('.cc-compliance').evaluate(el => {
                const top = getComputedStyle(el, '::before');
                const bottom = getComputedStyle(el, '::after');
                return { top: { color: top.borderTopColor, width: top.borderTopWidth, top: top.top, left: top.left, z: top.zIndex },
                    bottom: bottom.content };
            });
            expect(corner).toEqual({
                top: { color: 'rgb(252, 238, 9)', width: '2px', top: '0px', left: '0px', z: '1' },
                bottom: 'none'
            });
        }
        await page.locator('.cc-btn').click();
        await expect(page.locator('.cc-window')).toHaveAttribute('data-clicked', 'true');
    });

    // The variant can be set per page in the front-matter
    test('PJAX switches the variant stylesheets from page to page without reloading', async ({ page, visit, diagnostics }) => {
        const CYBERPUNK_POST = '/2024/04/03/cyberpunk-variant/';
        const DEFAULT_POST = '/2024/03/01/hello-world/';
        // The theme stylesheet, and the first font family of the web font stylesheet
        const stylesheets = () => page.evaluate(() => Array.from(document.querySelectorAll('link[rel="stylesheet"]'), link => link.getAttribute('href'))
            .filter(href => href.startsWith('/css/') || href.includes('family='))
            .map(href => {
                const family = href.match(/family=(\w+)/);
                return family ? family[1] : href;
            }));
        const navbar = () => page.locator('.navbar-main').evaluate(el => getComputedStyle(el).backgroundColor);
        const pjaxClick = async locator => {
            const done = page.evaluate(() => new Promise(resolve => document.addEventListener('pjax:complete', resolve, { once: true })));
            await locator.click();
            await done;
            await page.waitForLoadState('networkidle');
        };

        await visit('/', { variant: 'variant-per-page' });
        await page.evaluate(() => { window.notReloaded = true; });
        expect(await stylesheets()).toEqual(['/css/github-calendar.css', 'Ubuntu', '/css/default.css']);
        const defaultNavbar = await navbar();

        await pjaxClick(page.locator(`.column-main a[href="${CYBERPUNK_POST}"]`).first());
        expect(await stylesheets()).toEqual(['/css/github-calendar.css', 'Oxanium', '/css/cyberpunk.css']);
        await expect.poll(navbar).not.toBe(defaultNavbar);

        await pjaxClick(page.locator(`.content a[href="${DEFAULT_POST}"]`));
        expect(await stylesheets()).toEqual(['/css/github-calendar.css', 'Ubuntu', '/css/default.css']);
        await expect.poll(navbar).toBe(defaultNavbar);

        expect(await page.evaluate(() => window.notReloaded)).toBe(true);
        expect(diagnostics.pageErrors).toEqual([]);
        expect(diagnostics.consoleErrors).toEqual([]);
        expect(diagnostics.failedRequests).toEqual([]);
    });

    test('keeps the code block controls working', async ({ page, visit, context }) => {
        await context.grantPermissions(['clipboard-read', 'clipboard-write']);
        await visit('/2024/02/20/code-blocks/', { variant: 'cyberpunk' });
        await page.locator('figure.highlight button.copy').first().click();
        expect((await page.evaluate(() => navigator.clipboard.readText())).replace(/\r\n/g, '\n').trim()).toBe('const answer = 42;\nconsole.log(answer);');
    });

    test('uses UI fonts for code titles and body Chinese fallbacks inside monospaced code', async ({ page, visit }) => {
        await visit('/2024/02/20/code-blocks/', { variant: 'cyberpunk' });
        const fonts = await page.locator('figure.highlight').first().evaluate(figure => {
            const caption = figure.querySelector('figcaption');
            const title = [...caption.querySelectorAll('span')].find(span => span.textContent.trim() === 'Captioned example');
            return { body: getComputedStyle(document.body).fontFamily, title: getComputedStyle(title).fontFamily,
                code: getComputedStyle(figure.querySelector('pre')).fontFamily,
                icons: [...caption.querySelectorAll('i')].map(icon => getComputedStyle(icon).fontFamily) };
        });
        expect(fonts.title).toBe(fonts.body);
        expect(fonts.title).toContain('Oxanium');
        expect(fonts.code).toMatch(/^"JetBrains Mono", Consolas, "Microsoft YaHei", monospace$/);
        expect(fonts.icons.length).toBeGreaterThan(0);
        expect(fonts.icons.every(font => font.includes('Font Awesome'))).toBe(true);
        await page.evaluate(() => {
            for (const [id, parent] of [['body-cjk', document.body], ['code-cjk', document.querySelector('figure.highlight pre')]]) {
                const probe = document.createElement('span');
                probe.id = id;
                probe.textContent = '这是一个行内公式';
                parent.appendChild(probe);
            }
        });
        const session = await page.context().newCDPSession(page);
        try {
            await session.send('DOM.enable');
            await session.send('CSS.enable');
            const { root } = await session.send('DOM.getDocument');
            const families = [];
            for (const selector of ['#body-cjk', '#code-cjk']) {
                const { nodeId } = await session.send('DOM.querySelector', { nodeId: root.nodeId, selector });
                const { fonts } = await session.send('CSS.getPlatformFontsForNode', { nodeId });
                families.push(fonts.filter(font => font.glyphCount > 0).map(font => font.familyName).sort());
            }
            expect(families[0].length).toBeGreaterThan(0);
            expect(families[1]).toEqual(families[0]);
        } finally {
            await session.detach();
        }
    });
});
