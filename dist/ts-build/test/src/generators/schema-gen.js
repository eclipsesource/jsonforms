"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ADDITIONAL_PROPERTIES = 'additionalProperties';
const REQUIRED_PROPERTIES = 'required';
const distinct = (array, discriminator) => {
    const known = {};
    return array.filter(item => {
        const discriminatorValue = discriminator(item);
        if (known.hasOwnProperty(discriminatorValue)) {
            return false;
        }
        else {
            known[discriminatorValue] = true;
            return true;
        }
    });
};
class Gen {
    constructor(findOption) {
        this.findOption = findOption;
        this.schemaObject = (data) => {
            const props = this.properties(data);
            const schema = {
                'type': 'object',
                'properties': props,
                'additionalProperties': this.findOption(props)(ADDITIONAL_PROPERTIES)
            };
            const required = this.findOption(props)(REQUIRED_PROPERTIES);
            if (required.length > 0) {
                schema.required = required;
            }
            return schema;
        };
        this.properties = (data) => {
            const emptyProps = {};
            return Object
                .keys(data)
                .reduce((acc, propName) => {
                acc[propName] = this.property(data[propName]);
                return acc;
            }, emptyProps);
        };
        this.property = (data) => {
            switch (typeof data) {
                case 'string':
                    return { 'type': 'string' };
                case 'boolean':
                    return { 'type': 'boolean' };
                case 'number':
                    if (Number.isInteger(data)) {
                        return { 'type': 'integer' };
                    }
                    return { 'type': 'number' };
                case 'object':
                    if (data == null) {
                        return { 'type': 'null' };
                    }
                    return this.schemaObjectOrArray(data);
                default:
                    return {};
            }
        };
        this.schemaObjectOrArray = (data) => {
            if (data instanceof Array) {
                return this.schemaArray(data);
            }
            else {
                return this.schemaObject(data);
            }
        };
        this.schemaArray = (data) => {
            if (data.length > 0) {
                const allProperties = data.map(this.property);
                const uniqueProperties = distinct(allProperties, prop => JSON.stringify(prop));
                if (uniqueProperties.length === 1) {
                    return {
                        'type': 'array',
                        'items': uniqueProperties[0]
                    };
                }
                else {
                    return {
                        'type': 'array',
                        'items': {
                            'oneOf': uniqueProperties
                        }
                    };
                }
            }
            else {
                return {
                    'type': 'array',
                    'items': {}
                };
            }
        };
    }
}
/**
 * Generate a JSON schema based on the given data and any additional options.
 * @param {Object} instance the data to create a JSON schema for
 * @param {any} options any additional options that may alter the generated JSON schema
 * @returns {JsonSchema} the generated schema
 */
exports.generateJsonSchema = (instance, options = {}) => {
    const findOption = (props) => (optionName) => {
        switch (optionName) {
            case ADDITIONAL_PROPERTIES:
                if (options.hasOwnProperty(ADDITIONAL_PROPERTIES)) {
                    return options[ADDITIONAL_PROPERTIES];
                }
                return true;
            case REQUIRED_PROPERTIES:
                if (options.hasOwnProperty(REQUIRED_PROPERTIES)) {
                    return options[REQUIRED_PROPERTIES](props);
                }
                return Object.keys(props);
            default:
                return;
        }
    };
    const gen = new Gen(findOption);
    return gen.schemaObject(instance);
};
//# sourceMappingURL=schema-gen.js.map