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
  Actions,
  ControlElement,
  HorizontalLayout,
  JsonSchema,
} from '@jsonforms/core';
import { JsonForms } from '@jsonforms/react';
import { Provider } from 'react-redux';
import '../../src';
import HorizontalLayoutRenderer, {
  horizontalLayoutTester
} from '../../src/layouts/HorizontalLayout';
import InputControl, { inputControlTester } from '../../src/controls/InputControl';
import BooleanCell, { booleanCellTester } from '../../src/cells/BooleanCell';
import TextCell, { textCellTester } from '../../src/cells/TextCell';
import DateCell, { dateCellTester } from '../../src/cells/DateCell';
import * as TestUtils from 'react-dom/test-utils';
import { initJsonFormsVanillaStore } from '../vanillaStore';

test.beforeEach(t => {
  t.context.data = { 'foo': true };
  t.context.schema = {
    type: 'object',
    properties: {
      foo: {
        type: 'boolean'
      }
    }
  };
  t.context.uischema = {
    type: 'Control',
    scope: '#/properties/foo'
  };
});

test('autofocus on first element', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      firstBooleanCell: { type: 'boolean' },
      secondBooleanCell: { type: 'boolean' }
    }
  };
  const firstControlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/firstBooleanCell',
    options: {
      focus: true
    }
  };
  const secondControlElement: ControlElement = {
    type: 'Control',
    scope: 'properties/secondBooleanCell',
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
    'firstBooleanCell': true,
    'secondBooleanCell': false
  };
  const store = initJsonFormsVanillaStore({
    data,
    schema,
    uischema,
    renderers: [
      { tester: inputControlTester, renderer: InputControl },
      { tester: horizontalLayoutTester, renderer: HorizontalLayoutRenderer }
    ],
    cells: [
      { tester: booleanCellTester, cell: BooleanCell }
    ]
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <JsonForms />
    </Provider>
  ) as unknown as React.Component<any>;
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(tree, 'input');
  t.not(document.activeElement, inputs[0]);
  t.is(document.activeElement, inputs[1]);
});

test('tester', t => {
  t.is(inputControlTester(undefined, undefined), -1);
  t.is(inputControlTester(null, undefined), -1);
  t.is(inputControlTester({type: 'Foo'}, undefined), -1);
  t.is(inputControlTester({type: 'Control'}, undefined), -1);
  const control: ControlElement = { type: 'Control', scope: '#/properties/foo' };
  t.is(inputControlTester(control, undefined), 1);
});

test('render', t => {
  const store = initJsonFormsVanillaStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
    renderers: [{ tester: inputControlTester, renderer: InputControl }],
    cells: [{ tester: booleanCellTester, cell: BooleanCell }]
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <InputControl uischema={t.context.uischema} schema={t.context.schema} />
    </Provider>
  ) as unknown as React.Component<any>;

  const control = TestUtils.findRenderedDOMComponentWithClass(tree, 'control');
  t.not(control, undefined);
  t.is(control.childNodes.length, 3);
  t.not(TestUtils.findRenderedDOMComponentWithClass(tree, 'root_properties_foo'), undefined);

  const label = TestUtils.findRenderedDOMComponentWithTag(tree, 'label') as HTMLLabelElement;
  t.is(label.textContent, 'Foo');

  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.not(input, undefined);
  t.not(input, null);

  const validation = TestUtils.findRenderedDOMComponentWithClass(tree, 'validation');
  t.is(validation.tagName, 'DIV');
  t.is((validation as HTMLDivElement).children.length, 0);
});

