import 'jsdom-global/register';
import * as installCE from 'document-register-element/pony';
declare let global;
installCE(global, 'force');
global.requestAnimationFrame = cb => setTimeout(cb, 0);
import {
  INIT,
  JsonForms,
  jsonformsReducer,
  JsonSchema,
  UISchemaElement
} from '@jsonforms/core';
import { applyMiddleware, createStore, Store } from 'redux';
import { JsonFormsState } from '@jsonforms/core';
import thunk from 'redux-thunk';

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

export const initJsonFormsStore = ({
                                     data,
                                     schema,
                                     uischema,
                                     ...props
                                   }: JsonFormsInitialState): Store<JsonFormsState> => {
  const store: Store<JsonFormsState> = createStore(
    jsonformsReducer(),
    {
      jsonforms: {
        common: {
          data,
          schema,
          uischema
        },
        renderers: JsonForms.renderers,
        fields: JsonForms.fields,
        ...props
      }
    },
    applyMiddleware(thunk)
  );

  // necessary for validation to work
  store.dispatch({
    type: INIT,
    schema,
    data,
    uischema
  });

  return store;
};

import FakeLayout, { fakeLayoutTester } from './FakeLayout';
import FakeControl, { fakeControlTester } from './FakeControl';

export { FakeControl, FakeLayout, fakeLayoutTester, fakeControlTester };
