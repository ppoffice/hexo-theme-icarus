/**
 * Global mocha setup (see .mocharc.yml).
 * Filters known, harmless third-party noise so test output stays readable.
 */
const NOISE = [
    // babel-plugin-inferno uses deprecated @babel/types builders; not actionable here.
    /has been deprecated, please migrate to/,
    /^Inferno is in development mode\./
];

for (const method of ['log', 'warn']) {
    const original = console[method];
    console[method] = function(...args) {
        if (typeof args[0] === 'string' && NOISE.some(re => re.test(args[0]))) {
            return;
        }
        return original.apply(this, args);
    };
}
