/*
  The MIT License

  Copyright (c) 2017-2025 EclipseSource Munich
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

import React from 'react';
import { ControlElement } from '@jsonforms/core';
import { JsonFormsStateProvider } from '@jsonforms/react';
import { mount, ReactWrapper } from 'enzyme';
import TextCell, { textCellTester } from '../../src/cells/TextCell';
import { initCore, TestEmitter } from '../util';

const data = { name: 'Foo' };
const maxLengthSchema = {
  type: 'string',
  maxLength: 5,
};
const schema = { type: 'string' };

const uischema: ControlElement = {
  type: 'Control',
  scope: '#/properties/name',
};

describe('TextCell tester', () => {
  it('should fail with undefined uischema', () => {
    expect(textCellTester(undefined, undefined, undefined)).toBe(-1);
  });

  it('should fail with null uischema', () => {
    expect(textCellTester(null, undefined, undefined)).toBe(-1);
  });

  it('should fail with wrong uischema type', () => {
    expect(textCellTester({ type: 'Foo' }, undefined, undefined)).toBe(-1);
  });

  it('should fail with missing schema', () => {
    expect(textCellTester({ type: 'Control' }, undefined, undefined)).toBe(-1);
  });

  it('should succeed with correct uischema and schema', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
    };
    expect(
      textCellTester(
        control,
        {
          type: 'object',
          properties: {
            foo: { type: 'string' },
          },
        },
        undefined
      )
    ).toBe(1);
  });
});

describe('TextCell', () => {
  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  it('should render with data', () => {
    const core = initCore(schema, uischema, { name: 'Foo' });
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextCell schema={schema} uischema={uischema} path='name' />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.value).toBe('Foo');
  });

  it('should render with empty string when data is undefined', () => {
    const core = initCore(schema, uischema, { name: undefined });
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextCell schema={schema} uischema={uischema} path='name' />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.value).toBe('');
  });

  it('should render with empty string when data is null', () => {
    const core = initCore(schema, uischema, { name: null });
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextCell schema={schema} uischema={uischema} path='name' />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.value).toBe('');
  });

  it('should update via input event', () => {
    const onChangeData: any = {
      data: undefined,
    };
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TestEmitter
          onChange={({ data }) => {
            onChangeData.data = data;
          }}
        />
        <TextCell schema={schema} uischema={uischema} path='name' />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 'Bar' } });
    expect(onChangeData.data.name).toBe('Bar');
  });

  it('should update with undefined when input is empty', () => {
    const onChangeData: any = {
      data: undefined,
    };
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TestEmitter
          onChange={({ data }) => {
            onChangeData.data = data;
          }}
        />
        <TextCell schema={schema} uischema={uischema} path='name' />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input');
    input.simulate('change', { target: { value: '' } });
    expect(onChangeData.data.name).toBeUndefined();
  });

  it('should be disabled when enabled is false', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextCell
          schema={schema}
          uischema={uischema}
          path='name'
          enabled={false}
        />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it('should be enabled by default', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextCell schema={schema} uischema={uischema} path='name' />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.disabled).toBe(false);
  });

  it('should have autofocus when focus option is true', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
      options: { focus: true },
    };
    const core = initCore(schema, control, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextCell schema={schema} uischema={control} path='name' />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input');
    expect(input.prop('autoFocus')).toBe(true);
  });

  it('should not have autofocus when focus option is false', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
      options: { focus: false },
    };
    const core = initCore(schema, control, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextCell schema={schema} uischema={control} path='name' />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input');
    expect(input.prop('autoFocus')).toBeFalsy();
  });

  it('should accept placeholder option', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
      options: { placeholder: 'Enter your name' },
    };
    const core = initCore(schema, control, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextCell schema={schema} uischema={control} path='name' />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.placeholder).toBe('Enter your name');
  });

  it('should use password type when format option is password', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
      options: { format: 'password' },
    };
    const core = initCore(schema, control, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextCell schema={schema} uischema={control} path='name' />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.type).toBe('password');
  });

  it('should use text type by default', () => {
    const core = initCore(schema, uischema, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextCell schema={schema} uischema={uischema} path='name' />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.type).toBe('text');
  });

  it('should apply maxLength when restrict option is true', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
      options: { restrict: true },
    };
    const core = initCore(maxLengthSchema, control, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextCell schema={maxLengthSchema} uischema={control} path='name' />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.maxLength).toBe(5);
  });

  it('should not apply maxLength when restrict option is false', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/name',
      options: { restrict: false },
    };
    const core = initCore(maxLengthSchema, control, data);
    wrapper = mount(
      <JsonFormsStateProvider initState={{ core }}>
        <TextCell schema={maxLengthSchema} uischema={control} path='name' />
      </JsonFormsStateProvider>
    );

    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    // When no maxLength is set, it defaults to 524288
    expect(input.maxLength).toBe(524288);
  });
});
