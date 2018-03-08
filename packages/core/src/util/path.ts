/*
  The MIT License
  
  Copyright (c) 2018 EclipseSource Munich
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
import * as _ from 'lodash';
import { Scopable } from '../';

export const compose = (path1: string, path2: string) => {
  let p1 = path1;
  if (!_.isEmpty(path1) && !_.isEmpty(path2) && !path2.startsWith('[')) {
    p1 = path1 + '.';
  }

  if (_.isEmpty(p1)) {
    return path2;
  } else if (_.isEmpty(path2)) {
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

  const segments = schemaPath.split('/');
  const startFromRoot = segments[0] === '#' || segments[0] === '';
  const startIndex =  startFromRoot ? 2 : 1;

  return _.range(startIndex, segments.length, 2).map(idx => segments[idx]);
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
  const segments = toDataPathSegments(scopableUi.scope);

  if (_.isEmpty(segments) && path === undefined) {
    return '';
  }

  return _.isEmpty(segments) ? path : compose(path, segments.join('.'));
};
