/**
 * Mark a test as documenting a confirmed bug that has not been fixed yet.
 *
 * The test body asserts the CORRECT behavior. While the bug exists the body fails
 * and the test is reported as passing (prefixed with "[known bug]"). As soon as the
 * bug is fixed the body passes, and this wrapper fails the test so whoever fixed it
 * remembers to turn `knownBug(...)` into a plain `it(...)` and keep it as a regression test.
 *
 * Set SHOW_KNOWN_BUGS=1 to print why each known-bug test currently fails, which is how
 * to check that it fails for the documented reason and not because of a broken test.
 */
const KNOWN_BUG_PREFIX = '[known bug]';

function knownBug(title, fn) {
    return it(`${KNOWN_BUG_PREFIX} ${title}`, async function() {
        let failure = null;
        try {
            await fn.call(this);
        } catch (e) {
            failure = e;
            if (process.env.SHOW_KNOWN_BUGS) {
                console.log(`      ↳ ${title}\n        ${String(e && e.message).split('\n').join('\n        ')}`);
            }
        }
        if (!failure) {
            throw new Error('This known bug appears to be fixed. '
                + 'Replace knownBug() with it() so the test guards against regressions.');
        }
    });
}

module.exports = { knownBug, KNOWN_BUG_PREFIX };
