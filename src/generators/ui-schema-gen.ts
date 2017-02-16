
import {Layout, ControlElement, UISchemaElement} from '../models/uischema';
import {JsonSchema} from "../models/jsonSchema";

/**
 * Creates a new ILayout.
 * @param layoutType The type of the laoyut
 * @returns the new ILayout
 */
const createLayout = (layoutType: string): Layout => ({
    type: layoutType,
    elements: []
});

/**
 * Derives the type of the jsonSchema element
 */
const deriveType = (jsonSchema: any): string => {
    if (jsonSchema.type) {
        return jsonSchema.type;
    }
    if (jsonSchema.properties || jsonSchema.additionalProperties) {
        return 'object';
    }
    // ignore all remaining cases
    return 'null';
};

/**
 * Creates a IControlObject with the given label referencing the given ref
 */
const createControlElement = (label: string, ref: string): ControlElement => ({
    type: 'Control',
    label: label,
    scope: {
        $ref: ref
    }
});

/**
 * Wraps the given {@code uiSchema} in a Layout if there is none already.
 * @param uiSchema The ui schema to wrap in a layout.
 * @param layoutType The type of the layout to create.
 * @returns the wrapped uiSchema.
 */
const wrapInLayoutIfNecessary = (uiSchema: UISchemaElement, layoutType: string): Layout  => {
    if (uiSchema['elements'] === undefined) {
        const verticalLayout: Layout = createLayout(layoutType);
        verticalLayout.elements.push(uiSchema);
        return verticalLayout;
    }
    return <Layout>uiSchema;
};

const generateUISchema =
    (jsonSchema: JsonSchema, schemaElements: UISchemaElement[],
     currentRef: string, schemaName: string, layoutType: string): UISchemaElement => {

    const type = deriveType(jsonSchema);

    switch (type) {
        case 'object':
            const layout: Layout = createLayout(layoutType);
            schemaElements.push(layout);

            addLabel(layout, schemaName);

            if (jsonSchema.properties) {
                // traverse properties
                const nextRef: string = currentRef + '/properties';
                Object.keys(jsonSchema.properties).map(propName => {
                    const value = jsonSchema.properties[propName];
                    generateUISchema(value, layout.elements,
                        `${nextRef}/${propName}`, propName, layoutType);
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
            const controlObject: ControlElement = createControlElement(
                startCase(schemaName),
                currentRef
            );
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
const addLabel = (layout: Layout, labelName: string) => {
    if (labelName && labelName !== '') {
        // add label with name
        const label = {
            type: 'Label',
            text: startCase(labelName)
        };
        layout.elements.push(label);
    }
};

// poor man's version of a startCase implementation
export const startCase = (label: string): string =>
    (label.split(/(?=[A-Z])/) || [])
        .map(token => token.charAt(0).toUpperCase() + token.slice(1))
        .join(" ");

const generateDefaultUISchema = (jsonSchema: JsonSchema, layoutType = 'VerticalLayout'): UISchemaElement =>
    wrapInLayoutIfNecessary(
        generateUISchema(jsonSchema, [], '#', '', layoutType),
        layoutType);

export default generateDefaultUISchema;