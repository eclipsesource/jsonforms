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
import { ExampleDescription, nestedArray as NestedArrayExample } from '@jsonforms/examples';
import ConnectedRatingControl, { ratingControlTester } from './RatingControl';
import { Actions } from '@jsonforms/core';

export interface ReactExampleDescription extends ExampleDescription {
  customReactExtension?(dispatch): React.Component;
}
const registerRatingControl = dispatch => {
  dispatch(Actions.registerField(ratingControlTester, ConnectedRatingControl));
};
const unregisterRatingControl = dispatch => {
  dispatch(Actions.unregisterField(ratingControlTester, ConnectedRatingControl));
};

export const enhanceExample: (examples: ExampleDescription[]) => ReactExampleDescription[] =
  examples => examples.map(e => {
    switch (e.name) {
      case 'day6':
        const day6 = Object.assign({}, e, {
          customReactExtension: dispatch => (
            <div>
              <button
                onClick={() => registerRatingControl(dispatch)}
              >
                Register Custom Field
              </button>
              <button
                onClick={() => unregisterRatingControl(dispatch)}
              >
                Unregister Custom Field
              </button>
            </div>
          )
        });
        return day6;
      case 'nestedArray':
        const nestedArray = Object.assign({}, e, {
          customReactExtension: dispatch => (
            <div>
              <button
                onClick={() => NestedArrayExample.registerNestedArrayUISchema(dispatch)}
              >
                Register NestedArray UISchema
              </button>
              <button
                onClick={() => NestedArrayExample.unregisterNestedArrayUISchema(dispatch)}
              >
                Unregister NestedArray UISchema
              </button>
            </div>
          )
        });
        return nestedArray;
      case 'dynamic':
        const dynamic = Object.assign({}, e, {
          customReactExtension: dispatch => (
            <div>
              <button
                onClick={() => dispatch(Actions.init({ id: 'aaa' }, e.schema, e.uischema))}
              >
                Change data
              </button>
            </div>
          )
        });
        return dynamic;
      default: return e;
    }
  });
