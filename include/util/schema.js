const Ajv = require('ajv');
const path = require('path');
const deepmerge = require('deepmerge');

const PRIMITIVE_DEFAULTS = {
    'null': null,
    'boolean': false,
    'number': 0,
    'integer': 0,
    'string': '',
    'array': [],
    'object': {}
};

class DefaultValue {
    constructor(value, description) {
        this.value = value;
        this.description = description;
    }

    merge(source) {
        if ('description' in source && source.description) {
            this.description = source.description;
        }
        if ('value' in source && source.value) {
            this.value = deepmerge(this.value, source.value);
        }
        return this;
    }

    toString() {
        return '[DefaultValue]' + JSON.stringify(value);
    }
}

class Schema {
    constructor(loader, def) {
        if (!(loader instanceof SchemaLoader)) {
            throw new Error('loader must be an instance of SchemaLoader');
        }
        if (typeof def !== 'object') {
            throw new Error('schema definition must be an object');
        }
        this.loader = loader;
        this.def = def;
        this.compiledSchema = null;
    }

    validate(obj) {
        if (!this.compiledSchema) {
            this.compiledSchema = this.loader.compileValidator(this.def.$id);
        }
        return this.compiledSchema(obj) ? true : this.compiledSchema.errors;
    }

    getArrayDefaultValue(def) {
        let value;
        if ('items' in def && typeof def.items === 'object') {
            const items = Object.assign({}, def.items);
            delete items.oneOf;
            value = this.getDefaultValue(items);
        }
        if ('oneOf' in def.items && Array.isArray(def.items.oneOf)) {
            value = def.items.oneOf.map(one => {
                if (!value) {
                    return this.getDefaultValue(one);
                }
                return new DefaultValue(value.value, value.description)
                    .merge(this.getDefaultValue(one));
            });
        }
        if (!Array.isArray(value)) {
            value = [value];
        }
        return new DefaultValue(value, def.description);
    }

    getObjectDefaultValue(def) {
        let value = {};
        if ('properties' in def && typeof def.properties === 'object') {
            for (let property in def.properties) {
                value[property] = this.getDefaultValue(def.properties[property]);
            }
        }
        if ('oneOf' in def && Array.isArray(def.oneOf) && def.oneOf.length) {
            value = deepmerge(value, this.getDefaultValue(def.oneOf[0]));
        }
        return new DefaultValue(value, def.description);
    }

    getTypedDefaultValue(def) {
        let defaultValue;
        const type = Array.isArray(def.type) ? def.type[0] : def.type;
        if (type === 'array') {
            defaultValue = this.getArrayDefaultValue(def);
        } else if (type === 'object') {
            defaultValue = this.getObjectDefaultValue(def);
        } else if (type in PRIMITIVE_DEFAULTS) {
            defaultValue = new DefaultValue(PRIMITIVE_DEFAULTS[type], def.description);
        } else {
            throw new Error(`Cannot get default value for type ${type}`)
        }
        // referred default value always get overwritten by its parent default value
        if ('$ref' in def && def.$ref) {
            defaultValue = this.getReferredDefaultValue(def).merge(defaultValue);
        }
        return defaultValue;
    }

    getReferredDefaultValue(def) {
        const schema = this.loader.getSchema(def.$ref);
        if (!schema) {
            throw new Error(`Schema ${def.$ref} is not loaded`);
        }
        return this.getDefaultValue(schema.def).merge({ description: def.description });
    }

    getDefaultValue(def = null) {
        if (!def) {
            def = this.def;
        }
        if ('const' in def) {
            return new DefaultValue(def['const'], def.description);
        }
        if ('default' in def) {
            return new DefaultValue(def['default'], def.description);
        }
        if ('examples' in def && Array.isArray(def.examples) && def.examples.length) {
            return new DefaultValue(def.examples[0], def.description);
        }
        if ('type' in def && def.type) {
            return this.getTypedDefaultValue(def);
        }
        // $ref only schemas
        if ('$ref' in def && def.$ref) {
            return this.getReferredDefaultValue(def);
        }
    }
}

class SchemaLoader {
    constructor() {
        this.schemas = {};
        this.ajv = new Ajv();
    }

    getSchema($id) {
        return this.schemas[$id];
    }

    addSchema(def) {
        if (!Object.prototype.hasOwnProperty.call(def, '$id')) {
            throw new Error('The schema definition does not have an $id field');
        }
        this.ajv.addSchema(def);
        this.schemas[def['$id']] = new Schema(this, def);
    }

    removeSchema($id) {
        this.ajv.removeSchema(def);
        delete this.schemas[$id];
    }

    compileValidator($id) {
        return this.ajv.compile(this.schemas[$id].def);
    }
}

function traverseObj(obj, targetKey, handler) {
    if (Array.isArray(obj)) {
        for (const child of obj) {
            traverseObj(child, targetKey, handler);
        }
    } else if (typeof obj === 'object') {
        for (const key in obj) {
            if (key === targetKey) {
                handler(obj[key]);
            } else {
                traverseObj(obj[key], targetKey, handler);
            }
        }
    }
}

SchemaLoader.load = (rootSchemaDef, resolveDirs = []) => {
    if (!Array.isArray(resolveDirs)) {
        resolveDirs = [resolveDirs];
    }

    const loader = new SchemaLoader();
    loader.addSchema(rootSchemaDef);

    function handler($ref) {
        if (typeof $ref !== 'string') {
            throw new Error('Invalid schema reference id: ' + JSON.stringify($ref));
        }
        if (loader.getSchema($ref)) {
            return;
        }
        for (const dir of resolveDirs) {
            let def;
            try {
                def = require(path.join(dir, $ref));
            } catch (e) {
                continue;
            }
            if (typeof def !== 'object' || def['$id'] !== $ref) {
                continue;
            }
            loader.addSchema(def);
            traverseObj(def, '$ref', handler);
            return;
        }
        throw new Error('Cannot find schema definition ' + $ref + '.\n'
            + 'Please check if the file exists and its $id is correct');
    }

    traverseObj(rootSchemaDef, '$ref', handler);
    return loader;
}

module.exports = SchemaLoader;