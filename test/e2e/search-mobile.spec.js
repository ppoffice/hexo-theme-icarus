const { test, expect } = require('./fixtures');

for (const variant of ['default', 'cyberpunk', 'm3e']) {
    for (const width of [320, 390]) {
        test(`Algolia branding does not push close off-screen (${variant}, ${width}px)`, async ({ page, visit }) => {
            await page.setViewportSize({ width, height: 844 });
            await visit('/', { variant });
            await page.locator('.searchbox').evaluate(box => {
                // InstantSearch nests the searchBox root and form inside the input host.
                // The real PoweredBy SVG has a 572:64 aspect ratio and a 1.2em height.
                box.querySelector('.searchbox-header').innerHTML = `
                    <div class="searchbox-input-container" id="algolia-input">
                        <div class="ais-SearchBox searchbox-input-container">
                            <form class="ais-SearchBox-form searchbox-input-container">
                                <input class="ais-SearchBox-input searchbox-input" type="search" placeholder="Type something...">
                            </form>
                        </div>
                    </div>
                    <div id="algolia-poweredby" style="display:flex;margin:0 .5em 0 1em;align-items:center;line-height:0">
                        <a href="https://www.algolia.com/" aria-label="Search by Algolia">
                            <svg height="1.2em" viewBox="0 0 572 64" style="width:auto"><title>Search by Algolia</title></svg>
                        </a>
                    </div>
                    <a class="searchbox-close" href="javascript:;">&times;</a>`;
                box.classList.add('show');
            });
            const close = page.locator('.searchbox-close');
            const bounds = await close.evaluate(button => {
                const rect = button.getBoundingClientRect();
                const logo = document.querySelector('#algolia-poweredby').getBoundingClientRect();
                const input = document.querySelector('#algolia-input input').getBoundingClientRect();
                return { left: rect.left, right: rect.right, width: rect.width, viewport: innerWidth,
                    logoLeft: logo.left, logoRight: logo.right, inputRight: input.right, inputWidth: input.width };
            });
            expect(bounds.left).toBeGreaterThanOrEqual(0);
            expect(bounds.right).toBeLessThanOrEqual(bounds.viewport + .5);
            expect(bounds.width).toBeGreaterThanOrEqual(32);
            expect(bounds.logoRight).toBeLessThanOrEqual(bounds.left);
            expect(bounds.inputRight).toBeLessThanOrEqual(bounds.logoLeft);
            expect(bounds.inputWidth).toBeGreaterThan(24);
            await page.locator('#algolia-input input').fill('Icarus');
            await close.click();
            await expect(page.locator('.searchbox')).not.toHaveClass(/show/);
        });
    }
}

