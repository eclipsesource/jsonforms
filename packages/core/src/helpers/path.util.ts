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

export const composeWithUi = (scopableUi: Scopable, path: string) => {
  const segments = toDataPathSegments(scopableUi.scope.$ref);

  return _.isEmpty(segments) ? path : compose(path, segments.join('.'));
};
