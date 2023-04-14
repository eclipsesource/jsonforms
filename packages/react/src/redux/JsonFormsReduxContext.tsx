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

import {
  cellReducer,
  configReducer,
  coreReducer,
  i18nReducer,
  JsonFormsState,
  JsonFormsSubStates,
  rendererReducer,
  uischemaRegistryReducer,
} from '@jsonforms/core';
import { connect } from 'react-redux';
import { combineReducers, Reducer } from 'redux';
import React from 'react';
// This import will be aliased to '@jsonforms/react' via rollup
import { JsonFormsContext, JsonFormsReduxContextProps } from '..';

const JsonFormsReduxProvider = ({
  children,
  dispatch,
  ...other
}: JsonFormsReduxContextProps) => {
  return (
    <JsonFormsContext.Provider
      value={{
        dispatch,
        ...other,
      }}
    >
      {children}
    </JsonFormsContext.Provider>
  );
};

export const JsonFormsReduxContext = connect((state: JsonFormsState) => ({
  ...state.jsonforms,
}))(JsonFormsReduxProvider);

export const jsonformsReducer = (
  additionalReducers = {}
): Reducer<JsonFormsSubStates> =>
  combineReducers<JsonFormsSubStates>({
    core: coreReducer,
    renderers: rendererReducer,
    cells: cellReducer,
    config: configReducer,
    uischemas: uischemaRegistryReducer,
    i18n: i18nReducer,
    ...additionalReducers,
  });
