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
import { Actions, getData } from '@jsonforms/core';
import { CHANGE_EXAMPLE, changeExample, ExampleDescription } from '@jsonforms/examples';
import { ReactExampleDescription } from './util';
import * as React from 'react';
import { connect } from 'react-redux';
import { AnyAction, Dispatch, Reducer } from 'redux';

export interface ExampleStateProps {
    examples: ReactExampleDescription[];
    dataAsString: string;
    selectedExample: ReactExampleDescription;
}

export interface ExampleDispatchProps {
    changeExampleData(example: ReactExampleDescription): void;
    getComponent(example: ReactExampleDescription): React.Component;
}

export interface AppProps extends ExampleStateProps {
    changeExample(exampleName: string): void;
    getExtensionComponent(): React.Component;
}

const mapStateToProps = (state: any) => {
  const examples = state.examples.data;
  const selectedExample = state.examples.selectedExample || examples[0];
  return {
    dataAsString: JSON.stringify(getData(state), null, 2),
    examples,
    selectedExample
  };
};
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  changeExampleData: (example: ReactExampleDescription) => {
    dispatch(changeExample(example));
    dispatch(Actions.init(example.data, example.schema, example.uischema));
    Actions.setConfig(example.config)(dispatch);
  },
  getComponent: (example: ReactExampleDescription) =>
    example.customReactExtension ? example.customReactExtension(dispatch) : null
});
const mergeProps =
    (stateProps: ExampleStateProps, dispatchProps: ExampleDispatchProps, ownProps: any): AppProps => {
        return Object.assign({}, ownProps, {
            ...stateProps,
            changeExample: (exampleName: string) => dispatchProps.changeExampleData(
                stateProps.examples.find((e: ExampleDescription) => e.name === exampleName)
            ),
            getExtensionComponent: () =>
                dispatchProps.getComponent(stateProps.selectedExample)
        });
    };

interface ExamplesState {
    examples: ReactExampleDescription[];
    selectedExample: ReactExampleDescription;
}

const initState: ExamplesState = {
    examples: [],
    selectedExample: undefined
};

export const exampleReducer = (state: ExamplesState = initState, action: any) => {
  switch (action.type) {
    case CHANGE_EXAMPLE:
      return Object.assign({}, state, {
        selectedExample: action.example
      });
    default:
      return state;
  }
};
export const initializedConnect = connect(mapStateToProps, mapDispatchToProps, mergeProps);
export interface AdditionalStoreParams {
  name: string;
  reducer?: Reducer<any>;
  state: any;
}
