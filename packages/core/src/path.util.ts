import * as _ from 'lodash';
import { JsonSchema } from './models/jsonSchema';
import { Scopable } from './models/uischema';

const isObject = (schema: JsonSchema): boolean => {
  return schema.properties !== undefined;
};
const isArray = (schema: JsonSchema): boolean => {
  return schema.type === 'array' && schema.items !== undefined;
};

export const compose = (path1: string, path2: string) => {
  let p1 = path1;
  if (!_.isEmpty(path1) && !path2.startsWith('[')) {
    p1 = path1 + '.';
  }

  if (_.isEmpty(p1)) {
    return path2;
  } else {
    return `${p1}${path2}`;
  }
};

/**
 * Convert a schema path (i.e. JSON pointer) to an array by splitting
 * at the '/' character and removing all schema-specific keywords.
 *
 * The returned value can be used to de-reference a root object by folding over it
 * and derefercing the single segments to obtain a new object.
 *
 *
 * @param {string} schemaPath the schema path to be converted
 * @returns {string[]} an array containing only non-schema-specific segments
 */
export const toDataPathSegments = (schemaPath: string): string[] => {
  const segments = schemaPath.split('/');
  const startFromRoot = segments[0] === '#' || segments[0] === '';
  if (startFromRoot) {
    return segments.filter((_segment, index) => {
      if (index === 0) {
        return false;
      } else {
        return index % 2 !== 1;
      }
    });
  }

  return segments.filter((_segment, index) => index % 2 !== 0);
};

/**
 * Remove all schema-specific keywords (e.g. 'properties') from a given path.
 * @example
 * toDataPath('#/properties/foo/properties/bar') === '#/foo/bar')
 *
 * @param {string} schemaPath the schema path to be converted
 * @returns {string} the path without schema-specific keywords
 */
export const toDataPath = (schemaPath: string): string => {
  return toDataPathSegments(schemaPath).join('/');
};

/**
 * Resolve the given schema path against the given instance until the last
 * segment. The returned value allows easy assignment of any new value.
 *
 * @example
 * const pair = getValuePropertyPair(someData, someRef);
 * pair.instance[pair.property] = someValue;
 *
 * @param {any} instance the instance to resolve the path against
 * @param {string} schemaPath the schema path to be resolved
 * @returns {{instance: string, property: string}} an object containing
 *          the resolved instance as well the last fragment of
 */
export const getValuePropertyPair = (instance: any, schemaPath: string):
  { instance: Object, property: string } => {
  const validPathSegments = toDataPathSegments(schemaPath);
  const resolvedInstance =
    validPathSegments
      .slice(0, validPathSegments.length - 1)
      .map(segment => decodeURIComponent(segment))
      .reduce(
      (curInstance, decodedSegment) => {
        if (!curInstance.hasOwnProperty(decodedSegment)) {
          curInstance[decodedSegment] = {};
        }

        return curInstance[decodedSegment];
      },
      instance
      );

  return {
    instance: resolvedInstance,
    property: validPathSegments.length > 0 ?
      decodeURIComponent(validPathSegments[validPathSegments.length - 1]) : undefined
  };
};

export const composeWithUi = (scopableUi: Scopable, path: string) => {
  const segments = toDataPathSegments(scopableUi.scope.$ref);

  return _.isEmpty(segments) ? path : compose(path, segments.join('.'));
};

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

/**
 * Normalizes the schema and resolves the given ref.
 *
 * @param {JsonSchema} full the JSON schema to resolved the reference against
 * @param {string} reference the reference to be resolved
 * @returns {JsonSchema} the resolved sub-schema
 */
// disable rule because resolve is mutually recursive
// tslint:disable:only-arrow-functions
export function retrieveResolvableSchema(full: JsonSchema, reference: string): JsonSchema {
  // tslint:enable:only-arrow-functions
  const child = resolveSchema(full, reference);
  const allRefs = findAllRefs(child);
  const innerSelfReference = allRefs[reference];
  if (innerSelfReference !== undefined) {
    innerSelfReference.$ref = '#';
  }

  return child;
}

export interface ReferenceSchemaMap {
  [ref: string]: JsonSchema;
}
