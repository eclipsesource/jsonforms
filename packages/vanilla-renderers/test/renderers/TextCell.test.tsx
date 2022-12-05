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
  HorizontalLayout,
  JsonSchema,
} from '@jsonforms/core';
import { JsonFormsStateProvider } from '@jsonforms/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import TextCell, { textCellTester } from '../../src/cells/TextCell';
import HorizontalLayoutRenderer from '../../src/layouts/HorizontalLayout';
import { initCore, TestEmitter } from '../util';

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
  expect(textCellTester(undefined, undefined, undefined)).toBe(-1);
  expect(textCellTester(null, undefined, undefined)).toBe(-1);
  expect(textCellTester({ type: 'Foo' }, undefined, undefined)).toBe(-1);
  expect(textCellTester({ type: 'Control' }, undefined, undefined)).toBe(-1);
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
    const core = initCore(schema, uischema, { firstName: 'Foo', lastName: 'Boo' });
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <HorizontalLayoutRenderer schema={schema} uischema={uischema} />
      </JsonFormsStateProvider>
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
    const core = initCore(fixture.minLengthSchema, uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextCell
          schema={fixture.minLengthSchema}
          uischema={uischema}
          path='name'
        />
      </JsonFormsStateProvider>
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
    const core = initCore(fixture.minLengthSchema, uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextCell schema={fixture.minLengthSchema} uischema={uischema} path='name' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').getDOMNode();
    expect(document.activeElement).not.toBe(input);
  });

  test('autofocus inactive by default', () => {
    const core = initCore(fixture.minLengthSchema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextCell schema={fixture.minLengthSchema} uischema={fixture.uischema} path='name' />
      </JsonFormsStateProvider>
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
    const core = initCore(schema, fixture.uischema, { name: 'Foo' });
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextCell schema={schema} uischema={fixture.uischema} path='name' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.value).toBe('Foo');
  });

  test('has classes set', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextCell schema={fixture.schema} uischema={fixture.uischema} path='name' />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input');
    expect(input.hasClass('input')).toBe(true);
    expect(input.hasClass('validate')).toBe(true);
    expect(input.hasClass('valid')).toBe(true);
  });

  test('update via input event', () => {
    const onChangeData: any = {
      data: undefined
    };
    const core = initCore(fixture.minLengthSchema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TestEmitter
          onChange={({ data }) => {
            onChangeData.data = data;
          }}
        />
        <TextCell schema={fixture.minLengthSchema} uischema={fixture.uischema} path='name' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 'Bar' } });
    expect(onChangeData.data.name).toBe('Bar');
  });

  test('update via action', () => {
    const core = initCore(fixture.minLengthSchema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextCell schema={fixture.minLengthSchema} uischema={fixture.uischema} path='name' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    core.data = { ...core.data, name: 'Bar' };
    wrapper.setProps({ initState: { core }} );
    wrapper.update();
    expect(input.value).toBe('Bar');
  });

  test('update with undefined value', () => {
    const core = initCore(fixture.minLengthSchema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextCell schema={fixture.minLengthSchema} uischema={fixture.uischema} path='name' />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, name: undefined };
    wrapper.setProps({ initState: { core }} );
    wrapper.update();
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.value).toBe('');
  });

  test('update with null value', () => {
    const core = initCore(fixture.minLengthSchema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextCell schema={fixture.minLengthSchema} uischema={fixture.uischema} path='name' />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, name: null };
    wrapper.setProps({ initState: { core }} );
    wrapper.update();
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.value).toBe('');
  });

  test('update with wrong ref', () => {
    const core = initCore(fixture.minLengthSchema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextCell schema={fixture.minLengthSchema} uischema={fixture.uischema} path='name' />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, firstname: 'Bar' };
    wrapper.setProps({ initState: { core }} );
    wrapper.update();
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.value).toBe('Foo');
  });

  test('update with null ref', () => {
    const core = initCore(fixture.minLengthSchema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextCell schema={fixture.minLengthSchema} uischema={fixture.uischema} path='name' />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, null: 'Bar' };
    wrapper.setProps({ initState: { core }} );
    wrapper.update();
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.value).toBe('Foo');
  });

  test('update with undefined ref', () => {
    const core = initCore(fixture.minLengthSchema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextCell schema={fixture.minLengthSchema} uischema={fixture.uischema} path='name' />
      </JsonFormsStateProvider>
    );
    core.data = { ...core.data, undefined: 'Bar' };
    wrapper.setProps({ initState: { core }} );
    wrapper.update();
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.value).toBe('Foo');
  });

  test('disable', () => {
    const core = initCore(fixture.minLengthSchema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextCell schema={fixture.minLengthSchema} uischema={fixture.uischema} path='name' enabled={false} />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  test('enabled by default', () => {
    const core = initCore(fixture.minLengthSchema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextCell schema={fixture.minLengthSchema} uischema={fixture.uischema} path='name' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.disabled).toBe(false);
  });

  test('accept placeholder attribute', () => {
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
      options: {
        placeholder: 'Placeholder for name field'
      }
    };
    const core = initCore(fixture.schema, uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextCell schema={fixture.schema} uischema={uischema} path='name' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.placeholder).toBe('Placeholder for name field');
  });

  test('use maxLength for attributes size and maxlength', () => {
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
      options: {
        trim: true,
        restrict: true
      }
    };
    const core = initCore(fixture.maxLengthSchema, uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextCell schema={fixture.maxLengthSchema} uischema={uischema} path='name' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.maxLength).toBe(5);
    expect(input.size).toBe(5);
  });

  test('use maxLength for attribute size only', () => {
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
      options: {
        trim: true,
        restrict: false
      }
    };
    const core = initCore(fixture.maxLengthSchema, uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextCell schema={fixture.maxLengthSchema} uischema={uischema} path='name' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.maxLength).toBe(defaultMaxLength);
    expect(input.size).toBe(5);
  });

  test('use maxLength for attribute max length only', () => {
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
      options: {
        trim: false,
        restrict: true
      }
    };
    const core = initCore(fixture.maxLengthSchema, uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextCell schema={fixture.maxLengthSchema} uischema={uischema} path='name' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.maxLength).toBe(5);
    expect(input.size).toBe(defaultSize);
  });

  test('do not use maxLength by default', () => {
    const core = initCore(fixture.maxLengthSchema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextCell schema={fixture.maxLengthSchema} uischema={fixture.uischema} path='name' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.maxLength).toBe(defaultMaxLength);
    expect(input.size).toBe(defaultSize);
  });

  test('maxLength not specified, attributes should have default values (trim && restrict)', () => {
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
      options: {
        trim: true,
        restrict: true
      }
    };
    const core = initCore(fixture.schema, uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextCell schema={fixture.schema} uischema={uischema} path='name' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.maxLength).toBe(defaultMaxLength);
    expect(input.size).toBe(defaultSize);
  });

  test('maxLength not specified, attributes should have default values (trim)', () => {
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
      options: {
        trim: true,
        restrict: false
      }
    };
    const core = initCore(fixture.schema, uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextCell schema={fixture.schema} uischema={uischema} path='name' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.maxLength).toBe(defaultMaxLength);
    expect(input.size).toBe(defaultSize);
  });

  test('maxLength not specified, attributes should have default values (restrict)', () => {
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
      options: {
        trim: false,
        restrict: true
      }
    };
    const core = initCore(fixture.schema, uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextCell schema={fixture.schema} uischema={uischema} path='name' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.maxLength).toBe(defaultMaxLength);
    expect(input.size).toBe(defaultSize);
  });

  test('maxLength not specified, attributes should have default values', () => {
    const core = initCore(fixture.schema, fixture.uischema, fixture.data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextCell schema={fixture.schema} uischema={fixture.uischema} path='name' />
      </JsonFormsStateProvider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.maxLength).toBe(defaultMaxLength);
    expect(input.size).toBe(defaultSize);
  });
});
