const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const vm = require('vm');

describe('main.js navbar refresh', () => {
    it('refreshes once after synchronous content layout without replacing the navbar', () => {
        const calls = [];
        const jQuery = selector => ({
            length: 0,
            each() { return this; },
            wrap() { calls.push('wrap ' + selector); return this; },
            addClass() { return this; },
            click() { calls.push('bind ' + selector); return this; },
            remove() { calls.push('remove ' + selector); return this; }
        });
        jQuery.fn = {};
        vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../../source/js/main.js'), 'utf8'), {
            jQuery,
            document: { documentElement: { lang: 'en' }, querySelectorAll: () => [] },
            window: {
                IcarusThemeSettings: { article: { highlight: { clipboard: false, fold: 'folded', fold_preview: 3 } } },
                IcarusNavbar: {
                    init: () => assert.fail('main.js must not initialize the navbar again'),
                    destroy: () => assert.fail('main.js must not dispose pending navbar work'),
                    refresh: () => calls.push('refresh')
                }
            }
        });
        assert.deepEqual(calls, [
            'wrap figure.highlight table',
            'bind figure.highlight.foldable figcaption .level-left',
            'bind figure.highlight.fold-preview .highlight-body',
            'remove #toc-mask',
            'refresh'
        ]);
    });
});
