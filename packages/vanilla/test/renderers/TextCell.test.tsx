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
import * as React from 'react';
import {
  ControlElement,
  getData,
  HorizontalLayout,
  JsonSchema,
  update
} from '@jsonforms/core';
import { JsonFormsReduxContext } from '@jsonforms/react/lib/redux';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import TextCell, { textCellTester } from '../../src/cells/TextCell';
import HorizontalLayoutRenderer from '../../src/layouts/HorizontalLayout';
import { initJsonFormsVanillaStore } from '../vanillaStore';

Enzyme.configure({ adapter: new Adapter() });

const defaultMaxLength = 524288;
const defaultSize = 20;

const controlElement: ControlElement = {
  type: 'Control',
  scope: '#/properties/name'
};

const fixture = {
  data: { name: 'Foo' },
  minLengthSchema: {
    type: 'string',
    minLength: 3
  },
  maxLengthSchema: {
    type: 'string',
    maxLength: 5
  },
  schema: { type: 'string' },
  uischema: controlElement,
  styles: [
    {
      name: 'control',
      classNames: ['control']
    },
    {
      name: 'control.validation',
      classNames: ['validation']
    }
  ]
};

test('Text cell tester', () => {
  expect(textCellTester(undefined, undefined)).toBe(-1);
  expect(textCellTester(null, undefined)).toBe(-1);
  expect(textCellTester({ type: 'Foo' }, undefined)).toBe(-1);
  expect(textCellTester({ type: 'Control' }, undefined)).toBe(-1);
});

