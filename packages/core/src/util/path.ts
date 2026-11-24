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

export const compose = (path1: string, path2: string) => {
  let p1 = path1;
  if (!isEmpty(path1) && !isEmpty(path2) && !path2.startsWith('[')) {
    p1 = path1 + '.';
  }

  if (isEmpty(p1)) {
    return path2;
  } else if (isEmpty(path2)) {
    return p1;
  } else {
    return `${p1}${path2}`;
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
  const segments = schemaPath.split('/').map(decode);
  const startFromRoot = segments[0] === '#' || segments[0] === '';
  const dataSegments: string[] = [];
  // Walk the pointer segment by segment so that keywords are only skipped
  // where a keyword is expected, never inside or in place of a property name
  let i = startFromRoot ? 1 : 0;
  while (i < segments.length) {
    const segment = segments[i];
    if (
      (segment === 'anyOf' || segment === 'allOf' || segment === 'oneOf') &&
      /^\d+$/.test(segments[i + 1] ?? '')
    ) {
      i += 2;
    } else if (segment === 'then' || segment === 'else') {
      i += 1;
    } else {
      if (i + 1 < segments.length) {
        dataSegments.push(segments[i + 1]);
      }
      i += 2;
    }
  }
  return dataSegments;
};

/**
 * Convert a schema path (i.e. JSON pointer) to a data path.
 *
 * Data paths can be used in field change event handlers like handleChange.
 *
 * @example
 * toDataPath('#/properties/foo/properties/bar') === 'foo.bar')
 *
 * @param {string} schemaPath the schema path to be converted
 * @returns {string} the data path
 */
export const toDataPath = (schemaPath: string): string => {
  return toDataPathSegments(schemaPath).join('.');
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
  pointerSegment?.replace(/~1/g, '/').replace(/~0/g, '~');

/**
 * Transform a dotted path to a uiSchema properties path
 * @param path a dotted prop path to a schema value (i.e. articles.comment.author)
 * @return the uiSchema properties path (i.e. /properties/articles/properties/comment/properties/author)
 */
export const getPropPath = (path: string): string => {
  return `/properties/${path
    .split('.')
    .map((p) => encode(p))
    .join('/properties/')}`;
};
