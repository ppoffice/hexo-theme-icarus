let chalk;
try {
    chalk = require('chalk'); // eslint-disable-line node/no-extraneous-require
} catch (e) { }

module.exports = new Proxy({}, {
    get(obj, prop) {
        if (chalk) {
            return chalk[prop];
        }
        return function() {
            return arguments.length === 1 ? arguments[0] : arguments;
        };
    }
});
