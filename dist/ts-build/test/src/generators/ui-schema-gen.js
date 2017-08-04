"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
/**
 * Creates a new ILayout.
 * @param layoutType The type of the laoyut
 * @returns the new ILayout
 */
const createLayout = (layoutType) => ({
    type: layoutType,
    elements: []
});
/**
 * Derives the type of the jsonSchema element
 */
const deriveType = (jsonSchema) => {
    if (!_.isEmpty(jsonSchema) &&
        !_.isEmpty(jsonSchema.type) &&
        typeof jsonSchema.type === 'string') {
        return jsonSchema.type;
    }
    if (!_.isEmpty(jsonSchema) &&
        (!_.isEmpty(jsonSchema.properties) || !_.isEmpty(jsonSchema.additionalProperties))) {
        return 'object';
    }
    if (!_.isEmpty(jsonSchema) && !_.isEmpty(jsonSchema.items)) {
        return 'array';
    }
    // ignore all remaining cases
    return 'null';
};
/**
 * Creates a IControlObject with the given label referencing the given ref
 */
const createControlElement = (label, ref) => ({
    type: 'Control',
    label: label,
    scope: {
        $ref: ref
    }
});
const isLayout = (uiSchema) => uiSchema.elements !== undefined;
/**
 * Wraps the given {@code uiSchema} in a Layout if there is none already.
 * @param uiSchema The ui schema to wrap in a layout.
 * @param layoutType The type of the layout to create.
 * @returns the wrapped uiSchema.
 */
const wrapInLayoutIfNecessary = (uiSchema, layoutType) => {
    if (!_.isEmpty(uiSchema) && !isLayout(uiSchema)) {
        const verticalLayout = createLayout(layoutType);
        verticalLayout.elements.push(uiSchema);
        return verticalLayout;
    }
    return uiSchema;
};
/**
 * Adds the given {@code labelName} to the {@code layout} if it exists
 * @param layout
 *      The layout which is to receive the label
 * @param labelName
 *      The name of the schema
 */
const addLabel = (layout, labelName) => {
    if (!_.isEmpty(labelName)) {
        // add label with name
        const label = {
            type: 'Label',
            text: _.startCase(labelName)
        };
        layout.elements.push(label);
    }
};
const generateUISchema = (jsonSchema, schemaElements, currentRef, schemaName, layoutType) => {
    const type = deriveType(jsonSchema);
    switch (type) {
        case 'object':
            const layout = createLayout(layoutType);
            schemaElements.push(layout);
            addLabel(layout, schemaName);
            if (!_.isEmpty(jsonSchema.properties)) {
                // traverse properties
                const nextRef = currentRef + '/properties';
                Object.keys(jsonSchema.properties).map(propName => {
                    const value = jsonSchema.properties[propName];
                    generateUISchema(value, layout.elements, `${nextRef}/${propName}`, propName, layoutType);
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
            const controlObject = createControlElement(_.startCase(schemaName), currentRef);
            schemaElements.push(controlObject);
            return controlObject;
        case 'null':
            return null;
        default:
            throw new Error('Unknown type: ' + JSON.stringify(jsonSchema));
    }
};
/**
 * Generate a default UI schema.
 * @param {JsonSchema} jsonSchema the JSON schema to generated a UI schema for
 * @param {string} layoutType the desired layout type for the root layout
 *        of the generated UI schema
 */
exports.generateDefaultUISchema = (jsonSchema, layoutType = 'VerticalLayout') => wrapInLayoutIfNecessary(generateUISchema(jsonSchema, [], '#', '', layoutType), layoutType);
//# sourceMappingURL=ui-schema-gen.js.map