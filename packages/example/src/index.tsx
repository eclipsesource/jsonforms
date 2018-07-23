/*
  The MIT License

  Copyright (c) 2018 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import { Actions, jsonformsReducer, RankedTester } from '@jsonforms/core';
import { getExamples } from '@jsonforms/examples';
import { AdditionalStoreParams, exampleReducer } from './reduxUtil';
import { enhanceExample, ReactExampleDescription } from './util';
const setupStore = (
  exampleData: ReactExampleDescription[], fields, renderers, additionalStoreParams) => {
  const additionalReducers = additionalStoreParams.reduce(
    (acc, x) => {
      if (x.reducer) {
        acc[x.name] = x.reducer;
      }

      return acc;
    },
    {} as any
  );
  const additionalInitState = additionalStoreParams.reduce(
    (acc, x) => {
      acc[x.name] = x.state;

      return acc;
    },
    {} as any
  );
  const store = createStore(
    combineReducers({
      jsonforms: jsonformsReducer({ ...additionalReducers }), examples: exampleReducer,
    }),
    {
      jsonforms: {
        fields: fields,
        renderers: renderers,
        ...additionalInitState
      },
      examples: {
        data: exampleData
      }
    }
  );
  store.dispatch(Actions.init(exampleData[0].data, exampleData[0].schema, exampleData[0].uischema));

  return store;
};
export const renderExample = (
  renderers: { tester: RankedTester, renderer: any }[],
  fields: { tester: RankedTester, field: any }[],
  ...additionalStoreParams: AdditionalStoreParams[]
) => {

  const exampleData = enhanceExample(getExamples());
  const store = setupStore(exampleData, fields, renderers, additionalStoreParams);
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  );

};
