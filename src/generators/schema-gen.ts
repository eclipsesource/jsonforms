
import {JsonSchema} from '../models/jsonSchema';

const AdditionalProperties = 'additionalProperties';
const RequiredProperties   = 'required';

type Properties = {[property: string]: JsonSchema};

const distinct = (array: Array<any>, discriminator: (item: any) => string): Array<any> => {
    const known = {};
    return array.filter(item => {
        const discriminatorValue = discriminator(item);
        if (known.hasOwnProperty(discriminatorValue)) {
            return false;
        } else {
            known[discriminatorValue] = true;
            return true;
        }
    });
};

export const generateJsonSchemaWithOptions = (options: any) => (instance: Object): JsonSchema => {

    const findOption: (Properties) => (string) => any = (props) => (optionName) => {
        switch (optionName) {
            case AdditionalProperties:
                if (options.hasOwnProperty(AdditionalProperties)) {
                    return options[AdditionalProperties];
                }
                return true;
            case RequiredProperties:
                if (options.hasOwnProperty(RequiredProperties)) {
                    return options[RequiredProperties](props);
                }
                return Object.keys(props);
        }
    };

    const gen = new class {

        schemaObject = (data: Object): JsonSchema  => {
            const props = this.properties(data);
            const schema: JsonSchema = {
                'type': 'object',
                'properties': props,
                'additionalProperties': findOption(props)(AdditionalProperties)
            };
            const required = findOption(props)(RequiredProperties);
            if (required.length > 0) {
                schema['required'] = required;
            }
            return schema;
        };

        properties = (data: Object) : Properties =>
            Object.keys(data).reduce((acc, propName) => {
                acc[propName] = this.property(data[propName]);
                return acc;
            }, {});

        property = (data: any): Object => {
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

        schemaObjectOrArray = (data: any): JsonSchema => {
            if (data instanceof Array) {
                return this.schemaArray(<Array<any>>data);
            } else {
                return this.schemaObject(data);
            }
        };

        schemaArray = (data: Array<any>): JsonSchema => {
            if (data.length) {
                const allProperties = data.map(this.property);
                const uniqueProperties = distinct(allProperties, JSON.stringify);
                if (uniqueProperties.length === 1) {
                    return {
                        'type': 'array',
                        'items': uniqueProperties[0]
                    };
                } else {
                    return {
                        'type': 'array',
                        'items': {
                            'oneOf': uniqueProperties
                        }
                    };
                }
            } else {
                return {
                    'type': 'array',
                    'items': {}
                };
            }
        }
    };

    return gen.schemaObject(instance);
};

export const generateJsonSchema = (instance: Object): JsonSchema =>
    generateJsonSchemaWithOptions({})(instance);

export default generateJsonSchema;
