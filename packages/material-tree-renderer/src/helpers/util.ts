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
import get from 'lodash/get';
import last from 'lodash/last';
import isEmpty from 'lodash/isEmpty';
export interface LabelDefinition {
  /** A constant label value displayed for every object for which this label definition applies. */
  constant?: string;
  /** The property name that is used to get a variable part of an object's label. */
  property?: string;
}

/**
 * Resolves the given local data path against the root data.
 *
 * @param rootData the root data to resolve the data from
 * @param path The path to resolve against the root data
 * @return the resolved data or {null} if the path is not a valid path in the root data
 */
export const resolveLocalData = (rootData: Object, path: string): Object => {
  let resolvedData = rootData;
  for (const segment of path.split('/')) {
    if (segment === '#' || isEmpty(segment)) {
      continue;
    }
    if (isEmpty(resolvedData) || !resolvedData.hasOwnProperty(segment)) {
      console.warn(
        `The local path '${path}' cannot be resolved in the given data:`,
        rootData
      );

      return null;
    }
    resolvedData = get(resolvedData, segment);
  }

  return resolvedData;
};

/**
 * Extract the array index from the given path.
 */
export const indexFromPath = (path: string): number => {
  return parseInt(last(path.split('.')), 10);
};

/**
 * Gets the parent path from the given path by cutting of the last segment
 *
 * @param path The path to get the parent path from
 */
export const parentPath = (path: string): string => {
  return path.substring(0, path.lastIndexOf('.'));
};
