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
