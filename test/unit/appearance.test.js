const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const script = fs.readFileSync(path.join(__dirname, '../../source/js/appearance.js'), 'utf8');

function createController({ mode = 'auto', saved = null, dark = false, blocked = false } = {}) {
    const attributes = { 'data-appearance-mode': mode, 'data-appearance': mode };
    const root = { style: {}, getAttribute: name => attributes[name], setAttribute: (name, value) => { attributes[name] = value; } };
    const listeners = {};
    const stored = [];
    const queries = {};
    const system = { matches: dark, addEventListener: (name, callback) => { system.change = callback; } };
    const window = { matchMedia: () => system };
    const document = {
        documentElement: root,
        querySelectorAll: selector => queries[selector] || [],
        addEventListener: (name, callback) => { listeners[name] = callback; },
        dispatchEvent() {}
    };
    vm.runInNewContext(script, {
        window, document,
        localStorage: {
            getItem() { if (blocked) { throw new Error('Denied'); } return saved; },
            setItem(key, value) { if (blocked) { throw new Error('Denied'); } stored.push([key, value]); }
        },
        CustomEvent: function() {}
    });
    const click = () => listeners.click({ target: { closest: () => ({}) } });
    return { root, attributes, stored, click, system, queries, window };
}

describe('appearance controller', () => {
    it('follows the system until the visitor chooses, then persists the opposite appearance', () => {
        const state = createController({ dark: true });
        assert.equal(state.attributes['data-appearance'], 'auto');
        state.click();
        assert.equal(state.attributes['data-appearance'], 'light');
        assert.equal(state.root.style.colorScheme, 'light');
        state.click();
        assert.equal(state.attributes['data-appearance'], 'dark');
        assert.deepEqual(state.stored, [['icarus:appearance', 'light'], ['icarus:appearance', 'dark']]);
    });

    it('restores only valid saved choices on auto pages', () => {
        assert.equal(createController({ saved: 'dark' }).attributes['data-appearance'], 'dark');
        assert.equal(createController({ saved: 'invalid' }).attributes['data-appearance'], 'auto');
        for (const mode of ['light', 'dark']) {
            const state = createController({ mode, saved: mode === 'light' ? 'dark' : 'light' });
            state.click();
            assert.equal(state.attributes['data-appearance'], mode);
            assert.deepEqual(state.stored, []);
        }
    });

    it('works when localStorage cannot be accessed', () => {
        const state = createController({ blocked: true });
        state.click();
        assert.equal(state.attributes['data-appearance'], 'dark');
        state.window.IcarusAppearance.apply();
        assert.equal(state.attributes['data-appearance'], 'dark');
    });

    it('reapplies the choice after a fixed page returns to auto', () => {
        const state = createController({ saved: 'dark' });
        state.root.setAttribute('data-appearance-mode', 'light');
        state.root.setAttribute('data-appearance', 'light');
        state.window.IcarusAppearance.apply();
        assert.equal(state.attributes['data-appearance'], 'light');
        state.root.setAttribute('data-appearance-mode', 'auto');
        state.root.setAttribute('data-appearance', 'auto');
        state.window.IcarusAppearance.apply();
        assert.equal(state.attributes['data-appearance'], 'dark');
    });
});
