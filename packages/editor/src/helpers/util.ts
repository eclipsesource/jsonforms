import * as _ from 'lodash';
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
      if (segment === '#' || _.isEmpty(segment)) {
        continue;
      }
      if (_.isEmpty(resolvedData) || !resolvedData.hasOwnProperty(segment)) {
        console.error(`The local path '${path}' cannot be resolved in the given data:`, rootData);
  
        return null;
      }
      resolvedData = resolvedData[segment];
    }
  
    return resolvedData;
  };
