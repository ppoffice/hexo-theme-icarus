const yaml = require('js-yaml');
const YamlType = require('js-yaml/lib/js-yaml/type');
const YamlSchema = require('js-yaml/lib/js-yaml/schema');

// output null as empty in yaml
const YAML_SCHEMA = new YamlSchema({
    include: [
        require('js-yaml/lib/js-yaml/schema/default_full')
    ],
    implicit: [
        new YamlType('tag:yaml.org,2002:null', {
            kind: 'scalar',
            resolve(data) {
                if (data === null) {
                    return true;
                }
                const max = data.length;
                return (max === 1 && data === '~')
                    || (max === 4 && (data === 'null' || data === 'Null' || data === 'NULL'));
            },
            construct: () => null,
            predicate: object => object === null,
            represent: {
                empty: () => ''
            },
            defaultStyle: 'empty'
        })
    ]
});

module.exports = {
    parse(str) {
        return yaml.safeLoad(str);
    },

    stringify(object) {
        return yaml.safeDump(object, {
            indent: 4,
            lineWidth: 1024,
            schema: YAML_SCHEMA
        });
    }
};
