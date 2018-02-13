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
  JsonFormsStore,
  SET_CONFIG,
  SET_LOCALE
} from '@jsonforms/core';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

export const initJsonFormsStore = ({
                                     data,
                                     schema,
                                     uischema,
                                     translations,
                                     locale,
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
          uischema
        },
        renderers: JsonForms.renderers,
        fields: JsonForms.fields,
        i18n: {
          translations,
          locale
        },
        config,
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

  store.dispatch({
    type: SET_LOCALE,
    locale
  });

  store.dispatch({
    type: SET_CONFIG,
    config
  });

  return store;
};
