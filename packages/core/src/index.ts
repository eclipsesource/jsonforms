import { JsonSchema } from './models/jsonSchema';

export * from './core';
export * from './json-forms';
export * from './path.util';
export * from './core/renderer';
export * from './core/runtime';
export * from './core/schema.service';
export * from './core/styling.registry';

export * from './models/jsonSchema';
export * from './store';
export *  from './actions';
export *  from './renderers';
export * from './reducers';
export * from './generators';

export * from './models/uischema';

// do not export findAllRefs and ReferenceSchemaMap
import { resolveData, resolveSchema } from './resolvers';
const Resolve: {
  schema(schema: JsonSchema, schemaPath: string): JsonSchema;
  data(data, path): any
} = {
  schema: resolveSchema,
  data: resolveData
};
export { resolveData, resolveSchema } from './resolvers';
export { Resolve };

import * as Test from './testers';
export * from './testers';
export { Test };
