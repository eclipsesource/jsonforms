///<reference path="../../references.ts"/>

module JSONForms{

    export class UISchemaGenerator implements IUISchemaGenerator{
        generateDefaultUISchema = (jsonSchema:any):any =>{
            var uiSchemaElements = [];
            this.generateUISchema(jsonSchema, uiSchemaElements, "#", "");
            return uiSchemaElements[0];
        };

        private generateUISchema = (jsonSchema:any, schemaElements:IUISchemaElement[], currentRef:string, schemaName:string):any =>{
            var type = this.deriveType(jsonSchema);

            switch(type) {

                case "object":
                    // Add a vertical layout with a label for the element name (if it exists)
                    var verticalLayout:IVerticalLayout = {
                        type: "VerticalLayout",
                        elements: []
                    };
                    schemaElements.push(verticalLayout);

                    if (schemaName && schemaName !== "") {
                        // add label with name
                        var label:ILabel = {
                            type: "Label",
                            text: PathUtil.beautify(schemaName)
                        };
                        verticalLayout.elements.push(label);
                    }

                    // traverse properties
                    if (!jsonSchema.properties) {
                        // If there are no properties return
                        return;
                    }

                    var nextRef:string = currentRef + '/' + "properties";
                    for (var property in jsonSchema.properties) {
                        if(this.isIgnoredProperty(property, jsonSchema.properties[property])){
                            continue;
                        }
                        this.generateUISchema(jsonSchema.properties[property], verticalLayout.elements, nextRef + "/" + property, property);
                    }

                    break;

                case "array":
                    var horizontalLayout:IHorizontalLayout = {
                        type: "HorizontalLayout",
                        elements: []
                    };
                    schemaElements.push(horizontalLayout);

                    var nextRef:string = currentRef + '/' + "items";

                    if (!jsonSchema.items) {
                        // If there are no items ignore the element
                        return;
                    }

                    //check if items is object or array
                    if (jsonSchema.items instanceof Array) {
                        for (var i = 0; i < jsonSchema.items.length; i++) {
                            this.generateUISchema(jsonSchema.items[i], horizontalLayout.elements, nextRef + '[' + i + ']', "");
                        }
                    } else {
                        this.generateUISchema(jsonSchema.items, horizontalLayout.elements, nextRef, "");
                    }

                    break;

                case "string":
                case "number":
                case "integer":
                case "boolean":
                    var controlObject:IControlObject = this.getControlObject(PathUtil.beautify(schemaName), currentRef);
                    schemaElements.push(controlObject);
                    break;
                case "null":
                    //ignore
                    break;
                default:
                    throw new Error("Unknown type: " + JSON.stringify(jsonSchema));
            }

        };

        /**
         * Determines if the property should be ignored because it is a meta property
         */
        private isIgnoredProperty = (propertyKey: string, propertyValue: any): boolean => {
            // could be a string (json-schema-id). Ignore in that case
            return propertyKey === "id" && typeof propertyValue === "string";
            // TODO ignore all meta keywords
        };

        /**
         * Derives the type of the jsonSchema element
         */
        private deriveType = (jsonSchema: any): string => {
            if(jsonSchema.type){
                return jsonSchema.type;
            }
            if(jsonSchema.properties || jsonSchema.additionalProperties){
                return "object";
            }
            // ignore all remaining cases
            return "null";
        };

        /**
         * Creates a IControlObject with the given label referencing the given ref
         */
        private getControlObject = (label: string, ref: string): IControlObject => {
            return {
                type: "Control",
                label: label,
                scope: {
                    $ref: ref
                }
            };
        };
    }
}
