import 'jsdom-global/register';
import * as installCE from 'document-register-element/pony';
declare let global;
installCE(global, 'force');
global.requestAnimationFrame = cb => setTimeout(cb, 0);
import {
  Actions,
  jsonformsReducer,
  JsonFormsState,
  JsonSchema,
  UISchemaElement
} from '@jsonforms/core';
import { combineReducers, createStore, Store } from 'redux';
import FakeLayout, { fakeLayoutTester } from './FakeLayout';
import FakeControl, { fakeControlTester } from './FakeControl';

/**
 * Describes the initial state of the JSON Form's store.
 */
export interface JsonFormsInitialState {
  /**
   * Data instance to be rendered.
   */
  data: any;

  /**
   * JSON Schema describing the data to be rendered.
   */
  schema?: JsonSchema;

  /**
   * UI Schema describing the UI to be rendered.
   */
  uischema?: UISchemaElement;

  /**
   * Any additional state.
   */
  [x: string]: any;
}

export const testRenderers = [
  { tester: fakeLayoutTester, renderer: FakeLayout },
  { tester: fakeControlTester, renderer: FakeControl }
];

export const initJsonFormsStore = ({
                                     data,
                                     schema,
                                     uischema,
                                     ...props
                                   }: JsonFormsInitialState): Store<JsonFormsState> => {

  const store: Store<JsonFormsState> = createStore(
    combineReducers({ jsonforms: jsonformsReducer() }),
    {
      jsonforms: {
        renderers: testRenderers,
        ...props
      }
    }
  );

  store.dispatch(Actions.init(data, schema, uischema));

  return store;
};

export { FakeControl, FakeLayout, fakeLayoutTester, fakeControlTester };