test('render without label', t => {
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo',
    label: false
  };
  const store = initJsonFormsVanillaStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema,
    renderers: [{ tester: inputControlTester, renderer: InputControl }],
    cells: [{ tester: booleanCellTester, cell: BooleanCell }]
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <JsonForms />
    </Provider>
  ) as unknown as React.Component<any>;

  const control = TestUtils.findRenderedDOMComponentWithClass(tree, 'control');
  t.not(control, undefined);
  t.is(control.childNodes.length, 3);
  t.not(TestUtils.findRenderedDOMComponentWithClass(tree, 'root_properties_foo'), undefined);
  /*t.not(TestUtils.findRenderedDOMComponentWithClass(tree, 'valid'), undefined);*/

  const label = TestUtils.findRenderedDOMComponentWithTag(tree, 'label') as HTMLLabelElement;
  t.is(label.textContent, '');

  const input = TestUtils.findRenderedDOMComponentWithTag(tree, 'input') as HTMLInputElement;
  t.not(input, undefined);
  t.not(input, null);

  const validation = TestUtils.findRenderedDOMComponentWithClass(tree, 'validation');
  t.is(validation.tagName, 'DIV');
  t.is((validation as HTMLDivElement).children.length, 0);
});

test('hide', t => {
  const store = initJsonFormsVanillaStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
    renderers: [{ tester: inputControlTester, renderer: InputControl }],
    cells: [{ tester: booleanCellTester, cell: BooleanCell }]
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <InputControl
        schema={t.context.schema}
        uischema={t.context.uischema}
        path={''}
        visible={false}
      />
    </Provider>
  ) as unknown as React.Component<any>;
  const control = TestUtils.findRenderedDOMComponentWithClass(tree, 'control') as HTMLElement;
  t.true(control.hidden);
});

test('show by default', t => {
  const store = initJsonFormsVanillaStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
    renderers: [{ tester: inputControlTester, renderer: InputControl }],
    cells: [{ tester: booleanCellTester, cell: BooleanCell }]
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <InputControl schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  ) as unknown as React.Component<any>;
  const control = TestUtils.findRenderedDOMComponentWithClass(tree, 'control') as HTMLElement;
  t.false(control.hidden);
});

test('single error', t => {
  const store = initJsonFormsVanillaStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
    renderers: [{ tester: inputControlTester, renderer: InputControl }],
    cells: [{ tester: booleanCellTester, cell: BooleanCell }]
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <InputControl schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  ) as unknown as React.Component<any>;
  const validation = TestUtils.findRenderedDOMComponentWithClass(tree, 'validation');
  store.dispatch(Actions.update('foo', () => 2));
  t.is(validation.textContent, 'should be boolean');
});

test('multiple errors', t => {
  const store = initJsonFormsVanillaStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
    renderers: [{ tester: inputControlTester, renderer: InputControl }],
    cells: [{ tester: booleanCellTester, cell: BooleanCell }]
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <InputControl schema={t.context.schema} uischema={t.context.uischema}/>
    </Provider>
  ) as unknown as React.Component<any>;
  const validation = TestUtils.findRenderedDOMComponentWithClass(tree, 'validation');
  store.dispatch(Actions.update('foo', () => 3));
  t.is(validation.textContent, 'should be boolean');
});

test('empty errors by default', t => {
  const store = initJsonFormsVanillaStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
    renderers: [{ tester: inputControlTester, renderer: InputControl }],
    cells: [{ tester: booleanCellTester, cell: BooleanCell }]
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <JsonForms />
    </Provider>
  ) as unknown as React.Component<any>;
  const validation = TestUtils.findRenderedDOMComponentWithClass(tree, 'validation');
  t.is(validation.textContent, '');
});

