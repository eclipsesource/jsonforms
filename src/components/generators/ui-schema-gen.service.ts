

import {IUISchemaGenerator} from './generators';
import {PathUtil} from '../services/pathutil';
import {IUISchemaElement, IControlObject, ILayout} from '../../uischema';

export class UISchemaGenerator implements IUISchemaGenerator {

    /**
     * Creates a new ILayout.
     * @param layoutType The type of the laoyut
     * @returns the new ILayout
     */
    private static createLayout(layoutType: string): ILayout {
        return {
            type: layoutType,
            elements: []
        };
    }

    /**
     * Determines if the property should be ignored because it is a meta property
     */
    private static isIgnoredProperty(propertyKey: string, propertyValue: any): boolean {
        // could be a string (json-schema-id). Ignore in that case
        return propertyKey === 'id' && typeof propertyValue === 'string';
        // TODO ignore all meta keywords
    }

    /**
     * Derives the type of the jsonSchema element
     */
    private static deriveType(jsonSchema: any): string {
        if (jsonSchema.type) {
            return jsonSchema.type;
        }
        if (jsonSchema.properties || jsonSchema.additionalProperties) {
            return 'object';
        }
        // ignore all remaining cases
        return 'null';
    }

    /**
     * Creates a IControlObject with the given label referencing the given ref
     */
    private static getControlObject(label: string, ref: string): IControlObject {
        let control: IControlObject = {
            type: 'Control',
            scope: {
                $ref: ref
            }
        };
        if (label) {
            control.label = label;
        }
        return control;
    }

    /**
     * Wraps the given {@code uiSchema} in a Layout if there is none already.
     * @param uiSchema The ui schema to wrap in a layout.
     * @param layoutType The type of the layout to create.
     * @returns the wrapped uiSchema.
     */
    private static wrapInLayoutIfNecessary
        (uiSchema: IUISchemaElement, layoutType: string): ILayout {
        if (uiSchema['elements'] === undefined) {
            let verticalLayout: ILayout = UISchemaGenerator.createLayout(layoutType);
            verticalLayout.elements.push(uiSchema);
            return verticalLayout;
        }
        return <ILayout>uiSchema;
    }

    generateDefaultUISchema(jsonSchema: any, layoutType = 'VerticalLayout'): IUISchemaElement {
        let uiSchema = this.generateUISchema(jsonSchema, [], '#', '', layoutType);
        return UISchemaGenerator.wrapInLayoutIfNecessary(uiSchema, layoutType);
    };

    private generateUISchema(jsonSchema: any, schemaElements: IUISchemaElement[],
        currentRef: string, schemaName: string, layoutType: string): IUISchemaElement {

        let type = UISchemaGenerator.deriveType(jsonSchema);

        switch (type) {
            case 'object':
                let layout: ILayout = UISchemaGenerator.createLayout(layoutType);
                schemaElements.push(layout);

                this.addLabel(layout, schemaName);

                if (jsonSchema.properties) {
                    // traverse properties
                    let nextRef: string = currentRef + '/properties';
                    _.forOwn(jsonSchema.properties, (value, key) => {
                        if (!UISchemaGenerator.isIgnoredProperty(key, value)) {
                            this.generateUISchema(value, layout.elements,
                                `${nextRef}/${key}`, key, layoutType);
                        }
                    });
                }

                return layout;

            case 'array': // array items will be handled by the array control itself
            /* falls through */
            case 'string':
            /* falls through */
            case 'number':
            /* falls through */
            case 'integer':
            /* falls through */
            case 'boolean':
                let controlObject: IControlObject = UISchemaGenerator.getControlObject(
                    PathUtil.beautify(schemaName), currentRef);
                schemaElements.push(controlObject);
                return controlObject;
            case 'null':
                return null;
            default:
                throw new Error('Unknown type: ' + JSON.stringify(jsonSchema));
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
        if (labelName && labelName !== '') {
            // add label with name
            let label = {
                type: 'Label',
                text: PathUtil.beautify(labelName)
            };
            layout.elements.push(label);
        }
    };
}

export default angular
    .module('jsonforms.generators.uischema', ['jsonforms.generators'])
    .service('UISchemaGenerator', UISchemaGenerator).name;
