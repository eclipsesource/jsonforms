import {
  isControl,
  isObjectControl,
  rankWith,
  resolveSchema,
  type JsonFormsRendererRegistryEntry,
  type JsonSchema,
  type Scopable,
  type TesterContext,
  type UISchemaElement,
} from '@jsonforms/core';
import controlRenderer from './ObjectRenderer.vue';
import isEmpty from 'lodash/isEmpty';

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(
    2,
    (
      uischema: UISchemaElement & Scopable,
      schema: JsonSchema,
      context: TesterContext,
    ) => {
      return (
        isObjectControl(uischema, schema, context) ||
        // schemaMatches that is used inside the isObjectControl uses a resolve of the current schema which when the schema is provided as resolved for the MixedRender then there is no need for further resolve
        (isControl(uischema) &&
          !isEmpty(uischema.scope) &&
          schema?.type === 'object' &&
          Array.isArray(
            resolveSchema(
              context.rootSchema,
              uischema.scope,
              context.rootSchema,
            )?.type,
          ))
      );
    },
  ),
};
