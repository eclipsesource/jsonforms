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
import without from 'lodash/without';
import { Scopable } from '../';

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
    .replace(/anyOf\/[\d]\//g, '')
    .replace(/allOf\/[\d]\//g, '')
    .replace(/oneOf\/[\d]\//g, '');
  const segments = s.split('/');
  // TODO: any keywords missing?
  const keywords = [
    'properties',
    'items',
    'definitions',
    'anyOf',
    'allOf',
    'oneOf'
  ];
  const instancePath: string[] = [];
  let prevWord;

  for (let i = 0; i < segments.length; i++) {
    if (keywords.includes(prevWord)) {
      prevWord = segments[i];
      instancePath.push(segments[i]);
      continue;
    }
    prevWord = segments[i];
    if (without(keywords, 'properties').includes(segments[i])) {
      // ignore next segment
      i += 1;
      continue;
    }
    if (keywords.includes(segments[i])) {
      continue;
    }
    instancePath.push(segments[i]);
  }

  return instancePath.slice(1);
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
  return toDataPathSegments(schemaPath).join('.');
};

export const composeWithUi = (scopableUi: Scopable, path: string): string => {
  let segments = toDataPathSegments(scopableUi.scope);

  if (isEmpty(segments) && path === undefined) {
    return '';
  }

  // TODO: this seems rather ugly, but what we're trying to do
  // here is to join with any path that possibly contains
  // indices
  if (path !== undefined && segments[0] === path.split('.')[0]) {
    segments = segments.slice(1);
  }

  return isEmpty(segments)
    ? path
    : compose(
        path,
        segments.join('.')
      );
};
