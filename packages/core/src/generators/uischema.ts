/*
  The MIT License
  
  Copyright (c) 2018 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import * as _ from 'lodash';

import { JsonSchema } from '../models/jsonSchema';
import { ControlElement, LabelElement, Layout, UISchemaElement } from '../models/uischema';

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
const deriveType = (jsonSchema: JsonSchema): string => {
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
const createControlElement = (label: string, ref: string): ControlElement => ({
    type: 'Control',
    label: label,
    scope: ref,
});

const isLayout = (uischema: UISchemaElement): uischema is Layout =>
    (uischema as Layout).elements !== undefined;

/**
 * Wraps the given {@code uiSchema} in a Layout if there is none already.
 * @param uiSchema The ui schema to wrap in a layout.
 * @param layoutType The type of the layout to create.
 * @returns the wrapped uiSchema.
 */
const wrapInLayoutIfNecessary = (uischema: UISchemaElement, layoutType: string): Layout  => {
    if (!_.isEmpty(uischema) && !isLayout(uischema)) {
        const verticalLayout: Layout = createLayout(layoutType);
        verticalLayout.elements.push(uischema);

        return verticalLayout;
    }

    return uischema as Layout;
};

/**
 * Adds the given {@code labelName} to the {@code layout} if it exists
 * @param layout
 *      The layout which is to receive the label
 * @param labelName
 *      The name of the schema
 */
const addLabel = (layout: Layout, labelName: string) => {
    if (!_.isEmpty(labelName) ) {
        // add label with name
        const label: LabelElement = {
            type: 'Label',
            text: _.startCase(labelName)
        };
        layout.elements.push(label);
    }
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

            if (!_.isEmpty(jsonSchema.properties)) {
                // traverse properties
                const nextRef: string = currentRef + '/properties';
                Object.keys(jsonSchema.properties).map(propName => {
                    const value = jsonSchema.properties[propName];
                    generateUISchema(
                        value,
                        layout.elements,
                        `${nextRef}/${propName}`, propName, layoutType
                    );
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
                _.startCase(schemaName),
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
 * Generate a default UI schema.
 * @param {JsonSchema} jsonSchema the JSON schema to generated a UI schema for
 * @param {string} layoutType the desired layout type for the root layout
 *        of the generated UI schema
 */
export const generateDefaultUISchema =
    (jsonSchema: JsonSchema, layoutType = 'VerticalLayout', prefix = '#'): UISchemaElement =>
        wrapInLayoutIfNecessary(
            generateUISchema(jsonSchema, [], prefix, '', layoutType),
            layoutType);
