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
import { Provider } from 'react-redux';
import * as TestUtils from 'react-dom/test-utils';
import {
  Actions,
  ControlElement,
  HorizontalLayout,
  jsonformsReducer,
  JsonFormsState,
  JsonSchema,
  NOT_APPLICABLE
} from '@jsonforms/core';
import '../../src/fields';
import MaterialLabelRenderer, {
  materialLabelRendererTester
} from '../../src/additional/MaterialLabelRenderer';
import MaterialHorizontalLayoutRenderer from '../../src/layouts/MaterialHorizontalLayout';
import { materialFields, materialRenderers } from '../../src';
import { combineReducers, createStore, Store } from 'redux';

const data = {};
const schema = {
  type: 'object',
  properties: {}
};
const uischema = {
  type: 'Label',
  text: 'Foo'
};

const initJsonFormsStore = (testData, testSchema, testUiSchema): Store<JsonFormsState> => {
  const store: Store<JsonFormsState> = createStore(
    combineReducers({ jsonforms: jsonformsReducer() }),
    {
      jsonforms: {
        renderers: materialRenderers,
        fields: materialFields,
      }
    }
  );

  store.dispatch(Actions.init(testData, testSchema, testUiSchema));
  return store;
};

describe('Material Label Renderer tester', () => {
  it('should fail', () => {
    expect(materialLabelRendererTester(undefined, undefined)).toBe(NOT_APPLICABLE);
    expect(materialLabelRendererTester(null, undefined)).toBe(NOT_APPLICABLE);
    expect(materialLabelRendererTester({type: 'Foo'}, undefined)).toBe(NOT_APPLICABLE);
    expect(materialLabelRendererTester({type: 'Label'}, undefined)).toBe(1);
  });
});

describe('Material Label Renderer', () => {

  it('render', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <MaterialLabelRenderer schema={schema} uischema={uischema}/>
      </Provider>
    );

    const label = TestUtils.findRenderedDOMComponentWithTag(tree, 'h2') as HTMLHeadingElement;
    expect(label.textContent).toBe('Foo');

  });

  it('can be hidden', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <MaterialLabelRenderer
          schema={schema}
          uischema={uischema}
          visible={false}
        />
      </Provider>
    );
    const control = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'h2')[0] as HTMLElement;
    expect(getComputedStyle(control).display).toBe('none');
  });

  it('should be shown by default', () => {
    const store = initJsonFormsStore(data, schema, uischema);
    const tree = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <MaterialLabelRenderer schema={schema} uischema={uischema}/>
      </Provider>
    );
    const control = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'h2')[0] as HTMLElement;
    expect(control.hidden).toBeFalsy();
  });

});
