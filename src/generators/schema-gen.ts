
import {JsonSchema} from "../models/jsonSchema";

const AdditionalProperties = "additionalProperties";
const RequiredProperties   = "required";

type Properties = {[property: string]: JsonSchema}

const distinct = (array: Array<any>, discriminator: (item: any) => any): Array<any> => {
    const known = {};
    return array.filter(item => {
        const discriminatorValue = discriminator(item);
        if (known.hasOwnProperty(discriminatorValue)) {
            return false;
        } else {
            return (known[discriminatorValue] = true);
        }
    });
};

export const generateJsonSchema = (instance: Object): JsonSchema =>
    generateJsonSchemaWithOptions({})(instance);

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

        schemaObject = (instance: Object): JsonSchema  => {
            const props = this.properties(instance, options);
            return {
                'type': 'object',
                'properties': props,
                'additionalProperties': findOption(props)(AdditionalProperties),
                'required': findOption(props)(RequiredProperties)
            } as JsonSchema;
        };

        properties = (instance: Object, options: any) : Properties =>
            Object.keys(instance).reduce((acc, propName) => {
                acc[propName] = this.property(instance[propName]);
                return acc;
            }, {});

        property = (instance: any): Object => {
            switch (typeof instance) {
                case 'string':
                    return { 'type': 'string' };
                case 'boolean':
                    return { 'type': 'boolean' };
                case 'number':
                    if (Number.isInteger(instance)) {
                        return { 'type': 'integer' };
                    }
                    return { 'type': 'number' };
                case 'object':
                    if (instance == null) {
                        return { 'type': 'null' }
                    }
                    return this.schemaObjectOrArray(instance);
                default:
                    return {};
            }
        };

        schemaObjectOrArray = (instance: any): JsonSchema => {
            if (instance instanceof Array) {
                return this.schemaArray(<Array<any>>instance)
            } else {
                return this.schemaObject(instance);
            }
        };

        schemaArray = (instance: Array<any>): JsonSchema => {
            if (instance.length) {
                const allProperties = instance.map(this.property);
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
                }
            }
        };
    };

    return gen.schemaObject(instance);
};

export default generateJsonSchema;