import * as _ from 'lodash';

import { JsonSchema } from '../';

// export const resolveData = (instance: any, dataPath: string): any => {
//   const dataPathSegments = dataPath.split('/');
//
//   return dataPathSegments
//     .slice(0, dataPathSegments.length )
//     .map(segment => decodeURIComponent(segment))
//     .reduce(
//       (curInstance, decodedSegment) => {
//         if (curInstance === undefined || !curInstance.hasOwnProperty(decodedSegment)) {
//           return undefined;
//         }
//
//         return curInstance[decodedSegment];
//       },
//       instance
//     );
// };

export const resolveData = (data, path) =>
  _.isEmpty(path) ? data : _.get<any, any>(data, path);

/**
 * Resolve the given schema path in order to obtain a subschema.
 * @param {JsonSchema} schema the root schema from which to start
 * @param {string} schemaPath the schema path to be resolved
 * @returns {JsonSchema} the resolved sub-schema
 */
export const resolveSchema = (schema: JsonSchema, schemaPath: string): JsonSchema => {
  const validPathSegments = schemaPath.split('/');
  const invalidSegment =
    pathSegment => pathSegment === '#' || pathSegment === undefined || pathSegment === '';
  const resultSchema = validPathSegments.reduce(
    (curSchema, pathSegment) =>
      invalidSegment(pathSegment) ? curSchema : curSchema[pathSegment],
    schema
  );
  if (resultSchema !== undefined && resultSchema.$ref !== undefined) {
    return retrieveResolvableSchema(schema, resultSchema.$ref);
  }

  return resultSchema;
};

/**
 * Normalizes the schema and resolves the given ref.
 *
 * @param {JsonSchema} full the JSON schema to resolved the reference against
 * @param {string} reference the reference to be resolved
 * @returns {JsonSchema} the resolved sub-schema
 */
// disable rule because resolve is mutually recursive
// tslint:disable:only-arrow-functions
function retrieveResolvableSchema(full: JsonSchema, reference: string): JsonSchema {
  // tslint:enable:only-arrow-functions
  const child = resolveSchema(full, reference);
  const allRefs = findAllRefs(child);
  const innerSelfReference = allRefs[reference];
  if (innerSelfReference !== undefined) {
    innerSelfReference.$ref = '#';
  }

  return child;
}

/**
 * Finds all references inside the given schema.
 *
 * @param schema The {@link JsonSchema} to find the references in
 * @param result The initial result map, default: empty map (this parameter is used for recursion
 *               inside the function)
 * @param resolveTuples Whether arrays of tuples should be considered; default: false
 */
export const findAllRefs =
  (schema: JsonSchema, result: ReferenceSchemaMap = {}, resolveTuples = false)
    : ReferenceSchemaMap => {

    if (isObject(schema)) {
      Object.keys(schema.properties).forEach(key =>
        findAllRefs(schema.properties[key], result));
    }
    if (isArray(schema)) {
      if (Array.isArray(schema.items)) {
        if (resolveTuples) {
          schema.items.forEach(child => findAllRefs(child, result));
        }
      } else {
        findAllRefs(schema.items, result);
      }
    }
    if (Array.isArray(schema.anyOf)) {
      schema.anyOf.forEach(child => findAllRefs(child, result));
    }
    if (schema.$ref !== undefined) {
      result[schema.$ref] = schema;
    }

    // tslint:disable:no-string-literal
    if (schema['links'] !== undefined) {
      schema['links'].forEach(link => {
        if (!_.isEmpty(link.targetSchema.$ref)) {
          result[link.targetSchema.$ref] = schema;
        } else {
          findAllRefs(link.targetSchema, result);
        }
      });
    }

    return result;
  };

export interface ReferenceSchemaMap {
  [ref: string]: JsonSchema;
}

const isObject = (schema: JsonSchema): boolean => {
  return schema.properties !== undefined;
};
const isArray = (schema: JsonSchema): boolean => {
  return schema.type === 'array' && schema.items !== undefined;
};
