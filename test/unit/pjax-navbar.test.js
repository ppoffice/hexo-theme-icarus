const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const vm = require('vm');

describe('PJAX navbar lifecycle', () => {
    it('restores the replaced navbar synchronously before requesting page scripts', () => {
        const events = new Map();
        const calls = [];
        const from = {};
        const to = {};
        const options = {};
        const result = {};
        let pjax;
        class Pjax {
            constructor() {
                pjax = this;
                this.state = { href: '/archives/' };
            }

            switchSelectors(selectors, fromEl, toEl, receivedOptions) {
                assert.equal(this, pjax);
                assert.deepEqual(selectors, ['.navbar-start', '.navbar-end']);
                assert.equal(fromEl, from);
                assert.equal(toEl, to);
                assert.equal(receivedOptions, options);
                calls.push('replace');
                return this.afterAllSwitches();
            }

            afterAllSwitches() {
                assert.equal(this, pjax);
                calls.push('request scripts');
                events.get('pjax:complete')();
                return result;
            }
        }
        vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../../source/js/pjax.js'), 'utf8'), {
            document: { addEventListener: (name, callback) => events.set(name, callback) },
            window: {
                Pjax,
                IcarusPjaxPage: {
                    resolveUrls(doc, href) {
                        assert.equal(doc, from);
                        assert.equal(href, pjax.state.href);
                        calls.push('resolve');
                    },
                    complete: () => calls.push('complete')
                },
                IcarusNavbar: { destroy: () => calls.push('destroy'), init: () => calls.push('init') }
            }
        });
        events.get('DOMContentLoaded')();
        for (let i = 0; i < 2; i++) {
            assert.equal(pjax.switchSelectors(['.navbar-start', '.navbar-end'], from, to, options), result);
        }
        const navigation = ['resolve', 'destroy', 'replace', 'init', 'request scripts', 'complete'];
        assert.deepEqual(calls, navigation.concat(navigation));
    });
});
