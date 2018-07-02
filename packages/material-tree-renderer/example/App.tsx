import * as React from 'react';
import { Provider } from 'react-redux';
import EditorIde from '../src/ThemedTreeWithDetail';
import EditorBar from './app-bar/EditorBar';
import {
  getData,
  getSchema,
  getUiSchema
} from '@jsonforms/core';

const App = ({store, filterPredicate, labelProvider, imageProvider}) => (
  <Provider store={store}>
    <React.Fragment>
      <EditorBar
        schema={getSchema(store.getState())}
        rootData={getData(store.getState())}
      />
      <EditorIde
        filterPredicate={filterPredicate}
        labelProvider={labelProvider}
        imageProvider={imageProvider}
        schema={getSchema(store.getState())}
        uischema={getUiSchema(store.getState())}
      />
    </React.Fragment>
  </Provider>
);

export default App;
