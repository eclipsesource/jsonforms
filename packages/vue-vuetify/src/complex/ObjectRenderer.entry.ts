import {
  isObjectControl,
  rankWith,
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
    ) =>
      isObjectControl(uischema, schema, context) ||
      (uischema.type === 'Object' && !isEmpty(uischema.scope)),
  ),
};
