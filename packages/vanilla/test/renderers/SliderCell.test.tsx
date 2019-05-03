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
import '@jsonforms/test';
import * as React from 'react';
import test from 'ava';
import {
  ControlElement,
  getData,
  HorizontalLayout,
  JsonSchema,
  update
} from '@jsonforms/core';
import { JsonFormsReduxContext } from '@jsonforms/react';
import SliderCell, { sliderCellTester } from '../../src/cells/SliderCell';
import HorizontalLayoutRenderer from '../../src/layouts/HorizontalLayout';
import { Provider } from 'react-redux';
import * as TestUtils from 'react-dom/test-utils';
import { initJsonFormsVanillaStore } from '../vanillaStore';

test.beforeEach(t => {
  t.context.data = { 'foo': 5 };
  t.context.schema = {
    type: 'number',
    maximum: 10,
    minimum: 2,
    default: 6
  };
  t.context.uischema = {
    type: 'Control',
    scope: '#/properties/foo'
  };
  t.context.styles = [
    {
      name: 'control',
      classNames: ['control']
    },
    {
      name: 'control.validation',
      classNames: ['validation']
    }
  ];
});

test.failing('autofocus on first element', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      firstSliderCell: { type: 'number', minimum: 5, maximum: 10 },
      secondSliderCell: { type: 'number', minimum: 5, maximum: 10 }
    }
  };
  const firstControlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/firstSliderCell',
    options: {
      focus: true
    }
  };
  const secondControlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/secondSliderCell',
    options: {
      focus: true
    }
  };
  const uischema: HorizontalLayout = {
    type: 'HorizontalLayout',
    elements: [
      firstControlElement,
      secondControlElement
    ]
  };
  const data = {
    firstSliderCell: 3.14,
    secondSliderCell: 5.12
  };
  const store = initJsonFormsVanillaStore({
    data,
    schema,
    uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <JsonFormsReduxContext>
        <HorizontalLayoutRenderer schema={schema} uischema={uischema} />
      </JsonFormsReduxContext>
    </Provider>
  ) as unknown as React.Component<any>;

  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'input');
  t.not(document.activeElement, inputs[0]);
  t.is(document.activeElement, inputs[1]);
});

test('autofocus active', t => {
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo',
    options: { focus: true }
  };
  const store = initJsonFormsVanillaStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <JsonFormsReduxContext>
        <SliderCell
          schema={t.context.schema}
          uischema={uischema}
          path='foo'
        />
      </JsonFormsReduxContext>
    </Provider>
  ) as unknown as React.Component<any>;
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.is(document.activeElement, input);
});

test('autofocus inactive', t => {
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo',
    options: { focus: false }
  };
  const store = initJsonFormsVanillaStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <JsonFormsReduxContext>
        <SliderCell
          schema={t.context.schema}
          uischema={uischema}
          path='foo'
        />
      </JsonFormsReduxContext>
    </Provider>
  ) as unknown as React.Component<any>;
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.false(input.autofocus);
});

test('autofocus inactive by default', t => {
  const uischema: ControlElement = t.context.uischema;
  const store = initJsonFormsVanillaStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <JsonFormsReduxContext>
        <SliderCell
          schema={t.context.schema}
          uischema={uischema}
          path='foo'
        />
      </JsonFormsReduxContext>
    </Provider>
  ) as unknown as React.Component<any>;
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.false(input.autofocus);
});

test('tester', t => {
  t.is(sliderCellTester(undefined, undefined), -1);
  t.is(sliderCellTester(null, undefined), -1);
  t.is(sliderCellTester({ type: 'Foo' }, undefined), -1);
  t.is(sliderCellTester({ type: 'Control' }, undefined), -1);
});

test('tester with wrong schema type', t => {
  const control: ControlElement = t.context.uischema;
  t.is(
    sliderCellTester(
      control,
      {
        type: 'object',
        properties: {
          foo: { type: 'string' }
        }
      }
    ),
    -1
  );
});

test('tester with wrong schema type, but sibling has correct one', t => {
  const control: ControlElement = t.context.uischema;
  t.is(
    sliderCellTester(
      control,
      {
        type: 'object',
        properties: {
          foo: { type: 'string' },
          bar: { type: 'number' }
        }
      }
    ),
    -1
  );
});

test('tester with correct schema type, but missing maximum and minimum cells', t => {
  const control: ControlElement = t.context.uischema;
  t.is(
    sliderCellTester(
      control,
      {
        type: 'object',
        properties: {
          foo: { type: 'number' }
        }
      }
    ),
    -1
  );
});

test('tester with correct schema type, but missing maximum', t => {
  const control: ControlElement = t.context.uischema;
  t.is(
    sliderCellTester(
      control,
      {
        type: 'object',
        properties: {
          foo: {
            type: 'number',
            minimum: 2
          }
        }
      }
    ),
    -1
  );
});

test('tester with correct schema type, but missing minimum', t => {
  const control: ControlElement = t.context.uischema;
  t.is(
    sliderCellTester(
      control,
      {
        type: 'object',
        properties: {
          foo: {
            type: 'number',
            maximum: 10
          }
        }
      }
    ),
    -1
  );
});

test('tester with matching schema type (number) without default', t => {
  const control: ControlElement = t.context.uischema;
  t.is(
    sliderCellTester(
      control,
      {
        type: 'object',
        properties: {
          foo: {
            type: 'number',
            maximum: 10,
            minimum: 2
          }
        }
      }
    ),
    -1
  );
});

