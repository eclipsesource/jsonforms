import {
  isControl,
  rankWith,
  resolveSchema,
  type JsonFormsRendererRegistryEntry,
  type JsonSchema,
  type Scopable,
  type TesterContext,
  type UISchemaElement,
} from '@jsonforms/core';

import isEmpty from 'lodash/isEmpty';
import mixedRenderer from './MixedRenderer.vue';

export const isMixedSchema = (
  uischema: UISchemaElement & Scopable,
  schema: JsonSchema,
  context: TesterContext,
) => {
  if (schema && typeof schema === 'boolean') {
    // support a case like
    // "examples": {
    //   "type": "array",
    //   "items": true
    // }
    // that is used in the jsonschema meta model where the items: true means any type which in effect means array of all allowed types.
    // in the above scenario the schema will be the value true from the items
    return true;
  }

  if (!schema || typeof schema !== 'object') {
    return false;
  }

  if (Array.isArray(schema.type)) {
    return true;
  }
  if (schema.type === 'object') {
    const schemaPath = uischema.scope;
    if (schemaPath && !isEmpty(schemaPath)) {
      let currentDataSchema: JsonSchema | undefined = schema;
      currentDataSchema = resolveSchema(
        schema,
        schemaPath,
        context?.rootSchema,
      );
      if (currentDataSchema === undefined) {
        return false;
      }
      if (Array.isArray(currentDataSchema.type)) {
        return true;
      }
    }
  }

  return false;
};

export const isMixedControl = (
  uischema: UISchemaElement,
  schema: JsonSchema,
  context: TesterContext,
) =>
  isMixedSchema(uischema, schema, context) &&
  (isControl(uischema) || isDefaultGenUiSchema(uischema));

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: mixedRenderer,
  tester: rankWith(20, isMixedControl),
};

function isDefaultGenUiSchema(uischema: UISchemaElement): boolean {
  const elements = (uischema as any)?.elements;
  let result = false;
  if (
    (uischema.type === 'VerticalLayout' || uischema.type === 'Group') &&
    Array.isArray(elements)
  ) {
    if (elements.length == 1) {
      // if the uischema is the default then take control
      result = elements[0].scope === '#' && elements[0].type === 'Control';
    }
  }
  return result;
}
