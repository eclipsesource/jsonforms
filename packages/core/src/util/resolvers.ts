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
import has from 'lodash/has';
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

  // tslint:disable:no-string-literal
  if (has(schema, 'links')) {
    get(schema, 'links').forEach((link: { targetSchema: JsonSchema }) => {
      if (!isEmpty(link.targetSchema.$ref)) {
        result[link.targetSchema.$ref] = schema;
      } else {
        findAllRefs(link.targetSchema, result);
      }
    });
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

export const findRefs = (obj: any) => {
  var refs = {} as any;

  // Validate the provided document
  if (!isArray(obj) && !isObject(obj)) {
    throw new TypeError('obj must be an Array or an Object');
  }

  // Walk the document (or sub document) and find all JSON References
  walk([], obj, [], function({}, node: any, path: any) {
    var processChildren = true;
    var refDetails;
    var refPtr;

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

function walk(ancestors: any, node: any, path: any, fn: any) {
  var processChildren = true;

  function walkItem(item: any, segment: any) {
    path.push(segment);
    walk(ancestors, item, path, fn);
    path.pop();
  }

  // Call the iteratee
  if (isFunction(fn)) {
    processChildren = fn(ancestors, node, path);
  }

  // We do not process circular objects again
  if (ancestors.indexOf(node) === -1) {
    ancestors.push(node);

    if (processChildren !== false) {
      if (isArray(node)) {
        node.forEach(function(member, index) {
          walkItem(member, index.toString());
        });
      } else if (isObject(node)) {
        forOwn(node, function(cNode, key) {
          walkItem(cNode, key);
        });
      }
    }

    ancestors.pop();
  }
}

function pathToPtr(path: any, hashPrefix: any) {
  if (!isArray(path)) {
    throw new Error('path must be an Array');
  }

  // Encode each segment and return
  return (
    (hashPrefix !== false ? '#' : '') +
    (path.length > 0 ? '/' : '') +
    encodePath(path).join('/')
  );
}

function encodePath(path: any) {
  if (!isArray(path)) {
    throw new TypeError('path must be an array');
  }

  return path.map(function(seg) {
    if (!isString(seg)) {
      seg = JSON.stringify(seg);
    }

    return seg.replace(/~/g, '~0').replace(/\//g, '~1');
  });
}

var uriDetailsCache = {} as any;
var badPtrTokenRegex = /~(?:[^01]|$)/g;

function getRefDetails(obj: any) {
  var details = {
    def: obj
  } as any;
  var cacheKey;
  var extraKeys;
  var uriDetails;

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
}

function getRefType(refDetails: any) {
  var type;

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
}

function getExtraRefKeys(ref: any) {
  return Object.keys(ref).filter(function(key) {
    return key !== '$ref';
  });
}

function parseURI(uri: string) {
  // We decode first to avoid doubly encoding
  return parse(uri);
}

function isPtr(ptr: any, throwWithDetails: boolean) {
  var valid = true;
  var firstChar;

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
}

function isRefLike(obj: any, throwWithDetails: boolean) {
  var refLike = true;

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
}
