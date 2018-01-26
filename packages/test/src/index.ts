import 'jsdom-global/register';
import * as installCE from 'document-register-element/pony';
declare let global;
installCE(global, 'force');
global.requestAnimationFrame = cb => setTimeout(cb, 0);
import {
  INIT,
  JsonForms,
  JsonFormsInitialState,
  jsonformsReducer,
  JsonFormsStore
} from '@jsonforms/core';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

export const initJsonFormsStore = ({
                                     data,
                                     schema,
                                     uischema,
                                     config,
                                     ...props
                                   }: JsonFormsInitialState): JsonFormsStore => {
  const store = createStore(
    jsonformsReducer(),
    {
      jsonforms: {
        common: {
          data,
          schema,
          uischema,
          config
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
    uischema,
    config
  });

  return store;
};