for (const variant of ['default', 'cyberpunk', 'm3e']) {
    test(`Google find-more text and magnifier follow theme link colors (${variant})`, async ({ page, visit }) => {
        await visit('/', { variant });
        // Google's SDK adds these fixed blue colors after the theme stylesheet.
        await page.addStyleTag({ content: '.gcsc-find-more-on-google{color:#1a0dab}.gcsc-find-more-on-google-magnifier{fill:#1a0dab}' });
        await page.locator('.searchbox').evaluate(box => {
            box.classList.add('searchbox-google', 'show');
            box.querySelector('.searchbox-body').innerHTML = '<a class="gcsc-find-more-on-google" href="https://www.google.com/search?q=icarus"><svg class="gcsc-find-more-on-google-magnifier" width="16" height="16"><path d="M0 0h16v16H0z"/></svg><span class="gcsc-find-more-on-google-text">Search </span><span class="gcsc-find-more-on-google-query">icarus</span> on Google</a>';
        });
        const link = page.locator('.gcsc-find-more-on-google');
        for (const appearance of ['light', 'dark']) {
            await page.evaluate(value => document.documentElement.setAttribute('data-appearance', value), appearance);
            const expected = await link.evaluate(el => {
                const probe = document.createElement('span');
                probe.style.color = 'var(--search-result-link)';
                el.appendChild(probe);
                const color = getComputedStyle(probe).color;
                probe.remove();
                return color;
            });
            await expect(link).toHaveCSS('color', expected);
            await expect(link.locator('.gcsc-find-more-on-google-text')).toHaveCSS('color', expected);
            await expect(link.locator('.gcsc-find-more-on-google-query')).toHaveCSS('color', expected);
            await expect(link.locator('svg')).toHaveCSS('fill', expected);
            await link.hover();
            await expect(link).toHaveCSS('color', expected);
            await link.focus();
            await expect(link).toHaveCSS('color', expected);
        }
    });

    test(`Google current page keeps its highlight on hover and focus (${variant})`, async ({ page, visit }) => {
        await visit('/', { variant });
        await page.locator('.searchbox').evaluate(box => {
            box.classList.add('searchbox-google', 'show');
            box.querySelector('.searchbox-body').innerHTML = '<div class="gsc-results"><div class="gsc-cursor-box"><div class="gsc-cursor-page gsc-cursor-current-page" tabindex="0">1</div><div class="gsc-cursor-page" tabindex="0">2</div></div></div>';
        });
        const current = page.locator('.gsc-cursor-current-page');
        const color = await current.evaluate(element => getComputedStyle(element).backgroundColor);
        expect(color).not.toBe('rgba(0, 0, 0, 0)');
        await current.hover();
        await expect(current).toHaveCSS('background-color', color);
        await current.focus();
        await expect(current).toHaveCSS('background-color', color);
    });
}

for (const variant of ['default', 'cyberpunk', 'm3e']) {
    test(`Google results fill landscape search and right-align sorting (${variant})`, async ({ page, visit }) => {
        await page.setViewportSize({ width: 844, height: 390 });
        await visit('/', { variant });
        // Reproduce the constraints from Google's own stylesheet without a network query.
        await page.addStyleTag({ content: '.gsc-wrapper,.gsc-above-wrapper-area{max-width:700px}.gsc-orderby-container{width:30%;text-align:left}.gsc-orderby{text-align:left}.gsc-option-menu-container{display:inline-block}' });
        await page.locator('.searchbox').evaluate(box => {
            box.classList.add('searchbox-google', 'show');
            box.querySelector('.searchbox-body').innerHTML = `
                <div class="gsc-control-cse"><div class="gsc-control-wrapper-cse">
                    <div class="gsc-results-wrapper-overlay">
                        <div class="gsc-above-wrapper-area"><table class="gsc-above-wrapper-area-container" style="width:100%"><tbody><tr>
                            <td class="gsc-result-info-container"><div class="gsc-result-info">About 26 results</div></td>
                            <td class="gsc-orderby-container"><div class="gsc-orderby"><div class="gsc-option-menu-container"><span>Sort by</span><span> ▾</span></div></div></td>
                        </tr></tbody></table></div>
                        <div class="gsc-wrapper"><div class="gsc-resultsbox-visible"><div class="gsc-resultsRoot"><div class="gsc-results">Search results</div></div></div></div>
                    </div>
                </div></div>`;
        });
        const bounds = await page.locator('.searchbox').evaluate(box => {
            const rect = selector => box.querySelector(selector).getBoundingClientRect();
            const content = rect('.gsc-control-wrapper-cse');
            const results = rect('.gsc-wrapper');
            const toolbar = rect('.gsc-above-wrapper-area');
            const table = rect('.gsc-above-wrapper-area-container');
            const sort = rect('.gsc-option-menu-container');
            return { viewport: innerWidth, panel: rect('.searchbox-container').width,
                content: content.width, results: results.width, toolbar: toolbar.width,
                sortRight: sort.right, tableRight: table.right };
        });
        expect(bounds.panel).toBe(bounds.viewport);
        expect(Math.abs(bounds.results - bounds.content)).toBeLessThan(1);
        expect(Math.abs(bounds.toolbar - bounds.content)).toBeLessThan(1);
        expect(Math.abs(bounds.sortRight - bounds.tableRight)).toBeLessThan(1);
    });
}
