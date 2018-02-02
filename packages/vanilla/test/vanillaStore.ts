import { applyMiddleware, createStore, Store } from 'redux';
import thunk from 'redux-thunk';
import { Actions, jsonformsReducer, JsonFormsState } from '@jsonforms/core';
import { vanillaStyles } from '../src/util';
import { stylingReducer } from '../src/reducers';

export const initJsonFormsVanillaStore = ({
  data,
  schema,
  uischema,
  ...other
}): Store<JsonFormsState> => {

  const store = createStore(
    jsonformsReducer({ styles: stylingReducer }),
    {
      jsonforms: {
        common: {
          data,
          schema,
          uischema
        },
        styles: vanillaStyles,
        ...other
      }
    },
    applyMiddleware(thunk)
  );

  store.dispatch({
    type: Actions.INIT,
    schema,
    data,
    uischema
  });

  store.dispatch(Actions.validate());

  return store;
};
