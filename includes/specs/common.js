module.exports = {
    projectName: 'Icarus',
    is: {
        string(value) {
            return typeof(value) === 'string';
        },
        array(value) {
            return Array.isArray(value);
        },
        boolean(value) {
            return typeof(value) === 'boolean';
        },
        object(value) {
            return typeof(value) === 'object' && value.constructor == Object;
        }
    },
    descriptor: {
        type: Symbol('@type'),
        required: Symbol('@required'),
        description: Symbol('@description'),
        defaultValue: Symbol('@defaultValue'),
        condition: Symbol('@condition'),
    }
};