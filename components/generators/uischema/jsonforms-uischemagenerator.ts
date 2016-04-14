///<reference path="../../references.ts"/>


import {IUISchemaGenerator} from "../generators";
import {PathUtil} from "../../services/pathutil";

export class UISchemaGenerator implements IUISchemaGenerator{
    generateDefaultUISchema = (jsonSchema:any): IUISchemaElement => {
        var uiSchema = this.generateUISchema(jsonSchema, [], "#", "");
        return this.wrapInLayoutIfNecessary(uiSchema);
    };

    private generateUISchema = (jsonSchema:any, schemaElements:IUISchemaElement[], currentRef:string, schemaName:string): IUISchemaElement => {
        var type = this.deriveType(jsonSchema);

        switch(type) {

            case "object":
                var verticalLayout: IVerticalLayout = this.createVerticalLayout();
                schemaElements.push(verticalLayout);

                this.addLabel(verticalLayout, schemaName);

                if (jsonSchema.properties) {
                    // traverse properties
                    var nextRef:string = currentRef + '/' + "properties";
                    for (var property in jsonSchema.properties) {
                        if(this.isIgnoredProperty(property, jsonSchema.properties[property])){
                            continue;
                        }
                        this.generateUISchema(jsonSchema.properties[property], verticalLayout.elements, nextRef + "/" + property, property);
                    }
                }

                return verticalLayout;

            case "array": // array items will be handled by the array control itself
            case "string":
            case "number":
            case "integer":
            case "boolean":
                var controlObject:IControlObject = this.getControlObject(PathUtil.beautify(schemaName), currentRef);
                schemaElements.push(controlObject);
                return controlObject;
            case "null":
                return null;
            default:
                throw new Error("Unknown type: " + JSON.stringify(jsonSchema));
        }

    };

    /**
     * Adds the given {@code labelName} to the {@code layout} if it exists
     * @param layout
     *      The layout which is to receive the label
     * @param labelName
     *      The name of the schema
     */
    private addLabel = (layout: ILayout, labelName: string) => {
        if (labelName && labelName != "") {
            // add label with name
            var label = {
                type: "Label",
                text: PathUtil.beautify(labelName)
            };
            layout.elements.push(label);
        }
    };

    /**
     * Creates a new VerticalLayout
     * @returns the new IVerticalLayout
     */
    private createVerticalLayout = (): IVerticalLayout => {
        return {
            type: "VerticalLayout",
            elements: []
        };
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
    private getControlObject = (label:string, ref:string):IControlObject => {
        var control:IControlObject = {
            type: "Control",
            scope: {
                $ref: ref
            }
        };
        if (label) {
            control.label = label;
        }
        return control;
    };

    /**
     * Wraps the given {@code uiSchema} in a VerticalLayout if there is none already.
     * @param uiSchema The ui schema to wrap in a vertical layout.
     * @returns the wrapped uiSchema.
     */
    private wrapInLayoutIfNecessary = (uiSchema:IUISchemaElement):ILayout => {
        if (uiSchema.type !== "VerticalLayout") {
            var verticalLayout:IVerticalLayout = this.createVerticalLayout();
            verticalLayout.elements.push(uiSchema);
            return verticalLayout;
        }
        return <ILayout>uiSchema;
    };
}