describe('Text cell', () => {

  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  test.skip('autofocus on first element', () => {
    const schema: JsonSchema = {
      type: 'object',
      properties: {
        firstName: { type: 'string' },
        lastName: { type: 'string' }
      }
    };
    const firstControlElement: ControlElement = {
      type: 'Control',
      scope: '#/properties/firstName',
      options: { focus: true }
    };
    const secondControlElement: ControlElement = {
      type: 'Control',
      scope: '#/properties/lastName',
      options: { focus: true }
    };
    const uischema: HorizontalLayout = {
      type: 'HorizontalLayout',
      elements: [firstControlElement, secondControlElement]
    };
    const store = initJsonFormsVanillaStore({
      data: { firstName: 'Foo', lastName: 'Boo' },
      schema,
      uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <HorizontalLayoutRenderer schema={schema} uischema={uischema} />
      </Provider>
    );
    const inputs = wrapper.find('input');
    expect(document.activeElement).not.toBe(inputs.at(0).getDOMNode());
    expect(document.activeElement).toBe(inputs.at(1).getDOMNode());
  });

  test('autofocus active', () => {
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
      options: { focus: true }
    };
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.minLengthSchema,
      uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextCell
            schema={fixture.minLengthSchema}
            uischema={uischema}
            path='name'
          />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').getDOMNode();
    expect(document.activeElement).toBe(input);
  });

  test('autofocus inactive', () => {
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
      options: { focus: false }
    };
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.minLengthSchema,
      uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextCell schema={fixture.minLengthSchema} uischema={uischema} path='name' />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').getDOMNode();
    expect(document.activeElement).not.toBe(input);
  });

  test('autofocus inactive by default', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.minLengthSchema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextCell schema={fixture.minLengthSchema} uischema={fixture.uischema} path='name' />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').getDOMNode();
    expect(document.activeElement).not.toBe(input);
  });

  test('render', () => {
    const schema: JsonSchema = {
      type: 'object',
      properties: {
        name: { type: 'string' }
      }
    };
    const store = initJsonFormsVanillaStore({
      data: { name: 'Foo' },
      schema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextCell schema={schema} uischema={fixture.uischema} path='name' />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.value).toBe('Foo');
  });

  test('has classes set', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextCell schema={fixture.schema} uischema={fixture.uischema} path='name' />
        </JsonFormsReduxContext>
      </Provider>
    );

    const input = wrapper.find('input');
    expect(input.hasClass('input')).toBe(true);
    expect(input.hasClass('validate')).toBe(true);
    expect(input.hasClass('valid')).toBe(true);
  });

  test('update via input event', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.minLengthSchema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextCell schema={fixture.minLengthSchema} uischema={fixture.uischema} path='name' />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 'Bar' } });
    expect(getData(store.getState()).name).toBe('Bar');
  });

  test('update via action', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.minLengthSchema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextCell schema={fixture.minLengthSchema} uischema={fixture.uischema} path='name' />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    store.dispatch(update('name', () => 'Bar'));
    expect(input.value).toBe('Bar');
  });

  test('update with undefined value', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.minLengthSchema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextCell schema={fixture.minLengthSchema} uischema={fixture.uischema} path='name' />
        </JsonFormsReduxContext>
      </Provider>
    );
    store.dispatch(update('name', () => undefined));
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.value).toBe('');
  });

  test('update with null value', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.minLengthSchema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextCell schema={fixture.minLengthSchema} uischema={fixture.uischema} path='name' />
        </JsonFormsReduxContext>
      </Provider>
    );
    store.dispatch(update('name', () => null));
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.value).toBe('');
  });

  test('update with wrong ref', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.minLengthSchema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextCell schema={fixture.minLengthSchema} uischema={fixture.uischema} path='name' />
        </JsonFormsReduxContext>
      </Provider>
    );
    store.dispatch(update('firstname', () => 'Bar'));
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.value).toBe('Foo');
  });

  test('update with null ref', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.minLengthSchema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextCell schema={fixture.minLengthSchema} uischema={fixture.uischema} path='name' />
        </JsonFormsReduxContext>
      </Provider>
    );
    store.dispatch(update(null, () => 'Bar'));
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.value).toBe('Foo');
  });

  test('update with undefined ref', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.minLengthSchema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextCell schema={fixture.minLengthSchema} uischema={fixture.uischema} path='name' />
        </JsonFormsReduxContext>
      </Provider>
    );
    store.dispatch(update(undefined, () => 'Bar'));
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.value).toBe('Foo');
  });

  test('disable', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.minLengthSchema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextCell schema={fixture.minLengthSchema} uischema={fixture.uischema} path='name' enabled={false} />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  test('enabled by default', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.minLengthSchema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextCell schema={fixture.minLengthSchema} uischema={fixture.uischema} path='name' />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.disabled).toBe(false);
  });

  test('use maxLength for attributes size and maxlength', () => {
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/name'
    };
    const config = {
      restrict: true,
      trim: true
    };
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.maxLengthSchema,
      uischema,
      config
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextCell schema={fixture.maxLengthSchema} uischema={uischema} path='name' />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.maxLength).toBe(5);
    expect(input.size).toBe(5);
  });

  test('use maxLength for attribute size only', () => {
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/name'
    };
    const config = {
      restrict: false,
      trim: true
    };
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.maxLengthSchema,
      uischema,
      config
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextCell schema={fixture.maxLengthSchema} uischema={uischema} path='name' />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.maxLength).toBe(defaultMaxLength);
    expect(input.size).toBe(5);
  });

  test('use maxLength for attribute max length only', () => {
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/name'
    };
    const config = {
      restrict: true,
      trim: false
    };
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.maxLengthSchema,
      uischema,
      config
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextCell schema={fixture.maxLengthSchema} uischema={uischema} path='name' />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.maxLength).toBe(5);
    expect(input.size).toBe(defaultSize);
  });

  test('do not use maxLength by default', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.maxLengthSchema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextCell schema={fixture.maxLengthSchema} uischema={fixture.uischema} path='name' />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.maxLength).toBe(defaultMaxLength);
    expect(input.size).toBe(defaultSize);
  });

  test('maxLength not specified, attributes should have default values (trim && restrict)', () => {
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/name'
    };
    const config = {
      restrict: true,
      trim: true
    };
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema,
      config
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextCell schema={fixture.schema} uischema={uischema} path='name' />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.maxLength).toBe(defaultMaxLength);
    expect(input.size).toBe(defaultSize);
  });

  test('maxLength not specified, attributes should have default values (trim)', () => {
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/name'
    };
    const config = {
      restrict: false,
      trim: true
    };
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema,
      config
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextCell schema={fixture.schema} uischema={uischema} path='name' />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.maxLength).toBe(defaultMaxLength);
    expect(input.size).toBe(defaultSize);
  });

  test('maxLength not specified, attributes should have default values (restrict)', () => {
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/name'
    };
    const config = {
      restrict: true,
      trim: false
    };
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema,
      config
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextCell schema={fixture.schema} uischema={uischema} path='name' />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.maxLength).toBe(defaultMaxLength);
    expect(input.size).toBe(defaultSize);
  });

  test('maxLength not specified, attributes should have default values', () => {
    const store = initJsonFormsVanillaStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <TextCell schema={fixture.schema} uischema={fixture.uischema} path='name' />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.maxLength).toBe(defaultMaxLength);
    expect(input.size).toBe(defaultSize);
  });
});
