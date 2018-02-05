import { JsonSchema, Scopable } from '../';
export { createLabelDescriptionFrom, translateLabel } from './label';

export const convertToValidClassName = (s: string): string =>
  s.replace('#', 'root')
   .replace(new RegExp('/', 'g'), '_');

export const formatErrorMessage = errors => {
  if (errors === undefined || errors === null) {
    return '';
  }

  return errors.join('\n');
};

// Resolve --
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

// Paths --
import {
  compose as composePaths,
  composeWithUi, toDataPath,
  toDataPathSegments
} from './path';
const fromScopable = (scopable: Scopable) => toDataPathSegments(scopable.scope).join('.');

const Paths = {
  compose: composePaths,
  fromScopable
};
export { composePaths, composeWithUi, Paths, toDataPath };

// Runtime --
import { isEnabled, isVisible } from './runtime';
const Runtime = {
  isEnabled,
  isVisible,
};
export { isEnabled, isVisible, Runtime };

export * from './renderer';
export * from './field';
export * from './runtime';
