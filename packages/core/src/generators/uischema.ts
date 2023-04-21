/*
  The MIT License

  Copyright (c) 2017-2019 EclipseSource Munich
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

import isEmpty from 'lodash/isEmpty';
import startCase from 'lodash/startCase';
import keys from 'lodash/keys';
import {
  ControlElement,
  isGroup,
  isLayout,
  JsonSchema,
  LabelElement,
  Layout,
  UISchemaElement,
} from '../models';
import { deriveTypes, encode, resolveSchema } from '../util';

/**
 * Creates a new ILayout.
 * @param layoutType The type of the laoyut
 * @returns the new ILayout
 */
const createLayout = (layoutType: string): Layout => ({
  type: layoutType,
  elements: [],
});

/**
 * Creates a IControlObject with the given label referencing the given ref
 */
export const createControlElement = (ref: string): ControlElement => ({
  type: 'Control',
  scope: ref,
});

/**
 * Wraps the given {@code uiSchema} in a Layout if there is none already.
 * @param uischema The ui schema to wrap in a layout.
 * @param layoutType The type of the layout to create.
 * @returns the wrapped uiSchema.
 */
const wrapInLayoutIfNecessary = (
  uischema: UISchemaElement,
  layoutType: string
): Layout => {
  if (!isEmpty(uischema) && !isLayout(uischema)) {
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
  if (!isEmpty(labelName)) {
    const fixedLabel = startCase(labelName);
    if (isGroup(layout)) {
      layout.label = fixedLabel;
    } else {
      // add label with name
      const label: LabelElement = {
        type: 'Label',
        text: fixedLabel,
      };
      layout.elements.push(label);
    }
  }
};

/**
 * Returns whether the given {@code jsonSchema} is a combinator ({@code oneOf}, {@code anyOf}, {@code allOf}) at the root level
 * @param jsonSchema
 *      the schema to check
 */
const isCombinator = (jsonSchema: JsonSchema): boolean => {
  return (
    !isEmpty(jsonSchema) &&
    (!isEmpty(jsonSchema.oneOf) ||
      !isEmpty(jsonSchema.anyOf) ||
      !isEmpty(jsonSchema.allOf))
  );
};

const generateUISchema = (
  jsonSchema: JsonSchema,
  schemaElements: UISchemaElement[],
  currentRef: string,
  schemaName: string,
  layoutType: string,
  rootSchema?: JsonSchema
): UISchemaElement => {
  if (!isEmpty(jsonSchema) && jsonSchema.$ref !== undefined) {
    return generateUISchema(
      resolveSchema(rootSchema, jsonSchema.$ref, rootSchema),
      schemaElements,
      currentRef,
      schemaName,
      layoutType,
      rootSchema
    );
  }

  if (isCombinator(jsonSchema)) {
    const controlObject: ControlElement = createControlElement(currentRef);
    schemaElements.push(controlObject);

    return controlObject;
  }

  const types = deriveTypes(jsonSchema);
  if (types.length === 0) {
    return null;
  }

  if (types.length > 1) {
    const controlObject: ControlElement = createControlElement(currentRef);
    schemaElements.push(controlObject);
    return controlObject;
  }

  if (currentRef === '#' && types[0] === 'object') {
    const layout: Layout = createLayout(layoutType);
    schemaElements.push(layout);

    if (jsonSchema.properties && keys(jsonSchema.properties).length > 1) {
      addLabel(layout, schemaName);
    }

    if (!isEmpty(jsonSchema.properties)) {
      // traverse properties
      const nextRef: string = currentRef + '/properties';
      Object.keys(jsonSchema.properties).map((propName) => {
        let value = jsonSchema.properties[propName];
        const ref = `${nextRef}/${encode(propName)}`;
        if (value.$ref !== undefined) {
          value = resolveSchema(rootSchema, value.$ref, rootSchema);
        }
        generateUISchema(
          value,
          layout.elements,
          ref,
          propName,
          layoutType,
          rootSchema
        );
      });
    }

    return layout;
  }

  switch (types[0]) {
    case 'object': // object items will be handled by the object control itself
    /* falls through */
    case 'array': // array items will be handled by the array control itself
    /* falls through */
    case 'string':
    /* falls through */
    case 'number':
    /* falls through */
    case 'integer':
    /* falls through */
    case 'boolean': {
      const controlObject: ControlElement = createControlElement(currentRef);
      schemaElements.push(controlObject);

      return controlObject;
    }
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
export const generateDefaultUISchema = (
  jsonSchema: JsonSchema,
  layoutType = 'VerticalLayout',
  prefix = '#',
  rootSchema = jsonSchema
): UISchemaElement =>
  wrapInLayoutIfNecessary(
    generateUISchema(jsonSchema, [], prefix, '', layoutType, rootSchema),
    layoutType
  );
