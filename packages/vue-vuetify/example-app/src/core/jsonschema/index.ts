import rule from './specification/rule.json';
import schema from './specification/schema.json';
import uischema from './specification/uischema.json';
import { JsonSchema } from '@jsonforms/core';

export const jsonSchemaDraft7 = {
  uri: 'http://json-schema.org/draft-07/schema',
  schema: schema as JsonSchema,
};

export const uiSchema = {
  uri: 'http://jsonforms.io/uischema',
  schema: uischema as JsonSchema,
};
export const ruleSchema = {
  uri: 'http://jsonforms.io/uischema/rule',
  schema: rule as JsonSchema,
};
