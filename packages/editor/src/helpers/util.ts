import * as _ from 'lodash';
import {
  combineReducers,
  createStore,
  Store
} from 'redux';
import {
  Actions,
  jsonformsReducer
} from '@jsonforms/core';
import { editorReducer } from '../reducers/index';

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

/**
 * Extract the array index from the given path.
 */
export const indexFromPath = (path: string): number => {
  return parseInt(_.last(path.split('.')), 10);
};

/**
 * Gets the parent path from the given path by cutting of the last segment
 *
 * @param path The path to get the parent path from
 */
export const parentPath = (path: string): string => {
  return path.substring(0, path.lastIndexOf('.'));
};

// TODO instead of this method with lots of parameters use a fluent pattern
//      that allows to configure each parameter with a separate method call.
/**
 * Inits a store for a json editor
 *
 * @param data The initial data
 * @param schema The root JSON Schema
 * @param uischema The UI Schema
 * @param fields The renderer fields (e.g. vanilla or material)
 * @param renderers The renderer set (e.g. vanilla or material)
 * @param imageMapping The image mapping for the tree's icons
 * @param labelMapping The label mapping for the labels shown in the tree
 * @param modelMapping The model mapping
 * @param uiSchemata The object containing the UI Schemata for the data types displayed by the
 *                   editor. The keys are the schema ids and the values the actual UI Schemata
 */
export const createEditorStore = (
  data = {},
  schema,
  uischema,
  fields,
  renderers,
  imageMapping?,
  labelMapping?,
  modelMapping?,
  uiSchemata = {}): Store<any> => {
  const store = createStore(
    combineReducers({ jsonforms: jsonformsReducer({ editor: editorReducer }) }),
    {
        jsonforms: {
          renderers,
          fields,
          editor: {
            imageMapping,
            labelMapping,
            modelMapping,
            uiSchemata
          }
        }
      }
  );

  store.dispatch(Actions.init(data, schema, uischema));

  return store;
};