test('tester with matching schema type (integer) without default', t => {
  const control: ControlElement = t.context.uischema;
  t.is(
    sliderCellTester(
      control,
      {
        type: 'object',
        properties: {
          foo: {
            type: 'integer',
            maximum: 10,
            minimum: 2
          }
        }
      }
    ),
    -1
  );
});

test('tester with matching schema type (number) with default', t => {
  const control: ControlElement = t.context.uischema;
  control.options = { slider: true };
  t.is(
    sliderCellTester(
      control,
      {
        type: 'object',
        properties: {
          foo: {
            type: 'number',
            maximum: 10,
            minimum: 2,
            default: 3
          }
        }
      }
    ),
    4
  );
});

test('tester with matching schema type (integer) with default', t => {
  const control: ControlElement = t.context.uischema;
  control.options = { slider: true };
  t.is(
    sliderCellTester(
      control,
      {
        type: 'object',
        properties: {
          foo: {
            type: 'integer',
            maximum: 10,
            minimum: 2,
            default: 4
          }
        }
      }
    ),
    4
  );
});

test('render', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      foo: {
        type: 'number',
        maximum: 10,
        minimum: 2,
        default: 6
      }
    }
  };
  const store = initJsonFormsVanillaStore({
    data: { 'foo': 5 },
    schema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <JsonFormsReduxContext>
        <SliderCell
          schema={schema}
          uischema={t.context.uischema}
          path='foo'
        />
      </JsonFormsReduxContext>
    </Provider>
  ) as unknown as React.Component<any>;
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.type, 'range');
  t.is(input.value, '5');
});

test('update via input event', t => {
  const store = initJsonFormsVanillaStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <JsonFormsReduxContext>
        <SliderCell
          schema={t.context.schema}
          uischema={t.context.uischema}
          path='foo'
        />
      </JsonFormsReduxContext>
    </Provider>
  ) as unknown as React.Component<any>;
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  input.value = '3';
  TestUtils.Simulate.change(input);
  t.is(getData(store.getState()).foo, 3);
});

test('update via action', t => {
  const store = initJsonFormsVanillaStore({
    data: { 'foo': 3 },
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <JsonFormsReduxContext>
        <SliderCell
          schema={t.context.schema}
          uischema={t.context.uischema}
          path='foo'
        />
      </JsonFormsReduxContext>
    </Provider>
  ) as unknown as React.Component<any>;
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.value, '3');
  store.dispatch(update('foo', () => 4));
  setTimeout(() => t.is(input.value, 'Bar'), 4);
});
// FIXME this moves the slider and changes the value
test.failing('update with undefined value', t => {
  const store = initJsonFormsVanillaStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <JsonFormsReduxContext>
        <SliderCell
          schema={t.context.schema}
          uischema={t.context.uischema}
          path='foo'
        />
      </JsonFormsReduxContext>
    </Provider>
  ) as unknown as React.Component<any>;
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('foo', () => undefined));
  t.is(input.value, '');
});
// FIXME this moves the slider and changes the value
test.failing('update with null value', t => {
  const store = initJsonFormsVanillaStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <JsonFormsReduxContext>
        <SliderCell
          schema={t.context.schema}
          uischema={t.context.uischema}
          path='foo'
        />
      </JsonFormsReduxContext>
    </Provider>
  ) as unknown as React.Component<any>;
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('foo', () => null));
  t.is(input.value, '');
});

test('update with wrong ref', t => {
  const store = initJsonFormsVanillaStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <JsonFormsReduxContext>
        <SliderCell
          schema={t.context.schema}
          uischema={t.context.uischema}
          path='foo'
        />
      </JsonFormsReduxContext>
    </Provider>
  ) as unknown as React.Component<any>;
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update('bar', () => 11));
  t.is(input.value, '5');
});

test('update with null ref', t => {
  const store = initJsonFormsVanillaStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <JsonFormsReduxContext>
        <SliderCell
          schema={t.context.schema}
          uischema={t.context.uischema}
          path='foo'
        />
      </JsonFormsReduxContext>
    </Provider>
  ) as unknown as React.Component<any>;
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  store.dispatch(update(null, () => 3));
  t.is(input.value, '5');
});

test('update with undefined ref', t => {
  const store = initJsonFormsVanillaStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <JsonFormsReduxContext>
        <SliderCell
          schema={t.context.schema}
          uischema={t.context.uischema}
          path='foo'
        />
      </JsonFormsReduxContext>
    </Provider>
  ) as unknown as React.Component<any>;
  store.dispatch(update(undefined, () => 13));
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.is(input.value, '5');
});

test('disable', t => {
  const store = initJsonFormsVanillaStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <JsonFormsReduxContext>
        <SliderCell
          schema={t.context.schema}
          uischema={t.context.uischema}
          path='foo'
          enabled={false}
        />
      </JsonFormsReduxContext>
    </Provider>
  ) as unknown as React.Component<any>;
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.true(input.disabled);
});

test('enabled by default', t => {
  const store = initJsonFormsVanillaStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <JsonFormsReduxContext>
        <SliderCell
          schema={t.context.schema}
          uischema={t.context.uischema}
          path='foo'
        />
      </JsonFormsReduxContext>
    </Provider>
  ) as unknown as React.Component<any>;
  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.false(input.disabled);
});
