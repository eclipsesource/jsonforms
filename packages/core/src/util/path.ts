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
import range from 'lodash/range';
import { isScoped, Scopable } from '../models';

/**
 * Composes two JSON pointer. Pointer1 is appended to pointer2.
 * JSON pointer is seperated and start with '/' e.g: /foo/0
 *
 * @param {string} pointer1 JSON pointer
 * @param {string} pointer2 JSON pointer
 * @returns {string} resulting JSON pointer
 */
export const compose = (pointer1: string, pointer2: string) => {
  let p2 = pointer2;
  if (!isEmpty(pointer2) && !pointer2.startsWith('/')) {
    p2 = '/' + pointer2;
  }

  if (isEmpty(pointer1)) {
    return p2;
  } else if (isEmpty(pointer2)) {
    return pointer1;
  } else {
    return `${pointer1}${p2}`;
  }
};

export { compose as composePaths };

/**
 * Convert a schema path (i.e. JSON pointer) to an array by splitting
 * at the '/' character and removing all schema-specific keywords.
 *
 * The returned value can be used to de-reference a root object by folding over it
 * and de-referencing the single segments to obtain a new object.
 *
 *
 * @param {string} schemaPath the schema path to be converted
 * @returns {string[]} an array containing only non-schema-specific segments
 */
export const toDataPathSegments = (schemaPath: string): string[] => {
  const s = schemaPath
    .replace(/(anyOf|allOf|oneOf)\/[\d]\//g, '')
    .replace(/(then|else)\//g, '');
  const segments = s.split('/');

  const decodedSegments = segments.map(decode);

  const startFromRoot = decodedSegments[0] === '#' || decodedSegments[0] === '';
  const startIndex = startFromRoot ? 2 : 1;
  return range(startIndex, decodedSegments.length, 2).map(
    (idx) => decodedSegments[idx]
  );
};

/**
 * Convert a schema path (i.e. JSON pointer) to a data path.
 *
 * Data paths can be used in field change event handlers like handleChange.
 *
 * @example
 * toDataPath('#/properties/foo/properties/bar') === '/foo/bar')
 *
 * @param {string} schemaPath the schema path to be converted
 * @returns {string} the data path
 */
export const toDataPath = (schemaPath: string): string => {
  return '/' + toDataPathSegments(schemaPath).join('/');
};

export const composeWithUi = (scopableUi: Scopable, path: string): string => {
  if (!isScoped(scopableUi)) {
    return path ?? '';
  }

  const segments = toDataPathSegments(scopableUi.scope);

  if (isEmpty(segments)) {
    return path ?? '';
  }

  return compose(path, '/' + segments.join('/'));
};

export const toLodashSegments = (jsonPointer: string): string[] => {
  let path = jsonPointer;
  if (jsonPointer && jsonPointer.startsWith('/')) {
    path = jsonPointer.substring(1);
  }
  return path ? path.split('/').map(decode) : [];
};

export const toLodashPath = (jsonPointer: string) => {
  return toLodashSegments(jsonPointer).join('.');
};

/**
 * Encodes the given segment to be used as part of a JSON Pointer
 *
 * JSON Pointer has special meaning for "/" and "~", therefore these must be encoded
 */
export const encode = (segment: string) =>
  segment?.replace(/~/g, '~0').replace(/\//g, '~1');
/**
 * Decodes a given JSON Pointer segment to its "normal" representation
 */
export const decode = (pointerSegment: string) =>
  pointerSegment?.replace(/~1/g, '/').replace(/~0/, '~');
