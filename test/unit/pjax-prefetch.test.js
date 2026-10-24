const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function createRequests() {
    let time = 0;
    const window = {};
    vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../../source/js/pjax-prefetch.js'), 'utf8'), {
        window, Date: { now: () => time }
    });
    const calls = [];
    const pjax = { options: { cacheBust: false } };
    function sendRequest(href, options, callback) {
        const xhr = { readyState: 1 };
        calls.push({ owner: this, href, options, xhr, respond: text => callback(text, xhr) });
        return xhr;
    }
    const requests = window.IcarusPjaxPrefetch.create(pjax, sendRequest);
    return { calls, pjax, requests, expire: () => { time += 5 * 60 * 1000; } };
}

describe('PJAX prefetch requests', () => {
    it('deduplicates hashes and asynchronously consumes a completed response only once', async () => {
        const { calls, pjax, requests } = createRequests();
        requests.prefetch('/post/#one');
        requests.prefetch('/post/#two');
        assert.equal(calls.length, 1);
        assert.equal(calls[0].owner, pjax);
        assert.equal(calls[0].options, pjax.options);
        assert.equal(calls[0].href, '/post/');
        calls[0].respond('page');
        const received = [];
        const options = {};
        const request = requests.doRequest.call(pjax, '/post/#three', options, (...args) => received.push(args));
        assert.equal(received.length, 0);
        assert.equal(request.readyState, 1);
        await Promise.resolve();
        assert.equal(request.readyState, 4);
        assert.deepEqual(received, [['page', calls[0].xhr, '/post/#three', options]]);
        requests.doRequest.call(pjax, '/post/', {}, () => {});
        assert.equal(calls.length, 2);
    });

    it('joins an in-flight prefetch and retries a failed response as a navigation', () => {
        const { calls, pjax, requests } = createRequests();
        requests.prefetch('/post/');
        const callback = () => {};
        const options = {};
        requests.doRequest.call(pjax, '/post/#heading', options, callback);
        assert.equal(calls.length, 1);
        calls[0].respond(null);
        assert.equal(calls.length, 2);
        assert.equal(calls[1].href, '/post/#heading');
        assert.equal(calls[1].options, options);
        assert.equal(pjax.request, calls[1].xhr);
    });

    for (const completed of [false, true]) {
        it(`does not deliver an aborted ${completed ? 'completed' : 'in-flight'} prefetch`, async () => {
            const { calls, pjax, requests } = createRequests();
            requests.prefetch('/post/');
            if (completed) {
                calls[0].respond('page');
            }
            let received = false;
            const request = requests.doRequest.call(pjax, '/post/', {}, () => { received = true; });
            request.abort();
            if (!completed) {
                calls[0].respond(null);
            }
            await Promise.resolve();
            assert.equal(received, false);
            assert.equal(calls.length, 1, 'an aborted navigation must not retry');
        });
    }

    for (const options of [
        { cacheBust: true },
        { requestOptions: { requestMethod: 'POST' } },
        { requestOptions: { requestParams: ['query'] } },
        { requestOptions: { formData: {} } }
    ]) {
        it(`keeps normal requests for ${JSON.stringify(options)}`, () => {
            const { calls, pjax, requests } = createRequests();
            requests.prefetch('/post/');
            const result = requests.doRequest.call(pjax, '/post/', options, () => {});
            assert.equal(calls.length, 2);
            assert.equal(result, calls[1].xhr);
            assert.equal(calls[1].owner, pjax);
            assert.equal(calls[1].options, options);
        });
    }

    it('expires prefetches at five minutes and retries failures on the next hover', () => {
        const { calls, pjax, requests, expire } = createRequests();
        requests.prefetch('/expired/');
        expire();
        requests.doRequest.call(pjax, '/expired/', {}, () => {});
        assert.equal(calls.length, 2);
        requests.prefetch('/failed/');
        calls[2].respond(null);
        requests.prefetch('/failed/');
        assert.equal(calls.length, 4);
    });
});
