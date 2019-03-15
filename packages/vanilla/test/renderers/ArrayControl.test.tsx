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
import '@jsonforms/test';
import * as React from 'react';
import test from 'ava';
import { Provider } from 'react-redux';
import ArrayControl from '../../src/complex/array/ArrayControlRenderer';
import { vanillaRenderers } from '../../src/index';
import * as TestUtils from 'react-dom/test-utils';
import { initJsonFormsVanillaStore } from '../vanillaStore';
import IntegerField, { integerFieldTester } from '../../src/fields/IntegerField';

test.beforeEach(t => {

  t.context.schema = {
    type: 'object',
    properties: {
      test: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            x: { type: 'integer' },
            y: { type: 'integer' }
          }
        }
      }
    }
  };
  t.context.uischema = {
    type: 'Control',
    scope: '#/properties/test'
  };
  t.context.data = {
    test: [{ x: 1, y: 3 }]
  };
  t.context.styles = [
    {
      name: 'array.table',
      classNames: ['array-table-layout', 'control']
    }
  ];
});

test('render two children', t => {
  const store = initJsonFormsVanillaStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
    renderers: vanillaRenderers,
    fields: [
      {
        tester: integerFieldTester, field: IntegerField
      }
    ]
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <ArrayControl
        schema={t.context.schema}
        uischema={t.context.uischema}
      />
    </Provider>
  ) as React.Component<any>;

  const controls = TestUtils.scryRenderedDOMComponentsWithClass(
    tree,
    'control'
  ) as HTMLDivElement[];

  t.is(controls.length, 3);
});
