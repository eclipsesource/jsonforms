import { applyMiddleware, combineReducers, createStore, Store } from 'redux';
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

  const store: Store<JsonFormsState> = createStore(
    combineReducers({ jsonforms: jsonformsReducer({ styles: stylingReducer }) }),
    {
      jsonforms: {
        styles: vanillaStyles,
        ...other
      }
    },
    applyMiddleware(thunk)
  );

  store.dispatch(Actions.init(
    data,
    schema,
    uischema
  ));

  return store;
};
