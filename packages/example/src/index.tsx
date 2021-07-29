/*
  The MIT License

  Copyright (c) 2017-2019 EclipseSource Munich
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
import ReactDOM from 'react-dom';
import React from 'react';
import './index.css';
import App from './App';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import {
  Actions,
  JsonFormsCellRendererRegistryEntry,
  jsonFormsReducerConfig,
  JsonFormsRendererRegistryEntry,
  JsonFormsState,
  RankedTester,
  Store
} from '@jsonforms/core';
import { getExamples } from '@jsonforms/examples';
import { AdditionalStoreParams, exampleReducer } from './reduxUtil';
import { enhanceExample, ReactExampleDescription } from './util';

import dayjs from 'dayjs';
import 'dayjs/locale/de';
import 'dayjs/locale/en';
dayjs.locale('de');

const setupStore = (
  exampleData: ReactExampleDescription[],
  cells: JsonFormsCellRendererRegistryEntry[],
  renderers: JsonFormsRendererRegistryEntry[],
  additionalStoreParams: any
) => {
  const additionalReducers = additionalStoreParams.reduce(
    (acc: any, x: any) => {
      if (x.reducer) {
        acc[x.name] = x.reducer;
      }

      return acc;
    },
    {} as any
  );
  const additionalInitState = additionalStoreParams.reduce(
    (acc: any, x: any) => {
      acc[x.name] = x.state;

      return acc;
    },
    {} as any
  );
  const reducer = combineReducers({
    jsonforms: combineReducers(jsonFormsReducerConfig),
    examples: exampleReducer,
    ...additionalReducers
  });
  const store: Store<JsonFormsState> = createStore(reducer, {
    jsonforms: {
      cells: cells,
      renderers: renderers,
      ...additionalInitState
    },
    examples: {
      data: exampleData
    }
  } as any);

  // Add configuration to JSONForms
  store.dispatch(
    Actions.init(
      exampleData[0].data,
      exampleData[0].schema,
      exampleData[0].uischema,
    )
  );
  return store;
};

export const renderExample = (
  renderers: { tester: RankedTester; renderer: any }[],
  cells: { tester: RankedTester; cell: any }[],
  enhancer?: (examples: ReactExampleDescription[]) => ReactExampleDescription[],
  ...additionalStoreParams: AdditionalStoreParams[]
) => {
  const exampleData = enhanceExample(getExamples());
  const enhancedExampleData = enhancer ? enhancer(exampleData) : exampleData;
  const store = setupStore(
    enhancedExampleData,
    cells,
    renderers,
    additionalStoreParams
  );
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  );
};