test('reset validation message', t => {
  const store = initJsonFormsVanillaStore({
    data: t.context.data,
    schema: t.context.schema,
    uischema: t.context.uischema,
    renderers: [{ tester: inputControlTester, renderer: InputControl }],
    cells: [{ tester: booleanCellTester, cell: BooleanCell }]
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <JsonForms />
    </Provider>
  ) as unknown as React.Component<any>;
  const validation = TestUtils.findRenderedDOMComponentWithClass(tree, 'validation');
  store.dispatch(Actions.update('foo', () => 3));
  store.dispatch(Actions.update('foo', () => true));
  t.is(validation.textContent, '');
});

test('validation of nested schema', t => {
  const schema = {
    type: 'object',
    properties: {
      name: {
        type: 'string'
      },
      personalData: {
        type: 'object',
        properties: {
          middleName: {
            type: 'string'
          },
          lastName: {
            type: 'string'
          }
        },
        required: ['middleName', 'lastName']
      }
    },
    required: ['name']
  };
  const firstControlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/name'
  };
  const secondControlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/personalData/properties/middleName'
  };
  const thirdControlElement: ControlElement = {
    type: 'Control',
    scope: '#/properties/personalData/properties/lastName'
  };
  const uischema: HorizontalLayout = {
    type: 'HorizontalLayout',
    elements: [
      firstControlElement,
      secondControlElement,
      thirdControlElement
    ]
  };
  const data = {
    name: 'John Doe',
    personalData: {}
  };
  const store = initJsonFormsVanillaStore({
    data,
    schema,
    uischema,
    renderers: [{ tester: inputControlTester, renderer: InputControl }],
    cells: [{ tester: textCellTester, cell: TextCell }]
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <HorizontalLayoutRenderer schema={schema} uischema={uischema}/>
    </Provider>
  ) as unknown as React.Component<any>;
  const validation = TestUtils.scryRenderedDOMComponentsWithClass(tree, 'validation');
  t.is(validation[0].textContent, '');
  t.is(validation[1].textContent, 'is a required property');
  t.is(validation[2].textContent, 'is a required property');
});
test('required cell is marked', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      dateCell: {
        type: 'string',
        format: 'date'
      }
    },
    required: ['dateCell']
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/dateCell'
  };
  const store = initJsonFormsVanillaStore({
    data: {},
    schema,
    uischema,
    renderers: [{ tester: inputControlTester, renderer: InputControl }],
    cells: [{ tester: dateCellTester, cell: DateCell }]
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <InputControl schema={schema} uischema={uischema}/>
    </Provider>
  ) as unknown as React.Component<any>;
  const label = TestUtils.findRenderedDOMComponentWithTag(tree, 'label');
  t.is(label.textContent, 'Date Cell*');
});

test('not required', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      dateCell: {
        type: 'string',
        format: 'date'
      }
    }
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/dateCell'
  };
  const store = initJsonFormsVanillaStore({
    data: {},
    schema,
    uischema,
    renderers: [{ tester: inputControlTester, renderer: InputControl }],
    cells: [{ tester: dateCellTester, cell: DateCell }]
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <InputControl schema={schema} uischema={uischema}/>
    </Provider>
  ) as unknown as React.Component<any>;
  const label = TestUtils.findRenderedDOMComponentWithTag(tree, 'label');
  t.is(label.textContent, 'Date Cell');
});
test('required cell is marked', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      dateCell: {
        type: 'string',
        format: 'date'
      }
    },
    required: ['dateCell']
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/dateCell'
  };

  const store = initJsonFormsVanillaStore({
    data: {},
    schema,
    uischema,
    renderers: [{ tester: inputControlTester, renderer: InputControl }],
    cells: [{ tester: dateCellTester, cell: DateCell }]
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <InputControl schema={schema} uischema={uischema}/>
    </Provider>
  ) as unknown as React.Component<any>;
  const label = TestUtils.findRenderedDOMComponentWithTag(tree, 'label');
  t.is(label.textContent, 'Date Cell*');
});

test('not required', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      dateCell: {
        type: 'string',
        format: 'date'
      }
    }
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/dateCell'
  };

  const store = initJsonFormsVanillaStore({
    data: {},
    schema,
    uischema,
    renderers: [{ tester: inputControlTester, renderer: InputControl }],
    cells: [{ tester: dateCellTester, cell: DateCell }]
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <InputControl schema={schema} uischema={uischema}/>
    </Provider>
  ) as unknown as React.Component<any>;
  const label = TestUtils.findRenderedDOMComponentWithTag(tree, 'label');
  t.is(label.textContent, 'Date Cell');
});

