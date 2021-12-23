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
import { Scopable } from '../models';

export const compose = (path1: string[], path2: string[] | string) => {
  return path1?.concat(path2 ?? []);
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
    .replace(/anyOf\/[\d]\//g, '')
    .replace(/allOf\/[\d]\//g, '')
    .replace(/oneOf\/[\d]\//g, '');
  const segments = s.split('/');

  const startFromRoot = segments[0] === '#' || segments[0] === '';
  const startIndex = startFromRoot ? 2 : 1;
  return range(startIndex, segments.length, 2).map(idx => segments[idx]);
};
// TODO: `toDataPathSegments` and `toDataPath` are the same!
/**
 * Remove all schema-specific keywords (e.g. 'properties') from a given path.
 * @example
 * toDataPath('#/properties/foo/properties/bar') === ['foo', 'bar'])
 *
 * @param {string} schemaPath the schema path to be converted
 * @returns {string[]} the path without schema-specific keywords
 */
export const toDataPath = (schemaPath: string): string[] => toDataPathSegments(schemaPath);

export const composeWithUi = (scopableUi: Scopable, path: string[]): string[] => {
  const segments = toDataPathSegments(scopableUi.scope);

  if (isEmpty(segments) && path === undefined) {
    return [];
  }

  return isEmpty(segments) ? path : compose(path, segments);
};

/**
 * Check if two paths are equal (section by section)
 */
export const pathsAreEqual = (path1: string[], path2: string[]) =>
  path2.length === path1.length && path2.every((section, i) => section === path1[i]);

/**
 * Check if a path starts with another path (`subPath`)
 */
export const pathStartsWith = (path: string[], subPath: string[]) =>
  subPath.length <= path.length && subPath.every((section, i) => section === path[i]);

/**
 * Convert path `array` to a `string`, injectively (in a reversible way)
 */
export const stringifyPath = (path: string[]) =>
  path.map(segment => ajvInstancePathEncoder(segment)).join('/');

export const ajvInstancePathEncoder = (pathSegment: string) =>
  pathSegment.replace(/[~\/]/g, match => match === '~' ? '~0' : '~1');

export const ajvInstancePathDecoder = (pathSegment: string) =>
  pathSegment.replace(/~0|~1/g, match => match === '~0' ? '~' : '/');
