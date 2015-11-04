///<reference path="../../references.ts"/>

module JSONForms {

    export class SchemaGenerator implements ISchemaGenerator{

        public generateDefaultSchema = (instance: Object) : Object => {
            return this.schemaObject(instance, this.allowAdditionalProperties, this.requiredProperties);
        };

        public generateDefaultSchemaWithOptions = (instance: Object,
                                                   allowAdditionalProperties: (properties:Object) => boolean,
                                                   requiredProperties: (properties: string[]) =>  string[]) : Object => {
            return this.schemaObject(instance, allowAdditionalProperties, requiredProperties);
        };

        private schemaObject = (instance: Object,
                                allowAdditionalProperties: (properties:Object) => boolean,
                                requiredProperties: (properties: string[]) =>  string[]) : Object => {
            var properties = this.properties(instance, allowAdditionalProperties, requiredProperties);
            return {
                "type": "object",
                "properties": properties,
                "additionalProperties": allowAdditionalProperties(properties),
                "required": requiredProperties(this.keys(properties))
            };
        };

        private properties = (instance: Object,
                              allowAdditionalProperties: (properties:Object) => boolean,
                              requiredProperties: (properties: string[]) =>  string[]) : Object => {
            var properties = {};
            var generator = this;
            this.keys(instance).forEach(function(property) {
                properties[property] = generator.property(instance[property],
                    allowAdditionalProperties, requiredProperties);
            });
            return properties;
        };

        private keys = (properties: Object) : string[] => {
            return Object.keys(properties);
        };

        private property = (instance: Object,
                            allowAdditionalProperties: (properties:Object) => boolean,
                            requiredProperties: (properties: string[]) =>  string[]) : Object => {
            switch (typeof instance) {
                case "string":
                case "boolean":
                    return { "type": typeof instance };
                case "number":
                    if (Number(instance) % 1 === 0) {
                        return { "type": "integer" };
                    } else {
                        return { "type": "number" };
                    }
                case "object":
                    return this.schemaObjectOrNullOrArray(instance, allowAdditionalProperties, requiredProperties);
                default:
                    return {};
            }
        };

        private schemaObjectOrNullOrArray= (instance: Object,
                                            allowAdditionalProperties: (properties:Object) => boolean,
                                            requiredProperties: (properties: string[]) =>  string[]): Object => {
            if (this.isNotNull(instance)) {
                if (this.isArray(instance)) {
                    return this.schemaArray(<Array<Object>>instance, allowAdditionalProperties, requiredProperties);
                } else {
                    return this.schemaObject(instance, allowAdditionalProperties, requiredProperties);
                }
            } else {
                return { "type": "null" };
            }
        };

        private schemaArray= (instance: Array<Object>,
                              allowAdditionalProperties: (properties:Object) => boolean,
                              requiredProperties: (properties: string[]) =>  string[]): Object => {
            if (instance.length) {
                var generator = this;
                var allProperties = instance.map(function(object) {
                    return generator.property(object, allowAdditionalProperties, requiredProperties);
                });
                var uniqueProperties = this.distinct(allProperties,
                    function(object) { return JSON.stringify(object) });
                if (uniqueProperties.length == 1) {
                    return {
                        "type": "array",
                        "items": uniqueProperties[0]
                    };
                } else {
                    return {
                        "type": "array",
                        "items": {
                            "oneOf": uniqueProperties
                        }
                    };
                }
            }
        };

        private isArray = (instance: any): boolean => {
            return Object.prototype.toString.call(instance) === '[object Array]';
        };

        private isNotNull = (instance: any): boolean => {
            return (typeof(instance) !== 'undefined') && (instance !== null);
        };

        private distinct = (array: Array<Object>, discriminator: (item: Object) => any): Array<Object> => {
            var known = {};
            return array.filter(function(item) {
                var discriminatorValue = discriminator(item);
                if (known.hasOwnProperty(discriminatorValue)) {
                    return false;
                } else {
                    return (known[discriminatorValue] = true);
                }
            });
        };

        protected requiredProperties = (properties: string[]): string[] => {
            return properties; // all known properties are required by default
        };

        protected allowAdditionalProperties = (properties:Object): boolean => {
            return true; // allow other properties by default
        }

    }
}