test('show description on focus', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Enter your first name'
      }
    }
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/name'
  };
  const data = { isFocused: false };
  const store = initJsonFormsVanillaStore({
    data,
    schema,
    uischema,
    renderers: [{tester: inputControlTester, renderer: InputControl}],
    cells: [{ tester: textCellTester, cell: TextCell }]
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <InputControl schema={schema} uischema={uischema}/>
    </Provider>
  ) as unknown as React.Component<any>;
  const control = TestUtils.findRenderedDOMComponentWithClass(tree, 'control') as HTMLDivElement;
  TestUtils.Simulate.focus(control);
  const description =
    TestUtils.findRenderedDOMComponentWithClass(tree, 'input-description') as HTMLDivElement;
  t.is(description.textContent, 'Enter your first name');
});

test('hide description when input cell is not focused', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Enter your first name'
      }
    }
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/name'
  };
  const data = { isFocused: false };
  const store = initJsonFormsVanillaStore({
    data,
    schema,
    uischema,
    renderers: [{tester: inputControlTester, renderer: InputControl}],
    cells: [{ tester: textCellTester, cell: TextCell }]
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <InputControl schema={schema} uischema={uischema}/>
    </Provider>
  ) as unknown as React.Component<any>;
  const description = TestUtils.findRenderedDOMComponentWithClass(
    tree,
    'input-description'
  ) as HTMLDivElement;
  t.is(description.textContent, '');
});

test('hide description on blur', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Enter your first name'
      }
    }
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/name'
  };
  const data = { isFocused: false };
  const store = initJsonFormsVanillaStore({
    data,
    schema,
    uischema,
    renderers: [{tester: inputControlTester, renderer: InputControl}],
    cells: [{ tester: textCellTester, cell: TextCell }]
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <JsonForms />
    </Provider>
  ) as unknown as React.Component<any>;
  const control = TestUtils.findRenderedDOMComponentWithClass(tree, 'control') as HTMLDivElement;
  TestUtils.Simulate.focus(control);
  const description =
    TestUtils.findRenderedDOMComponentWithClass(tree, 'input-description') as HTMLDivElement;
  t.is(description.textContent, 'Enter your first name');
  TestUtils.Simulate.blur(control);
  const hiddenDescription =
    TestUtils.findRenderedDOMComponentWithClass(tree, 'input-description') as HTMLDivElement;
  t.is(hiddenDescription.textContent, '');
});

test('description undefined', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string'
      }
    }
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/name'
  };
  const data = { isFocused: false };
  const store = initJsonFormsVanillaStore({
    data,
    schema,
    uischema,
    renderers: [{tester: inputControlTester, renderer: InputControl}],
    cells: [{ tester: textCellTester, cell: TextCell }]
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <JsonForms />
    </Provider>
  ) as unknown as React.Component<any>;
  const description =
    TestUtils.findRenderedDOMComponentWithClass(tree, 'input-description') as HTMLDivElement;
  t.is(description.textContent, '');
});

test('undefined input control', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      expectedValue: {
        type: [
          'string',
          'integer',
          'number',
          'boolean'
        ]
      }
    }
  };
  const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/expectedValue'
  };
  const store = initJsonFormsVanillaStore({
    data: {},
    schema,
    uischema,
    renderers: [{ tester: inputControlTester, renderer: InputControl }],
    cells: [{ tester: textCellTester, cell: TextCell }]
  });
  const tree: React.Component<any> = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <InputControl schema={schema} uischema={uischema}/>
    </Provider>
  ) as unknown as React.Component<any>;
  const control = TestUtils.scryRenderedDOMComponentsWithClass(tree, 'control');
  t.is(control.length, 0);
});
