
import { JsonSchema } from '../models/jsonSchema';

const ADDITIONAL_PROPERTIES = 'additionalProperties';
const REQUIRED_PROPERTIES   = 'required';

type Properties = {[property: string]: JsonSchema};

const distinct = (array: any[], discriminator: (item: any) => string): any[] => {
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

class Gen {

    constructor(private findOption: (props: Properties) => (optionName: string) => any) {

    }

    schemaObject = (data: Object): JsonSchema => {
        const props = this.properties(data);
        const schema: JsonSchema = {
            'type': 'object',
            'properties': props,
            'additionalProperties': this.findOption(props)(ADDITIONAL_PROPERTIES)
        };
        const required = this.findOption(props)(REQUIRED_PROPERTIES);
        if (required.length > 0) {
            schema.required = required;
        }

        return schema;
    }

    properties = (data: Object): Properties => {
        const emptyProps: Properties = {};

        return Object
            .keys(data)
            .reduce(
                (acc, propName) => {
                    acc[propName] = this.property(data[propName]);

                    return acc;
                },
                emptyProps
            );
    }

    property = (data: any): JsonSchema => {
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
    }

    schemaObjectOrArray = (data: any): JsonSchema => {
        if (data instanceof Array) {
            return this.schemaArray(data as any[]);
        } else {
            return this.schemaObject(data);
        }
    }

    schemaArray = (data: any[]): JsonSchema => {
        if (data.length > 0) {
            const allProperties = data.map(this.property);
            const uniqueProperties = distinct(allProperties, prop => JSON.stringify(prop));
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
}

/**
 * Generate a JSON schema based on the given data and any additional options.
 * @param {Object} instance the data to create a JSON schema for
 * @param {any} options any additional options that may alter the generated JSON schema
 * @returns {JsonSchema} the generated schema
 */
export const generateJsonSchema = (instance: Object, options: any = {}): JsonSchema => {

    const findOption = (props: Properties) => (optionName: string) => {
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
