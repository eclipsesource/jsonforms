
import {ISchemaGenerator} from './generators';

export class SchemaGenerator implements ISchemaGenerator {

    protected static requiredProperties(properties: string[]): string[] {
        return properties; // all known properties are required by default
    }

    protected static allowAdditionalProperties(properties: Object): boolean {
        return true; // allow other properties by default
    }

    public generateDefaultSchema(instance: Object): Object {
        return this.schemaObject(instance,
            SchemaGenerator.allowAdditionalProperties,
            SchemaGenerator.requiredProperties);
    };

    public generateDefaultSchemaWithOptions(
        instance: Object,
        allowAdditionalProperties: (properties: Object) => boolean,
        requiredProperties: (properties: string[]) =>  string[]) : Object {

        return this.schemaObject(instance, allowAdditionalProperties, requiredProperties);
    }

    private schemaObject(instance: Object,
                         allowAdditionalProperties: (properties: Object) => boolean,
                         requiredProperties: (properties: string[]) =>  string[]) : Object {
        let properties = this.properties(instance, allowAdditionalProperties, requiredProperties);
        return {
            'type': 'object',
            'properties': properties,
            'additionalProperties': allowAdditionalProperties(properties),
            'required': requiredProperties(_.keys(properties))
        };
    }

    private properties = (instance: Object,
                          allowAdditionalProperties: (properties: Object) => boolean,
                          requiredProperties: (properties: string[]) =>  string[]) : Object => {
        let generator = this;
        return _.keys(instance).reduce((acc, key) => {
            acc[key] = generator.property(instance[key],
                allowAdditionalProperties, requiredProperties);
            return acc;
        }, {});
    };

    private property(instance: Object,
                     allowAdditionalProperties: (properties: Object) => boolean,
                     requiredProperties: (properties: string[]) =>  string[]): Object {
        switch (typeof instance) {
            case 'string':
                return { 'type': 'string' };
            case 'boolean':
                return { 'type': 'boolean' };
            case 'number':
                if (_.toNumber(instance) % 1 === 0) {
                    return { 'type': 'integer' };
                }
                return { 'type': 'number' };
            case 'object':
                return this.schemaObjectOrNullOrArray(instance,
                    allowAdditionalProperties, requiredProperties);
            default:
                return {};
        }
    }

    private schemaObjectOrNullOrArray(
        instance: Object,
        allowAdditionalProperties: (properties: Object) => boolean,
        requiredProperties: (properties: string[]) =>  string[]): Object {

        if (!_.isNull(instance)) {
            if (_.isArray(instance)) {
                return this.schemaArray(<Array<Object>>instance,
                    allowAdditionalProperties, requiredProperties);
            } else {
                return this.schemaObject(instance,
                    allowAdditionalProperties, requiredProperties);
            }
        } else {
            return { 'type': 'null' };
        }
    }

    private schemaArray(
        instance: Array<Object>,
        allowAdditionalProperties: (properties: Object) => boolean,
        requiredProperties: (properties: string[]) =>  string[]): Object {

        if (instance.length) {
            let generator = this;
            let allProperties = instance.map((object) =>
                generator.property(object, allowAdditionalProperties, requiredProperties)
            );
            let uniqueProperties = this.distinct(allProperties, JSON.stringify);
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
        }
    };

    private distinct(array: Array<Object>, discriminator: (item: Object) => any): Array<Object> {
        let known = {};
        return array.filter(item => {
            let discriminatorValue = discriminator(item);
            if (_.has(known, discriminatorValue)) {
                return false;
            } else {
                return (known[discriminatorValue] = true);
            }
        });
    };
}

export default angular
    .module('jsonforms.generators.schema', ['jsonforms.generators'])
    .service('SchemaGenerator', SchemaGenerator)
    .name;

