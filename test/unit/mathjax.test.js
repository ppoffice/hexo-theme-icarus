const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const vm = require('vm');

describe('MathJax PJAX lifecycle', () => {
    function load(MathJax, errors = []) {
        const window = { MathJax };
        vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../../source/js/pjax-page.js'), 'utf8'), {
            window,
            document: { baseURI: 'https://example.com/', querySelector: () => null, querySelectorAll: () => [], dispatchEvent() {} },
            location: { hash: '' },
            CustomEvent: class CustomEvent {},
            console: { error: (...args) => errors.push(args) }
        });
        return window.IcarusPjaxPage;
    }

    it('clears old MathItems before replacement and again after pending typesetting settles', async () => {
        const calls = [];
        load({
            typesetClear: () => calls.push('clear'),
            texReset: () => calls.push('reset'),
            whenReady: action => Promise.resolve().then(action)
        }).beforeReplace();
        assert.deepEqual(calls, ['clear']);
        await Promise.resolve();
        assert.deepEqual(calls, ['clear', 'clear', 'reset']);
    });

    it('tolerates pages without MathJax and the configuration-only startup phase', () => {
        for (const math of [undefined, { tex: {} }]) {
            const lifecycle = load(math);
            lifecycle.beforeReplace();
            lifecycle.complete();
        }
    });

    it('handles asynchronous typesetting failures instead of leaking a rejected promise', async () => {
        const errors = [];
        const failure = new Error('font load failed');
        load({ typesetPromise: () => Promise.reject(failure) }, errors).complete();
        await Promise.resolve();
        assert.deepEqual(errors, [['MathJax reload error:', failure]]);
    });
});
