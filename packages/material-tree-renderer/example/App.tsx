import React from 'react';
import { Provider } from 'react-redux';
import { ThemedTreeWithDetail } from '../src';
import EditorBar from './app-bar/EditorBar';
import {
  ControlElement,
  getData,
  getSchema,
  getUiSchema,
  JsonFormsStore
} from '@jsonforms/core';

interface AppParameter {
  store: JsonFormsStore;
  filterPredicate: any;
  labelProviders: any;
  imageProvider: any;
}

const App = ({ store, filterPredicate, labelProviders, imageProvider }: AppParameter) => (
  <Provider store={store}>
    <React.Fragment>
      <EditorBar
        schema={getSchema(store.getState())}
        rootData={getData(store.getState())}
      />
      <ThemedTreeWithDetail
        filterPredicate={filterPredicate}
        labelProviders={labelProviders}
        imageProvider={imageProvider}
        schema={getSchema(store.getState())}
        uischema={getUiSchema(store.getState())as ControlElement}
      />
    </React.Fragment>
  </Provider>
);

export default App;
