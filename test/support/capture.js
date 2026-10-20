/**
 * Run a function while capturing everything written to stdout/stderr/console and
 * turning process.exit() into a thrown ExitError, so theme startup code can be tested
 * in-process without killing the test runner or flooding its output.
 */
class ExitError extends Error {
    constructor(code) {
        super(`process.exit(${code})`);
        this.code = code;
    }
}

function capture(fn) {
    const chunks = [];
    const record = (...args) => {
        chunks.push(args.map(arg => {
            return typeof arg === 'string' ? arg : require('util').inspect(arg);
        }).join(' ') + '\n');
    };
    const saved = {
        stdout: process.stdout.write,
        stderr: process.stderr.write,
        exit: process.exit,
        console: {}
    };
    const consoleMethods = ['log', 'info', 'warn', 'error', 'debug', 'trace'];
    process.stdout.write = chunk => { chunks.push(String(chunk)); return true; };
    process.stderr.write = chunk => { chunks.push(String(chunk)); return true; };
    process.exit = code => { throw new ExitError(code); };
    for (const method of consoleMethods) {
        saved.console[method] = console[method];
        console[method] = record;
    }
    const restore = () => {
        process.stdout.write = saved.stdout;
        process.stderr.write = saved.stderr;
        process.exit = saved.exit;
        for (const method of consoleMethods) {
            console[method] = saved.console[method];
        }
    };
    let result;
    let error = null;
    try {
        result = fn();
    } catch (e) {
        error = e;
    } finally {
        restore();
    }
    return {
        result,
        error,
        exitCode: error instanceof ExitError ? error.code : null,
        output: chunks.join('')
    };
}

/** Temporarily append flags to process.argv while running fn. */
function withArgv(flags, fn) {
    const original = process.argv;
    process.argv = original.concat(flags);
    try {
        return fn();
    } finally {
        process.argv = original;
    }
}

module.exports = { capture, withArgv, ExitError };
