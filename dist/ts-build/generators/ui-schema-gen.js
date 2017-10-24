"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
/**
 * Creates a new ILayout.
 * @param layoutType The type of the laoyut
 * @returns the new ILayout
 */
var createLayout = function (layoutType) { return ({
    type: layoutType,
    elements: []
}); };
/**
 * Derives the type of the jsonSchema element
 */
var deriveType = function (jsonSchema) {
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
var createControlElement = function (label, ref) { return ({
    type: 'Control',
    label: label,
    scope: {
        $ref: ref
    }
}); };
var isLayout = function (uischema) {
    return uischema.elements !== undefined;
};
/**
 * Wraps the given {@code uiSchema} in a Layout if there is none already.
 * @param uiSchema The ui schema to wrap in a layout.
 * @param layoutType The type of the layout to create.
 * @returns the wrapped uiSchema.
 */
var wrapInLayoutIfNecessary = function (uischema, layoutType) {
    if (!_.isEmpty(uischema) && !isLayout(uischema)) {
        var verticalLayout = createLayout(layoutType);
        verticalLayout.elements.push(uischema);
        return verticalLayout;
    }
    return uischema;
};
/**
 * Adds the given {@code labelName} to the {@code layout} if it exists
 * @param layout
 *      The layout which is to receive the label
 * @param labelName
 *      The name of the schema
 */
var addLabel = function (layout, labelName) {
    if (!_.isEmpty(labelName)) {
        // add label with name
        var label = {
            type: 'Label',
            text: _.startCase(labelName)
        };
        layout.elements.push(label);
    }
};
var generateUISchema = function (jsonSchema, schemaElements, currentRef, schemaName, layoutType) {
    var type = deriveType(jsonSchema);
    switch (type) {
        case 'object':
            var layout_1 = createLayout(layoutType);
            schemaElements.push(layout_1);
            addLabel(layout_1, schemaName);
            if (!_.isEmpty(jsonSchema.properties)) {
                // traverse properties
                var nextRef_1 = currentRef + '/properties';
                Object.keys(jsonSchema.properties).map(function (propName) {
                    var value = jsonSchema.properties[propName];
                    generateUISchema(value, layout_1.elements, nextRef_1 + "/" + propName, propName, layoutType);
                });
            }
            return layout_1;
        case 'array': // array items will be handled by the array control itself
        /* falls through */
        case 'string':
        /* falls through */
        case 'number':
        /* falls through */
        case 'integer':
        /* falls through */
        case 'boolean':
            var controlObject = createControlElement(_.startCase(schemaName), currentRef);
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
exports.generateDefaultUISchema = function (jsonSchema, layoutType, prefix) {
    if (layoutType === void 0) { layoutType = 'VerticalLayout'; }
    if (prefix === void 0) { prefix = '#'; }
    return wrapInLayoutIfNecessary(generateUISchema(jsonSchema, [], prefix, '', layoutType), layoutType);
};
//# sourceMappingURL=ui-schema-gen.js.map