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
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import isFunction from 'lodash/isFunction';
import isUndefined from 'lodash/isUndefined';
import forOwn from 'lodash/forOwn';
import isString from 'lodash/isString';
import isPlainObject from 'lodash/isPlainObject';
import { parse } from 'uri-js';
import { JsonSchema } from '..';

/**
 * Map for storing refs and the respective schemas they are pointing to.
 */
export interface ReferenceSchemaMap {
  [ref: string]: JsonSchema;
}

const isObjectSchema = (schema: JsonSchema): boolean => {
  return schema.properties !== undefined;
};
const isArraySchema = (schema: JsonSchema): boolean => {
  return schema.type === 'array' && schema.items !== undefined;
};

export const resolveData = (instance: any, dataPath: string): any => {
  if (isEmpty(dataPath)) {
    return instance;
  }
  const dataPathSegments = dataPath.split('.');

  return dataPathSegments
    .map(segment => decodeURIComponent(segment))
    .reduce((curInstance, decodedSegment) => {
      if (
        curInstance === undefined ||
        !curInstance.hasOwnProperty(decodedSegment)
      ) {
        return undefined;
      }

      return curInstance[decodedSegment];
    }, instance);
};

/**
 * Finds all references inside the given schema.
 *
 * @param schema The {@link JsonSchema} to find the references in
 * @param result The initial result map, default: empty map (this parameter is used for recursion
 *               inside the function)
 * @param resolveTuples Whether arrays of tuples should be considered; default: false
 */
export const findAllRefs = (
  schema: JsonSchema,
  result: ReferenceSchemaMap = {},
  resolveTuples = false
): ReferenceSchemaMap => {
  if (isObjectSchema(schema)) {
    Object.keys(schema.properties).forEach(key =>
      findAllRefs(schema.properties[key], result)
    );
  }
  if (isArraySchema(schema)) {
    if (Array.isArray(schema.items)) {
      if (resolveTuples) {
        const items: JsonSchema[] = schema.items;
        items.forEach(child => findAllRefs(child, result));
      }
    } else {
      findAllRefs(schema.items, result);
    }
  }
  if (Array.isArray(schema.anyOf)) {
    const anyOf: JsonSchema[] = schema.anyOf;
    anyOf.forEach(child => findAllRefs(child, result));
  }
  if (schema.$ref !== undefined) {
    result[schema.$ref] = schema;
  }

  return result;
};

/**
 * Resolve the given schema path in order to obtain a subschema.
 * @param {JsonSchema} schema the root schema from which to start
 * @param {string} schemaPath the schema path to be resolved
 * @param {JsonSchema} rootSchema the actual root schema
 * @returns {JsonSchema} the resolved sub-schema
 */
export const resolveSchema = (
  schema: JsonSchema,
  schemaPath: string,
  rootSchema?: JsonSchema
): JsonSchema => {
  if (isEmpty(schema)) {
    return undefined;
  }
  const validPathSegments = schemaPath.split('/');
  const invalidSegment = (pathSegment: string) =>
    pathSegment === '#' || pathSegment === undefined || pathSegment === '';
  const resultSchema = validPathSegments.reduce((curSchema, pathSegment) => {
    curSchema =
      curSchema === undefined || curSchema.$ref === undefined
        ? curSchema
        : resolveSchema(schema, curSchema.$ref);
    return invalidSegment(pathSegment)
      ? curSchema
      : get(curSchema, pathSegment);
  }, schema);
  // TODO: because schema is already scoped we might end up with refs pointing
  // outside of the current schema. It would be better if we'd always could deal
  // with absolute paths here, so that we don't need to keep two different
  // schemas around
  if (resultSchema !== undefined && resultSchema.$ref !== undefined) {
    try {
      return retrieveResolvableSchema(schema, resultSchema.$ref);
    } catch (e) {
      return retrieveResolvableSchema(rootSchema, resultSchema.$ref);
    }
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
function retrieveResolvableSchema(
  full: JsonSchema,
  reference: string
): JsonSchema {
  // tslint:enable:only-arrow-functions
  const child = resolveSchema(full, reference);
  const allRefs = findAllRefs(child);
  const innerSelfReference = allRefs[reference];
  if (innerSelfReference !== undefined) {
    innerSelfReference.$ref = '#';
  }

  return child;
}

// copied and adapted from JsonRefs

/**
 * Interface for describing result of an extracted schema ref
 */
export interface SchemaRef {
  uri: string;
}

/**
 * Interface wraps SchemaRef
 */
export interface SchemaRefs {
  [id: string]: SchemaRef;
}

export const findRefs = (obj: JsonSchema): SchemaRefs => {
  const refs: SchemaRefs = {};

  // Walk the document (or sub document) and find all JSON References
  walk([], obj, [], ({}, node: any, path: any) => {
    let processChildren = true;
    let refDetails;
    let refPtr;

    if (isRefLike(node, false)) {
      refDetails = getRefDetails(node);

      if (refDetails.type !== 'invalid') {
        refPtr = pathToPtr(path, undefined);

        refs[refPtr] = refDetails;
      }

      // Whenever a JSON Reference has extra children, its children should not be processed.
      //   See: http://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03#section-3
      if (getExtraRefKeys(node).length > 0) {
        processChildren = false;
      }
    }

    return processChildren;
  });

  return refs;
};

// pure copy of JsonRefs (added types)

const walk = (ancestors: any, node: any, path: any, fn: any) => {
  let processChildren = true;

  const walkItem = (item: any, segment: any) => {
    path.push(segment);
    walk(ancestors, item, path, fn);
    path.pop();
  };

  // Call the iteratee
  if (isFunction(fn)) {
    processChildren = fn(ancestors, node, path);
  }

  // We do not process circular objects again
  if (ancestors.indexOf(node) === -1) {
    ancestors.push(node);

    if (processChildren !== false) {
      if (isArray(node)) {
        node.forEach((member, index) => {
          walkItem(member, index.toString());
        });
      } else if (isObject(node)) {
        forOwn(node, (cNode, key) => {
          walkItem(cNode, key);
        });
      }
    }

    ancestors.pop();
  }
};

const pathToPtr = (path: any, hashPrefix: any) => {
  if (!isArray(path)) {
    throw new Error('path must be an Array');
  }

  // Encode each segment and return
  return (
    (hashPrefix !== false ? '#' : '') +
    (path.length > 0 ? '/' : '') +
    encodePath(path).join('/')
  );
};

const encodePath = (path: any) => {
  if (!isArray(path)) {
    throw new TypeError('path must be an array');
  }

  return path.map(seg => {
    if (!isString(seg)) {
      seg = JSON.stringify(seg);
    }

    return seg.replace(/~/g, '~0').replace(/\//g, '~1');
  });
};

const uriDetailsCache = {} as any;
const badPtrTokenRegex = /~(?:[^01]|$)/g;

const getRefDetails = (obj: any) => {
  const details = {
    def: obj
  } as any;
  let cacheKey;
  let extraKeys;
  let uriDetails;

  try {
    if (isRefLike(obj, true)) {
      cacheKey = obj.$ref;
      uriDetails = uriDetailsCache[cacheKey];

      if (isUndefined(uriDetails)) {
        uriDetails = uriDetailsCache[cacheKey] = parseURI(cacheKey);
      }

      details.uri = cacheKey;
      details.uriDetails = uriDetails;

      if (isUndefined(uriDetails.error)) {
        details.type = getRefType(details);

        // Validate the JSON Pointer
        try {
          if (['#', '/'].indexOf(cacheKey[0]) > -1) {
            isPtr(cacheKey, true);
          } else if (cacheKey.indexOf('#') > -1) {
            isPtr(uriDetails.fragment, true);
          }
        } catch (err) {
          details.error = err.message;
          details.type = 'invalid';
        }
      } else {
        details.error = details.uriDetails.error;
        details.type = 'invalid';
      }

      // Identify warning
      extraKeys = getExtraRefKeys(obj);

      if (extraKeys.length > 0) {
        details.warning =
          'Extra JSON Reference properties will be ignored: ' +
          extraKeys.join(', ');
      }
    } else {
      details.type = 'invalid';
    }
  } catch (err) {
    details.error = err.message;
    details.type = 'invalid';
  }

  return details;
};

const getRefType = (refDetails: any) => {
  let type;

  // Convert the URI reference to one of our types
  switch (refDetails.uriDetails.reference) {
    case 'absolute':
    case 'uri':
      type = 'remote';
      break;
    case 'same-document':
      type = 'local';
      break;
    default:
      type = refDetails.uriDetails.reference;
  }

  return type;
};

const getExtraRefKeys = (ref: any) => {
  return Object.keys(ref).filter(key => {
    return key !== '$ref';
  });
};

const parseURI = (uri: string) => {
  // We decode first to avoid doubly encoding
  return parse(uri);
};

const isPtr = (ptr: any, throwWithDetails: boolean) => {
  let valid = true;
  let firstChar;

  try {
    if (isString(ptr)) {
      if (ptr !== '') {
        firstChar = ptr.charAt(0);

        if (['#', '/'].indexOf(firstChar) === -1) {
          throw new Error('ptr must start with a / or #/');
        } else if (firstChar === '#' && ptr !== '#' && ptr.charAt(1) !== '/') {
          throw new Error('ptr must start with a / or #/');
        } else if (ptr.match(badPtrTokenRegex)) {
          throw new Error('ptr has invalid token(s)');
        }
      }
    } else {
      throw new Error('ptr is not a String');
    }
  } catch (err) {
    if (throwWithDetails === true) {
      throw err;
    }

    valid = false;
  }

  return valid;
};

const isRefLike = (obj: any, throwWithDetails: boolean) => {
  let refLike = true;

  try {
    if (!isPlainObject(obj)) {
      throw new Error('obj is not an Object');
    } else if (!isString(obj.$ref)) {
      throw new Error('obj.$ref is not a String');
    }
  } catch (err) {
    if (throwWithDetails) {
      throw err;
    }

    refLike = false;
  }

  return refLike;
};
